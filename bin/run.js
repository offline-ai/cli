#!/usr/bin/env -S node --no-warnings

import {execute} from '@oclif/core'

await execute({dir: import.meta.url})

// #!/usr/bin/env node

// // eslint-disable-next-line unicorn/prefer-top-level-await
// (async () => {
//   const oclif = await import('@oclif/core')
//   await oclif.execute({dir: __dirname})
// })()
