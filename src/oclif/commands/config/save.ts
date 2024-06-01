import {Flags} from '@oclif/core'
import { AICommand } from '../../lib/ai-command.js'
import { loadConfigFile } from '../../../lib/load-config.js'
import { defaultsDeep } from 'lodash-es'
import { showBanner } from '../../lib/help.js'

export default class AIConfigSaveCommand extends AICommand {
  static enableJsonFlag = true

  static summary = '🛠️💾 Save the configuration to file.'

  // static description = ''

  static flags = {
    ...AICommand.flags,
    api: Flags.url({char: 'u', description: 'the api URL'}),
    searchPaths: Flags.directory({char: 's', description: 'the search paths for ai-agent script file', exists: true, multiple: true}),
    logLevel: Flags.string({char: 'l', description: 'the log level', options: ['silence', 'fatal', 'error', 'warn', 'info', 'debug', 'trace']}),
    interactive: Flags.boolean({char: 'i', description: 'interactive mode', allowNo: true}),
    history: Flags.file({char: 'h', description: 'the chat history file for interactive mode to record', dependsOn: ['interactive']}),
    stream: Flags.boolean({char: 'm', description: 'stream mode. defaults to true.', allowNo: true}),
    banner: Flags.boolean({char: 'b', description: 'show banner', allowNo: true}),
    script: Flags.string({char: 'f', description: 'the ai-agent script file name or id'}),
    dataFile: Flags.file({char: 'd', description: 'the data file which will be passed to the ai-agent script'}),
  }

  async run(): Promise<any> {
    const {args, flags} = await this.parse(AIConfigSaveCommand)
    const userConfig = this.loadConfig(flags.config)
    const interactive = flags.interactive ?? userConfig.interactive
    if (interactive !== undefined) {userConfig.interactive = interactive}

    const hasBanner = flags.banner ?? userConfig.banner ?? interactive
    if (hasBanner !== undefined) {userConfig.banner = hasBanner}

    const apiUrl = flags.api?.toString() ?? userConfig.apiUrl ?? 'http://localhost:8080'
    if (apiUrl) {userConfig.apiUrl = apiUrl}
    const script = flags.script ?? userConfig.script
    if (script) {userConfig.script = script}
    const searchPaths = flags.searchPaths ?? userConfig.agentDirs
    if (searchPaths) {userConfig.agentDirs = searchPaths}
    const chatsFilename = flags.history ?? userConfig.history
    const stream = flags.stream ?? userConfig.stream ?? true
    if (stream !== undefined) {userConfig.stream = stream}

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
    if (hasBanner) {showBanner('Config')}

    let level: any = flags.logLevel ?? userConfig.logLevel
    if (!level) {
      level = interactive ? 'error' : 'warn'
    }
  }
}
