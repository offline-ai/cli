const DEFAULT_CONFIG_NAME = '.ai'

import { expandObjEnv } from "@isdk/ai-tool";
import { ConfigFile } from "@isdk/ai-tool-prompt"
import { defaultsDeep } from "lodash-es"
import path from 'path'
import type { Config } from "@oclif/core";

export function loadConfigFile(filename: string, searchPaths: string[] = ['.']) {
  if (path.isAbsolute(filename)) {return ConfigFile.loadSync(filename)}

  const configs = searchPaths.map(p => {
    return ConfigFile.loadSync(path.resolve(p, filename))
  }).filter(Boolean);
 return defaultsDeep({}, ...configs)
}

export function expandConfig(config: any, data: Config) {
  const processEnv = { ...process.env }
  processEnv.XDG_CONFIG_HOME = data.configDir
  processEnv.XDG_DATA_HOME = data.dataDir
  processEnv.XDG_CACHE_HOME = data.cacheDir
  processEnv.XDG_BIN_HOME = data.binPath ?? data.options.root

  return expandObjEnv(config, {
    processEnv,
    parsed: processEnv
  })
}

export function loadConfig(filename: string, config: Config) {
  let defaultConfig = ConfigFile.loadSync(path.resolve(config.configDir, filename))
  if (!defaultConfig) {
    defaultConfig = {
      configDir: ['$XDG_BIN_HOME', config.configDir, '$HOME'],
      brainDir: [path.join(config.dataDir, 'brain')],
      agentDir: [path.join(config.dataDir, 'agent'), '$PWD'],
      promptDir: [path.join(config.dataDir, 'prompt')],
    }
  }
  const searchPaths = defaultConfig.configDir
  return expandConfig(loadConfigFile(filename, searchPaths), config)
}

export function loadAIConfig(config: Config) {
  return loadConfig(DEFAULT_CONFIG_NAME, config)
}
