import path from 'path'
import enquier from 'enquirer'
import { Args, Flags } from '@oclif/core'
import { initTools } from '../../../lib/init-tools.js'
import { AICommand } from '../../lib/ai-command.js'
import { showBanner } from '../../lib/help.js'
import { downloadBrain, getQuantsFromBrain, listBrains, printBrains } from '../../../lib/brain.js'
import { AIModelQuantType } from '@isdk/ai-tool-llm'
import logUpdate from 'log-update'

const AIModelQuantTypes = Object.keys(AIModelQuantType).filter(k => (typeof AIModelQuantType[k] === 'number') && k !== 'Guessed')
const prompt = enquier.prompt

export default class DownloadBrainCommand extends AICommand {
  static aliases = ['brain:dn', 'brain:down']
  static args = {
    name: Args.string({
      description: 'the brain name to download',
    })
  }

  static flags = {
    ...AICommand.flags,
    brainDir: Flags.directory({char: 'b', description: 'the brains(LLM) directory', exists: true}),
    quant: Flags.string({
      char: 'q',
      description: 'the quantization of the model, defaults to 4bit',
      options: AIModelQuantTypes,
    }),
    hubUrl: Flags.string({
      char: 'u',
      aliases: ['hub-url'],
      description: 'the hub mirror url',
    }),
    dryRun: Flags.boolean({
      char: 'd',
      aliases: ['dry-run'],
      description: 'dry run, do not download',
    }),
  }

  static summary = '🧠 The AI Agent Brains(LLM) Downloader.'

  static description = `
  📥 download 🧠 brains to brainDir.
`

  static examples = [`
<%= config.bin %> <%= command.id %> <brain-name> [-q <QUANT>]
`,
  ]

  async run(): Promise<any> {
    const opts = await this.parse(DownloadBrainCommand)
    const isJson = this.jsonEnabled()
    const {args, flags} = opts
    const userConfig = this.loadConfig(flags.config, opts)
    initTools(userConfig)

    process.on('SIGINT', ()=>{
      process.exit(0)
    })

    if (userConfig.banner && !isJson) {showBanner('Brain')}
    flags.name = args.name
    if (!flags.name) {
      const {name} = await prompt<{name: string}>({
        type: 'input',
        name: 'name',
        message: 'Enter the brain(LLM) name to download',
      })
      if (!name) {
        this.log('No brain name provided')
        return
      }
      flags.name = name
    }
    flags.onlyFeatured = false
    flags.all = true
    let brain: any = listBrains(userConfig, flags)
    if (!brain || brain.length === 0) {
      this.log('No Such brains found')
      return
    } else if (brain.length > 1) {
      const {index} = await prompt<{index: number}>({
        type: 'autocomplete',
        name: 'index',
        message: 'Select the brain(LLM) to download',
        choices: brain.map((b, index) => ({message: b.author +'/' + b.name, value: index})),
      })
      if (index === undefined) {
        this.log('No brain name provided')
        return
      }
      brain = brain[index]
    } else {
      brain = brain[0]
    }

    const quants = getQuantsFromBrain(brain)
    if (flags.quant && !quants.includes(flags.quant)) {
      this.log(`Your chosen brain has no such quantization level: ${flags.quant}`)
      flags.quant = undefined
    }

    if (!flags.quant) {
      const {quant} = await prompt<{quant: string}>({
        type: 'autocomplete',
        name: 'quant',
        message: 'Choose the quantization level for the brain compression (lossy)',
        choices: quants,
      })
      if (!quant) {
        this.log('No quantization provided')
        return
      }
      flags.quant = quant
    }

    const quant = AIModelQuantType[flags.quant]
    const progresses: any = {}
    const onProgress = function(_name: string, progress: {percent:number, totalBytes:number, transferredBytes:number}, idInfo: {url: string, id?: string, filepath?: string}) {
      // console.log('🚀 ~ DownloadBrainCommand ~ onProgress ~ progress:', arguments)
      progresses[idInfo.url] = `Downloading ${idInfo.url}... ${(progress.percent * 100).toFixed(2)}% ${progress.transferredBytes} bytes`
      const info = Object.keys(progresses).map(k => progresses[k]).join('\n')
      logUpdate(info)
    }
    this.log('Downloading to ' + userConfig.brainDir)
    let result: any[]
    try {
      result = await downloadBrain(brain, {quant, onProgress, url: flags.hubUrl, dryRun: flags.dryRun})
    } finally {
      logUpdate.clear()
    }
    if (result?.length && !isJson) {
      const width = calcIntWidth(result.length)
      // result = result.map(item => omitBy(item, (v, k) => k === 'id' || v == null))
      result.forEach((item, index) => {
        this.log((++index).toString().padStart(width, ' ') + '. ' + item.url)
        this.log(' '.padStart(width, ' ') + '  ' + path.join(userConfig.brainDir, item.filepath))
      })
    }
    this.log('done')
    return result
  }
}

function calcIntWidth(num: number) {
  let width = 0
  while (num > 0) {
    num = Math.floor(num / 10)
    width++
  }
  return width
}