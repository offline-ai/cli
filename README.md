# ai-agent

The AI agent script CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ai-agent.svg)](https://npmjs.org/package/@offline-ai/ai)
[![Downloads/week](https://img.shields.io/npm/dw/ai-agent.svg)](https://npmjs.org/package/@offline-ai/ai)

Developing an intelligent application with AI Agent Script Engine involves just three steps:

* Choose an appropriate brain🧠 (LLM Large Language Model)
  * Select a parameter size based on your application's requirements; larger sizes offer better performance but consume more resources and increase response time...
  * Choose the model's expertise: Different models are trained with distinct methods and datasets, resulting in unique capabilities...
  * Optimize quantization: Higher levels of quantization (compression) result in faster speed and smaller size, but potentially lower accuracy...
  * Decide on the optimal context window size (`content_size`): Typically, 2048 is sufficient; this parameter also influences model performance...
  * Use the client (`@offline-ai/cli`) directly to download the AI brain: `ai brain download`
* Create the ai application's agent script file and debug prompts using the client (`@offline-ai/cli`): `ai run -f your_script --interactive --loglevel info`.
* Integrate the script into your ai application.

**Features**:

* User-friendly for ai development and creation of intelligent applications...
* Low-code or even no-code solutions for rapid ai development...
* Flexible, adding custom instructions within scripts and inter-script calls...
* Data openness, granting access to input/output data and internal data within scripts...
* Powerful, enabling event transmission seamlessly between client and server with numerous utility functions...
* Secure, supporting encrypted execution and usage limits for scripts...

## TOC

<!-- toc -->
* [ai-agent](#ai-agent)
<!-- tocstop -->

## Usage

Install the CLI globally:

<!-- usage -->
```sh-session
$ npm install -g @offline-ai/cli
$ ai COMMAND
running command...
$ ai (--version)
@offline-ai/cli/0.0.0 linux-x64 node-v20.14.0
$ ai --help [COMMAND]
USAGE
  $ ai COMMAND
...
```
<!-- usagestop -->

Search and Download a brain(LLM) on huggingface:

```bash
#Choose one to download, or type more to reduce the brain(models) list
ai brain download llama3-8b

#after download, get the brainDir from here:
ai config brainDir
{
  "brainDir": "~/.local/share/ai/brain"
}
```

You can create your config in `~/.config/ai/.ai.yaml` or using json format: `~/.config/ai/.ai.json`.

Download and run the LLM backend Server: [llama.cpp](https://github.com/ggerganov/llama.cpp/releases/latest)

```bash
#eg, download
mkdir llamacpp
cd llamacpp
wget https://github.com/ggerganov/llama.cpp/releases/download/b3091/llama-b3091-bin-ubuntu-x64.zip
unzip llama-b3091-bin-ubuntu-x64.zip
cd build/bin
#run the server
#`-ngl 33` means GPU layers to load, adjust it according to your GPU.
#`-c 4096` means max context length
#`-t 4` means thread count
./server -t 4 -c 4096 -ngl 33 -m ~/.local/share/ai/brain/your-brain-model.gguf
```

Now you can run your AI agent:

```bash
#the `.ai.yaml` extension is optional.
#defaults will search current working dir. you can config the search paths in `agentDirs`.
#`-f` means the agent file
#`-i` means entering the interactive mode
ai run -if your_ai_agent_script.ai.yaml
```

## Commands

<!-- commands -->
* [`ai agent`](#ai-agent)
* [`ai autocomplete [SHELL]`](#ai-autocomplete-shell)
* [`ai brain [NAME]`](#ai-brain-name)
* [`ai brain dn [NAME]`](#ai-brain-dn-name)
* [`ai brain down [NAME]`](#ai-brain-down-name)
* [`ai brain download [NAME]`](#ai-brain-download-name)
* [`ai brain list [NAME]`](#ai-brain-list-name)
* [`ai config`](#ai-config)
* [`ai config save [DATA]`](#ai-config-save-data)
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
* [`ai run [DATA]`](#ai-run-data)
* [`ai version`](#ai-version)

## `ai agent`

🤖 The AI Agent Manager

```
USAGE
  $ ai agent

DESCRIPTION
  🤖 The AI Agent Manager

EXAMPLES
  $ ai agent list
  $ ai agent download <agent-name>
  $ ai agent publish <agent-name>
```

_See code: [src/commands/agent/index.ts](https://github.com/offline-ai/ai/blob/v0.0.0/src/commands/agent/index.ts)_

## `ai autocomplete [SHELL]`

Display autocomplete installation instructions.

```
USAGE
  $ ai autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ ai autocomplete

  $ ai autocomplete bash

  $ ai autocomplete zsh

  $ ai autocomplete powershell

  $ ai autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.1.2/src/commands/autocomplete/index.ts)_

## `ai brain [NAME]`

🧠 The AI Agent Brains(LLM) Manager.

```
USAGE
  $ ai brain [NAME] [--json] [-c <value>] [--banner] [-b <value>] [-s
    <value>] [-n <value>]

ARGUMENTS
  NAME  the brain name to search

FLAGS
  -b, --brainDir=<value>  the brains(LLM) directory
  -c, --config=<value>    the config file
  -n, --count=<value>     [default: 100] the max number of brains to list, 0 means all.
  -s, --search=<value>    the json filter to search for brains
      --[no-]banner       show banner

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  🧠 The AI Agent Brains(LLM) Manager.


  Manage AI Agent brains 🧠 here.
  📜 List downloaded or online brains
  🔎 search for brains
  📥 download brains
  ❌ delete brains


EXAMPLES
  $ ai brain               # list download brains
  $ ai brain list --online # list online brains
  $ ai brain download <brain-name>
```

_See code: [src/commands/brain/index.ts](https://github.com/offline-ai/ai/blob/v0.0.0/src/commands/brain/index.ts)_

## `ai brain dn [NAME]`

🧠 The AI Agent Brains(LLM) Downloader.

```
USAGE
  $ ai brain dn [NAME] [--json] [-c <value>] [--banner] [-b <value>] [-q
    F32|F16|Q4_0|Q4_1|Q4_1SomeF16|Q8_0|Q5_0|Q5_1|Q2_K|Q3_K_S|Q3_K_M|Q3_K_L|Q4_K_S|Q4_K_M|Q5_K_S|Q5_K_M|Q6_K|IQ2_XXS|IQ2_
    XS|Q2_KS|IQ3_XS|IQ3_XXS|IQ1_S|IQ4_NL|IQ3_S|IQ3_M|IQ2_S|IQ2_M|IQ4_XS|IQ1_M] [-u <value>] [-d]

ARGUMENTS
  NAME  the brain name to download

FLAGS
  -b, --brainDir=<value>  the brains(LLM) directory
  -c, --config=<value>    the config file
  -d, --dryRun            dry run, do not download
  -q, --quant=<option>    the quantization of the model, defaults to 4bit
                          <options: F32|F16|Q4_0|Q4_1|Q4_1SomeF16|Q8_0|Q5_0|Q5_1|Q2_K|Q3_K_S|Q3_K_M|Q3_K_L|Q4_K_S|Q4_K_M
                          |Q5_K_S|Q5_K_M|Q6_K|IQ2_XXS|IQ2_XS|Q2_KS|IQ3_XS|IQ3_XXS|IQ1_S|IQ4_NL|IQ3_S|IQ3_M|IQ2_S|IQ2_M|I
                          Q4_XS|IQ1_M>
  -u, --hubUrl=<value>    the hub mirror url
      --[no-]banner       show banner

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  🧠 The AI Agent Brains(LLM) Downloader.


  📥 download 🧠 brains to brainDir.


ALIASES
  $ ai brain dn
  $ ai brain down

EXAMPLES
  $ ai brain dn <brain-name> [-q <QUANT>]
```

## `ai brain down [NAME]`

🧠 The AI Agent Brains(LLM) Downloader.

```
USAGE
  $ ai brain down [NAME] [--json] [-c <value>] [--banner] [-b <value>] [-q
    F32|F16|Q4_0|Q4_1|Q4_1SomeF16|Q8_0|Q5_0|Q5_1|Q2_K|Q3_K_S|Q3_K_M|Q3_K_L|Q4_K_S|Q4_K_M|Q5_K_S|Q5_K_M|Q6_K|IQ2_XXS|IQ2_
    XS|Q2_KS|IQ3_XS|IQ3_XXS|IQ1_S|IQ4_NL|IQ3_S|IQ3_M|IQ2_S|IQ2_M|IQ4_XS|IQ1_M] [-u <value>] [-d]

ARGUMENTS
  NAME  the brain name to download

FLAGS
  -b, --brainDir=<value>  the brains(LLM) directory
  -c, --config=<value>    the config file
  -d, --dryRun            dry run, do not download
  -q, --quant=<option>    the quantization of the model, defaults to 4bit
                          <options: F32|F16|Q4_0|Q4_1|Q4_1SomeF16|Q8_0|Q5_0|Q5_1|Q2_K|Q3_K_S|Q3_K_M|Q3_K_L|Q4_K_S|Q4_K_M
                          |Q5_K_S|Q5_K_M|Q6_K|IQ2_XXS|IQ2_XS|Q2_KS|IQ3_XS|IQ3_XXS|IQ1_S|IQ4_NL|IQ3_S|IQ3_M|IQ2_S|IQ2_M|I
                          Q4_XS|IQ1_M>
  -u, --hubUrl=<value>    the hub mirror url
      --[no-]banner       show banner

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  🧠 The AI Agent Brains(LLM) Downloader.


  📥 download 🧠 brains to brainDir.


ALIASES
  $ ai brain dn
  $ ai brain down

EXAMPLES
  $ ai brain down <brain-name> [-q <QUANT>]
```

## `ai brain download [NAME]`

🧠 The AI Agent Brains(LLM) Downloader.

```
USAGE
  $ ai brain download [NAME] [--json] [-c <value>] [--banner] [-b <value>] [-q
    F32|F16|Q4_0|Q4_1|Q4_1SomeF16|Q8_0|Q5_0|Q5_1|Q2_K|Q3_K_S|Q3_K_M|Q3_K_L|Q4_K_S|Q4_K_M|Q5_K_S|Q5_K_M|Q6_K|IQ2_XXS|IQ2_
    XS|Q2_KS|IQ3_XS|IQ3_XXS|IQ1_S|IQ4_NL|IQ3_S|IQ3_M|IQ2_S|IQ2_M|IQ4_XS|IQ1_M] [-u <value>] [-d]

ARGUMENTS
  NAME  the brain name to download

FLAGS
  -b, --brainDir=<value>  the brains(LLM) directory
  -c, --config=<value>    the config file
  -d, --dryRun            dry run, do not download
  -q, --quant=<option>    the quantization of the model, defaults to 4bit
                          <options: F32|F16|Q4_0|Q4_1|Q4_1SomeF16|Q8_0|Q5_0|Q5_1|Q2_K|Q3_K_S|Q3_K_M|Q3_K_L|Q4_K_S|Q4_K_M
                          |Q5_K_S|Q5_K_M|Q6_K|IQ2_XXS|IQ2_XS|Q2_KS|IQ3_XS|IQ3_XXS|IQ1_S|IQ4_NL|IQ3_S|IQ3_M|IQ2_S|IQ2_M|I
                          Q4_XS|IQ1_M>
  -u, --hubUrl=<value>    the hub mirror url
      --[no-]banner       show banner

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  🧠 The AI Agent Brains(LLM) Downloader.


  📥 download 🧠 brains to brainDir.


ALIASES
  $ ai brain dn
  $ ai brain down

EXAMPLES
  $ ai brain download <brain-name> [-q <QUANT>]
```

_See code: [src/commands/brain/download.ts](https://github.com/offline-ai/ai/blob/v0.0.0/src/commands/brain/download.ts)_

## `ai brain list [NAME]`

📜 List downloaded or online brains, defaults to downloaded.

```
USAGE
  $ ai brain list [NAME] [--json] [-c <value>] [--banner] [-d] [-a] [-b
    <value>] [-f] [-s <value>] [-n <value>]

ARGUMENTS
  NAME  the brain name to search

FLAGS
  -a, --all                list all brains(include downloaded and online)
  -b, --brainDir=<value>   the brains(LLM) directory
  -c, --config=<value>     the config file
  -d, --downloaded         list downloaded brains
  -f, --[no-]onlyFeatured  only list featured brains, defaults to true for online
  -n, --count=<value>      [default: 100] the max number of brains to list, 0 means all.
  -s, --search=<value>     the json filter to search for brains
      --[no-]banner        show banner

GLOBAL FLAGS
  --json  Format output as json.
```

_See code: [src/commands/brain/list.ts](https://github.com/offline-ai/ai/blob/v0.0.0/src/commands/brain/list.ts)_

## `ai config`

🛠️  Manage the AI Configuration.

```
USAGE
  $ ai config [--json] [-c <value>] [--banner]

FLAGS
  -c, --config=<value>  the config file
      --[no-]banner     show banner

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  🛠️  Manage the AI Configuration.

  show current configuration if no commands.
```

_See code: [src/commands/config/index.ts](https://github.com/offline-ai/ai/blob/v0.0.0/src/commands/config/index.ts)_

## `ai config save [DATA]`

💾 Save the configuration to file.

```
USAGE
  $ ai config save [DATA] [--json] [-c <value>] [--banner] [-u <value>] [-s
    <value>...] [-l silence|fatal|error|warn|info|debug|trace] [-h <value>] [-n] [-t <value> -i] [--no-chats ]
    [--no-inputs ] [-m] [-f <value>] [-d <value>] [-a <value>] [-b <value>] [-p <value>...]

ARGUMENTS
  DATA  the json data which will be passed to the ai-agent script

FLAGS
  -a, --arguments=<value>      the json data which will be passed to the ai-agent script
  -b, --brainDir=<value>       the brains(LLM) directory
  -c, --config=<value>         the config file
  -d, --dataFile=<value>       the data file which will be passed to the ai-agent script
  -f, --script=<value>         the ai-agent script file name or id
  -h, --histories=<value>      the chat histories folder to record
  -i, --[no-]interactive       interactive mode
  -l, --logLevel=<option>      the log level
                               <options: silence|fatal|error|warn|info|debug|trace>
  -m, --[no-]stream            stream mode, defaults to true
  -n, --[no-]newChat           whether to start a new chat history, defaults to false in interactive mode, true in
                               non-interactive
  -p, --promptDirs=<value>...  the prompts template directory
  -s, --agentDirs=<value>...   the search paths for ai-agent script file
  -t, --inputs=<value>         the input histories folder for interactive mode to record
  -u, --api=<value>            the api URL
      --[no-]banner            show banner
      --no-chats               disable chat histories, defaults to false
      --no-inputs              disable input histories, defaults to false

GLOBAL FLAGS
  --json  Format output as json.
```

_See code: [src/commands/config/save.ts](https://github.com/offline-ai/ai/blob/v0.0.0/src/commands/config/save.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.1.0/src/commands/help.ts)_

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

## `ai run [DATA]`

💻 Run ai-agent script file.

```
USAGE
  $ ai run [DATA] [--json] [-c <value>] [--banner] [-u <value>] [-s
    <value>...] [-l silence|fatal|error|warn|info|debug|trace] [-h <value>] [-n] [-t <value> -i] [--no-chats ]
    [--no-inputs ] [-m] [-f <value>] [-d <value>] [-a <value>] [-b <value>] [-p <value>...]

ARGUMENTS
  DATA  the json data which will be passed to the ai-agent script

FLAGS
  -a, --arguments=<value>      the json data which will be passed to the ai-agent script
  -b, --brainDir=<value>       the brains(LLM) directory
  -c, --config=<value>         the config file
  -d, --dataFile=<value>       the data file which will be passed to the ai-agent script
  -f, --script=<value>         the ai-agent script file name or id
  -h, --histories=<value>      the chat histories folder to record
  -i, --[no-]interactive       interactive mode
  -l, --logLevel=<option>      the log level
                               <options: silence|fatal|error|warn|info|debug|trace>
  -m, --[no-]stream            stream mode, defaults to true
  -n, --[no-]newChat           whether to start a new chat history, defaults to false in interactive mode, true in
                               non-interactive
  -p, --promptDirs=<value>...  the prompts template directory
  -s, --agentDirs=<value>...   the search paths for ai-agent script file
  -t, --inputs=<value>         the input histories folder for interactive mode to record
  -u, --api=<value>            the api URL
      --[no-]banner            show banner
      --no-chats               disable chat histories, defaults to false
      --no-inputs              disable input histories, defaults to false

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  💻 Run ai-agent script file.

  Execute ai-agent script file and return result. with `-i` to interactive.

EXAMPLES
  $ ai run -f ./script.yaml "{content: 'hello world'}"
  ┌────────────────────
  │[info]:Start Script: ...
```

_See code: [src/commands/run/index.ts](https://github.com/offline-ai/ai/blob/v0.0.0/src/commands/run/index.ts)_

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

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v2.2.2/src/commands/version.ts)_
<!-- commandsstop -->
