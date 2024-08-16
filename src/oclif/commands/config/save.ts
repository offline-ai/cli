import { AICommand, AICommonFlags } from '../../lib/ai-command.js'
import { showBanner } from '../../lib/help.js'
import { Args } from '@oclif/core'
import { parseJsJson, saveConfigFile } from '@isdk/ai-tool'

export default class AIConfigSaveCommand extends AICommand {
  static enableJsonFlag = true

  static summary = '💾 Save the configuration to file.'

  // static description = ''

  static args = {
    data: Args.string({
      description: 'the json data which will be passed to the ai-agent script',
      parse: (input: string) => parseJsJson(input),
    })
  }

  static flags = {
    ...AICommand.flags,
    ...AICommonFlags,
  }

  async run(): Promise<any> {
    const opts = await this.parse(AIConfigSaveCommand)
    const {flags} = opts
    const isJson = this.jsonEnabled()
    const userConfig = await this.loadConfig(flags.config, {...opts, skipLoadHook: true})
    if (userConfig.banner && !isJson) {showBanner('Config')}

    saveConfigFile(userConfig.configFile, userConfig)
    this.log(`Saved config to "${userConfig.configFile}"`)
  }
}
