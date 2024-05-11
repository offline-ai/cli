import {Args, Command, Flags} from '@oclif/core'
import { parseJsJson } from '@isdk/ai-tool'
import { LogLevelMap, logLevel } from '@isdk/ai-tool-agent'

import {runScript} from '../../../lib/run-script.js'

export default class RunScript extends Command {
  public static enableJsonFlag = true

  static args = {
    script: Args.file({description: 'the ai-agent script file name', exists: true, required: true}),
    data: Args.string({
      description: 'the data which will be passed to the ai-agent script',
      parse: (input: string) => parseJsJson(input),
    })
  }

  static description = 'Run ai-agent script file'

  static examples = [
    `<%= config.bin %> <%= command.id %> ./script.yaml
┌────────────────────
│[info]:Start Script: ...
`,
  ]

  static flags = {
    apiUrl: Flags.url({char: 'u', description: 'the api URL', default: new URL('http://localhost:8080')}),
    searchPaths: Flags.directory({char: 's', description: 'the search paths for ai-agent script file', exists: true, multiple: true}),
    logLevel: Flags.string({char: 'l', description: 'the log level', options: ['silence', 'fatal', 'error', 'warn', 'info', 'debug', 'trace'], default: 'info'}),
  }

  async run(): Promise<any> {
    const {args, flags} = await this.parse(RunScript)
    // console.log('🚀 ~ RunScript ~ run ~ flags:', flags)
    const isJson = this.jsonEnabled()
    logLevel.json = isJson
    const level = flags.logLevel as any
    let result = await runScript(args.script, {
      logLevel: level,
      apiUrl: flags.apiUrl.toString(),
      searchPaths: flags.searchPaths,
      data: args.data,
    })
    if (LogLevelMap[level] >= LogLevelMap.info && result.content) {
      result = result.content
    }
    this.log(typeof result === 'string' ? result : JSON.stringify(result, null, 2))
    return result
  }
}
