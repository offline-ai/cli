ai-agent
=================

ai-agent CLI


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ai-agent.svg)](https://npmjs.org/package/ai-agent)
[![Downloads/week](https://img.shields.io/npm/dw/ai-agent.svg)](https://npmjs.org/package/ai-agent)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @isdk/ai-agent
$ ai COMMAND
running command...
$ ai (--version)
@isdk/ai-agent/0.0.0 linux-x64 node-v20.11.1
$ ai --help [COMMAND]
USAGE
  $ ai COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ai help [COMMAND]`](#ai-help-command)
* [`ai plugins`](#ai-plugins)
* [`ai plugins add PLUGIN`](#ai-plugins-add-plugin)
* [`ai plugins:inspect PLUGIN...`](#ai-pluginsinspect-plugin)
* [`ai plugins install PLUGIN`](#ai-plugins-install-plugin)
* [`ai plugins link PATH`](#ai-plugins-link-path)
* [`ai plugins remove [PLUGIN]`](#ai-plugins-remove-plugin)
* [`ai plugins reset`](#ai-plugins-reset)
* [`ai plugins uninstall [PLUGIN]`](#ai-plugins-uninstall-plugin)
* [`ai plugins unlink [PLUGIN]`](#ai-plugins-unlink-plugin)
* [`ai plugins update`](#ai-plugins-update)
* [`ai run SCRIPT [DATA]`](#ai-run-script-data)
* [`ai run world`](#ai-run-world)
* [`ai version`](#ai-version)

## `ai help [COMMAND]`

Display help for ai.

```
USAGE
  $ ai help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for ai.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.21/src/commands/help.ts)_

## `ai plugins`

List installed plugins.

```
USAGE
  $ ai plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ ai plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.19/src/commands/plugins/index.ts)_

## `ai plugins add PLUGIN`

Installs a plugin into ai.

```
USAGE
  $ ai plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into ai.

  Uses bundled npm executable to install plugins into /home/riceball/.local/share/ai

  Installation of a user-installed plugin will override a core plugin.

  Use the AI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the AI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ ai plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ ai plugins add myplugin

  Install a plugin from a github url.

    $ ai plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ ai plugins add someuser/someplugin
```

## `ai plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ ai plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ ai plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.19/src/commands/plugins/inspect.ts)_

## `ai plugins install PLUGIN`

Installs a plugin into ai.

```
USAGE
  $ ai plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into ai.

  Uses bundled npm executable to install plugins into /home/riceball/.local/share/ai

  Installation of a user-installed plugin will override a core plugin.

  Use the AI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the AI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ ai plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ ai plugins install myplugin

  Install a plugin from a github url.

    $ ai plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ ai plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.19/src/commands/plugins/install.ts)_

## `ai plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ ai plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ ai plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.19/src/commands/plugins/link.ts)_

## `ai plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ai plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ai plugins unlink
  $ ai plugins remove

EXAMPLES
  $ ai plugins remove myplugin
```

## `ai plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ ai plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.19/src/commands/plugins/reset.ts)_

## `ai plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ai plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ai plugins unlink
  $ ai plugins remove

EXAMPLES
  $ ai plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.19/src/commands/plugins/uninstall.ts)_

## `ai plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ai plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ai plugins unlink
  $ ai plugins remove

EXAMPLES
  $ ai plugins unlink myplugin
```

## `ai plugins update`

Update installed plugins.

```
USAGE
  $ ai plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.19/src/commands/plugins/update.ts)_

## `ai run SCRIPT [DATA]`

Run ai-agent script file

```
USAGE
  $ ai run SCRIPT [DATA] [--json] [-u <value>] [-s <value>] [-l silence|fatal|error|warn|info|debug|trace]

ARGUMENTS
  SCRIPT  the ai-agent script file name
  DATA    the data which will be passed to the ai-agent script

FLAGS
  -l, --logLevel=<option>       [default: info] the log level
                                <options: silence|fatal|error|warn|info|debug|trace>
  -s, --searchPaths=<value>...  the search paths for ai-agent script file
  -u, --apiUrl=<value>          [default: http://localhost:8080/] the api URL

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Run ai-agent script file

EXAMPLES
  $ ai run ./script.yaml
  ┌────────────────────
  │[info]:Start Script: ...
```

_See code: [src/commands/run/index.ts](https://github.com/snowyu/ai-agent/blob/v0.0.0/src/commands/run/index.ts)_

## `ai run world`

Say hello world

```
USAGE
  $ ai run world

DESCRIPTION
  Say hello world

EXAMPLES
  $ ai run world
  hello world! (./src/commands/run/world.ts)
```

_See code: [src/commands/run/world.ts](https://github.com/snowyu/ai-agent/blob/v0.0.0/src/commands/run/world.ts)_

## `ai version`

```
USAGE
  $ ai version [--json] [--verbose]

FLAGS
  --verbose  Show additional information about the CLI.

GLOBAL FLAGS
  --json  Format output as json.

FLAG DESCRIPTIONS
  --verbose  Show additional information about the CLI.

    Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v2.1.0/src/commands/version.ts)_
<!-- commandsstop -->
