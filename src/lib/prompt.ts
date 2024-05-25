import fs from 'fs'
import path from 'path'
import enquier from 'enquirer'
import colors from 'ansi-colors'
const Input = (enquier as any).Input

let GlobalStore: HistoryStore|undefined

function save() {
  if (GlobalStore) {
    GlobalStore.save()
  }
}

process.on('exit', function () {
  save()
});

// catch ctrl+c event and exit normally
process.on('SIGINT', function () {
  save()
});

export function setHistoryStore(store?: HistoryStore) {
  GlobalStore = store
}

export function prompt(options: any = {}, useStore = true) {
  const defaultOptions = {
    message: '',
    initial: '',
    // symbols: { prefix: ']',  },
    separator() {return ''},
    styles: {
      // primary: colors.yellow,
      // submitted: colors.yellow,
      prefix: colors.yellow,
      // get submitted() {
      //   return this.complement;
      // }
    }
  }
  options = {...defaultOptions, ...options}
  if (GlobalStore && useStore) {
    if (!options.history) {options.history = {}}
    options.history.store = GlobalStore
    options.history.autosave = true
  }
  const result = new Input(options);

  if (GlobalStore && useStore) {
    result.on('keypress', (s, key) => {
      switch (key.action) {
        case 'up': {
          result.altUp()
          break
        }
        case 'down': {
          result.altDown()
          break
        }
        case 'cancel': {
          if (key.ctrl && key.name === 'c') {
            process.exit(0)
          } else if (result.input) {
            key.action = 'reset'
          }
          break
        }
      }
    })
  }

  return result
}

export class HistoryStore {
  store: {[name: string]: any} = {}

  constructor(public path: string) {
    if (path) {this.load(path)}
  }

  get(key: string) {
    return this.store[key]
  }

  set(key: string, value: any) {
    this.store[key] = value
  }

  save(filepath: string = this.path) {
    const dirpath = path.dirname(filepath)
    if (!fs.existsSync(dirpath)) {
      fs.mkdirSync(dirpath, {recursive: true})
    }
    fs.writeFileSync(filepath, JSON.stringify(this.store, null, 2))
  }

  load(filepath = this.path) {
    if (fs.existsSync(filepath)) {
      Object.assign(this.store, JSON.parse(fs.readFileSync(filepath, 'utf8')))
    }
  }
}
