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

export function expandConfig(config: any, defaultConfig: any) {
  const processEnv = { ...process.env, ...defaultConfig }

  return expandObjEnv(config, {
    processEnv,
    parsed: processEnv
  })
}

export function loadConfig(filename: string, config: Config) {
  let defaultConfig = ConfigFile.loadSync(path.resolve(config.configDir, filename))
  if (!defaultConfig) {
    defaultConfig = {
      configDirs: ['$XDG_BIN_HOME', config.configDir, '$HOME'],
      brainDir: [path.join(config.dataDir, 'brain')],
      agentDirs: [path.join(config.dataDir, 'agent'), '$PWD'],
      promptDirs: [path.join(config.dataDir, 'prompt')],
    }
  }

  for (const [key, value] of Object.entries(getXDGConfigs(config))) {
    defaultConfig[key] = value
  }

  expandConfig(defaultConfig, defaultConfig)
  const searchPaths = defaultConfig.configDirs
  if (defaultConfig.AI_CONFIG_BASENAME) {
    filename = defaultConfig.AI_CONFIG_BASENAME
  }
  return expandConfig(loadConfigFile(filename, searchPaths), defaultConfig)
}

export function loadAIConfig(config: Config) {
  return loadConfig(DEFAULT_CONFIG_NAME, config)
}

export function getXDGConfigs(config: Config) {
  const result = {
    XDG_CONFIG_HOME: config.configDir,
    XDG_DATA_HOME: config.dataDir,
    XDG_CACHE_HOME: config.cacheDir,
    XDG_BIN_HOME: path.dirname(config.options.root),
  }
  return result
}
