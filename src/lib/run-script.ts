import { ToolFunc } from '@isdk/ai-tool'
import { AIPromptsFunc, AIPromptsName } from '@isdk/ai-tool-prompt'
import { llm } from '@isdk/ai-tool-llm';
import { LlamaCppProviderName, llamaCpp } from '@isdk/ai-tool-llm-llamacpp'
import { AIScript, LogLevel, loadScriptFromFile } from '@isdk/ai-tool-agent'

const apiUrl = 'http://localhost:8080'
llamaCpp.apiUrl = apiUrl

const promptsFunc = new AIPromptsFunc(AIPromptsName, {dbPath: ':memory:'})

ToolFunc.register(promptsFunc)
ToolFunc.register(llm)
llamaCpp.register()
llm.setCurrentProvider(LlamaCppProviderName)

export async function runScript(filename: string, options?: {logLevel?: LogLevel, data?: any, apiUrl?: string, searchPaths?: string[]}) {
  const {logLevel: level, data, apiUrl, searchPaths} = options ?? {}
  if (apiUrl) { llamaCpp.apiUrl = apiUrl }
  const content = loadScriptFromFile(filename, searchPaths)
  if (content) {
    const script = new AIScript(content)
    if (level !== undefined) {
      script.logLevel = level
    }
    const result = await script.exec(data)
    return result
  }
}