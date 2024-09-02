# Programmable Prompt Engine (PPE) CLI Command

`ai` is the shell CLI command to manage the brain(LLM) files and run a PPE agent script mainly.

* Run script file command `ai run`, eg, `ai run -f calculator.ai.yaml "{content: '32+12*53'}"`
  * `-f` is used to specify the script file.
  * `{content: '32+12*53'}` is the optional json input to the script.
  * Scripts will display intermediate echo outputs during processing when streaming output. This can be controlled with `--streamEcho true|line|false`.  To keep the displayed echo outputs, use `--no-consoleClear`.
  * Script can be single YAML file (`.ai.yaml`) or directory.
    * Directory must have an entry point script file with the same name as the directory. Other scripts in the directory can call each other.
* Manage the brain files command `ai brain` include `ai brain download`, `ai brain list/search`.
* Run `ai help` or `ai help [command]` to get more.

## Usage

Install the CLI globally:

```sh
$ npm install -g @offline-ai/cli
$ ai COMMAND
running command...
$ ai (--version)
@offline-ai/cli/0.3.8 linux-x64 node-v20.14.0
$ ai --help [COMMAND]
USAGE
  $ ai COMMAND
...
```

Search and Download a brain(LLM) on huggingface.

Choose one to download, or type more to reduce the brain(models) list

Note:

* All quantification (compression) brain 🧠 models are uploaded by the user by themselves, so it cannot guarantee that these user quantitative (compressed) brain 🧠 models can be used
* At present, the GGUF quantitative brain 🧠 model has been tens of thousands, and many of them are repeated.
* `AI Brain List` Display the brain list, which is part of the list filtered by the `featured`. If you want to display all the brain list, use `--no-onlyFeatured` option.

```sh
#list the downloaded brain list
#which means `ai brain list --downloaded`
$ai brain

#You can specify the keyword of the brain model to search
$ai brain search llama3-8b
#Download the brain, if there are multiple choices in the input keywords, you will be required to specify
#LLAMA3-8B is the name of the brain model to be searched
#`-q q4_0` is the quantification level of download. If it is not provided, it will be prompted to specify
#`--hubUrl` is the mirror URL address of Huggingface
$ai brain download llama3-8b -q Q4_0 --hubUrl=https://huggingface-mirror-url-address
```

After download, get the brain dir:

```bash
ai config brainDir
{
  "brainDir": "~/.local/share/ai/brain"
}
```

You can create your config by `ai config save`

