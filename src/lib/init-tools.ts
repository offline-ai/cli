import './global-fetch-proxy.js'
import {
  event, // event bus for server
  backendEventable,
  ResServerTools,
  ServerTools,
} from '@isdk/ai-tool'
import { llm } from '@isdk/ai-tool-llm'
import { LlamaCppProviderName, llamaCpp } from '@isdk/ai-tool-llm-llamacpp'
import { AIPromptsFunc, AIPromptsName } from '@isdk/ai-tool-prompt'
import { download } from '@isdk/ai-tool-downloader'
import type { Hook, Config } from '@oclif/core'

export const BRAINS_FUNC_NAME = 'llm.brains'

export async function initTools(this: Hook.Context, userConfig: any, _config: Config) {
  try {
    const promptsFunc = new AIPromptsFunc(AIPromptsName, {dbPath: ':memory:', initDir: userConfig.promptsDir})

    ServerTools.register(promptsFunc)
    ServerTools.register(llm)
    llamaCpp.register()
    llm.setCurrentProvider(LlamaCppProviderName)

    // the event-bus for server
    ResServerTools.register(event)
    backendEventable(ResServerTools)
    ResServerTools.register(download)

    if (userConfig.apiUrl) {
      llamaCpp.apiUrl = userConfig.apiUrl
    }
  } catch (err) {
    console.error('🚀 ~ initTools ~ err:', err)
    throw err
  }
}
