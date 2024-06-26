import path from 'path'
import {
  ToolFunc,
} from '@isdk/ai-tool'
import { AIModelQuantType, AIModelSettings, LlmModelsFunc } from '@isdk/ai-tool-llm'
// import { LlamaCppProviderName, llamaCpp } from '@isdk/ai-tool-llm-llamacpp'
// import { AIPromptsFunc, AIPromptsName } from '@isdk/ai-tool-prompt'
import { DownloadProgressEventName, DownloadStatusEventName, FileDownloadStatus, download } from '@isdk/ai-tool-downloader'
import { BRAINS_FUNC_NAME } from './init-tools.js'
import EventEmitter from 'events'

EventEmitter.defaultMaxListeners = 1000

// note: need initTools() first
export function upgradeBrains() {
  const brains = ToolFunc.get(BRAINS_FUNC_NAME) as LlmModelsFunc
  brains.updateDBFromDir()
}

export function listBrains(userConfig: any, flags: any) {
  const brainDir = userConfig.brainDir
  const result: any[] = searchBrains(brainDir, flags)
  return result
}

export function searchBrains(brainDir: string, flags: any) {
  const brains = ToolFunc.get(BRAINS_FUNC_NAME) as LlmModelsFunc
  const filter:any = flags.search ?? {}
  let onlyFeatured = flags.onlyFeatured
  if (!flags.all) {
    if (flags.downloaded) {
      filter.downloaded = {'=': true}
    } else {
      filter.$or = [{downloaded: {'!=': true}}, {downloaded: null}]
    }
    // filter.downloaded = flags.downloaded ? {'=': true} : {'!=': true}
    if (!flags.downloaded && onlyFeatured === undefined) {
      // the defaults for online is true
      onlyFeatured = true
    }

    if (onlyFeatured) {
      filter.featured = true
    }
  }

  if (flags.name) {
    filter._id = {'$like': `%${flags.name}%`}
  }

  const result = brains.$search({filter})
  return result as AIModelSettings[]
}

export function printBrains(brains: AIModelSettings[], flags?: {count?: number}) {
  let maxArrayLength = flags?.count ?? 100
  if (maxArrayLength >= 0) {maxArrayLength--}
  for (let i=0; i<brains.length; i++) {
    const brain = brains[i]
    brain.files
    console.log((i+1)+'. '+sprintBrainInfo(brain))
    console.log(sprintBrainFileInfo(brain))
    if ((maxArrayLength > 0) && (i >= maxArrayLength)) {break}
  }
  if (brains.length > maxArrayLength) {
    maxArrayLength++
    console.log((maxArrayLength+1)+`. …… and ${brains.length - maxArrayLength} more\n`)
  }
  console.log('total:', brains.length)
}

export function getQuantsFromBrain(brain: AIModelSettings) {
  return getFileInfo(brain).map(item => item.quant)
}

export async function downloadBrain(brain: AIModelSettings, options: {quant: number, url?: string, dryRun?: boolean, onStatus?: Function, onProgress?: Function}) {
  const quant = options.quant
  const brains = ToolFunc.get(BRAINS_FUNC_NAME) as LlmModelsFunc
  const dryRun = options.dryRun
  let downTasks = await brains.$download({id: brain._id, quant, url: options.url, dryRun})
  if (downTasks) {
    if (!Array.isArray(downTasks)) {downTasks = [downTasks]}
    downTasks = downTasks.filter(Boolean)
  }

  if (dryRun) return downTasks

  return new Promise<any>((resolve, reject) => {
    if (downTasks) {
      if (!Array.isArray(downTasks)) {downTasks = [downTasks]}
      downTasks = downTasks.filter(Boolean)
      let leftCount = downTasks.length
      const errs: string[] = []
      for (const downTask of downTasks) {
        if (typeof options.onProgress === 'function') {
          download.on(DownloadProgressEventName+':'+downTask!.id, options.onProgress)
        }
        download.on(DownloadStatusEventName+':'+downTask!.id, function(_name: string, status: FileDownloadStatus, idInfo: {url: string, id: string, filepath: string}) {
          // console.log(_name, status, idInfo)
          if (status === 'completed') {
            --leftCount
            if (leftCount === 0) resolve(downTasks)
          } else if (status !== 'downloading') {
            --leftCount
            errs.push(`download ${idInfo.filepath} failed : ${status}`)
            console.error(`download ${idInfo.filepath} failed : ${status}`)
          }
          if (leftCount === 0) {
            if (errs.length > 0) {
              reject(new Error(errs.join('\n')))
            } else {
              resolve(downTasks)
            }
          }
          if (typeof options.onStatus === 'function') {
            try {
              options.onStatus.call(this, _name, status, idInfo)
            } catch (err) {
              console.error(err)
            }
          }
        })
      }
    } else {
      reject(new Error('no download'))
    }
  })
}

function sprintBrainInfo(brain: AIModelSettings) {
  const keys = ['name', 'likes', 'downloads', 'hf_repo']
  let result = ''
  for (let i=0; i<keys.length; i++) {
    const key = keys[i]
    const value = brain[key]
    if (value) {
      result += `${key}: ${JSON.stringify(value)}`
      if (i < keys.length - 1) {
        result += ', '
      }
    }
  }
  return result
}

function getFileInfo(brain: AIModelSettings) {
  const files = brain.files!
  const result: any[] = []
  for (let file of files) {
    if (Array.isArray(file)) {
      if (file[0]) {
        file = {...file[0], count: file.length}
      } else {continue}
    }
    result.push({quant: AIModelQuantType[file.quant!],file_name: path.basename(file.file_name!), count: file.count})
  }
  return result
}

function sprintBrainFileInfo(brain: AIModelSettings) {
  const info = getFileInfo(brain)
  let result = ''
  for (let i = 0; i < info.length; i++) {
    const item = info[i]
    result += `   * ${item.quant}: ${item.file_name}`
    if (item.count > 1) {
      result += ` (${item.count} files)`
    }
    if (i < info.length - 1) {
      result += '\n'
    }
  }
  return result
}