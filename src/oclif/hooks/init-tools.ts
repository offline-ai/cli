import type { Hook, Config } from '@oclif/core'

import { initTools as _initTools } from '../../lib/init-tools.js'

export async function init_tools(this: Hook.Context, options: {userConfig: any, config: Config}) {
  await _initTools(options.userConfig)
  this.config.runHook('register', {...options})
}

export default init_tools
