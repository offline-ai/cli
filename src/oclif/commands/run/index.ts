import cj from 'color-json'
import {Args, Flags} from '@oclif/core'
import { parseJsJson } from '@isdk/ai-tool'
import { LogLevelMap, logLevel } from '@isdk/ai-tool-agent'

import { AICommand, AICommonFlags } from '../../lib/ai-command.js'
import {runScript} from '../../../lib/run-script.js'
import { showBanner } from '../../lib/help.js'
import { expandPath } from '../../../lib/load-config.js'

export default class RunScript extends AICommand {
  static args = {
    data: Args.string({
      description: 'the json data which will be passed to the ai-agent script',
      parse: (input: string) => {
        try {
          return parseJsJson(input)
        } catch(e) {
          return input
        }
      },
    })
  }

  static summary = '💻 Run ai-agent script file.'

  static description = 'Execute ai-agent script file and return result. with `-i` to interactive.'

  static examples = [
    `<%= config.bin %> <%= command.id %> -f ./script.yaml "{content: 'hello world'}" -l info
┌────────────────────
│[info]:Start Script: ...
`,
  ]

  static flags = {
    ...AICommand.flags,
    ...AICommonFlags,
    'consoleClear': Flags.boolean({
      aliases: ['console-clear', 'ConsoleClear', 'Console-clear', 'Console-Clear'],
      description: 'Whether console clear after stream output, default to true in interactive, false to non-interactive',
      allowNo: true,
    }),
  }

  async run(): Promise<any> {
    const opts = await this.parse(RunScript)
    const {flags} = opts
    // console.log('🚀 ~ RunScript ~ run ~ flags:', flags)
    const isJson = this.jsonEnabled()
    const userConfig = this.loadConfig(flags.config, opts)
    logLevel.json = isJson
    const hasBanner = userConfig.banner ?? userConfig.interactive
    let script = userConfig.script
    if (!script) {
      this.error('missing script to run! require argument: `-f <script_file_name>`')
    }

    script = expandPath(script, userConfig)

    if (hasBanner) {showBanner()}

    if (!userConfig.logLevel) {
      userConfig.logLevel = userConfig.interactive ? 'error' : 'warn'
    }

    try {
      this.config.runHook('init_tools', {id: 'run', userConfig})
      let result = await runScript(script, userConfig)
      if (LogLevelMap[userConfig.logLevel] >= LogLevelMap.info && result?.content) {
        result = result.content
      }
      if (!userConfig.interactive && result != null) {
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
