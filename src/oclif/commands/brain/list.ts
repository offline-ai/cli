// import util from 'util'
import { parseJsJson } from '@isdk/ai-tool'
import { listBrains, printBrains, upgradeBrains } from '../../../lib/brain.js'
import { AICommand } from '../../lib/ai-command.js'
import { showBanner } from '../../lib/help.js'
import { Args, Flags } from '@oclif/core'

export default class AIBrainListCommand extends AICommand {
  static summary = '📜 List downloaded or online brains, defaults to downloaded.'
  static aliases = ['brain:search']

  // static description = ''

  static args = {
    name: Args.string({
      description: 'the brain name to search',
    })
  }

  static flags = {
    ...AICommand.flags,
    downloaded: Flags.boolean({
      char: 'd',
      description: 'list downloaded brains',
      default: false,
    }),
    all: Flags.boolean({
      char: 'a',
      description: 'list all brains(include downloaded and online)',
      default: false,
    }),
    brainDir: Flags.directory({char: 'b', description: 'the brains(LLM) directory', exists: true}),
    onlyFeatured: Flags.boolean({
      char: 'f',
      aliases: ['only-featured'],
      description: 'only list featured brains',
      allowNo: true,
    }),
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

  async run(): Promise<any> {
    const opts = await this.parse(AIBrainListCommand)
    const isJson = this.jsonEnabled()
    const {args, flags} = opts
    const userConfig = this.loadConfig(flags.config, opts)
    await this.config.runHook('init_tools', {id: 'brain', userConfig})

    if (flags.refresh) {
      upgradeBrains()
    }

    if (userConfig.banner && !isJson) {showBanner('Brain')}
    flags.name = args.name
    const result = listBrains(userConfig, flags)
    if (!isJson) {
      if (!result || result.length === 0) {
        this.log('No brains found')
      } else {
        printBrains(result, flags as any)
        // console.log(util.inspect(result, {showHidden: false, depth: 10, colors: true, maxArrayLength: 6}))
        // console.log('total:', result.length)
      }
    }
    return result
  }
}
