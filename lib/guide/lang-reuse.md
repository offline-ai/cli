# Programmable Prompt Engine Language Reusability & Configuration

Programmable Prompt Engine (PPE) Language is a message-processing language, similar to the YAML format.

PPE is designed to define AI prompt messages and their input/output configurations. It allows for the creation of a reusable and programmable prompt system akin to software engineering practices.

* Message-Based: PPE revolves around defining interactions as a series of messages. Each message has a `role` (e.g., `system`, `assistant`, `user`) and the actual `message content`.
* YAML-Like: PPE uses a syntax similar to YAML, making it human-readable and relatively easy to learn.
* Dialogue Separation: Triple dashes (`---`) or asterisks (`***`) clearly mark the beginning of new dialogue turns, ensuring context is managed effectively.

## Front-matter Configuration

The optional `front-matter` section uses `input` and `output` keywords to define the script's input requirements and expected output format (using JSON Schema).

```yaml
---
# Below is the input/output configuration
input:
  # defaults to string if without `type`
  - content:
      required: true
output:
  - type: "string"
# The default value of input
content: "What is 10 + 18?"
---
# Below is the script content
system: "You are a calculator. Output result only."
user: "{{content}}"
assistant: "[[Answer]]"
```

Run it:

```bash
ai run -f calculator.ai.yaml "{content: '32+12*53'}"
668
```

## Message Template

The default message template format uses the lightweight [jinja2 template](https://en.wikipedia.org/wiki/Jinja_(template_engine)) syntax used by HuggingFace.

Templates can be pre-defined in configuration or generated dynamically during script execution.

The template formatting is by default delayed until it is passed to the large model. You can perform immediate formatting by prefixing with the `#` character.

```yaml
---
content: "2+3"
---
system: "You are a calculator. Output result only."
# this will be formatted immediately
user: "#{{content}}"
```

**Note:**

* Templates are rendered when `$AI` is called unless prefixed with `#` for immediate formatting.
* Data sources for templates follow this hierarchy: `function arguments` > `prompt` object > `runtime` object.

Messages can be generated during configuration, eg:

```yaml
---
# Below is the Front-matter configuration
prompt:
  description: |-
    You are Dobby in Harry Potter set.
  messages:
    - role: system
      content: {{description}}
---
# Below is the script content
```

It can also be generated during script execution, eg:

```yaml
---
# Below is the Front-matter configuration
prompt:
  # The data source for template
  description: |-
    You are Dobby in Harry Potter set.
---
# Below is the script content
system: "{{description}}"
```

## Script Inheritance

PPE enables defining custom script types (`type: type`) for script reuse and configuration inheritance.

Scripts can inherit code and configurations from another script through the `type` property. Here’s an example of creating a character named “Dobby”:

```yaml
---
# This script inherits from the "char" type
type: char
# Specific settings for the "char" type
# Character's name
name: "Dobby"
# Description of the character
description: "Dobby is a house-elf in the Harry Potter universe."
---
# User's question
user: "Who are you?"
---
# Response based on the character's settings
assistant: "I am Dobby. Dobby is very happy."
```

First, we create a basic character type script called `char`, which the above script will inherit from:

```yaml
---
# Indicates this is a type definition script
type: type
# Input configuration required for this character type
input:
  - name: {required: true}  # Required information: character's name
  - description             # Optional information: character's description
---
# System instructions based on the provided information
system: |-
  You are an intelligent and versatile role player.
  Your task is to flawlessly role-play according to the information provided below.
  Please speak as if you were {{name}}.
  You are {{name}}.

  {{description}}
```

## Invocation of External Scripts

### Chains Invocation of Agent Scripts Or Instructions

Within messages, results can be forwarded to other agents.

If no parameters are specified, the AI outcome will be passed as the `content` parameter to the agent. For instance,

`list-expression.ai.yaml`:

```yaml
system: Only list the calculation expression, do not calculate the result
---
user: "Three candies plus five candies."
assistant: "[[CalcExpression]]"
# The actual input to the agent in this case is: {content: "[AI-generated calculation expression]"}
-> calculator
$echo: "#A total of {{LatestResult}} pieces of candy"
```

`calculator.ai.yaml`:


```yaml
---
# Below is the front-matter configuration
parameters:
  response_format:
    type: "json"
output:
  type: "number"
---
# Below is the script
system: Please as a calculator to calculate the result of the following expression. Only output the result.
--- # mark the beginning of new dialogue
user: "{{content}}"
```

When parameters are included, the AI `content` is combined with these parameters and forwarded together to the agent. For example,

```yaml
user: "Tell me a joke!"
assistant: "[[JOKE]]"
# The actual input to the agent here is: {content: "[This is a joke generated by AI]", target_lang: "Portuguese"}
-> translator(target_lang="Portuguese") -> $print
```

**Note**:

* Call internal instruction with `$` prefix
* If the script returns a value of type `string`/`boolean`/`number`, that return value will be placed to the `content` field. If the return value is an `object`, its contents will be directly passed to the agent.

### External Script Invocation Formatting

In messages, we support content substitution by invoking scripts or instructions. The script or instructions must return a string value. For example:

```yaml
# the `#` prefix means immediate formatting
# call the `calculator.ai.yaml` script with the parameter '5+2'
user: "#five plus two equals [[@calculator('5+2')]]"
```

Notes:

* The prefix `#` indicates immediate formatting of the string.
* The Invocation formatting should be placed within two square brackets. The prefix `@` indicates calling an external script with the ID `calculator`. if there are no parameters, you must omit the parentheses.
* If placed within text, ensure there is at least one space before and after. Extra spaces will be removed after substitution.

Here’s an example of how to load a file and generate a summary using this method:

```yaml
user: |-
  Generate a summary for the following file:
  [[@file(file.txt)]]
```
