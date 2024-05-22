import {Command} from '@oclif/core'
import { createPromptModule } from 'inquirer';

export default class World extends Command {
  static args = {}

  static description = 'Say hello world'

  static examples = [
    `<%= config.bin %> <%= command.id %>
hello world! (./src/commands/run/world.ts)
`,
  ]

  static flags = {}

  async run(): Promise<void> {
    this.log('hello world! (./src/commands/run/world.ts)')
    const prompt = createPromptModule()
    class Input extends prompt.prompts['input'] {
      declare getQuestion
      declare opt
      declare status
      declare answer
      declare answers
      declare rl
      declare screen

      render(error) {
        let bottomContent = '';
        let appendContent = '';
        let message = this.getQuestion();
        const { transformer } = this.opt;
        const isFinal = this.status === 'answered';

        appendContent = isFinal ? this.answer : this.rl.line;
        // console.log('🚀 ~ Input ~ render ~ appendContent:', appendContent)

        if (transformer) {
          const s = transformer(appendContent, this.answers, { isFinal });
          if (s) {
            message += s;
          }
        } else {
          message += appendContent;
        }

        if (error) {
          bottomContent =  error;
        }

        // if (isFinal) bottomContent += 'Done'
        this.screen.render(message, bottomContent);
      }
    }


    prompt.registerPrompt('input', Input)

    let answer = await prompt([
      {
        type: 'input',
        name: 'name',
        message: '>',
        suffix: '',
        prefix: '',
      },
    ]);
    while (answer.name !== 'exit') {
      answer = await prompt([
        {
          type: 'input',
          name: 'name',
          message: '>',
          suffix: '',
          prefix: '',
        },
      ]);
    }
  }
}
