import {
  event, // event bus for server
  backendEventable,
  ResServerTools,
  ServerTools,
} from '@isdk/ai-tool'
import { LlmModelsFunc, llm } from '@isdk/ai-tool-llm'
import { LlamaCppProviderName, llamaCpp } from '@isdk/ai-tool-llm-llamacpp'
import { AIPromptsFunc, AIPromptsName } from '@isdk/ai-tool-prompt'
import { download } from '@isdk/ai-tool-download'

export const BRAINS_FUNC_NAME = 'llm.brains'

let initialized: boolean = false
export function initTools(userConfig: any) {
  if (initialized) return

  initialized = true
  const promptsFunc = new AIPromptsFunc(AIPromptsName, {dbPath: ':memory:', initDir: userConfig.promptsDir})

  ServerTools.register(promptsFunc)
  ServerTools.register(llm)
  llamaCpp.register()
  llm.setCurrentProvider(LlamaCppProviderName)

  // the event-bus for server
  ResServerTools.register(event)
  backendEventable(ResServerTools)
  ResServerTools.register(download)

  if (userConfig.brainDir) {
    const brainsFunc = new LlmModelsFunc(BRAINS_FUNC_NAME, {rootDir: userConfig.brainDir, dbPath: '.brainsdb'})
    ResServerTools.register(brainsFunc)
    // brainsFunc.updateDBFromDir()
  }

  if (userConfig.apiUrl) {
    llamaCpp.apiUrl = userConfig.apiUrl
  }
}
