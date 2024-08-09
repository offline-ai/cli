#!/usr/bin/env -S npx --node-options='--trace-warnings' tsx
// #!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning
// #!/usr/bin/env -S node --import=./bin/register.js --no-warnings=ExperimentalWarning
// #!/usr/bin/env bun

import {execute} from '@oclif/core'

await execute({development: true, dir: import.meta.url})
