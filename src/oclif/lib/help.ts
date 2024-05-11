import { type Command, Help } from '@oclif/core';
import { uText } from '../../lib/u-text.js';

export default class CustomHelp extends Help {
  async showHelp(args: string[]) {
    // console.log(uText('AI Agent', 'green'));
    console.log(uText('AI Agent', 'blue', 'ANSI Shadow'));
    super.showHelp(args);
    // console.dir('This will be displayed in multi-command CLIs', args);
  }

  async showCommandHelp(command: Command.Loadable) {
    // console.log(uText('AI Agent', 'green'));
    super.showCommandHelp(command);
    // console.log('This will be displayed in single-command CLIs');
  }
}
