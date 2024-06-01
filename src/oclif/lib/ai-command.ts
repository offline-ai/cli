import path from 'path'
import {Command, Flags} from '@oclif/core'
import { loadAIConfig, loadConfigFile } from '../../lib/load-config.js'
import { defaultsDeep } from 'lodash-es'

// const CONFIG_BASE_NAME = '.ai'

export abstract class AICommand extends Command {
  static enableJsonFlag = true

  static flags : Record<string, any> = {
    config: Flags.file({char: 'c', description: 'the config file', exists: true})
  }

  loadConfig(configFile?: string) {
    let result = loadAIConfig(this.config)
    if (configFile) {
      configFile = path.resolve(configFile)
      const config = loadConfigFile(configFile)
      if (!config) {
        this.error(`config file ${configFile} not found`)
      }
      result = defaultsDeep(config, result)
    }
    return result
  }
}
