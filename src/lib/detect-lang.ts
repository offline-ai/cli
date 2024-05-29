import { franc } from 'franc-all'
import {iso6393} from 'iso-639-3'

export function detectLang(text: string, options: any= {}): string|undefined {
  if (options.minLength === undefined) { options.minLength = 6 }
  const isoCode = franc(text, options)
  let result: any = isoCode !== 'und' ? iso6393.find(i => i.iso6393 === isoCode) : undefined
  if (result) {result = result.name}
  return result
}
