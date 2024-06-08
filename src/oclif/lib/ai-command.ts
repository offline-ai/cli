import path from 'path'
import {Command, Flags} from '@oclif/core'
import { DEFAULT_CONFIG_NAME, loadAIConfig, loadConfigFile } from '../../lib/load-config.js'
import { defaultsDeep } from 'lodash-es'
import { parseJsJson } from '@isdk/ai-tool'

// const CONFIG_BASE_NAME = '.ai'

export abstract class AICommand extends Command {
  static enableJsonFlag = true

  static flags : Record<string, any> = {
    config: Flags.file({char: 'c', description: 'the config file', exists: true}),
    banner: Flags.boolean({description: 'show banner', allowNo: true}),
  }

  loadConfig(configFile?: string, {args, flags}: any = {}) {
    let result = loadAIConfig(this.config)
    if (configFile) {
      configFile = path.resolve(configFile)
      const config = loadConfigFile(configFile)
      if (!config) {
        this.error(`config file ${configFile} not found`)
      }
      result = defaultsDeep(config, result)
    }
    result.theme = this.config.theme
    if (flags) {
      if (flags.interactive !== undefined) {result.interactive = flags.interactive}
      if (flags.brainDir) {result.brainDir = flags.brainDir}
      if (flags.agentDirs) {result.agentDirs = flags.agentDirs}
      if (flags.histories) {result.chatsDir = flags.histories}
      if (flags.newChat) {result.newChat = flags.newChat}
      if (result.newChat === undefined && !result.interactive) {
        result.newChat = true
      }
      if (flags['no-chats']) {result.chatsDir = undefined}
      if (flags.inputs) {result.inputsDir = flags.inputs}
      if (flags['no-inputs']) {result.inputsDir = undefined}
      if (flags.stream !== undefined) {result.stream = flags.stream}
      if (result.stream === undefined) {result.stream = true}
      if (flags.banner !== undefined) {result.banner = flags.banner}
      const api = flags.api?.toString()
      if (api) {result.apiUrl = api}
      if (!result.apiUrl) {result.apiUrl = 'http://localhost:8080'}
      if (flags.logLevel) {result.logLevel = flags.logLevel}
      if (flags.script) {result.script = flags.script}

      if (flags.arguments) {result.arguments = result.arguments ? defaultsDeep(flags.arguments, result.arguments) : flags.arguments}
      if (flags.dataFile) {result.dataFile = flags.dataFile}

      let data = result.arguments
      const dataFile = result.dataFile
      if (dataFile) {
        const _data = loadConfigFile(dataFile)
        if (_data) {
          if (data) {
            data = defaultsDeep(data, _data)
          } else {
            data = _data
          }
        } else {
          const whetherInFile = result.arguments ? '' : ' in config file'
          this.error(`The data file "${dataFile}" not found${whetherInFile}!`)
        }
      }
      Object.defineProperty(result, 'data', {
        value: data,
        enumerable: false,
        writable: true,
      })
    }

    if (!result.AI_CONFIG_BASENAME) {result.AI_CONFIG_BASENAME = DEFAULT_CONFIG_NAME}
    if (!configFile) {
      configFile =  result.AI_CONFIG_BASENAME as string
    }
    if (!path.isAbsolute(configFile)) {configFile = path.resolve(this.config.configDir, configFile)}
    Object.defineProperty(result, 'configFile', {
      value: configFile,
      enumerable: false,
    })

    if (args?.data) {
      if (result.hasOwnProperty('data')) {
        result.data = defaultsDeep(args.data, result.data)
      } else {
        Object.defineProperty(result, 'data', {
          value: args.data,
          enumerable: false,
          writable: true,
        })
      }
    }

    return result
  }
}

export const AICommonFlags = {
  api: Flags.url({char: 'u', description: 'the api URL'}),
  agentDirs: Flags.directory({char: 's', description: 'the search paths for ai-agent script file', exists: true, multiple: true}),
  logLevel: Flags.string({char: 'l', description: 'the log level', options: ['silence', 'fatal', 'error', 'warn', 'info', 'debug', 'trace']}),
  interactive: Flags.boolean({char: 'i', description: 'interactive mode', allowNo: true}),
  histories: Flags.directory({char: 'h', description: 'the chat histories folder to record', exists: true}),
  newChat: Flags.boolean({char:'n', aliases:['new-chat'], description: 'whether to start a new chat history, defaults to false in interactive mode, true in non-interactive', allowNo: true}),
  inputs: Flags.directory({char: 't', description: 'the input histories folder for interactive mode to record', exists: true, dependsOn: ['interactive']}),
  'no-chats': Flags.boolean({description: 'disable chat histories, defaults to false', dependsOn: ['interactive']}),
  'no-inputs': Flags.boolean({description: 'disable input histories, defaults to false', dependsOn: ['interactive']}),
  stream: Flags.boolean({char: 'm', description: 'stream mode, defaults to true', allowNo: true}),
  script: Flags.string({char: 'f', description: 'the ai-agent script file name or id'}),
  dataFile: Flags.file({char: 'd', description: 'the data file which will be passed to the ai-agent script'}),
  arguments: Flags.string({
    char: 'a', description: 'the json data which will be passed to the ai-agent script',
    parse: (input: string) => parseJsJson(input),
  }),
  brainDir: Flags.directory({char: 'b', description: 'the brains(LLM) directory', exists: true}),
  promptDirs: Flags.directory({char: 'p', description: 'the prompts template directory', exists: true, multiple: true}),
}
