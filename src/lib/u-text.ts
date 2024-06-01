import colors from 'ansi-colors'
import figlet from 'figlet'

const textSync = figlet.textSync

const excludeFonts = new Set([
  'Gradient', 'Hex', 'Trek', 'Term', 'Runic', 'Runyc', 'Rot13', 'Octal', 'Mshebrew210', 'Mike', '1Row', 'DWhistled',
  'Tengwar', 'Small Tengwar', 'Benjamin',
])

const fonts = figlet.fontsSync().filter((f: string) => !excludeFonts.has(f))

function getRandomInt(size: number) {
  return Math.floor(Math.random() * size);
}

export function uText(s: string, options: any= {}) {
  const color = options.color || 'gray'
  if (!options.font) {
    // '3D-ASCII'
    options.font = fonts[getRandomInt(fonts.length)]
  }
      // horizontalLayout: 'default',
      // verticalLayout: 'default',
  return colors[color as any](
    textSync(s, options)
  );
}

// import cfonts from 'cfonts'

// export function uText(s: string, options: any = {}) {
//   cfonts.say(s, options)
// }
