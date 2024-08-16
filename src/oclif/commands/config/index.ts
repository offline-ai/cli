import { Args } from '@oclif/core'
import { getXDGConfigs } from '@offline-ai/cli-common'
import { AICommand } from '../../lib/ai-command.js'
import { showBanner } from '../../lib/help.js'
import { get as getByPath } from 'lodash-es'

export default class AIConfigCommand extends AICommand {
  static enableJsonFlag = true

  static args = {
    item_name: Args.string({
      description: 'the config item name path to get',
    })
  }

  static summary = '🛠️  Manage the AI Configuration.'

  static description = 'show current configuration if no commands.'

  static examples = [`
# list all configurations
<%= config.bin %> <%= command.id %>`,
`# get the brainDir config item
<%= config.bin %> <%= command.id %> brainDir

AI Configuration:
{
  "brainDir": "~/.local/share/ai/brain"
}
`
  ]

  static flags = {
    ...AICommand.flags,
  }

  async run(): Promise<any> {
    const opts = await this.parse(AIConfigCommand)
    const {args, flags} = opts
    const isJson = this.jsonEnabled()
    const userConfig = await this.loadConfig(flags.config, {...opts, skipLoadHook: true})
    const hasBanner = flags.banner ?? userConfig.banner ?? true
    if (hasBanner && !isJson) {showBanner('Config')}
    this.log('AI Configuration Envs:')
    this.logJson(getXDGConfigs(this.config))
    if (userConfig) {
      this.log('\nAI Configuration:')
      if (args.item_name) {
        const v = getByPath(userConfig, args.item_name)
        if (v === undefined) {
          this.logJson(userConfig)
          this.error(`config item "${args.item_name}" not found`)
        }
        this.logJson({[args.item_name]: v})
      }
      else {
        this.logJson(userConfig)
      }
    }
  }
}
