# Offline AI PPE CLI(WIP)

> 【English|[中文](./README.cn.md)】
---
The AI agent script CLI for [Programmable Prompt Engine](https://github.com/offline-ai/ppe).

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/%40offline-ai%2Fcli.svg)](https://npmjs.org/package/@offline-ai/cli)
[![Downloads/week](https://img.shields.io/npm/dw/%40offline-ai%2Fcli.svg)](https://npmjs.org/package/@offline-ai/cli)

Enjoying this project? Please star it! 🌟

**Features**:

* Programmable Prompt Engineering (PPE) language is a simple and natural scripting language designed for handling prompt information. This language is used to develop various agents that can be reused, inherited, combined, or called.
* Achieve or approximate the performance of ChatGPT 4 with open-source LLMs of medium to small scale (35B-4B parameters).
* User-friendly for ai development and creation of intelligent applications...
* Low-code or even no-code solutions for rapid ai development...
* Flexible, adding custom instructions within scripts, and inter-script calls...
* The data is completely open to the script, and the input and output data, even the internal data, can be freely accessed in the script
* Powerful, enabling event transmission seamlessly between client and server with numerous utility functions...
* Secure, supporting encrypted execution and usage limits for scripts(TODO)...
* Enable the local deployment and execution of large language models (LLMs) such as LLaMA, Qwen, Gemma, Phi, GLM, Mistral, and more.
* The AI Agent Script follows the [Programmable Prompt Engine Specification](https://github.com/offline-ai/ppe).
  * Visit the site for the detailed AI Agent script usage.
* [PPE Fixtures Unit Test](https://github.com/offline-ai/cli-plugin-cmd-test.js)
  * Unit Test Fixture Demo: https://github.com/offline-ai/cli/tree/main/examples/split-text-paragraphs
* Smart caching of LLM large models and intelligent agent invocation results to accelerate execution and reduce token expenses.
* Support for Multi LLM Service Providers:
  * (**Recommended**) Builtin local LLM provider(llama.cpp) as default to protect the security and privacy of the knowledge.
    * Download GGUF model file first: `ai brain download hf://bartowski/Qwen_QwQ-32B-GGUF -q q4_0`
    * Run with the default brain model file: `ai run example.ai.yaml`
    * Run with specified the model file: `ai run example.ai.yaml -P local://bartowski-qwq-32b.Q4_0.gguf`
  * OpenAI Compatible Service Provider:
    * OpenAI: `ai run example.ai.yaml -P openai://chatgpt-4o-latest --apiKey “sk-XXX”`
    * DeepSeek: `ai run example.ai.yaml -P openai://deepseek-chat -u https://api.deepseek.com/ --apiKey “sk-XXX”`
    * Siliconflow: `ai run example.ai.yaml -P openai://Qwen/Qwen2.5-Coder-7B-Instruct -u https://api.siliconflow.cn/ --apiKey “sk-XXX”`
    * Anthropic(Claude): `ai run example.ai.yaml -P openai://claude-3-7-sonnet-latest -u https://api.anthropic.com/v1/ --apiKey “sk-XXX”`
  * [llama-cpp Server(llama-server) Provider](https://github.com/ggml-org/llama.cpp/tree/master/examples/server): `ai run example.ai.yaml -P llamacpp`
    * llama-cpp Server does not support specifying model name, It is specified with the model parameter when llama-server is started.
  * You can specify or arbitrarily switch *LLM model or provider* in the PPE script.

  ```yaml
  ---
  parameters:
    model: openai://deepseek-chat
    apiUrl: https://api.deepseek.com/
    apiKey: "sk-XXX"
  ---
  system: You are a helpful assistant.
  user: "tell me a joke"
  ---
  assistant: "[[AI]]"
  ---
  assistant: "[[AI:model='local://bartowski-qwq-32b.Q4_0.gguf']]"
  ```

* Builtin local LLM provider(llama.cpp) **Features**:
  * By default, it automatically detects memory and GPU, and uses the best computing layer by default. It automatically allocates gpu - layers and context window size (it will adopt the largest possible value) to get the best performance from the hardware without manually configuring anything.
    * It is recommended to configure the context window yourself.
  * System security: Support for system template anti-injection (to avoid jailbreaking).
  * Support for general tool invocation (Tool Funcs) of any LLM models (only for **builtin local LLM provider**):
    * Can be supported without specific training of LLM, requiring LLM can accurately follow instructions.
    * Minimum adaptation for 3B model, recommended to use 7B and above.
    * Dual permission control:
      1. Scripts set the list of tools AI can use.
      2. Users set the list of tools scripts can use.
  * Support for General Thinking Mode (`shouldThink`) of large models (only for **builtin local LLM provider**):
    * Can be supported without specific training of LLM, requiring LLM can accurately follow instructions.
    * Answer first then think (`last`).
    * Think first then answer(`first`).
    * Think deeply then answer(`deep`): 7B and above.
* Package support.
* PPE supports direct invocation of wasm.
* Support for multiple structured response output format types(`response_format.type`):
  * JSON format.
  * YAML format.
  * Natural Language Object(NOBJ) format.
  * Set `output` with JSON Schema format.PPE will automatically parse the content generated by AI in the corresponding format into an `Object` for code use.

Developing an intelligent application with AI Agent Script Engine involves just three steps:

* Choose an appropriate brain🧠 (LLM Large Language Model)
  * Select a parameter size based on your application's requirements; larger sizes offer better quality but consume more resources and increase response time...
  * Choose the model's expertise: Different models are trained with distinct methods and datasets, resulting in unique capabilities...
  * Optimize quantization: Higher levels of quantization (compression) result in faster speed and smaller size, but potentially lower accuracy...
  * Decide on the optimal context window size (`max_tokens`): Typically, 2048 is sufficient; this parameter also influences model performance...
  * Use the client (`@offline-ai/cli`) directly to download the AI brain: `ai brain download`
* Create the ai application's agent script file and debug prompts using the client (`@offline-ai/cli`): `ai run your_script.ai.yaml --interactive --loglevel info`.
* Integrate the script into your ai application.
* One-click packaging into standalone intelligent applications (TODO)

<!-- toc -->
* [Offline AI PPE CLI(WIP)](#offline-ai-ppe-cliwip)
* [Quick Start](#quick-start)
* [API mode, translate the TODO file to English](#api-mode-translate-the-todo-file-to-english)
* [interactive mode](#interactive-mode)
* [Usage](#usage)
* [Commands](#commands)
* [Credit](#credit)
<!-- tocstop -->

# Quick Start

* [Quick Start Programming Guide](./guide.md)
* [More examples](./examples)
* AI Applications written in PPE Language:
  * [AI Guide App For PPE Guide](./lib/guide/) - WIP
    * `ai run guide` in the project root folder to run the guide
  * [AI Terminal Shell](https://github.com/offline-ai/ai-shell)
* LLM Inference Providers:
  * `llamacpp`: llama.cpp server as the default local LLM provider. If no `provider` is specified, `llamacpp` is used.
  * `openai`: Also supports OpenAI-compatible service API providers.
    * `--provider openai://chatgpt-4o-latest --apiKey “sk-XXX”`

Note: Limitations of OpenAI-Compatible Service API Providers

1. OpenAI must be a large model (`gpt-4o`) released after `2024-07-18` to support `json-schema`. Before this date, only `json` is guaranteed, not the `json-schema`.
2. All `siliconflow` models only guarantee `json` support, not `json-schema` support.
3. `[[Fruit:|Apple|Banana]]`: Syntax for forcing AI to choose either Apple or Banana will be invalid.

## [PPE CLI Command](./lib/guide/cli.md)

`ai` is the shell CLI command to manage the brain(LLM) files and run a PPE agent script mainly.

* Run script file command `ai run`, eg, `ai run -f calculator.ai.yaml "{content: '32+12*53'}"`
  * `-f` is used to specify the script file.
  * `{content: '32+12*53'}` is the optional json input to the script.
  * Scripts will display intermediate echo outputs during processing when streaming output. This can be controlled with `--streamEcho true|line|false`.  To keep the displayed echo outputs, use `--no-consoleClear`.
  * Script can be single YAML file (`.ai.yaml`) or directory.
    * Directory must have an entry point script file with the same name as the directory. Other scripts in the directory can call each other.
* Manage the brain files command `ai brain` include `ai brain download`, `ai brain list/search`.
* Run `ai help` or `ai help [command]` to get more.

## [Programmable Prompt Engine Language](./lib/guide/lang.md)

Programmable Prompt Engine (PPE) Language is a message-processing language, similar to the YAML format.

PPE is designed to define AI prompt messages and their input/output configurations. It allows for the creation of a reusable and programmable prompt system akin to software engineering practices.

### [I. Core Structure](./lib/guide/core-lang.md)

* Message-Based Dialogue: Defines interactions as a series of messages with roles (system, user, assistant).
* YAML-Like: Syntax is similar to YAML, making it readable and easy to understand.
* Dialogue Separation: Uses triple dashes (`---`) or asterisks (`***`) to clearly mark dialogue turns.

### [II. Reusability & Configuration](./lib/guide/lang-reuse.md)

* **Input/Output Configuration (Front-Matter):** Defines input requirements (using `input` keyword) and expected output format (using `output` keyword with JSON Schema).
* **Prompt Template:** Embeds variables from input configuration or prompt settings into messages using Jinja2 templates (`{{variable_name}}`).
* **Custom Script Types:** Allows defining reusable script types (`type: type`) for code and configuration inheritance.

### [III. AI Capabilities](./lib/guide/lang-ai.md)

* **Advanced AI Replacement:** Use double brackets (`[[Response]]`) to trigger AI execution, store the response in a variable (`prompt.Response`), and use it within the script.
* **AI Parameter Control:** Fine-tune AI behavior by passing parameters within double brackets (e.g., `[[Answer:temperature=0.7]]`).
* **Constrained AI Responses:** Limit AI outputs to a predefined set of options (e.g., `[[FRUITS:|Apple|Banana]]`).

#### [IV. Message Text Formatting](./lib/guide/lang-formatting.md)

The role messages can be formatted using Jinja2 templates and advanced replacement features.

* **Jinja2 Templates:**  Reference variables from input configuration or prompt settings using double curly braces (e.g., `{{name}}`).
* **Advanced AI Replacement:** As described above, triggers AI execution and stores the response.
* **External Script Replacement:**  Invoke external scripts using the `@` symbol (e.g., `@say_hi_script(param1=value1)`).
* **Internal Instruction Replacement:**  Call internal instructions similarly (e.g., `@$instruction(param1=value1)`).
* **Regular Expression Replacement:** Use `/RegExp/[RegOpts]:Answer[:index_or_group_name]` for pattern-based replacement on the `Answer` variable.

### [V. Script Capabilities](./lib/guide/lang-script.md)

* **Chaining Outputs:** The `->` operator connect script outputs to subsequent instructions or scripts, creating complex workflows.
* **Instruction Invocation:** The `$` prefix calls script instructions (e.g., `$fn: {param1:value1}` or `$fn(param1=value1)`).
* **Control Flow:** Directives like `$if`, `$pipe`, `$while`, `$match` provide control flow mechanisms.
* **Event-Driven Architecture:** Functions like `$on`, `$once`, `$emit` and `$off` enable event-based programming for flexible script behavior.
* **Script Extension:**
  * The `!fn` directive allows declaring JavaScript functions to extend script functionality.
  * [`import` configuration](https://github.com/offline-ai/ppe/tree/main?tab=readme-ov-file#import) allows importing external scripts and modules.

## Install

```bash
npm install -g @offline-ai/cli
ai brain download QuantFactory/Phi-3-mini-4k-instruct-GGUF-v2 -q Q4_0
Downloading to ~/.local/share/ai/brain
Downloading https://huggingface.co/QuantFactory/Phi-3-mini-4k-instruct-GGUF-v2/resolve/main/Phi-3-mini-4k-instruct.Q4_0.gguf... 5.61% 121977704 bytes
1. https://huggingface.co/QuantFactory/Phi-3-mini-4k-instruct-GGUF-v2/resolve/main/Phi-3-mini-4k-instruct.Q4_0.gguf
   ~/.local/share/ai/brain/phi-3-mini-4k-instruct.Q4_0.gguf
done
```

Upgrade:

```bash
#install again
npm install -g @offline-ai/cli
```

## Run

run your ai agent script, eg, the `Dobby` character:

```bash
$ai run --interactive --script examples/char-dobby
```

run the `translator` script lib directly:

```bash
# API mode, translate the TODO file to English
$ai run -f translator "{file: './TODO', target: 'English'}"

# interactive mode
$ai run -if translator
```

# Usage

Install the CLI globally:

<!-- usage -->
```sh-session
$ npm install -g @offline-ai/cli
$ ai COMMAND
running command...
$ ai (--version)
@offline-ai/cli/0.10.3 linux-x64 node-v20.18.3
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
* `AI Brain List` Display the brain list, which is part of the list filtered by the `featured`. If you want to display all the brain list, use `--no-onlyFeatured` option.

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

Specific script instruction manual see: [Programmable Prompt Engine Specification](https://github.com/offline-ai/ppe)

# Commands

<!-- commands -->
* [`ai agent`](#ai-agent)
* [`ai autocomplete [SHELL]`](#ai-autocomplete-shell)
* [`ai brain [NAME]`](#ai-brain-name)
* [`ai brain dn [NAME]`](#ai-brain-dn-name)
* [`ai brain down [NAME]`](#ai-brain-down-name)
* [`ai brain download [NAME]`](#ai-brain-download-name)
* [`ai brain list [NAME]`](#ai-brain-list-name)
* [`ai brain refresh`](#ai-brain-refresh)
* [`ai brain search [NAME]`](#ai-brain-search-name)
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
* [`ai run [FILE] [DATA]`](#ai-run-file-data)
* [`ai test [FILE]`](#ai-test-file)
* [`ai version`](#ai-version)

## `ai agent`

🤖 The AI Agent Manager(TODO)

```
USAGE
  $ ai agent

DESCRIPTION
  🤖 The AI Agent Manager(TODO)


  Manage your AI Agents 🤖 here.
  📜 List local or online agents
  🔎 search for agents
  📥 download agents
  ❌ delete agents
  🎉 publish agents


EXAMPLES
  $ ai agent list
  $ ai agent download <agent-name>
  $ ai agent publish <agent-name>
```

_See code: [src/commands/agent/index.ts](https://github.com/offline-ai/cli/blob/v0.10.3/src/commands/agent/index.ts)_

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

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.2.25/src/commands/autocomplete/index.ts)_

## `ai brain [NAME]`

🧠 The AI Brains(LLM) Manager.

```
USAGE
  $ ai brain [NAME] [--json] [--config <value>] [--banner] [-b <value>]
    [-s <value>] [-n <value>] [-u <value> -r] [-v ]

ARGUMENTS
  NAME  the brain name to search

FLAGS
  -b, --brainDir=<value>  the brains(LLM) directory
  -n, --count=<value>     [default: 100] the max number of brains to list, 0 means all.
  -r, --refresh           refresh the online brains list
  -s, --search=<value>    the json filter to search for brains
  -u, --hubUrl=<value>    the hub mirror url
  -v, --verifyQuant       whether verify quant when refresh
      --[no-]banner       show banner
      --config=<value>    the config file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  🧠 The AI Brains(LLM) Manager.


  Manage AI brains 🧠 here.
  📜 List downloaded or online brains
  🔎 search for brains
  📥 download brains
  ❌ delete brains


EXAMPLES
  $ ai brain               # list download brains
  $ ai brain list --online # list online brains
  $ ai brain download <brain-name>
```

_See code: [@offline-ai/cli-plugin-cmd-brain](https://github.com/offline-ai/cli-plugin-cmd-brain.js/blob/v0.4.15/src/commands/brain/index.ts)_

## `ai brain dn [NAME]`

🧠 The AI Brains(LLM) Downloader.

```
USAGE
  $ ai brain dn [NAME] [--json] [--config <value>] [--banner] [-b <value>]
    [-q F32|F16|Q4_0|Q4_1|Q4_1_SOME_F16|Q8_0|Q5_0|Q5_1|Q2_K|Q3_K_S|Q3_K_M|Q3_K_L|Q4_K_S|Q4_K_M|Q5_K_S|Q5_K_M|Q6_K|IQ2_XX
    S|IQ2_XS|Q2_K_S|IQ3_XS|IQ3_XXS|IQ1_S|IQ4_NL|IQ3_S|IQ3_M|IQ2_S|IQ2_M|IQ4_XS|IQ1_M|BF16|Q4_0_4_4|Q4_0_4_8|Q4_0_8_8|GUE
    SSED|Q4_K_L|Q3_K_XL|Q2_K_L] [-u <value>] [-d] [-r]

ARGUMENTS
  NAME  the brain name to download

FLAGS
  -b, --brainDir=<value>  the brains(LLM) directory
  -d, --dryRun            dry run, do not download
  -q, --quant=<option>    the quantization of the model, defaults to 4bit
                          <options: F32|F16|Q4_0|Q4_1|Q4_1_SOME_F16|Q8_0|Q5_0|Q5_1|Q2_K|Q3_K_S|Q3_K_M|Q3_K_L|Q4_K_S|Q4_K
                          _M|Q5_K_S|Q5_K_M|Q6_K|IQ2_XXS|IQ2_XS|Q2_K_S|IQ3_XS|IQ3_XXS|IQ1_S|IQ4_NL|IQ3_S|IQ3_M|IQ2_S|IQ2_
                          M|IQ4_XS|IQ1_M|BF16|Q4_0_4_4|Q4_0_4_8|Q4_0_8_8|GUESSED|Q4_K_L|Q3_K_XL|Q2_K_L>
  -r, --refresh           refresh the specified brain
  -u, --hubUrl=<value>    the hub mirror url
      --[no-]banner       show banner
      --config=<value>    the config file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  🧠 The AI Brains(LLM) Downloader.


  📥 download 🧠 brains to brainDir.


ALIASES
  $ ai brain dn
  $ ai brain down

EXAMPLES
  $ ai brain dn <brain-name> [-q <QUANT>]
```

## `ai brain down [NAME]`

🧠 The AI Brains(LLM) Downloader.

```
USAGE
  $ ai brain down [NAME] [--json] [--config <value>] [--banner] [-b <value>]
    [-q F32|F16|Q4_0|Q4_1|Q4_1_SOME_F16|Q8_0|Q5_0|Q5_1|Q2_K|Q3_K_S|Q3_K_M|Q3_K_L|Q4_K_S|Q4_K_M|Q5_K_S|Q5_K_M|Q6_K|IQ2_XX
    S|IQ2_XS|Q2_K_S|IQ3_XS|IQ3_XXS|IQ1_S|IQ4_NL|IQ3_S|IQ3_M|IQ2_S|IQ2_M|IQ4_XS|IQ1_M|BF16|Q4_0_4_4|Q4_0_4_8|Q4_0_8_8|GUE
    SSED|Q4_K_L|Q3_K_XL|Q2_K_L] [-u <value>] [-d] [-r]

ARGUMENTS
  NAME  the brain name to download

FLAGS
  -b, --brainDir=<value>  the brains(LLM) directory
  -d, --dryRun            dry run, do not download
  -q, --quant=<option>    the quantization of the model, defaults to 4bit
                          <options: F32|F16|Q4_0|Q4_1|Q4_1_SOME_F16|Q8_0|Q5_0|Q5_1|Q2_K|Q3_K_S|Q3_K_M|Q3_K_L|Q4_K_S|Q4_K
                          _M|Q5_K_S|Q5_K_M|Q6_K|IQ2_XXS|IQ2_XS|Q2_K_S|IQ3_XS|IQ3_XXS|IQ1_S|IQ4_NL|IQ3_S|IQ3_M|IQ2_S|IQ2_
                          M|IQ4_XS|IQ1_M|BF16|Q4_0_4_4|Q4_0_4_8|Q4_0_8_8|GUESSED|Q4_K_L|Q3_K_XL|Q2_K_L>
  -r, --refresh           refresh the specified brain
  -u, --hubUrl=<value>    the hub mirror url
      --[no-]banner       show banner
      --config=<value>    the config file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  🧠 The AI Brains(LLM) Downloader.


  📥 download 🧠 brains to brainDir.


ALIASES
  $ ai brain dn
  $ ai brain down

EXAMPLES
  $ ai brain down <brain-name> [-q <QUANT>]
```

## `ai brain download [NAME]`

🧠 The AI Brains(LLM) Downloader.

```
USAGE
  $ ai brain download [NAME] [--json] [--config <value>] [--banner] [-b <value>]
    [-q F32|F16|Q4_0|Q4_1|Q4_1_SOME_F16|Q8_0|Q5_0|Q5_1|Q2_K|Q3_K_S|Q3_K_M|Q3_K_L|Q4_K_S|Q4_K_M|Q5_K_S|Q5_K_M|Q6_K|IQ2_XX
    S|IQ2_XS|Q2_K_S|IQ3_XS|IQ3_XXS|IQ1_S|IQ4_NL|IQ3_S|IQ3_M|IQ2_S|IQ2_M|IQ4_XS|IQ1_M|BF16|Q4_0_4_4|Q4_0_4_8|Q4_0_8_8|GUE
    SSED|Q4_K_L|Q3_K_XL|Q2_K_L] [-u <value>] [-d] [-r]

ARGUMENTS
  NAME  the brain name to download

FLAGS
  -b, --brainDir=<value>  the brains(LLM) directory
  -d, --dryRun            dry run, do not download
  -q, --quant=<option>    the quantization of the model, defaults to 4bit
                          <options: F32|F16|Q4_0|Q4_1|Q4_1_SOME_F16|Q8_0|Q5_0|Q5_1|Q2_K|Q3_K_S|Q3_K_M|Q3_K_L|Q4_K_S|Q4_K
                          _M|Q5_K_S|Q5_K_M|Q6_K|IQ2_XXS|IQ2_XS|Q2_K_S|IQ3_XS|IQ3_XXS|IQ1_S|IQ4_NL|IQ3_S|IQ3_M|IQ2_S|IQ2_
                          M|IQ4_XS|IQ1_M|BF16|Q4_0_4_4|Q4_0_4_8|Q4_0_8_8|GUESSED|Q4_K_L|Q3_K_XL|Q2_K_L>
  -r, --refresh           refresh the specified brain
  -u, --hubUrl=<value>    the hub mirror url
      --[no-]banner       show banner
      --config=<value>    the config file

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  🧠 The AI Brains(LLM) Downloader.


  📥 download 🧠 brains to brainDir.


ALIASES
  $ ai brain dn
  $ ai brain down

EXAMPLES
  $ ai brain download <brain-name> [-q <QUANT>]
```

_See code: [@offline-ai/cli-plugin-cmd-brain](https://github.com/offline-ai/cli-plugin-cmd-brain.js/blob/v0.4.15/src/commands/brain/download.ts)_

## `ai brain list [NAME]`

📜 List downloaded or not downloaded brains, defaults to not downloaded.

```
USAGE
  $ ai brain list [NAME] [--json] [--config <value>] [--banner] [-d] [-a] [-b
    <value>] [-f] [-s <value>] [-n <value>] [-u <value> -r]

ARGUMENTS
  NAME  the brain name to search

FLAGS
  -a, --all                list all brains(include downloaded)
  -b, --brainDir=<value>   the brains(LLM) directory
  -d, --downloaded         list downloaded brains
  -f, --[no-]onlyFeatured  only list featured brains
  -n, --count=<value>      [default: 100] the max number of brains to list, 0 means all.
  -r, --refresh            refresh the online brains list
  -s, --search=<value>     the json filter to search for brains
  -u, --hubUrl=<value>     the hub mirror url
      --[no-]banner        show banner
      --config=<value>     the config file

GLOBAL FLAGS
  --json  Format output as json.
```

_See code: [@offline-ai/cli-plugin-cmd-brain](https://github.com/offline-ai/cli-plugin-cmd-brain.js/blob/v0.4.15/src/commands/brain/list.ts)_

## `ai brain refresh`

🔄 refresh/update online brains index.

```
USAGE
  $ ai brain refresh [--json] [-b <value>] [-u <value>] [-v] [-c <value>]

FLAGS
  -b, --brainDir=<value>  the brains(LLM) directory
  -c, --maxCount=<value>  [default: -1] the max number of brains to refresh, -1 means no limits
  -u, --hubUrl=<value>    the hub mirror url
  -v, --verifyQuant       whether verify quant when refresh

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  🔄 refresh/update online brains index.

  refresh/update brain index from huggingface.co
```

_See code: [@offline-ai/cli-plugin-cmd-brain](https://github.com/offline-ai/cli-plugin-cmd-brain.js/blob/v0.4.15/src/commands/brain/refresh.ts)_

## `ai brain search [NAME]`

🔍 Search brains offline, defaults to all.

```
USAGE
  $ ai brain search [NAME] [--json] [--config <value>] [--banner] [-d] [-a] [-b
    <value>] [-f] [-s <value>] [-n <value>] [-u <value> -r]

ARGUMENTS
  NAME  the brain name to search

FLAGS
  -a, --[no-]all           list all brains(include downloaded)
  -b, --brainDir=<value>   the brains(LLM) directory
  -d, --downloaded         list downloaded brains
  -f, --[no-]onlyFeatured  only list featured brains
  -n, --count=<value>      [default: 100] the max number of brains to list, 0 means all.
  -r, --refresh            refresh the online brains list
  -s, --search=<value>     the json filter to search for brains
  -u, --hubUrl=<value>     the hub mirror url
      --[no-]banner        show banner
      --config=<value>     the config file

GLOBAL FLAGS
  --json  Format output as json.
```

_See code: [@offline-ai/cli-plugin-cmd-brain](https://github.com/offline-ai/cli-plugin-cmd-brain.js/blob/v0.4.15/src/commands/brain/search.ts)_

## `ai config [ITEM_NAME]`

🛠️  Manage the AI Configuration.

```
USAGE
  $ ai config [ITEM_NAME] [--json] [-u <value>] [--apiKey <value>] [-s
    <value>...] [--logLevelMaxLen <value> -l trace|debug|verbose|info|notice|warn|error|fatal|print|silence]
    [--histories <value>] [-n] [-k] [-t <value> -i] [--no-chats] [--no-inputs ] [-m] [-f <value>] [-d <value>] [-D
    <value>...] [-a <value>] [-b <value>] [-p <value>...] [-L <value>] [-A <value>] [-e true|false|line] [-C <value>]
    [-P <value>]

ARGUMENTS
  ITEM_NAME  the config item name path to get

FLAGS
  -A, --aiPreferredLanguage=<value>    the ISO 639-1 code for the AI preferred language to translate the user input
                                       automatically, eg, en, etc.
  -C, --streamEchoChars=<value>        [default: 80] stream echo max characters limit
  -D, --data=<value>...                the data which will be passed to the ai-agent script: key1=value1 key2=value2
  -L, --userPreferredLanguage=<value>  the ISO 639-1 code for the user preferred language to translate the AI result
                                       automatically, eg, en, zh, ja, ko, etc.
  -P, --provider=<value>               the LLM provider, defaults to llamacpp
  -a, --arguments=<value>              the json data which will be passed to the ai-agent script
  -b, --brainDir=<value>               the brains(LLM) directory
  -d, --dataFile=<value>               the data file which will be passed to the ai-agent script
  -e, --streamEcho=<option>            [default: line] stream echo mode
                                       <options: true|false|line>
  -f, --script=<value>                 the ai-agent script file name or id
  -i, --[no-]interactive               interactive mode
  -k, --backupChat                     whether to backup chat history before start, defaults to false
  -l, --logLevel=<option>              the log level
                                       <options: trace|debug|verbose|info|notice|warn|error|fatal|print|silence>
  -m, --[no-]stream                    stream mode, defaults to true
  -n, --[no-]newChat                   whether to start a new chat history, defaults to false in interactive mode, true
                                       in non-interactive
  -p, --promptDirs=<value>...          the prompts template directory
  -s, --agentDirs=<value>...           the search paths for ai-agent script file
  -t, --inputs=<value>                 the input histories folder for interactive mode to record
  -u, --api=<value>                    the api URL
      --apiKey=<value>                 the api key (optional)
      --histories=<value>              the chat histories folder to record
      --logLevelMaxLen=<value>         the max length of log item to display
      --no-chats                       disable chat histories, defaults to false
      --no-inputs                      disable input histories, defaults to false

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

_See code: [@offline-ai/cli-plugin-cmd-config](https://github.com/offline-ai/cli-plugin-cmd-config.js/blob/v0.2.15/src/commands/config/index.ts)_

## `ai config save [DATA]`

💾 Save the current configuration to file which can be used to initialize config.

```
USAGE
  $ ai config save [DATA] [--json] [--config <value>] [--banner] [-u <value>]
    [--apiKey <value>] [-s <value>...] [--logLevelMaxLen <value> -l
    trace|debug|verbose|info|notice|warn|error|fatal|print|silence] [--histories <value>] [-n] [-k] [-t <value> -i]
    [--no-chats] [--no-inputs ] [-m] [-f <value>] [-d <value>] [-D <value>...] [-a <value>] [-b <value>] [-p <value>...]
    [-L <value>] [-A <value>] [-e true|false|line] [-C <value>] [-P <value>]

ARGUMENTS
  DATA  the json data which will be passed to the ai-agent script

FLAGS
  -A, --aiPreferredLanguage=<value>    the ISO 639-1 code for the AI preferred language to translate the user input
                                       automatically, eg, en, etc.
  -C, --streamEchoChars=<value>        [default: 80] stream echo max characters limit
  -D, --data=<value>...                the data which will be passed to the ai-agent script: key1=value1 key2=value2
  -L, --userPreferredLanguage=<value>  the ISO 639-1 code for the user preferred language to translate the AI result
                                       automatically, eg, en, zh, ja, ko, etc.
  -P, --provider=<value>               the LLM provider, defaults to llamacpp
  -a, --arguments=<value>              the json data which will be passed to the ai-agent script
  -b, --brainDir=<value>               the brains(LLM) directory
  -d, --dataFile=<value>               the data file which will be passed to the ai-agent script
  -e, --streamEcho=<option>            [default: line] stream echo mode
                                       <options: true|false|line>
  -f, --script=<value>                 the ai-agent script file name or id
  -i, --[no-]interactive               interactive mode
  -k, --backupChat                     whether to backup chat history before start, defaults to false
  -l, --logLevel=<option>              the log level
                                       <options: trace|debug|verbose|info|notice|warn|error|fatal|print|silence>
  -m, --[no-]stream                    stream mode, defaults to true
  -n, --[no-]newChat                   whether to start a new chat history, defaults to false in interactive mode, true
                                       in non-interactive
  -p, --promptDirs=<value>...          the prompts template directory
  -s, --agentDirs=<value>...           the search paths for ai-agent script file
  -t, --inputs=<value>                 the input histories folder for interactive mode to record
  -u, --api=<value>                    the api URL
      --apiKey=<value>                 the api key (optional)
      --[no-]banner                    show banner
      --config=<value>                 the config file
      --histories=<value>              the chat histories folder to record
      --logLevelMaxLen=<value>         the max length of log item to display
      --no-chats                       disable chat histories, defaults to false
      --no-inputs                      disable input histories, defaults to false

GLOBAL FLAGS
  --json  Format output as json.
```

_See code: [@offline-ai/cli-plugin-cmd-config](https://github.com/offline-ai/cli-plugin-cmd-config.js/blob/v0.2.15/src/commands/config/save.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.26/src/commands/help.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.15/src/commands/plugins/index.ts)_

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

  Uses npm to install plugins.

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.15/src/commands/plugins/inspect.ts)_

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

  Uses npm to install plugins.

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.15/src/commands/plugins/install.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.15/src/commands/plugins/link.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.15/src/commands/plugins/reset.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.15/src/commands/plugins/uninstall.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.15/src/commands/plugins/update.ts)_

## `ai run [FILE] [DATA]`

💻 Run ai-agent script file.

```
USAGE
  $ ai run [FILE] [DATA] [--json] [--config <value>] [--banner] [-u
    <value>] [--apiKey <value>] [-s <value>...] [--logLevelMaxLen <value> -l
    trace|debug|verbose|info|notice|warn|error|fatal|print|silence] [--histories <value>] [-n] [-k] [-t <value> -i]
    [--no-chats] [--no-inputs ] [-m] [-f <value>] [-d <value>] [-D <value>...] [-a <value>] [-b <value>] [-p <value>...]
    [-L <value>] [-A <value>] [-e true|false|line] [-C <value>] [-P <value>] [--consoleClear]

ARGUMENTS
  FILE  the script file path, or the json data when `-f` switch is set
  DATA  the json data which will be passed to the ai-agent script

FLAGS
  -A, --aiPreferredLanguage=<value>    the ISO 639-1 code for the AI preferred language to translate the user input
                                       automatically, eg, en, etc.
  -C, --streamEchoChars=<value>        [default: 80] stream echo max characters limit
  -D, --data=<value>...                the data which will be passed to the ai-agent script: key1=value1 key2=value2
  -L, --userPreferredLanguage=<value>  the ISO 639-1 code for the user preferred language to translate the AI result
                                       automatically, eg, en, zh, ja, ko, etc.
  -P, --provider=<value>               the LLM provider, defaults to llamacpp
  -a, --arguments=<value>              the json data which will be passed to the ai-agent script
  -b, --brainDir=<value>               the brains(LLM) directory
  -d, --dataFile=<value>               the data file which will be passed to the ai-agent script
  -e, --streamEcho=<option>            [default: line] stream echo mode
                                       <options: true|false|line>
  -f, --script=<value>                 the ai-agent script file name or id
  -i, --[no-]interactive               interactive mode
  -k, --backupChat                     whether to backup chat history before start, defaults to false
  -l, --logLevel=<option>              the log level
                                       <options: trace|debug|verbose|info|notice|warn|error|fatal|print|silence>
  -m, --[no-]stream                    stream mode, defaults to true
  -n, --[no-]newChat                   whether to start a new chat history, defaults to false in interactive mode, true
                                       in non-interactive
  -p, --promptDirs=<value>...          the prompts template directory
  -s, --agentDirs=<value>...           the search paths for ai-agent script file
  -t, --inputs=<value>                 the input histories folder for interactive mode to record
  -u, --api=<value>                    the api URL
      --apiKey=<value>                 the api key (optional)
      --[no-]banner                    show banner
      --config=<value>                 the config file
      --[no-]consoleClear              Whether console clear after stream echo output, default to true
      --histories=<value>              the chat histories folder to record
      --logLevelMaxLen=<value>         the max length of log item to display
      --no-chats                       disable chat histories, defaults to false
      --no-inputs                      disable input histories, defaults to false

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  💻 Run ai-agent script file.

  Execute ai-agent script file and return result. with `-i` to interactive.

EXAMPLES
  $ ai run -f ./script.yaml "{content: 'hello world'}" -l info
  ┌────────────────────
  │[info]:Start Script: ...
```

_See code: [@offline-ai/cli-plugin-core](https://github.com/offline-ai/cli-plugin-core.js/blob/v0.11.4/src/commands/run/index.ts)_

## `ai test [FILE]`

🔬 Run simple AI fixtures to test(draft).

```
USAGE
  $ ai test [FILE] [--json] [--config <value>] [--banner] [-u <value>]
    [--apiKey <value>] [-s <value>...] [--logLevelMaxLen <value> -l
    trace|debug|verbose|info|notice|warn|error|fatal|print|silence] [--histories <value>] [-n] [-k] [-t <value> ]
    [--no-chats] [--no-inputs ] [-m] [-f <value>] [-d <value>] [-D <value>...] [-a <value>] [-b <value>] [-p <value>...]
    [-L <value>] [-A <value>] [-e true|false|line] [-e <value>] [-P <value>] [--consoleClear] [-i <value>...] [-x
    <value>...] [-g] [-c <value>] [--checkSchema]

ARGUMENTS
  FILE  the test fixtures file path

FLAGS
  -A, --aiPreferredLanguage=<value>    the ISO 639-1 code for the AI preferred language to translate the user input
                                       automatically, eg, en, etc.
  -D, --data=<value>...                the data which will be passed to the ai-agent script: key1=value1 key2=value2
  -L, --userPreferredLanguage=<value>  the ISO 639-1 code for the user preferred language to translate the AI result
                                       automatically, eg, en, zh, ja, ko, etc.
  -P, --provider=<value>               the LLM provider, defaults to llamacpp
  -a, --arguments=<value>              the json data which will be passed to the ai-agent script
  -b, --brainDir=<value>               the brains(LLM) directory
  -c, --runCount=<value>               [default: 1] The number of times to run the test case to check if the results are
                                       consistent with the previous run, and to record the counts of matching and
                                       non-matching results
  -d, --dataFile=<value>               the data file which will be passed to the ai-agent script
  -e, --streamEcho=<option>            [default: line] stream echo mode, defaults to true
                                       <options: true|false|line>
  -e, --streamEchoChars=<value>        [default: 80] stream echo max characters limit, defaults to no limit
  -f, --script=<value>                 the ai-agent script file name or id
  -g, --generateOutput                 generate output to fixture file if no output is provided
  -i, --includeIndex=<value>...        the index of the fixture to run
  -k, --backupChat                     whether to backup chat history before start, defaults to false
  -l, --logLevel=<option>              the log level
                                       <options: trace|debug|verbose|info|notice|warn|error|fatal|print|silence>
  -m, --[no-]stream                    stream mode, defaults to true
  -n, --[no-]newChat                   whether to start a new chat history, defaults to false in interactive mode, true
                                       in non-interactive
  -p, --promptDirs=<value>...          the prompts template directory
  -s, --agentDirs=<value>...           the search paths for ai-agent script file
  -t, --inputs=<value>                 the input histories folder for interactive mode to record
  -u, --api=<value>                    the api URL
  -x, --excludeIndex=<value>...        the index of the fixture to exclude from running
      --apiKey=<value>                 the api key (optional)
      --[no-]banner                    show banner
      --[no-]checkSchema               Whether check JSON schema of output
      --config=<value>                 the config file
      --[no-]consoleClear              Whether console clear after stream output, default to true in interactive, false
                                       to non-interactive
      --histories=<value>              the chat histories folder to record
      --logLevelMaxLen=<value>         the max length of log item to display
      --no-chats                       disable chat histories, defaults to false
      --no-inputs                      disable input histories, defaults to false

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  🔬 Run simple AI fixtures to test(draft).

  Execute fixtures file to test AI script file and check result.

EXAMPLES
  $ ai test ./named.fixture.yaml -l info
```

_See code: [@offline-ai/cli-plugin-cmd-test](https://github.com/offline-ai/cli-plugin-cmd-test.js/blob/v0.3.15/src/commands/test/index.ts)_

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

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v2.2.25/src/commands/version.ts)_
<!-- commandsstop -->

# Credit

* [OpenAI](https://openai.com/)
* [HuggingFace](https://huggingface.co/)
* [llama-cpp](https://github.com/ggerganov/llama.cpp)
