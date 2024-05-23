import { Config } from '@oclif/core';
import path from 'path'
import { ToolFunc, wait } from '@isdk/ai-tool'
import { AIPromptsFunc, AIPromptsName } from '@isdk/ai-tool-prompt'
import { llm } from '@isdk/ai-tool-llm';
import { LlamaCppProviderName, llamaCpp } from '@isdk/ai-tool-llm-llamacpp'
import { AIScript, LogLevel, SimpleScript, loadScriptFromFile } from '@isdk/ai-tool-agent'
import { prompt, setHistoryStore, HistoryStore } from './prompt.js'
import cliSpinners from 'cli-spinners';

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
  if (Array.isArray(searchPaths)) AIScriptEx.searchPaths = searchPaths
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

    let result = await script.exec(data)

    if (interactive) {
      const spinner = cliSpinners.dots
      let quit = false
      const aiName = script._runtime.prompt?.character?.name || 'ai'
      const store = new HistoryStore(path.join(config?.configDir ?? '.', path.basename(filename, path.extname(filename)), '.ai-history.json'))
      setHistoryStore(store)
      do {
        const input = prompt({prefix: 'You:'})
        const message = await input.run()
        quit = message === 'quit' || message === 'exit'
        console.log()

        if (!quit) {
          let isThinking = true
          const aiOutput = prompt({
            prefix: aiName+':',
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
              script._runtime.on('llm-stream', async (llmResult, content: string) => {
                const s = llmResult.content
                if (s) {
                  isThinking = false
                  await typeToPrompt(aiOutput, s)
                }
                // if (llmResult.stop) {
                //   aiOutput.submit()
                // }
              })
            }
            result = await script.interact({message: message})
            if (!stream) {
              await typeToPrompt(aiOutput, result)
            }
            if (!aiOutput.state.submitted) { aiOutput.submit() }
          })

          await aiOutput.run()

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

function getFrame(arr, i) {
  return arr[i % arr.length]
};

async function typeToPrompt(prompt: any, input: string) {
  for (const char of input) {
    await prompt.keypress(char)
    await wait(10)
  }
}