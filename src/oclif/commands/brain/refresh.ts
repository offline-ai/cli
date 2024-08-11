import { Flags } from '@oclif/core'
import { upgradeBrains } from '../../../lib/brain.js'
import { AICommand } from '../../lib/ai-command.js'
import { showBanner } from '../../lib/help.js'

export default class AIBrainRefreshCommand extends AICommand {
  static summary = '🔄 refresh online brains.'

  static description = 'refresh brain index from huggingface.co'
  static flags = {
    brainDir: Flags.directory({char: 'b', description: 'the brains(LLM) directory', exists: true}),
    hubUrl: Flags.string({
      char: 'u',
      aliases: ['hub-url'],
      description: 'the hub mirror url',
    }),
    verifyQuant: Flags.boolean({
      char: 'v',
      aliases: ['verify-quant'],
      description: 'whether verify quant when refresh',
    }),
  }

  async run(): Promise<any> {
    const opts = await this.parse(AIBrainRefreshCommand)
    const isJson = this.jsonEnabled()
    const {flags} = opts
    const userConfig = this.loadConfig(flags.config, opts)
    await this.config.runHook('init_tools', {id: 'brain', userConfig})

    if (userConfig.banner && !isJson) {showBanner('Refresh Brains')}

    const count = await upgradeBrains(flags)
    this.log(`${count} brains updated`)

    return count
  }
}
