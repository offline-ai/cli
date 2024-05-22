import inquirer, { createPromptModule } from 'inquirer';

export const prompt = createPromptModule()

export const BottomBar = inquirer.ui.BottomBar

export class Input extends prompt.prompts['input'] {
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
