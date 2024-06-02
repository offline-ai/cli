export const DEFAULT_CONFIG_NAME = '.ai'

import { expandObjEnv, getMultiLevelExtname } from "@isdk/ai-tool";
import { ConfigFile, stringifyYaml } from "@isdk/ai-tool-prompt"
import { defaultsDeep, omit } from "lodash-es"
import fs from 'fs'
import path from 'path'
import type { Config } from "@oclif/core";
import {mimeType} from 'mime-type/with-db'

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
      chatsDir: path.join(config.dataDir, 'log', 'chats'),
      inputsDir: path.join(config.dataDir, 'log', 'inputs'),
    }
  }
  const XDGConfigs = getXDGConfigs(config)
  for (const [key, value] of Object.entries(XDGConfigs)) {
    defaultConfig[key] = value
  }

  expandConfig(defaultConfig, defaultConfig)
  const searchPaths = defaultConfig.configDirs
  if (defaultConfig.AI_CONFIG_BASENAME) {
    filename = defaultConfig.AI_CONFIG_BASENAME
  }
  const result = expandConfig(loadConfigFile(filename, searchPaths), defaultConfig)
  return defaultsDeep(result, omit(defaultConfig, Object.keys(XDGConfigs)))
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

export function saveConfigFile(filename: string, config: any, extLevel = 1) {
  if (filename[0] === '.') {extLevel++}
  const extname = getMultiLevelExtname(filename, extLevel)
  if (!extname || (extname.split('.').length <= 1)) {filename += '.yaml'}
  const mime = mimeType.lookup(filename) as string
  if (mime === 'application/json')
    config = JSON.stringify(config, null, 2)
  else if (mime === 'text/yaml') {
    config = stringifyYaml(config)
  } else {
    throw new Error(`${filename} unsupported mime type: ${mime}`)
  }
  const dirname = path.dirname(filename)
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, {recursive: true})
  }
  fs.writeFileSync(filename, config, {encoding: 'utf8'})
}
