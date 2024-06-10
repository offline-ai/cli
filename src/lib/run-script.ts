import util from 'util'
import fs from 'fs'
import path from 'path'
import { DateTime } from 'luxon'
import colors from 'ansi-colors'
// import cliSpinners from 'cli-spinners'
import _logUpdate from 'log-update'
import { get as getByPath } from 'lodash-es'
import { ConfigFile, getMultiLevelExtname, parseJsJson, wait } from '@isdk/ai-tool'
import { AIScriptServer, LogLevel, LogLevelMap } from '@isdk/ai-tool-agent'
import { detectTextLanguage as detectLang } from '@isdk/detect-text-language'
import { prompt, setHistoryStore, HistoryStore } from './prompt.js'
import { initTools } from './init-tools.js'
import { ux } from '@oclif/core'

class AIScriptEx extends AIScriptServer {
  $detectLang(text: string) {
    return detectLang(text)
  }
}

interface IRunScriptOptions {
  chatsDir?: string,
  inputsDir?: string,
  stream?: boolean,
  interactive?: boolean,
  logLevel?: LogLevel,
  data?: any,
  apiUrl?: string,
  newChat?: boolean,
  agentDirs?: string[],
  theme?: any,
  noConsoleClear?: boolean,
}

function logUpdate(...text: string[]) {
  logUpdate.dirt = true
  _logUpdate(...text)
}

logUpdate.dirt = false
logUpdate.clear = () => {
  if (logUpdate.dirt) {
    logUpdate.dirt = false
    _logUpdate.clear()
  }
}

