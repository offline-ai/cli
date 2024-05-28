// import { color } from 'console-log-colors';
import colors from 'ansi-colors'
import cliSpinners from 'cli-spinners';
// import {randomSpinner} from 'cli-spinners';

import {Command} from '@oclif/core'
import enquier from 'enquirer'

// const red = colors.red
// const prompt = enquier.prompt
// const Prompt = enquier.Prompt
// const prompts = (enquier as any).prompts
const Input = (enquier as any).Input

// process.on('exit', function () {
//   console.log('exit...');
//   // process.exit(0);
// });

// // catch ctrl+c event and exit normally
// process.on('SIGINT', function () {
//   console.log('Ctrl-C...');
// });
export default class World extends Command {
  static args = {}

  static description = 'Say hello world'

  static hidden = true

  static examples = [
    `<%= config.bin %> <%= command.id %>
hello world! (./src/commands/run/world.ts)
`,
  ]

  static flags = {}

  async run(): Promise<void> {
    this.log('hello world! (./src/commands/run/world.ts)')
    let response: any
    // const rhythm = [red.dim, red, red.dim, red, red.dim, red];
    function getFrame(arr, i) {
      return arr[i % arr.length]
    };

    const store = new HistoryStore({ path: `his.json` })

    do {
      const spinner = cliSpinners.mindblown
      const prompt = new Input({
        message: '',
        initial: '',
        history: {
          store,
          autosave: true
        },
        // symbols: { prefix: '',  },
        // footer: 'This is \na footer\nwith a\nfew\nlines\n',
        styles: {
          primary: colors.yellow,
          get submitted() {
            return this.complement;
          }
        },
        separator() {return ''},
        prefix(state) {
          return getFrame(spinner.frames, state.timer?.tick);
        },
        // separator(state) {
        //   return frame(rhythm, state.timer.tick)('❤');
        // },
        timers: {
          // separator: 250,
          prefix: spinner.interval,
        },

      });

      prompt.on('keypress', (s, key) => {
        // console.log('🚀 ~ World ~ prompt.on ~ key:', key)
        if (key.action === 'up') {
          prompt.altUp()
        } else if (key.action === 'down') {
          prompt.altDown()
        }
      })

      // prompt.footer = () => {
      //   const state = { ...prompt.state };
      //   // delete state.prompt;
      //   delete state.styles;
      //   delete state.keypress;
      //   delete state.symbols;
      //   delete state.header;
      //   delete state.footer;
      //   // delete state.buffer;

      //   return JSON.stringify(state, null, 2);
      // };

      // try {
        response = await prompt.run()
      // } catch(err) {
      //   console.log('🚀 ~ World ~ run ~ err:', err)
      //   response = {input: 'exit'}
      //   break;
      // }


      // response = await prompt({
      //   type: 'input',
      //   name: 'input',
      //   message: '',
      //   initial: '',
      //   separator: false,
      //   history: {
      //     store,
      //     autosave: true
      //   },
      //   symbols: { prefix: '$' },
      //   styles: {
      //     primary: colors.yellow,
      //     get submitted() {
      //       return this.complement;
      //     }
      //   }
      // } as any)

      // console.log(response); // { username: 'jonschlinkert' }
      console.log('ook', response)
    } while (response !== 'exit' && response?.input !== 'exit')
    console.log('done')
  }
}

class HistoryStore {
  [name: string]: any

  constructor(options: any) {
    this.path = options.path
  }

  get(key: string) {
    return this[key]
  }

  set(key: string, value: any) {
    console.log('🚀 ~ HistoryStore ~ set ~ key:', key, value)
    this[key] = value
  }
}