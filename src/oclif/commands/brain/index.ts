import { Args, Flags } from '@oclif/core'
import { AICommand } from '../../lib/ai-command.js'
import { showBanner } from '../../lib/help.js'
import { parseJsJson } from '@isdk/ai-tool'
import { listBrains, printBrains, upgradeBrains } from '../../../lib/brain.js'

export default class Brain extends AICommand {
  static args = {
    name: Args.string({
      description: 'the brain name to search',
    })
  }

  static flags = {
    ...AICommand.flags,
    brainDir: Flags.directory({char: 'b', description: 'the brains(LLM) directory', exists: true}),
    search: Flags.string({
      char: 's',
      description: 'the json filter to search for brains',
      parse: (input: string) => parseJsJson(input),
    }),
    count: Flags.integer({
      char: 'n',
      description: 'the max number of brains to list, 0 means all.',
      default: 100,
    }),
    refresh: Flags.boolean({
      char: 'r',
      description: 'refresh the online brains list',
    }),
  }

  static summary = '🧠 The AI Agent Brains(LLM) Manager.'

  static description = `
  Manage AI Agent brains 🧠 here.
  📜 List downloaded or online brains
  🔎 search for brains
  📥 download brains
  ❌ delete brains
`

  static examples = [`
<%= config.bin %> <%= command.id %>               # list download brains
<%= config.bin %> <%= command.id %> list --online # list online brains
<%= config.bin %> <%= command.id %> download <brain-name>
`,
  ]

  async run(): Promise<any> {
    const opts = await this.parse(Brain)
    const isJson = this.jsonEnabled()
    const {args, flags} = opts
    const userConfig = this.loadConfig(flags.config, opts)
    await this.config.runHook('init_tools', {id: 'brain', userConfig})

    if (flags.refresh) {
      upgradeBrains()
    }

    if (userConfig.banner && !isJson) {showBanner('Brain')}
    flags.name = args.name
    flags.downloaded = true
    const result = listBrains(userConfig, flags)
    if (!isJson) {
      if (!result || result.length === 0) {
        this.log('No brains found')
      } else {
        printBrains(result, flags as any)
      }
    }
    return result
  }
}