function findCreatedAt(messages: any[]) {
  if (Array.isArray(messages)) {
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i]
      if (message.createdAt) {
        return message.createdAt
      }
    }
  }
}
function renameOldFile(filename: string) {
  if (fs.existsSync(filename)) {
    const content = ConfigFile.loadSync(filename)
    let createdAtStr = findCreatedAt(content)
    const createdAt = createdAtStr ? DateTime.fromISO(createdAtStr) : DateTime.now()
    const dirname = path.dirname(filename)
    const extName = path.extname(filename)
    const basename = path.basename(filename, extName)
    // rename to history-2023-01-01T00_00_00_000Z.yaml
    createdAtStr = createdAt.toISO().replace(/[:.]/g, '_')
    fs.renameSync(filename, path.join(dirname, `${basename}-${createdAtStr}${extName}`))
  }
}
export async function runScript(filename: string, options: IRunScriptOptions) {
  initTools(options)

  const { logLevel: level, interactive, stream } = options

  const scriptExtName = getMultiLevelExtname(filename, 2)
  const scriptBasename = path.basename(filename, scriptExtName)
  const chatsFilename = options.chatsDir ? path.join(options.chatsDir, scriptBasename, 'history.yaml') : undefined
  if (options.newChat && chatsFilename) { renameOldFile(chatsFilename) }

  AIScriptEx.searchPaths = Array.isArray(options.agentDirs) ? options.agentDirs : ['.']

  const script = AIScriptEx.load(filename, {chatsDir: options.chatsDir})
  let isSilence = false

  if (level !== undefined) {
    script.logLevel = level
    if (LogLevelMap[level] >= LogLevelMap['silence']) {
      isSilence = true
    }
  }
  if (stream !== undefined) {
    script.llmStream = stream
  }
  if (interactive) {
    script.autoRunLLMIfPromptAvailable = false
  }

  let quit = false
  const runtime = await script.getRuntime(false)

  const saveChatHistory = async () => {
    if (chatsFilename) {
      await runtime.$saveChats(chatsFilename)
    }
  }

  const interrupted = async () => {
    if (runtime.isAborted()) {
      await saveChatHistory()
      process.exit(0)
    } else {
      runtime.abort()
    }
  }
  process.on('SIGINT', interrupted)
  process.on('beforeExit', saveChatHistory)

  let llmLastContent = ''
  let retryCount = 0

  if (stream) {
    runtime.on('llm-stream', async function(llmResult, content: string, count: number) {
      const runtime = this.target as AIScriptEx
      const s = llmResult.content
      llmLastContent += s

      if (quit) {
        runtime.abort('quit')
        process.emit('SIGINT')
      }
      if (count !== retryCount) {
        retryCount = count
        llmLastContent += colors.blue(`<续:${count}>`)
      }
      // if (llmLastContent.length > 100) {
      //   llmLastContent = llmLastContent.slice(llmLastContent.length-100)
      // }
      if (!isSilence && llmLastContent) {logUpdate(llmLastContent)}
    })
  }

  try {
    await runtime.run(options.data)
  } finally {
    if (!isSilence && !options.noConsoleClear) {logUpdate.clear()}
  }

  let result = runtime.result

  if (interactive) {
    runtime.$ready(true)

    // const spinner = cliSpinners.dots
    const aiName = runtime.prompt?.character?.name || 'ai'

    const latestMessages = await runtime.getLatestMessages()
    if (latestMessages && latestMessages.length > 0) {
      for (const msg of latestMessages) {
        const char = msg.role === 'user' ? colors.blue('You') : (msg.role === 'assistant' ? colors.yellow(aiName): undefined)
        if (!char) {continue}
        console.log(char + ':', msg.content)
      }
    }

    const inputsHistoryFilename = options.inputsDir ? path.join(options.inputsDir, scriptBasename, 'history.yaml') : undefined
    const store = new HistoryStore(inputsHistoryFilename)
    setHistoryStore(store)

    do {
      // llmContentChunk = ''
      llmLastContent = ''
      retryCount = 0
      result = ''
      const input = prompt({prefix: 'You:'})
      const message = (await input.run()).trim()
      const llmOptions = {} as any
      if (message) {
        if (message[0] === '/') {
          const command = message.slice(1)
          switch (command) {
            case 'quit':
            case 'exit': {
              quit = true
              break
            }
            default: {
              if (command[0] === '.') {
                const r = getByPath(runtime, command.slice(1))
                console.log(command, '=', util.inspect(r, {showHidden: false, depth: 9, colors: true}))
              } else {
                const {command: cmd, args} = parseCommandString(command)
                try {
                  const r = await runtime[cmd](args)
                  if (r) {console.log(r)}
                } catch(e: any) {
                  console.error('command error:', e)
                }
              }
            }
          }
          continue;
        }

        llmOptions.message = message
        delete llmOptions.shouldAppendResponse
        delete llmOptions.add_generation_prompt
      } else {
        llmOptions.shouldAppendResponse = false
        llmOptions.add_generation_prompt = false
        input.clear()
      }
      quit = message === 'quit' || message === 'exit'
      // console.log()

      if (!quit) {
        // if (message) {input.write(colors.yellow(aiName+ ': '))}
        try {
          result = await runtime.$interact(llmOptions)
        } catch(error: any) {
          if (error.name !== 'AbortError') {throw error}
          const what = error.data?.what ? ':'+error.data.what : ''
          input.write(colors.magentaBright(`<${error.name+what}>`))
        } finally {
          if (!isSilence && !options.noConsoleClear) {logUpdate.clear()}
        }
        if (result) {
          if (typeof result !== 'string') { result = ux.colorizeJson(result, {pretty: true, theme: options.theme?.json})}
          input.write(colors.yellow(aiName+ ': ') + result + '\n')
        }
      } else {
        console.log('bye!')
      }

    } while (!quit)
  }
  return result
}

export function getFrame(arr, i) {
  return arr[i % arr.length]
};

export const keypressTimeout = 5
export async function typeToPrompt(prompt: any, input: string) {
  for (const char of input) {
    await prompt.keypress(char)
    await wait(keypressTimeout+ 10)
  }
}

export function parseCommandString(commandString: string): { command: string, args: string[] } {
  const regex = /^([\w$]+)(?:\((.*)\))?$/i;
  const match = commandString.match(regex);

  if (!match) {
    throw new Error('Invalid command format');
  }

  const command = match[1]
  const argsString = match[2] ? '[' + match[2].trim() + ']' : undefined;
  const args: any[] = argsString ? parseJsJson(argsString) : []

  return { command, args };
}
