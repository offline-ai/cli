import path from 'path'
import {
  ServerTools as ToolFunc,
} from '@isdk/ai-tool'
import { AIModelQuantType, AIModelSettings } from '@isdk/ai-tool-llm'
import type { LlmModelsFunc } from '@isdk/ai-tool-model'
import { DownloadProgressEventName, DownloadStatusEventName, FileDownloadStatus, download } from '@isdk/ai-tool-downloader'
import { BRAINS_FUNC_NAME } from './init-tools.js'
import EventEmitter from 'events'

EventEmitter.defaultMaxListeners = 1000

export async function upgradeBrains(flags?: any) {
  const brains = ToolFunc.get(BRAINS_FUNC_NAME) as LlmModelsFunc
  let _models: AIModelSettings[]|undefined
  let shouldBreak: boolean|undefined

  brains.on('brain:refresh', onRefresh)
  process.on('SIGINT', interrupted)

  try {
    const count = await brains.$refresh(flags)
    return count
  } finally {
    brains.off('brain:refresh', onRefresh)
    process.off('SIGINT', interrupted)
    if (shouldBreak) {console.log('saved.')}
  }

  function onRefresh(tool_name: string, act: string, model: AIModelSettings, models: AIModelSettings[]|string){
    let s = model._id!
    if (s.includes(':')) {s = '  ' + s}
    if (Array.isArray(models)) {
      _models = models
    } else if(models && typeof models === 'string') {
      s += ' ' + models
    }
    console.log(act, s)
    if (shouldBreak) {this.result = true}
  }

  async function interrupted() {
    if (_models) {
      console.log('wait to exit...')
      shouldBreak = true
    } else {
      process.exit(0)
    }
  }
}

export async function listBrains(userConfig: any, flags: any) {
  const brainDir = userConfig.brainDir
  const result = await searchBrains(brainDir, flags)
  return result
}

export async function searchBrains(brainDir: string, flags: any) {
  const brains = ToolFunc.get(BRAINS_FUNC_NAME) as LlmModelsFunc
  let result: AIModelSettings[]|undefined
  if (flags.name && flags.name.startsWith('hf://')) {
    const model = await brains.getModel(flags.name, flags.hubUrl)
    if (model) {result = [model]}
  } else {
    const filter:any = flags.search ?? {}
    const onlyFeatured = flags.onlyFeatured
    if (!flags.all) {
      if (flags.downloaded) {
        filter.downloaded = {'=': true}
      } else {
        filter.$or = [{downloaded: {'!=': true}}, {downloaded: null}]
      }
      // filter.downloaded = flags.downloaded ? {'=': true} : {'!=': true}
      // if (!flags.downloaded && onlyFeatured === undefined) {
      //   // the defaults for online is true
      //   onlyFeatured = true
      // }

      if (onlyFeatured) {
        filter.featured = true
      }
    }

    if (flags.name) {
      filter._id = {'$like': `%${flags.name}%`}
    }

    result = brains.$search({filter}) as AIModelSettings[]
  }
  return result
}

export async function verifyBrains(brains: AIModelSettings[]) {
  const brainFunc = ToolFunc.get(BRAINS_FUNC_NAME) as LlmModelsFunc
  for (const brain of brains) {
    const changed = await brainFunc.verifyFileExists(brain)
    if (changed) {
      brainFunc.put({id: brain._id, val: brain})
    }
  }
}

export function printBrains(brains: AIModelSettings[], flags?: {count?: number}) {
  let maxArrayLength = flags?.count ?? 100
  if (maxArrayLength >= 0) {maxArrayLength--}
  for (let i=0; i<brains.length; i++) {
    const brain = brains[i]
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

export async function downloadBrain(brain: AIModelSettings, options: {
  quant: number, url?: string, dryRun?: boolean, onStatus?: Function, onProgress?: Function,
  logLevel?: string,
}) {
  const quant = options.quant
  const onProgress = options.onProgress
  const brains = ToolFunc.get(BRAINS_FUNC_NAME) as LlmModelsFunc
  const dryRun = options.dryRun

  if (typeof onProgress === 'function') {
    brains.on('model:'+DownloadStatusEventName, (_name: string, status: string, info: any) => {
      if (info.old === info.quant) {delete info.old}
      onProgress('status', status, info)
    })
  }

  let downTasks = await brains.$download({id: brain._id, quant, url: options.url, dryRun})
  if (downTasks) {
    if (!Array.isArray(downTasks)) {downTasks = [downTasks]}
    downTasks = downTasks.filter(Boolean)
  }

  if (dryRun) return downTasks

  return new Promise<any>((resolve, reject) => {
    if (downTasks) {
      // if (!Array.isArray(downTasks)) {downTasks = [downTasks]}
      // downTasks = downTasks.filter(Boolean)
      let leftCount = downTasks.length
      const errs: string[] = []
      for (const downTask of downTasks) {
        if (typeof onProgress === 'function') {
          download.on(DownloadProgressEventName+':'+downTask!.id, onProgress)
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
    let downloaded = ''
    if (Array.isArray(file)) {
      if (file[0]) {
        // calc total files size
        const file_size = file.reduce((acc, cur) => acc + cur.file_size!, 0)
        const downloadedCount = file.filter(item => item.downloaded).length
        if (downloadedCount === file.length) {
          downloaded = '[downloaded]'
        } else if (downloadedCount > 0) {
          downloaded = `[${downloadedCount}/${file.length} downloaded]`
        }

        file = {...file[0], count: file.length, file_size}
      } else {continue}
    } else {
      downloaded = file.downloaded ? '[downloaded]' : ''
    }
    result.push({quant: AIModelQuantType[file.quant!],file_name: path.basename(file.location || file.file_name!), count: file.count, file_size: file.file_size!, downloaded})
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
    const fileSize = item.file_size
    if (fileSize > 0) {
      result += ' - ' + sizeToStr(fileSize)
    }
    if (item.downloaded) {
      result += ' - ' + item.downloaded
    }

    if (i < info.length - 1) {
      result += '\n'
    }
  }
  return result
}

function sizeToStr(num: number, fractionDigits = 2) {
  let result = ''
  if (num >= 1e12) { result = (num / 1e12).toFixed(fractionDigits) + 'T' }
  else if (num >= 1e9) { result = (num / 1e9).toFixed(fractionDigits) + 'G' }
  else if (num >= 1e6) { result = (num / 1e6).toFixed(fractionDigits) + 'M' }
  else if (num >= 1e3) { result = (num / 1e3).toFixed(fractionDigits) + 'K' }
  else { result = num.toFixed(fractionDigits) }
  return result
}
