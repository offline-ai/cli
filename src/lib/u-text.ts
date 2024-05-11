import { color } from 'console-log-colors';
import figlet from 'figlet'
import type { Fonts } from 'figlet';

const textSync = figlet.textSync

export function uText(s: string, aColor = 'gray', font: Fonts = '3D-ASCII') {
  return color[aColor as any](
    textSync(s, {
      font,
      horizontalLayout: 'default',
      verticalLayout: 'default',
    })
  );
}
