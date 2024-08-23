import { type Command } from '@oclif/core';
import { CustomHelp } from '@offline-ai/cli-common'

export { showBanner } from '@offline-ai/cli-common'

export default class AIHelp extends CustomHelp {
  async showHelp(args: string[]) {
    super.showHelp(args);
  }

  async showCommandHelp(command: Command.Loadable) {
    super.showCommandHelp(command);
  }
}
