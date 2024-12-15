# [Programmable Prompt Engine Language](./lang.md)

Programmable Prompt Engine(PPE) Language is a message-processing language, similar to the YAML format.

PPE is designed to define AI prompt messages and their input/output configurations. It allows for the creation of a reusable and programmable prompt system akin to software engineering practices.

## PPE Language Key Points

* Scripts use streaming output for LLM (`$AI`) responses by default.
* The script's final instruction's output determines its return value.
* Scripts automatically call the LLM (`$AI`) at the end if the messages of prompt is present and $AI hasn't been invoked. This behavior is controlled by the `autoRunLLMIfPromptAvailable` setting.

## Core Structure

* Message-Based: PPE defines interactions as a series of messages with roles for structured dialogue.
* YAML-Like: Syntax is similar to YAML, making it readable and easy to understand.

### Role-Based Messaging

Each line represents a message in the prompt, with roles (e.g., "`system`," "`assistant`," "`user`") specified using the format "`role`: message". Omitting the role defaults to a user message.
Clearly distinguish different message types (`system` instructions, `user` inputs, `assistant` responses)

```yaml
system: "You are an AI assistant."
# It's user message without role.
"What is 10 + 18?"
```

### Dialogue Separation

Triple dashes (`---`) or asterisks (`***`) delineate new dialogue turns, clearing the previous conversation context.

`test.ai.yaml`:

```yaml
system: "You're an AI."
# This mark the beginning of the first dialogue.
# The content above this line can be considered as system prompt instructions,
# which will not be outputted or recorded.
---
user: What's 10 plus 18?
assistant: "[[result]]"   # Executes the AI, replace the result which return by AI
$print: "?=result"        # Prints AI response
---                       # New dialogue starts here
user: What's 10 plus 12?
assistant: "[[result]]"   # Executes the AI, replace the result which return by AI
```

The result:

```bash
$ai run -f test.ai.yaml --no-stream
" 10 plus 18 equals 28."
 10 plus 12 equals 22.
```

## Prompt Engineering Power

### Reusable Prompts

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

### Message Text Formatting and Manipulation

The role messages can be formatted using Jinja2 templates and advanced replacement features.

* **Jinja2 Templates:**  Variables from input configuration or prompt settings can be referenced using double curly braces (e.g., `{{name}}`).
* **Advanced AI Replacement:** Double brackets (e.g., `[[Answer]]`) trigger AI execution, returning the AI's response and assigning it to the `prompt.Answer` variable.
  * **AI Parameter Passing:** AI parameters can be passed within double brackets (e.g., `[[Answer:temperature=0.7]]`).
  * **Constrained AI Responses:** Double brackets can enforce that AI responses are limited to specific options (e.g., `[[FRUITS:|Apple|Banana]]`).
* **Script and Instruction Replacement:** call the script or instruction in the message text. The script or instruction's output is then replaced into the message text.
  * **External Script Replacement:** External scripts can be invoked using the `@` symbol (e.g., `@say_hi_script(param1=value1, p2=v2)`, it will be replaced by `hi`).
  * **Internal Instruction Replacement:**  Internal instructions can be called and replaced similarly (e.g., `@$instruction(param1=value1)`).
* **Regular Expression Replacement:** `/RegExp/[RegOpts]:Answer[:index_or_group_name]` allows for pattern-based replacement on the `Answer` variable.

### Chaining and Script Function Calls

* The `->` operator chains script outputs as inputs to subsequent external scripts.
* The `$` prefix calls script instructions (e.g., `$fn: {param1:value1}`).

### Script Extension

* The `!fn` directive allows declaring JavaScript functions to extend script functionality.
* [`import` configuration](https://github.com/offline-ai/ppe/tree/main?tab=readme-ov-file#import) allows importing external scripts and modules.

### Custom Script Types

PPE enables defining custom script types (`type: type`) for code reuse and configuration inheritance.
