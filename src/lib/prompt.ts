import fs from 'fs'
import path from 'path'
import enquier from 'enquirer'
import colors from 'ansi-colors'
// Input extends StringPrompt
const Input = (enquier as any).Input

let GlobalStore: HistoryStore|undefined

function save() {
  if (GlobalStore) {
    GlobalStore.save()
  }
}

process.on('beforeExit', function () {
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
  const result = new InputEx(options);

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
            process.emit('SIGINT')
          } else if (result.input) {
            key.action = 'reset'
          }
          break
        }
        default: {
          if (key.name === 'tab') {
            key.action = 'tab'
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

  constructor(public path?: string) {
    if (path) {this.load(path)}
  }

  get(key: string) {
    return this.store[key]
  }

  set(key: string, value: any) {
    this.store[key] = value
  }

  save(filepath = this.path) {
    if (!filepath) {return}
    const dirpath = path.dirname(filepath)
    if (!fs.existsSync(dirpath)) {
      fs.mkdirSync(dirpath, {recursive: true})
    }
    fs.writeFileSync(filepath, JSON.stringify(this.store, null, 2))
  }

  load(filepath = this.path) {
    if (!filepath) {return}
    if (fs.existsSync(filepath)) {
      Object.assign(this.store, JSON.parse(fs.readFileSync(filepath, 'utf8')))
    }
  }
}

export class InputEx extends Input {
  constructor(options) {
    super(options)
  }

  completion(action: string) {
    if (!this.store) return this.alert();
    this.data = completer(action, this.data, this.input);
    if (!this.data.present) return this.alert();
    this.input = this.data.present;
    this.cursor = this.input.length;
    return this.render();
  }

  reset(input, key) {
    this.data.result = undefined
    return super.reset(input, key);
  }

  delete(input, key) {
    super.delete(input, key);
  }

  tab(input, key) {
    this.completion('tab')
  }
}

function unique(arr: any[]) {return arr.filter((v, i) => arr.lastIndexOf(v) === i);}
function compact(arr: any[]) {return unique(arr).filter(Boolean);}

function completer(action: string, data:{result?: string[], past?: string[], present?: string} = {}, value = '') {
  let { past = [], present = '' } = data;
  let result: any = data.result || past;
  const filtered = result !== past
  let rest, prev;

  switch (action) {
    case 'reset':
      return {
        past,
        present,
        result: undefined,
      };
    case 'prev':
    case 'undo':
      rest = result.slice(0, result.length - 1);
      prev = result[result.length - 1] || '';
      if (!filtered) {
        past = result
      }
      return {
        past,
        present: prev,
        result: compact([value, ...rest]),
      };

    case 'tab':
      // auto completion for present
      if (value) {
        result = past.filter((s)=> s.startsWith(value))
      }
    case 'next':
    case 'redo':
      rest = result.slice(1);
      prev = result[0] || '';
      return {
        result: compact([...rest, value]),
        present: prev,
        past,
      };

    case 'save':
      return {
        past: compact([...past, value]),
        present: '',
      };

    case 'remove':
      prev = compact(past.filter(v => v !== value));
      present = '';

      if (prev.length) {
        present = prev.pop();
      }

      return {
        past: prev,
        present,
      };

    default: {
      throw new Error(`Invalid action: "${action}"`);
    }
  }
}
