import {Command, Flags} from '@oclif/core'

// const CONFIG_BASE_NAME = '.ai'

export abstract class AICommand extends Command {

  static flags : Record<string, any> = {
    config: Flags.directory({char: 'c', description: 'the config directory', exists: true})
  }
}
