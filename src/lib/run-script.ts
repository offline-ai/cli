import path from 'path'
import { ToolFunc } from '@isdk/ai-tool'
import { AIPromptsFunc, AIPromptsName } from '@isdk/ai-tool-prompt'
import { llm } from '@isdk/ai-tool-llm';
import { LlamaCppProviderName, llamaCpp } from '@isdk/ai-tool-llm-llamacpp'
import { AIScript, LogLevel, SimpleScript, loadScriptFromFile } from '@isdk/ai-tool-agent'
import { prompt, BottomBar } from './prompt.js'

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

export async function runScript(filename: string, options?: {stream?: boolean, interactive?: boolean, logLevel?: LogLevel, data?: any, apiUrl?: string, searchPaths?: string[]}) {
  const {logLevel: level, data, apiUrl, searchPaths, interactive, stream} = options ?? {}
  if (apiUrl) { llamaCpp.apiUrl = apiUrl }
  if (Array.isArray(searchPaths)) AIScriptEx.searchPaths = searchPaths
  const content = loadScriptFromFile(filename, searchPaths)
  if (content) {
    const script = new AIScriptEx(content)
    const uiBottom = new BottomBar()

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
    if (stream) {
      script._runtime.on('llm-stream', (_, result: string) => {
        if (result) {uiBottom.updateBottomBar(result)}
      })
    }

    if (interactive) {
      let quit = false
      do {
        const answer = await prompt([
          {
            type: 'input',
            name: 'input',
            message: '>',
            suffix: '',
            prefix: '',
          },
        ])
        quit = answer.input === 'quit' || answer.input === 'exit'
        if (!quit) {
          result = await script.interact({message: answer.input})
          if (stream) { result = '' }
          console.log(result)
        }
      } while (!quit)
    }
    return result
  }
}