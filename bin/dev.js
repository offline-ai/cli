#!/usr/bin/env -S node --import=./bin/register.js --no-warnings

import {execute} from '@oclif/core'

await execute({development: true, dir: import.meta.url})

//#!/usr/bin/env node_modules/.bin/ts-node
// ;(async () => {
//   const oclif = await import('@oclif/core')
//   await oclif.execute({development: true, dir: __dirname})
// })()
