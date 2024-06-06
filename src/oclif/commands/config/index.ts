import { getXDGConfigs } from '../../../lib/load-config.js'
import { AICommand } from '../../lib/ai-command.js'
import { showBanner } from '../../lib/help.js'

export default class AIConfigCommand extends AICommand {
  static enableJsonFlag = true

  static summary = '🛠️  Manage the AI Configuration.'

  static description = 'show current configuration if no commands.'

  static flags = {
    ...AICommand.flags,
  }

  async run(): Promise<any> {
    const opts = await this.parse(AIConfigCommand)
    const {flags} = opts
    const isJson = this.jsonEnabled()
    const userConfig = this.loadConfig(flags.config, opts)
    const hasBanner = flags.banner ?? userConfig.banner ?? true
    if (hasBanner && !isJson) {showBanner('Config')}
    this.log('AI Configuration Envs:')
    this.logJson(getXDGConfigs(this.config))
    if (userConfig) {
      this.log('\nAI Configuration:')
      this.logJson(userConfig)
    }
  }
}
