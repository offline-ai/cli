import colors from 'ansi-colors'
// import cliSpinners from 'cli-spinners'
import logUpdate from 'log-update'
import { get as getByPath } from 'lodash-es'
import path from 'path'
import { ConfigFile, getMultiLevelExtname, parseJsJson, wait } from '@isdk/ai-tool'
import { AIScript, LogLevel, LogLevelMap, SimpleScript, loadScriptFromFile } from '@isdk/ai-tool-agent'
import { prompt, setHistoryStore, HistoryStore } from './prompt.js'
import { detectLang } from './detect-lang.js'
import { saveConfigFile } from './load-config.js'
import { initTools } from './init-tools.js'

// const apiUrl = 'http://localhost:8080'
// llamaCpp.apiUrl = apiUrl

// const promptsFunc = new AIPromptsFunc(AIPromptsName, {dbPath: ':memory:'})

// ToolFunc.register(promptsFunc)
// ToolFunc.register(llm)
// llamaCpp.register()
// llm.setCurrentProvider(LlamaCppProviderName)

class AIScriptEx extends AIScript {
  static load(filename: string) {
    const content = loadScriptFromFile(filename, this.searchPaths)
    if (!content) { throw new TypeError(`script file ${filename} not found`) }
    return new AIScriptEx(content)
  }

  async $exec(params: {id?: string, filename?: string, args?: any}) {
    const scripts = (this.constructor as typeof AIScript).scripts
    const filename = params.filename
    let script: SimpleScript | undefined
    const id = params.id
    if (filename) {
      if (id) {
        throw new TypeError('filename and id cannot be set at the same time')
      } else {
        const _id = path.basename(filename, path.extname(filename))
        script = scripts[_id]
        if (!script) {
          const content = loadScriptFromFile(filename, this.searchPaths)
          script = new AIScriptEx(content)
          if (!script.id) {
            script.id = _id
          } else if (scripts[script.id]) {
            throw new TypeError(`script id ${script.id} already exists`)
          }
        }
      }
    } else if (id) {
      script = scripts[id]
    } else {
      throw new TypeError('filename or id is required')
    }
    return super.$exec({args: params.args, script})
  }

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
  agentDirs?: string[]
}

export async function runScript(filename: string, options: IRunScriptOptions) {
  initTools(options)

  const { logLevel: level, interactive, stream } = options

  const scriptExtName = getMultiLevelExtname(filename, 2)
  const scriptBasename = path.basename(filename, scriptExtName)
  const chatsFilename = options.chatsDir ? path.join(options.chatsDir, scriptBasename, 'history.yaml') : undefined

  AIScriptEx.searchPaths = Array.isArray(options.agentDirs) ? options.agentDirs : ['.']

  const script = AIScriptEx.load(filename)
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
    if (interactive && chatsFilename) {
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
      if (!isSilence) {logUpdate(llmLastContent)}
    })
  }

  try {
    await runtime.run(options.data)
  } finally {
    if (!isSilence) {logUpdate.clear()}
  }

  let result = runtime.result

  if (interactive) {
    runtime.on('ready', async function(isReady: boolean) {
      if (isReady && chatsFilename) {
        // we should load chat history here
        await this.target.$loadChats(chatsFilename)
      }
    })

    runtime.on('load-chats', function(filename: string) {
      if (filename) {
        const content = ConfigFile.loadSync(filename )
        if (content) {this.result = content}
      }
    })

    runtime.on('save-chats', (messages: any[], filename: string) => {
      if (filename) {
        saveConfigFile(filename, messages)
      }
    })
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
                console.log(command, '=', r)
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
          // if (llmLastContent) {
          //   const lastMsg = await runtime.$getMessage(-1)
          //   if (lastMsg && lastMsg.role === 'assistant') {
          //     lastMsg.content += llmLastContent
          //   } else {
          //     runtime.$pushMessage({message: {role: 'assistant', content: llmLastContent}})
          //   }
          // }
        } finally {
          if (!isSilence) {logUpdate.clear()}
        }
        if (result) {
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
