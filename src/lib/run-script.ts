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
// import { initTools } from './init-tools.js'
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
  backupChat?: boolean,
  agentDirs?: string[],
  theme?: any,
  consoleClear?: boolean,
}

function logUpdate(...text: string[]) {
  logUpdate.dirt = true
  _logUpdate(...text)
}

logUpdate.dirt = false
logUpdate.clear = (consoleClear: boolean|undefined) => {
  if (logUpdate.dirt) {
    logUpdate.dirt = false
    if (consoleClear) {
      _logUpdate.clear()
    } else {
      console.log(`\n${colors.magenta('<---STREAMING END--->')}\n\n`)
    }
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
function renameOldFile(filename: string, backupChat?: boolean) {
  if (fs.existsSync(filename)) {
    const content = ConfigFile.loadSync(filename)
    let createdAtStr = findCreatedAt(content)
    const createdAt = createdAtStr ? DateTime.fromISO(createdAtStr) : DateTime.now()
    const dirname = path.dirname(filename)
    const extName = path.extname(filename)
    const basename = path.basename(filename, extName)
    // rename to history-2023-01-01T00_00_00_000Z.yaml
    createdAtStr = createdAt.toISO().replace(/[:.]/g, '_')
    const newFileName = path.join(dirname, `${basename}-${createdAtStr}${extName}`)
    if (backupChat) {
      fs.cpSync(filename, newFileName)
    } else {
      fs.renameSync(filename, newFileName)
    }
  }
}
export async function runScript(filename: string, options: IRunScriptOptions) {
  // initTools(options)

  const { logLevel: level, interactive, stream } = options

  if (options.consoleClear === undefined) {
    options.consoleClear = interactive
  }

  const scriptExtName = getMultiLevelExtname(filename, 2)
  const scriptBasename = path.basename(filename, scriptExtName)

  AIScriptEx.searchPaths = Array.isArray(options.agentDirs) ? options.agentDirs : ['.']

  let script
  try {
    script = await AIScriptEx.loadFile(filename, {chatsDir: options.chatsDir})
  } catch(err) {
    console.error('Load script error:',err)
    process.exit(1)
  }
  const chatsFilename = script.getChatsFilename()
  if ((options.newChat || options.backupChat) && chatsFilename) { renameOldFile(chatsFilename, options.backupChat) }

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
  if (interactive && script.autoRunLLMIfPromptAvailable === undefined) {
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
    if (runtime.isToolAborted()) {
      await saveChatHistory()
      process.exit(0)
    } else {
      runtime.abortTool()
    }
  }
  process.on('SIGINT', interrupted)
  process.on('beforeExit', saveChatHistory)

  let llmLastContent = ''
  let retryCount = 0

  if (stream) {
    runtime.on('llmStream', async function(llmResult, content: string, count: number) {
      const runtime = this.target as AIScriptEx
      let s = llmResult.content

      if (quit) {
        runtime.abortTool('quit')
        process.emit('SIGINT')
      }
      if (count !== retryCount) {
        retryCount = count
        s += colors.blue(`<续:${count}>`)
      }
      llmLastContent += s
      // if (llmLastContent.length > 100) {
      //   llmLastContent = llmLastContent.slice(llmLastContent.length-100)
      // }
      if (!isSilence && llmLastContent) {
        if (options.consoleClear) {
          logUpdate(llmLastContent)
        } else {
          process.stdout.write(s)
          logUpdate.dirt = true
        }
      }
    })
  }

  let lastError: any
  try {
    await runtime.run(options.data)
  } catch(error: any) {
    if (error.name !== 'AbortError') {throw error}
    lastError = error.name + (error.data?.what ? ':'+error.data.what : '')
} finally {
    if (!isSilence) {logUpdate.clear(options.consoleClear)}
    if (lastError) {
      console.log(colors.magentaBright(`<${lastError}>`))
      lastError = undefined
    }
  }

  let result = runtime.result

  if (interactive) {
    runtime.$ready(true)

    // const spinner = cliSpinners.dots
    const aiName = runtime.character?.name || runtime.name || 'ai'

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
          lastError = error.name + (error.data?.what ? ':'+error.data.what : '')
        } finally {
          if (!isSilence) {logUpdate.clear(options.consoleClear)}
          if (lastError) {
            input.write(colors.magentaBright(`<${lastError}>\n`))
            lastError = undefined
          }
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
