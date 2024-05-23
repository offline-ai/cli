import colors from 'ansi-colors'
import figlet from 'figlet'
import type { Fonts } from 'figlet';

const textSync = figlet.textSync

export function uText(s: string, aColor = 'gray', font: Fonts = '3D-ASCII') {
  return colors[aColor as any](
    textSync(s, {
      font,
      horizontalLayout: 'default',
      verticalLayout: 'default',
    })
  );
}