Download and run the brain(LLM) Server: [llama.cpp](https://github.com/ggerganov/llama.cpp/releases/latest)

```bash
mkdir llamacpp
cd llamacpp
wget https://github.com/ggerganov/llama.cpp/releases/download/b3631/llama-b3631-bin-ubuntu-x64.zip
unzip llama-b3631-bin-ubuntu-x64.zip
cd build/bin
#run the server
#`-ngl 33` means GPU layers to load, adjust it according to your GPU.
#`-c 4096` means max context length
#`-t 4` means thread count
./server -t 4 -c 4096 -ngl 33 -m ~/.local/share/ai/brain/your-brain-model.gguf
```

Now you can run your AI script:

```bash
#you can config the search agent paths in `agentDirs` config or add `-s your_search_path` to argument .
#`-f` means the agent file
#`-i` means entering the interactive mode
$ai run -if examples/char-dobby.ai.yaml
```

Note:

* By default, the history after running is in the directory `~/.local/share/ai/logs/chats/[script_file_basename]/history`. You can check `seeds`, `temperature` and other information here.
  * In interactive mode, the history will be automatically loaded by default. If you don't need it, you can use `--new-chat`
  * In non-interactive mode, the history will not be automatically loaded. A new history will be generated for each run.
  * To completely disable the history saving, you can use `--no-chats` switch.

## Commands

### `ai run [FILE] [DATA]`

💻 Run PPE ai-agent script file.

```
USAGE
  $ ai run [FILE] [DATA] [--json] [-c <value>] [--banner] [-u <value>]
    [-s <value>...] [-l silence|fatal|error|warn|info|debug|trace] [-h <value>] [-n] [-k] [-t <value> -i] [--no-chats]
    [--no-inputs ] [-m] [-f <value>] [-d <value>] [-D <value>...] [-a <value>] [-b <value>] [-p <value>...] [-L <value>] [-A <value>]
    [-e true|false|line] [--consoleClear]

ARGUMENTS
  FILE  the script file path, or the json data when `-f` switch is set
  DATA  the json data which will be passed to the ai-agent script

FLAGS
  -A, --aiPreferredLanguage=<value>    the ISO 639-1 code for the AI preferred language to translate the user input
                                       automatically, eg, en, etc.
  -D, --data=<value>...                the data which will be passed to the ai-agent script: key1=value1 key2=value2
  -L, --userPreferredLanguage=<value>  the ISO 639-1 code for the user preferred language to translate the AI result
                                       automatically, eg, en, zh, ja, ko, etc.
  -a, --arguments=<value>              the json data which will be passed to the ai-agent script
  -b, --brainDir=<value>               the brains(LLM) directory
  -c, --config=<value>                 the config file
  -d, --dataFile=<value>               the data file which will be passed to the ai-agent script
  -e, --streamEcho=<option>            [default: true] stream echo mode, defaults to true
                                       <options: true|false|line>
  -f, --script=<value>                 the ai-agent script file name or id
  -h, --histories=<value>              the chat histories folder to record
  -i, --[no-]interactive               interactive mode
  -k, --backupChat                     whether to backup chat history before start, defaults to false
  -l, --logLevel=<option>              the log level
                                       <options: silence|fatal|error|warn|info|debug|trace>
  -m, --[no-]stream                    stream mode, defaults to true
  -n, --[no-]newChat                   whether to start a new chat history, defaults to false in interactive mode, true
                                       in non-interactive
  -p, --promptDirs=<value>...          the prompts template directory
  -s, --agentDirs=<value>...           the search paths for ai-agent script file
  -t, --inputs=<value>                 the input histories folder for interactive mode to record
  -u, --api=<value>                    the api URL
      --[no-]banner                    show banner
      --[no-]consoleClear              Whether console clear after stream echo output, default to true
      --no-chats                       disable chat histories, defaults to false
      --no-inputs                      disable input histories, defaults to false

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Execute ai-agent script file and return result. with `-i` to interactive.

EXAMPLES
  $ ai run -f ./script.yaml "{content: 'hello world'}" -l info
  ┌────────────────────
  │[info]:Start Script: ...
```

### `ai brain`

🧠 The AI Brains(LLM) Manager.

```
USAGE
  $ ai brain [NAME] [--json] [-c <value>] [--banner] [-b <value>] [-s
    <value>] [-n <value>] [-u <value> -r] [-v ]

ARGUMENTS
  NAME  the brain name to search

FLAGS
  -b, --brainDir=<value>  the brains(LLM) directory
  -c, --config=<value>    the config file
  -n, --count=<value>     [default: 100] the max number of brains to list, 0 means all.
  -r, --refresh           refresh the online brains list
  -s, --search=<value>    the json filter to search for brains
  -u, --hubUrl=<value>    the hub mirror url
  -v, --verifyQuant       whether verify quant when refresh
      --[no-]banner       show banner

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


## `ai brain download [NAME]`

🧠 The AI Brains(LLM) Downloader.

```
USAGE
  $ ai brain download [NAME] [--json] [-c <value>] [--banner] [-b <value>] [-q
    F32|F16|Q4_0|Q4_1|Q4_1_SOME_F16|Q8_0|Q5_0|Q5_1|Q2_K|Q3_K_S|Q3_K_M|Q3_K_L|Q4_K_S|Q4_K_M|Q5_K_S|Q5_K_M|Q6_K|IQ2_XXS|IQ
    2_XS|Q2_K_S|IQ3_XS|IQ3_XXS|IQ1_S|IQ4_NL|IQ3_S|IQ3_M|IQ2_S|IQ2_M|IQ4_XS|IQ1_M|BF16|Q4_0_4_4|Q4_0_4_8|Q4_0_8_8|GUESSED
    ] [-u <value>] [-d]

ARGUMENTS
  NAME  the brain name to download

FLAGS
  -b, --brainDir=<value>  the brains(LLM) directory
  -c, --config=<value>    the config file
  -d, --dryRun            dry run, do not download
  -q, --quant=<option>    the quantization of the model, defaults to 4bit
                          <options: F32|F16|Q4_0|Q4_1|Q4_1_SOME_F16|Q8_0|Q5_0|Q5_1|Q2_K|Q3_K_S|Q3_K_M|Q3_K_L|Q4_K_S|Q4_K
                          _M|Q5_K_S|Q5_K_M|Q6_K|IQ2_XXS|IQ2_XS|Q2_K_S|IQ3_XS|IQ3_XXS|IQ1_S|IQ4_NL|IQ3_S|IQ3_M|IQ2_S|IQ2_
                          M|IQ4_XS|IQ1_M|BF16|Q4_0_4_4|Q4_0_4_8|Q4_0_8_8|GUESSED>
  -u, --hubUrl=<value>    the hub mirror url
      --[no-]banner       show banner

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

## `ai brain list [NAME]`

📜 List downloaded or not downloaded brains, defaults to not downloaded.

```
USAGE
  $ ai brain list [NAME] [--json] [-c <value>] [--banner] [-d] [-a] [-b
    <value>] [-f] [-s <value>] [-n <value>] [-u <value> -r]

ARGUMENTS
  NAME  the brain name to search

FLAGS
  -a, --all                list all brains(include downloaded and online)
  -b, --brainDir=<value>   the brains(LLM) directory
  -c, --config=<value>     the config file
  -d, --downloaded         list downloaded brains
  -f, --[no-]onlyFeatured  only list featured brains
  -n, --count=<value>      [default: 100] the max number of brains to list, 0 means all.
  -r, --refresh            refresh the online brains list
  -s, --search=<value>     the json filter to search for brains
  -u, --hubUrl=<value>     the hub mirror url
      --[no-]banner        show banner

GLOBAL FLAGS
  --json  Format output as json.

ALIASES
  $ ai brain search
```

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
  refresh brain index from huggingface.co
```

_See code: [@offline-ai/cli-plugin-cmd-brain](https://github.com/offline-ai/cli-plugin-cmd-brain.js/blob/v0.3.6/src/commands/brain/refresh.ts)_

## `ai brain search [NAME]`

🔍 Search brains offline, defaults to all.

```
USAGE
  $ ai brain search [NAME] [--json] [-c <value>] [--banner] [-d] [-a] [-b
    <value>] [-f] [-s <value>] [-n <value>] [-u <value> -r]

ARGUMENTS
  NAME  the brain name to search

FLAGS
  -a, --[no-]all           list all brains(include downloaded)
  -b, --brainDir=<value>   the brains(LLM) directory
  -c, --config=<value>     the config file
  -d, --downloaded         list downloaded brains
  -f, --[no-]onlyFeatured  only list featured brains
  -n, --count=<value>      [default: 100] the max number of brains to list, 0 means all.
  -r, --refresh            refresh the online brains list
  -s, --search=<value>     the json filter to search for brains
  -u, --hubUrl=<value>     the hub mirror url
      --[no-]banner        show banner

GLOBAL FLAGS
  --json  Format output as json.
```

## `ai config [ITEM_NAME]`

🛠️  Manage the AI Configuration.

```
USAGE
  $ ai config [ITEM_NAME] [--json]

ARGUMENTS
  ITEM_NAME  the config item name path to get

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

## `ai config save [DATA]`

💾 Save the current configuration to file which can be used to initialize config.

```
USAGE
  $ ai config save [DATA] [--json]


GLOBAL FLAGS
  --json  Format output as json.
```

## `ai test`

🔬 Run simple ai-agent fixtures to test(draft).

```
USAGE
  $ ai test [--json] [-f <value>]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  🔬 Run simple ai-agent fixtures to test(draft).

  Execute fixtures file to test ai-agent script file and check result, it likes unit test.

EXAMPLES
  $ ai test -f ./fixture.yaml -l info
```

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
