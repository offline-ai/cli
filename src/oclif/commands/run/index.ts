import cj from 'color-json'
import {Args, Flags} from '@oclif/core'
import { parseJsJson } from '@isdk/ai-tool'
import { LogLevelMap, logLevel } from '@isdk/ai-tool-agent'

import { AICommand } from '../ai-command.js'
import {runScript} from '../../../lib/run-script.js'
import { showBanner } from '../../lib/help.js'
import { loadConfigFile } from '../../../lib/load-config.js'
import { defaultsDeep } from 'lodash-es'

export default class RunScript extends AICommand {
  static enableJsonFlag = true

  static args = {
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
    ...AICommand.flags,
    api: Flags.url({char: 'u', description: 'the api URL'}),
    searchPaths: Flags.directory({char: 'p', description: 'the search paths for ai-agent script file', exists: true, multiple: true}),
    logLevel: Flags.string({char: 'l', description: 'the log level', options: ['silence', 'fatal', 'error', 'warn', 'info', 'debug', 'trace']}),
    interactive: Flags.boolean({char: 'i', description: 'interactive mode', allowNo: true}),
    history: Flags.file({char: 'h', description: 'the chat history file for interactive mode to record', dependsOn: ['interactive']}),
    stream: Flags.boolean({char: 's', description: 'stream mode', allowNo: true}),
    banner: Flags.boolean({char: 'b', description: 'show banner', allowNo: true}),
    script: Flags.string({char: 'f', description: 'the ai-agent script file name or id'}),
    dataFile: Flags.file({char: 'd', description: 'the data file which will be passed to the ai-agent script'}),
  }

  async run(): Promise<any> {
    const config = this.config
    const {args, flags} = await this.parse(RunScript)
    // console.log('🚀 ~ RunScript ~ run ~ flags:', flags)
    const isJson = this.jsonEnabled()
    const userConfig = this.loadConfig(flags.config)
    logLevel.json = isJson
    const interactive = flags.interactive ?? userConfig.interactive
    const hasBanner = flags.banner ?? userConfig.banner ?? interactive
    const apiUrl = flags.api?.toString() ?? userConfig.apiUrl ?? 'http://localhost:8080'
    const script = flags.script ?? userConfig.script
    const searchPaths = flags.searchPaths ?? userConfig.agentDir
    const chatsFilename = flags.history ?? userConfig.history
    const stream = flags.stream ?? userConfig.stream ?? true
    let data = args.data
    const dataFile = flags.dataFile ?? userConfig.dataFile
    if (dataFile) {
      const _data = loadConfigFile(dataFile)
      if (_data) {
        if (data) {
          data = defaultsDeep(data, _data)
        } else {
          data = _data
        }
      } else {
        const whetherInFile = flags.dataFile ? '' : ' in config file'
        this.error(`The data file "${dataFile}" not found${whetherInFile}!`)
      }
    }
    data = data ? defaultsDeep(data, userConfig.data) : userConfig.data

    if (!script) {
      this.error('missing script to run! require argument: `-f <script_file_name>`')
    }

    if (hasBanner) {showBanner()}

    let level: any = flags.logLevel ?? userConfig.logLevel
    if (!level) {
      level = interactive ? 'error' : 'warn'
    }
    try {
      let result = await runScript(script, {
        logLevel: level,
        apiUrl,
        searchPaths,
        interactive,
        chatsFilename,
        stream,
        data,
        config,
      })
      if (LogLevelMap[level] >= LogLevelMap.info && result?.content) {
        result = result.content
      }
      if (!interactive && result != null) {
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
