# Lightweight AI Agent Programmable Prompt Script Engine [ai-agent]

Objective: Organize a variety of intelligent agents into a reusable library of agents.

## AI Agent Script Introduction

`@offline-ai/cli` is the interpreter client for the lightweight AI agent script engine (`ai-agent`) developed in JS, used to run `AI agent scripts` directly.

An `AI agent script` abstracts agents into specific task script libraries, making them convenient for developers to use.

### Calculator Agent

**Warning:** Do not use AI for numerical calculations; this is not what large language models excel at. Here, it's only to demonstrate the invocation between agent scripts.

Demonstrating how to invoke other agents. First, you need a script for an agent that can calculate (`calculator.ai.yaml`), and then extract the result from that agent (`extract-calc-result.ai.yaml`).

Why two steps: To improve the accuracy of calculations, you must use CoT to make it think step by step. If it directly outputs the answer, it's very prone to errors.

`calculator.ai.yaml`:

```yaml
---
# Default input parameters, for testing or as examples, so not entering parameters won't cause errors.
expression: "1 + 2 * 3"
---
system: Please act as a calculator to calculate the result of the following expression, think it step by step.
# system: Please act as a calculator and calculate the result of the expression, think through the calculation step by step. # Can also use Chinese, small-scale brains are recommended to use English prompts.
---
user: "{{expression}}"
assistant: "[[thinking]]"
# Pass the result to extract-calc-result.ai.yaml for processing
-> extract-calc-result
```

* `[[thinking]]` indicates a high-level AI replacement, meaning the content in the brackets will be replaced by AI. Meanwhile, the content in the brackets, `thinking`, will be stored as a template data variable with the AI replacement content, available for use in subsequent messages.
* `->` indicates passing the current result to another agent script and waiting for the return result.

