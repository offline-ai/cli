import fs from 'fs'
import path from 'path'
import cj from 'color-json'
import {Flags} from '@oclif/core'
import { LogLevelMap, logLevel, parseFrontMatter, parseYaml } from '@isdk/ai-tool-agent'

import { AICommand, AICommonFlags } from '../../lib/ai-command.js'
import {runScript} from '../../../lib/run-script.js'
import { showBanner } from '../../lib/help.js'
import { expandPath } from '../../../lib/load-config.js'
import { getKeysPath, getMultiLevelExtname } from '@isdk/ai-tool'
import { get as getByPath, omit } from 'lodash-es'

export default class RunTest extends AICommand {
  static summary = '🔬 Run simple ai-agent fixtures to test(draft).'

  static description = 'Execute fixtures file to test ai-agent script file and check result.'

  static examples = [
    `<%= config.bin %> <%= command.id %> -f ./fixture.yaml -l info`,
  ]

  static flags = {
    ...AICommand.flags,
    ...AICommonFlags,
    script: Flags.string({char: 'f', description: 'the ai-agent fixture file path'}),
    stream: Flags.boolean({char: 'm', description: 'stream mode, defaults to false', default: false}),
    'consoleClear': Flags.boolean({
      aliases: ['console-clear', 'ConsoleClear', 'Console-clear', 'Console-Clear'],
      description: 'Whether console clear after stream output, default to true in interactive, false to non-interactive',
      allowNo: true,
    }),
  }

  async run(): Promise<any> {
    const opts = await this.parse(RunTest)
    const {flags} = opts
    // console.log('🚀 ~ RunScript ~ run ~ flags:', flags)
    const isJson = this.jsonEnabled()
    const userConfig = this.loadConfig(flags.config, opts)
    logLevel.json = isJson
    const hasBanner = userConfig.banner ?? userConfig.interactive
    let script = userConfig.script
    if (!script) {
      this.error('missing fixture file to run! require argument: `-f <fixture_file_name>`')
    }

    if (hasBanner) {showBanner()}

    script = expandPath(script, userConfig)
    const extname = path.extname(script)
    if (!extname || extname.length === 1) {
      script = path.join(path.dirname(script), path.basename(script, extname) + '.yaml')
    } //

    const fixtureText = fs.readFileSync(script, {encoding: 'utf8'})
    if (!fixtureText) {
      this.error(`fixture file not found: ${script}`)
    }

    const fixtureInfo = parseFrontMatter(fixtureText)
    if (!fixtureInfo.data.script) {
      // this.error('missing script to run! the script option should be in the fixture file: ' + script)
      fixtureInfo.data.script = path.basename(script, getMultiLevelExtname(script, 2))
    }

    let fixtures = parseYaml(fixtureInfo.content)
    if (!fixtures) {
      this.error('Can not find fixture in the file: ' + script)
    }
    if (!Array.isArray(fixtures)) {
      fixtures = [fixtures]
    }
    const fixtureFilepath = script
    script = expandPath(fixtureInfo.data.script, userConfig)
    if (!userConfig.logLevel) {
      userConfig.logLevel = userConfig.interactive ? 'error' : 'warn'
    }

    await this.config.runHook('init_tools', {id: 'run', userConfig})

    let failedCount = 0
    let passedCount = 0
    for (let i = 0; i < fixtures.length; i++) {
      const fixture = fixtures[i]
      const input = fixture.input
      if (!input) {
        this.error(`fixture[${i}] missing input for the fixture file: ` + fixtureFilepath)
      }
      const output = fixture.output
      if (!output) {
        this.error(`fixture[${i}] missing output for the fixture file: ` + fixtureFilepath)
      }
      userConfig.data = fixture.input
      userConfig.interactive = false

      try {
        let result = await runScript(script, userConfig)
        if (LogLevelMap[userConfig.logLevel] >= LogLevelMap.info && result?.content) {
          result = result.content
        }
        const keys = getKeysPath(output)
        let failed = false
        for (const key of keys) {
          const actualValue = getByPath(result, key)
          const expectedValue = getByPath(output, key)
          if (actualValue != expectedValue) {
            // console.log(`❌ ~ RunTest[${i}] ~ failed on ${key}:`, cj(input), '~ expected:', cj(expectedValue), 'actual:', cj(actualValue));
            failed = true
          }
        }
        const reason = result.reason ? `Reason: ${result.reason}` : ''
        if (failed) {
          failedCount++
          console.log(`❌ ~ RunTest[${i}] ~ failed:`, cj(input), reason);
          console.log('🔧 ~ actual output:', cj(omit(result, ['reason'])), 'expected output:', cj(omit(output, ['reason'])));
        } else {
          passedCount++
          console.log(`👍 ~ RunTest[${i}] ~ ok!`, reason);
        }
      } catch (error: any) {
        if (error) {
          console.log('🚀 ~ RunTest ~ run ~ error:', error)
          this.error(error.message)
        }
      }
    }
    console.log(`${passedCount} passed, ${failedCount} failed, total ${fixtures.length}`)
  }
}
