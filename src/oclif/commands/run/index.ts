import cj from 'color-json'
import {Args, Flags} from '@oclif/core'
import { parseJsJson } from '@isdk/ai-tool'
import { LogLevelMap, logLevel } from '@isdk/ai-tool-agent'

import { AICommand } from '../ai-command.js'
import {runScript} from '../../../lib/run-script.js'
import { showBanner } from '../../lib/help.js'

export default class RunScript extends AICommand {
  static enableJsonFlag = true

  static args = {
    script: Args.string({description: 'the ai-agent script file name', required: true}),
    data: Args.string({
      description: 'the json data which will be passed to the ai-agent script',
      parse: (input: string) => parseJsJson(input),
    })
  }

  static summary = '💻 Run ai-agent script file.'

  static description = 'Execute ai-agent script file and return result.'

  static examples = [
    `<%= config.bin %> <%= command.id %> ./script.yaml "{content: 'hello world'}"
┌────────────────────
│[info]:Start Script: ...
`,
  ]

  static flags = {
    api: Flags.url({char: 'u', description: 'the api URL', default: new URL('http://localhost:8080')}),
    searchPaths: Flags.directory({char: 'p', description: 'the search paths for ai-agent script file', exists: true, multiple: true}),
    logLevel: Flags.string({char: 'l', description: 'the log level', options: ['silence', 'fatal', 'error', 'warn', 'info', 'debug', 'trace']}),
    interactive: Flags.boolean({char: 'i', description: 'interactive mode', allowNo: true}),
    stream: Flags.boolean({char: 's', description: 'stream mode', allowNo: true}),
    banner: Flags.boolean({char: 'b', description: 'show banner', allowNo: true}),
    ...AICommand.flags,
  }

  async run(): Promise<any> {
    const config = this.config
    const {args, flags} = await this.parse(RunScript)
    // console.log('🚀 ~ RunScript ~ run ~ flags:', flags)
    const isJson = this.jsonEnabled()
    logLevel.json = isJson
    const interactive = flags.interactive
    const hasBanner = flags.banner ?? interactive
    if (hasBanner) {showBanner()}

    let level = flags.logLevel as any
    if (!level) {
      level = interactive ? 'error' : 'warn'
    }
    try {
      let result = await runScript(args.script, {
        logLevel: level,
        apiUrl: flags.api.toString(),
        searchPaths: flags.searchPaths,
        interactive,
        stream: flags.stream,
        data: args.data,
        config,
      })
      if (LogLevelMap[level] >= LogLevelMap.info && result.content) {
        result = result.content
      }
      if (!interactive) {
        this.log(typeof result === 'string' ? result : cj(result))
      }
      return result
    } catch (error: any) {
      if (error) {
        this.error(error.message)
      }
    }
  }
}
