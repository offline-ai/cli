import colors from 'ansi-colors'
// import cliSpinners from 'cli-spinners';
import { Config } from '@oclif/core';
import path from 'path'
import { ErrorCode, ToolFunc, wait } from '@isdk/ai-tool'
import { AIPromptsFunc, AIPromptsName } from '@isdk/ai-tool-prompt'
import { llm } from '@isdk/ai-tool-llm';
import { LlamaCppProviderName, llamaCpp } from '@isdk/ai-tool-llm-llamacpp'
import { AIScript, LogLevel, SimpleScript, loadScriptFromFile } from '@isdk/ai-tool-agent'
import { prompt, setHistoryStore, HistoryStore } from './prompt.js'

const apiUrl = 'http://localhost:8080'
llamaCpp.apiUrl = apiUrl

const promptsFunc = new AIPromptsFunc(AIPromptsName, {dbPath: ':memory:'})

ToolFunc.register(promptsFunc)
ToolFunc.register(llm)
llamaCpp.register()
llm.setCurrentProvider(LlamaCppProviderName)

class AIScriptEx extends AIScript {
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
}

export async function runScript(filename: string, options?: {config: Config, stream?: boolean, interactive?: boolean, logLevel?: LogLevel, data?: any, apiUrl?: string, searchPaths?: string[]}) {
  const {logLevel: level, data, apiUrl, searchPaths, interactive, stream, config} = options ?? {}
  if (apiUrl) { llamaCpp.apiUrl = apiUrl }

  AIScriptEx.searchPaths = Array.isArray(searchPaths) ? searchPaths: ['.']

  const content = loadScriptFromFile(filename, searchPaths)
  if (content) {
    const script = new AIScriptEx(content)

    if (level !== undefined) {
      script.logLevel = level
    }
    if (stream !== undefined) {
      script.llmStream = stream
    }
    if (interactive) {
      script.autoRunLLMIfPromptAvailable = false
    }

    let quit = false

    const interrupted = () => {
      // quit = true
      if (script._runtime.isAborted()) {
        process.exit(0)
      } else {
        script._runtime.abort()
      }
    }
    process.on('SIGINT', interrupted)

    const runtime = await script.run(data)
    let result = runtime.result

    if (interactive) {
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

      const store = new HistoryStore(path.join(config?.configDir ?? '.', path.basename(filename, path.extname(filename)), '.ai-history.json'))
      setHistoryStore(store)
      let retryCount = 0
      if (stream) {
        runtime.on('llm-stream', async function(llmResult, content: string, count: number) {
          const s = llmResult.content
          if (quit) {
            this.target.abort()
            process.exit(0)
          }
          if (count !== retryCount) {
            retryCount = count
            process.stdout.write(colors.blue(`<续:>`))
          }
          if (s) {process.stdout.write(s)}
        })
      }
      do {
        retryCount = 0
        const input = prompt({prefix: 'You:'})
        const message = (await input.run()).trim()
        const llmOptions = {} as any
        if (message) {
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
          if (message) {input.write(colors.yellow(aiName+ ': '))}
          try {
            result = await runtime.$interact(llmOptions)
          } catch(error: any) {
            console.log('🚀 ~ runScript ~ error:', error)
            if (error.code !== ErrorCode.Aborted) {throw error}
          }
          input.write('\n')

          /*
          let isThinking = true
          const aiOutput = prompt({
            prefix: aiName+':',
            keypressTimeout,
            multiline: true,
            separator(state) {
              const timer = state.timer
              if (!isThinking) {timer.stop()}
              return timer.loading ? getFrame(timer.frames, state.timer.tick) : '';
            },
            timers: {
              // prefix: 250,
              separator: spinner,
            },
          }, false)

          aiOutput.once('run', async() => {
            if (stream) {
              let count = 0
              script._runtime.on('llm-stream', async (llmResult, content: string) => {
                const s = llmResult.content
                if (s) {
                  isThinking = false
                  count += s.length
                  if (count > 20) {aiOutput.write('\n')}
                  // aiOutput.write(s)
                  await typeToPrompt(aiOutput, s)
                }
                if (llmResult.stop) {
                  aiOutput.input = content
                }
              })
            }
            result = await script.interact({message: message})
            if (!stream) {
              await typeToPrompt(aiOutput, result)
            }
            if (!aiOutput.state.submitted) { aiOutput.submit() }
          })

          await aiOutput.run()
          */

        }

      } while (!quit)


      // const answer = await prompt([
      //   {
      //     type: 'input',
      //     name: 'input',
      //     message: color.magenta('You')+':',
      //     // suffix: '',
      //     prefix: '',
      //     async validate(value) {
      //       if (value === 'exit' || value === 'quit') {
      //         return true
      //       }
      //       uiBottom.write(color.blue.bold(aiName) + ':')
      //       result = await script.interact({message: value})

      //       return false
      //     },
      //   },
      // ])

      // return answer

      /*
      do {
        const answer = await prompt([
          {
            type: 'input',
            name: 'input',
            message: color.magenta('You')+':',
            // suffix: '',
            prefix: '',
          },
        ])
        quit = answer.input === 'quit' || answer.input === 'exit'
        if (!quit) {
          uiBottom.write(color.blue.bold(aiName) + ':')
          result = await script.interact({message: answer.input})
          if (stream) { result = '' }
          console.log(result)
        }
      } while (!quit)
      //  */
    }
    return result
  }
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