For a more detailed explanation of script commands, please refer to: [Programmable Prompt Engineering Specifications](https://github.com/offline-ai/ppe/blob/main/README.en.md)

`extract-calc-result.ai.yaml`:

```yaml
---
parameters:
  response_format:
    type: "json"
output:
  type: "number"
---
user: |-
  Please extract the calculation results of the following content, and only output the results without explanation:
  {{result}}
```

Running (scripts are in the `examples` directory):

```bash
# `-s examples` adds the examples directory to the search directory to find the `calc-result` script.
# `--no-stream` disables streaming output
ai run -f examples/calculator.ai.yaml '{expression: "1+2*5"}' -s examples --no-stream
11
```

### Simple Translator Agent

Let's take a simple example. If I want AI to automatically translate `i18n` resources based on the following `json` format:

```json
{
   "en": {
     "Accept": "Accept",
     "Decline": "Decline",
     "Close": "Close",
     "Restart": "Restart",
     "YOU": "YOU",
     "Setup": "Setup",
     "dont_show_again": "Don't show again",
     "Background Color": "Background Color",
     "bg_color_desc": "Configure the background color. This overrides the background image.",
     "no_bg_color": "No background color set. Click the box below.",
     "Color": "Color",
     "Load image": "Load image",
   }
}
```

Of course, the simplest method is to directly paste it all to the AI for translation. Normally, you would get satisfactory results. But don't forget, this is a brain with hallucinations, meaning there's always a possibility of errors.
If it becomes an automated script execution without human review, then you fear mistakes. If it's just a translation error, it might be okay, but what you fear is it messing up the keys or not outputting JSON.

Rule number one for AI application development: When you can achieve something with code or when you absolutely must guarantee 100% accuracy, don't use AI.

Here, translation inherently has accuracy issues, so if the translation itself is wrong, it's not a big problem.

Imagine, in the past, if you wanted to develop an application for translating multiple languages, how complex an engineering project it would be. You'd need a corpus, design a model, train the model, and optimize it.
After all that work, the translation software would only output translation results.

And now, to implement a complete multi-language translation function locally, even if you don't understand code, you can achieve multi-language translation and communicate with it.

> Aside: Why is always English used in prompts? This is because the English corpus is much bigger than other languages, so using English yields better accuracy. Of course, using your native language may be fine too. But for small brains, English works better.

Below is the content of the simplest `translator` (translator) agent script file:

```yaml
---
_id: translator
templateFormat: hf
type: char
character:
  name: "Translator"
description: |-
  You are the best translator in the world. You are helpful, kind, honest, good at writing, and never fails to answer any requests immediately and with precision.

  Output high-quality translation results in the JSON object and stop immediately:
  {
    "translation": "translated content",
    "original": "original content",
    "lang": "original language",
    "target": "target language",
  }
input: # Agreed input parameters
  # The content that needs to be translated.
  - content
  # The language of the content. "auto" means auto detect
  - lang
  # The target language.
  - target
output: # Agreed output object
  type: "object"
  properties:
    translation:
      type: "string"
    original:
      type: "string"
    lang:
      type: "string"
    target:
      type: "string"
  required: ["translation", "original", "lang", "target"]
parameters:
  continueOnLengthLimit: true
  maxRetry: 10
  response_format:
    type: "json_object"
llmReturnResult: content
---
user: |-
  "{{content}}
  Translate the above content {% if lang %}from {{lang}} {% endif %}to {{target}}."
```

With just the configuration template, without a single line of code, you can handle the `translator`.

Do you need to explain the configuration parameters? Do you need to? No, right?

* `type`: Script type, `char` indicates a character type.
* `name`: Character name
* `character`: When `char` type, use an object to set other information about the character. no used here.
* `description`: Define your character details here.
* `prompt`: Prompt-related configuration, declare template variables should be in it.
  * `messages`: A list of messages for interaction with the brain model, compatible with OpenAI message prompts.
    * `role`: The role of the message, `user`, indicating a message sent by a person; `assistant`, indicating a message sent by AI; `system` indicating a system prompt message
    * `content`: Message content, here it references the template variable `description` in the prompt, Jinja2 template syntax.
* `input`: The input for this script, that is, the content to be translated.
  * `content`: The main content to be translated
  * `lang`: The language used in the main content
  * `target`: Target language
* `output`: the script's output. Of course, you don't need this if output the translated content directly. Here, we agree to return a JSON object.
  * `translation`: Return the translated content here
  * `original`: The original text is placed here. This is for verifying the command-following ability of a certain brain. It can be omitted.
  * `lang`: The language used in the original text
  * `target`: Target language

Alright, that's about it for the configuration introduction.

Remaining is the parameter configuration.

* `parameters`: Brain model parameter configuration, temperature, seed, etc., can all be configured here.
  * `continueOnLengthLimit`: This determines whether, upon reaching the maximum token limit, it will automatically continue to call AI to fetch data.
    * Note: This currently does not apply when the return result is JSON. If JSON is required, increase `max_tokens`.
  * `maxRetry`: Accompanying `continueOnLengthLimit` is this parameter, the maximum number of retries. If not set, the default is 7 times.
  * `timeout`: If the brain is large and the response is slow, if it hasn't responded within 2 minutes, then you need to adjust this timeout parameter, measured in milliseconds.
  * `max_tokens`: This is the maximum token limit, defaulting to 2048. AI will output until max_tokens is reached, avoiding situations where AI outputs endlessly without stopping.
  * `response_format`: Set the format of the return result. Currently, `type` only allows json (alias `json_object`) to be set.
    * Note: When `output` and `type:json` are both set, it will force the model to return a JSON object, rather than text.
    * If `response_format` is not set, you can set `forceJson:true` in the invocation parameters for the same effect.

After configuring, the following is the script content:

```yaml
user: |-
  "{{content}}
  Translate the above content {% if lang %}from {{lang}} {% endif %}to {{target}}."
```

This statement represents what the user (role) says (message), and the message content can use [jinja2](https://wsgzao.github.io/post/jinja/) template syntax.
`|-` is YAML syntax, indicating a multi-line string with line breaks preserved.

Let's give it a try. First, confirm that the background `llama.cpp` brain server is already running:

```bash
#run llama.cpp server
cd llamacpp/build/bin
#set -ngl 0 if no gpu
./server -t 4 -c 4096 -ngl 33 -m ~/.local/share/ai/brain/phi-3-mini-4k-instruct.Q4_0.gguf
```

Confirmed. Now, let's try translating a piece of text into Portuguese:

```bash
ai run -f translator-simple.ai.yaml "{ \
  lang:'English', \
  content:'When I came to the future, the first thing I saw were flying cars hovering everywhere in the city, quietly flying in the air, making the roads no longer congested. Sunlight shines through smart glass into the room, and the ceiling has a projection that can change scenes. The room is filled with a faint fragrance, which is automatically released by the fragrance generator embedded in the wall.', \
  target: 'Portuguese'}"

{
  "lang": "English",
  "original": "...",
  "target": "português",
  "translation": "Quando chegamos às futuras gerações, a primeira coisa que vemos é que, em toda a cidade, há aerotránsportos pendentes flutuando na atmosfera, voando de forma tranquila, eliminando os congestionamentos nas estradas."
}
```

Below are the results when `forceJson: false` is set in the invocation parameters, not forcing a return in JSON format, allowing it to perform freely. It keeps returning empty lines, which the script engine detects and forcibly terminates. This detection parameter `endWithRepeatedSequence` can also be set. The default value is `7`, indicating that the sequence at the end is repeated at least 7 times before termination.

```bash
ai run -f translator-simple.ai.yaml "{ \
  forceJson: false, \
  lang:'English',   \
  content:'When I came to the future, the first thing I saw were flying cars hovering everywhere in the city, they quietly flew in the air, making the roads no longer congested. Sunlight shines through smart glass into the room, and the ceiling has a projection that can change scenes. The room is filled with a faint fragrance, which is automatically released by the fragrance generator embedded in the wall.', \
  target: 'Portuguese'}"

{
  "translation": "Quando chegarei ao futuro, inicialmente verrei carros voadores que flutuam em todos os lugares da cidade, e eles voam calmadamente no céu, o que não mais causa congestionamento nas es
tradas. A luz do sol penetra pelas janelas inteligentes, e na parede há um projetor de imagens que pode mudar o ambiente.",
  "original": "...",
   "lang": "中文",
   "target": "português"
}

│[warn]:endWithRepeatedSequence "\n" 7 count found, you can set minTailRepeatCount to 0 to disable it or increase it! { content: "{
│ ...
│[warn]:<AbortError> The operation was aborted for endWithRepeatedSequence. { error: { code: 499, name: "AbortError", data: { what:
```

Alright, the agent script has successfully returned a JSON result. How to automatically translate the above language resources, do you need to continue?

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
# Example for Ubuntu x64 system
wget https://github.com/ggerganov/llama.cpp/releases/download/b3091/llama-b3091-bin-ubuntu-x64.zip
unzip llama-b3091-bin-ubuntu-x64.zip
```

### Download Brain(LLM) File 🧠

```bash
ai brain download QuantFactory/Phi-3-mini-4k-instruct-GGUF-v2 -q Q4_0
Downloading to ~/.local/share/ai/brain
Downloading https://huggingface.co/QuantFactory/Phi-3-mini-4k-instruct-GGUF-v2/resolve/main/Phi-3-mini-4k-instruct.Q4_0.gguf... 5.61% 121977704 bytes
1. https://hf-mirror.com/QuantFactory/Phi-3-mini-4k-instruct-GGUF-v2/resolve/main/Phi-3-mini-4k-instruct.Q4_0.gguf
   ~/.local/share/ai/brain/phi-3-mini-4k-instruct.Q4_0.gguf
done
```

### Run

First, you need to run the llama.cpp brain(LLM) server in background:

```bash
#run llama.cpp server
cd llamacpp/build/bin
#set -ngl 0 if no gpu
./llama-server -t 4 -c 4096 -ngl 33 -m ~/.local/share/ai/brain/phi-3-mini-4k-instruct.Q4_0.gguf
```

Now, you can run the agent script:

```bash
# -i `--interactive`: Run in interactive mode
# -f `--script`: Specify the script file
$ai run --interactive --script examples/char-dobby
```
