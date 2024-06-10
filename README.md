# ai-agent

The AI agent script CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ai-agent.svg)](https://npmjs.org/package/@offline-ai/ai)
[![Downloads/week](https://img.shields.io/npm/dw/ai-agent.svg)](https://npmjs.org/package/@offline-ai/ai)

**Features**:

* User-friendly for ai development and creation of intelligent applications...
* Low-code or even no-code solutions for rapid ai development...
* Flexible, adding custom instructions within scripts and inter-script calls...
* Data openness, granting access to input/output data and internal data within scripts...
* Powerful, enabling event transmission seamlessly between client and server with numerous utility functions...
* Secure, supporting encrypted execution and usage limits for scripts...

Developing an intelligent application with AI Agent Script Engine involves just three steps:

* Choose an appropriate brain🧠 (LLM Large Language Model)
  * Select a parameter size based on your application's requirements; larger sizes offer better quality but consume more resources and increase response time...
  * Choose the model's expertise: Different models are trained with distinct methods and datasets, resulting in unique capabilities...
  * Optimize quantization: Higher levels of quantization (compression) result in faster speed and smaller size, but potentially lower accuracy...
  * Decide on the optimal context window size (`content_size`): Typically, 2048 is sufficient; this parameter also influences model performance...
  * Use the client (`@offline-ai/cli`) directly to download the AI brain: `ai brain download`
* Create the ai application's agent script file and debug prompts using the client (`@offline-ai/cli`): `ai run -f your_script --interactive --loglevel info`.
* Integrate the script into your ai application.

<!-- toc -->
* [ai-agent](#ai-agent)
<!-- tocstop -->

## Quick Start

### Install

```bash
npm install -g @offline-ai/cli
ai brain download QuantFactory/Phi-3-mini-4k-instruct-GGUF-v2 -q Q4_0
Downloading to ~/.local/share/ai/brain
Downloading https://huggingface.co/QuantFactory/Phi-3-mini-4k-instruct-GGUF-v2/resolve/main/Phi-3-mini-4k-instruct.Q4_0.gguf... 5.61% 121977704 bytes
1. https://hf-mirror.com/QuantFactory/Phi-3-mini-4k-instruct-GGUF-v2/resolve/main/Phi-3-mini-4k-instruct.Q4_0.gguf
   ~/.local/share/ai/brain/phi-3-mini-4k-instruct.Q4_0.gguf
done
mkdir llamacpp
cd llamacpp
wget https://github.com/ggerganov/llama.cpp/releases/download/b3091/llama-b3091-bin-ubuntu-x64.zip
unzip llama-b3091-bin-ubuntu-x64.zip
```

### Run

```bash
#run llama.cpp server
cd llamacpp/build/bin
#set -ngl 0 if no gpu
./server -t 4 -c 4096 -ngl 33 -m ~/.local/share/ai/brain/phi-3-mini-4k-instruct.Q4_0.gguf
```

## Usage

Install the CLI globally:

<!-- usage -->
```sh-session
$ npm install -g @offline-ai/cli
$ ai COMMAND
running command...
$ ai (--version)
@offline-ai/cli/0.0.6 linux-x64 node-v20.14.0
$ ai --help [COMMAND]
USAGE
  $ ai COMMAND
...
```
<!-- usagestop -->


Search and Download a brain(LLM) on huggingface.

Choose one to download, or type more to reduce the brain(models) list

Note:

* All quantification (compression) brain 🧠 models are uploaded by the user by themselves, so it cannot guarantee that these user quantitative (compressed) brain 🧠 models can be used
* At present, the GGUF quantitative brain 🧠 model has been tens of thousands, and many of them are repeated.
* `AI Brain List` Display the brain list, which is part of the list filtered by the`featured`. If you want to display all the brain list, use `--no-onlyFeatured` option.

```bash
#list the downloaded brain list
#=`ai brain list --downloaded`
$ai brain
$ai brain list --downloaded
1. name: "deepseek-v2-chat", likes: 17, downloads: 1189, hf_repo: "leafspark/DeepSeek-V2-Chat-GGUF"
   * IQ2_XXS: deepseek-v2-chat.IQ2_XXS-00001-of-00003.gguf (3 files)
   * IQ3_XS: deepseek-v2-chat.IQ3_XS-00001-of-00008.gguf (8 files)
   * Q2_K: deepseek-v2-chat.Q2_K-00001-of-00005.gguf (5 files)
   * Q3_K_M: deepseek-v2-chat.Q3_K_M-00001-of-00006.gguf (6 files)
   * Q5_K_M: deepseek-v2-chat.Q5_K_M-00001-of-00008.gguf (8 files)
   * Q6_K: deepseek-v2-chat.Q6_K-00001-of-00010.gguf (10 files)
   * Q8_0: deepseek-v2-chat.Q8_0-00001-of-00012.gguf (12 files)
total: 1

#You can specify the keyword of the brain model to search
$ai brain list qwen1.5
1. name: "codeqwen1.5-7b-chat", likes: 84, downloads: 196977, hf_repo: "Qwen/CodeQwen1.5-7B-Chat-GGUF"
   * Q2_K: codeqwen-1_5-7b-chat.Q2_K.gguf
   * Q3_K_M: codeqwen-1_5-7b-chat.Q3_K_M.gguf
   * Q4_0: codeqwen-1_5-7b-chat.Q4_0.gguf
   * Q4_K_M: codeqwen-1_5-7b-chat.Q4_K_M.gguf
   * Q5_0: codeqwen-1_5-7b-chat.Q5_0.gguf
   * Q5_K_M: codeqwen-1_5-7b-chat.Q5_K_M.gguf
   * Q6_K: codeqwen-1_5-7b-chat.Q6_K.gguf
   * Q8_0: codeqwen-1_5-7b-chat.Q8_0.gguf
2. name: "qwen1.5-72b-chat", likes: 62, downloads: 3657, hf_repo: "Qwen/Qwen1.5-72B-Chat-GGUF"
   * Q2_K: qwen1_5-72b-chat.Q2_K.gguf
   * Q3_K_M: qwen1_5-72b-chat.Q3_K_M.gguf
   * Q4_0: qwen1_5-72b-chat.Q4_0-00001-of-00002.gguf (2 files)
   * Q4_K_M: qwen1_5-72b-chat.Q4_K_M-00001-of-00002.gguf (2 files)
   * Q5_0: qwen1_5-72b-chat.Q5_0-00001-of-00002.gguf (2 files)
   * Q5_K_M: qwen1_5-72b-chat.Q5_K_M-00001-of-00002.gguf (2 files)
   * Q6_K: qwen1_5-72b-chat.Q6_K-00001-of-00002.gguf (2 files)
   * Q8_0: qwen1_5-72b-chat.Q8_0-00001-of-00003.gguf (3 files)
...
total: 35
$ai brain list qwen1.5 --no-onlyFeatured
1. name: "codeqwen1.5-7b-chat", likes: 84, downloads: 196977, hf_repo: "Qwen/CodeQwen1.5-7B-Chat-GGUF"
...
total: 144

#Download the brain, if there are multiple choices in the input keywords, you will be required to specify
#LLAMA3-8B is the name of the brain model to be searched
#`-q q4_0` is the quantification level of download. If it is not provided, it will be prompted to specify
#`--hubUrl` is the mirror URL address of Huggingface
$ai brain download llama3-8b -q Q4_0 --hubUrl=huggingface-mirror-url-address
```

after download, get the brainDir from here:

```bash
ai config brainDir
{
  "brainDir": "~/.local/share/ai/brain"
}
```

You can create your config in `~/.config/ai/.ai.yaml` or using json format: `~/.config/ai/.ai.json`.

Download and run the LLM backend Server: [llama.cpp](https://github.com/ggerganov/llama.cpp/releases/latest)

```bash
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
$ai run -if examples/char-dobby
Dobby: I am Dobby. Dobby is happy.
You: intro yourself pls.
Dobby: I am Dobby. I'm a brave and loyal house-elf, and I'm very proud to be a free elf. I love socks and wearing mismatched pairs.

#provide the content and the json schema in output field, it will output the json data.
$ai run -f examples/json '{content: "I recently purchased the Razer BlackShark V2 X Gaming Headset, and it has significantly enhanced my gaming experience. This headset offers incredible sound quality, comfort, and features that are perfect for any serious gamer. Here’s why I highly recommend it: The 7.1 surround sound feature is a game-changer. The audio quality is superb, providing a truly immersive experience. I can clearly hear directional sounds, which is crucial for competitive gaming. The depth and clarity of the sound make it feel like I’m right in the middle of the action. The 50mm drivers deliver powerful, high-quality sound. The bass is deep and punchy without being overwhelming, while the mids and highs are crisp and clear. This balance makes the headset versatile, not only for gaming but also for listening to music and watching movies.", "output":{"type":"object","properties":{"sentiment":{"type":"string","description":"Sentiment (positive or negative)"},"products":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string","description":"Name of the product"},"brand":{"type":"string","description":"Company that made the product"}}},"description":"Products mentioned in the review"},"anger":{"type":"boolean","description":"Is the reviewer expressing anger?"}},"required":["sentiment","products","anger"]}}'

{
  "sentiment": "positive",
  "products": [
    {
      "name": "Razer BlackShark V2 X Gaming Headset",
      "brand": "Razer"
    }
  ],
  "anger": false
}
```

Note:

* By default, the history after running is in the directory `~/.local/share/ai/logs/chats/[script_file_basename]/history`. You can check `seeds`, `temperature` and other information here.
  * In interactive mode, the history will be automatically loaded by default. If you don't need it, you can use `--new-chat`
  * In non-interactive mode, the history will not be automatically loaded. A new history will be generated for each run.
  * To completely disable the history, you can use `--no-chats`

**Embed the script into your own code (locally) as follows**:

```ts
import { AIScriptServer } from '@isdk/ai-tool-agent';

// Configure your script search path
AIScriptEx.searchPaths = ['.']
const script = AIScriptServer.load('examples/json')
// Set the default to large model streaming response
script.llmStream = stream

const content = "I recently purchased the Razer BlackShark V2 X Gaming Headset, and it has significantly enhanced my gaming experience. This headset offers incredible sound quality, comfort, and features that are perfect for any serious gamer. Here’s why I highly recommend it: The 7.1 surround sound feature is a game-changer. The audio quality is superb, providing a truly immersive experience. I can clearly hear directional sounds, which is crucial for competitive gaming. The depth and clarity of the sound make it feel like I’m right in the middle of the action. The 50mm drivers deliver powerful, high-quality sound. The bass is deep and punchy without being overwhelming, while the mids and highs are crisp and clear. This balance makes the headset versatile, not only for gaming but also for listening to music and watching movies."
const output = {
  "type":"object",
  "properties":{
    "sentiment":{"type":"string","description":"Sentiment (positive or negative)"},
    "products":{
      "type":"array",
      "items":{
        "type":"object",
        "properties":{
          "name":{"type":"string","description":"Name of the product"},
          "brand":{"type":"string","description":"Company that made the product"}}
      },
      "description":"Products mentioned in the review"
    },
    "anger":{"type":"boolean","description":"Is the reviewer expressing anger?"}},
  "required":["sentiment","products","anger"]
}

const result =await script.exec({content, output})
console.log(result)
// You can see the json results output by the large model:
{
  "sentiment": "positive",
  "products": [
    {
      "name": "Razer BlackShark V2 X Gaming Headset",
      "brand": "Razer"
    }
  ],
  "anger": false
}
```

Specific script instruction manual see: [ai-tool-agent](https://www.npmjs.com/package/@isdk/ai-tool-agent)

## Commands

<!-- commands -->
* [`ai agent`](#ai-agent)
* [`ai autocomplete [SHELL]`](#ai-autocomplete-shell)
* [`ai brain [NAME]`](#ai-brain-name)
* [`ai brain dn [NAME]`](#ai-brain-dn-name)
* [`ai brain down [NAME]`](#ai-brain-down-name)
* [`ai brain download [NAME]`](#ai-brain-download-name)
* [`ai brain list [NAME]`](#ai-brain-list-name)
* [`ai config [ITEM_NAME]`](#ai-config-item_name)
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

_See code: [src/commands/agent/index.ts](https://github.com/offline-ai/cli/blob/v0.0.6/src/commands/agent/index.ts)_

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

_See code: [src/commands/brain/index.ts](https://github.com/offline-ai/cli/blob/v0.0.6/src/commands/brain/index.ts)_

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

_See code: [src/commands/brain/download.ts](https://github.com/offline-ai/cli/blob/v0.0.6/src/commands/brain/download.ts)_

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

_See code: [src/commands/brain/list.ts](https://github.com/offline-ai/cli/blob/v0.0.6/src/commands/brain/list.ts)_

## `ai config [ITEM_NAME]`

🛠️  Manage the AI Configuration.

```
USAGE
  $ ai config [ITEM_NAME] [--json] [-c <value>] [--banner]

ARGUMENTS
  ITEM_NAME  the config item name path to get

FLAGS
  -c, --config=<value>  the config file
      --[no-]banner     show banner

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  🛠️  Manage the AI Configuration.

  show current configuration if no commands.

EXAMPLES
  # list all configurations
  $ ai config

  # get the brainDir config item
  $ ai config brainDir
  AI Configuration:
  {
    "brainDir": "~/.local/share/ai/brain"
  }
```

_See code: [src/commands/config/index.ts](https://github.com/offline-ai/cli/blob/v0.0.6/src/commands/config/index.ts)_

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

_See code: [src/commands/config/save.ts](https://github.com/offline-ai/cli/blob/v0.0.6/src/commands/config/save.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.1/src/commands/help.ts)_

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
    [--no-inputs ] [-m] [-f <value>] [-d <value>] [-a <value>] [-b <value>] [-p <value>...] [--noConsoleClear]

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
      --noConsoleClear         disable console clear, debug purpose

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

_See code: [src/commands/run/index.ts](https://github.com/offline-ai/cli/blob/v0.0.6/src/commands/run/index.ts)_

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

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v2.2.3/src/commands/version.ts)_
<!-- commandsstop -->
