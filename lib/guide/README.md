# Programmable Prompt Engine (PPE) Script Guide

## [Programmable Prompt Engine(PPE) CLI Command](./cli.md)

`ai` is the shell CLI command to manage the brain(LLM) files and run a PPE script mainly.

* Run script file command `ai run`, eg, `ai run -f calculator.ai.yaml "{content: '32+12*53'}"`
  * `-f` is used to specify the script file.
  * `{content: '32+12*53'}` is the optional json input to the script.
  * Scripts will display intermediate echo outputs during processing when streaming output. This can be controlled with `--streamEcho true|line|false`.  To keep the displayed echo outputs, use `--no-consoleClear`.
  * Script can be single YAML file (`.ai.yaml`) or directory.
    * Directory must have an entry point script file with the same name as the directory. Other scripts in the directory can call each other.
* Manage the brain files command `ai brain` include `ai brain download`, `ai brain list/search`.
* Run `ai help` or `ai help [command]` to get more.

## [Programmable Prompt Engine Language](./lang.md)

Programmable Prompt Engine (PPE) Language is a message-processing language, similar to the YAML format.

PPE is designed to define AI prompt messages and their input/output configurations. It allows for the creation of a reusable and programmable prompt system akin to software engineering practices.

### [Programmable Prompt Engine Language - Core Structure](./lang-core.md)

* Message-Based Dialogue: Defines interactions as a series of messages with roles (system, user, assistant).
* YAML-Like: Syntax is similar to YAML, making it readable and easy to understand.
* Dialogue Separation: Uses triple dashes (`---`) or asterisks (`***`) to clearly mark dialogue turns.

### [Programmable Prompt Engine Language - Reusability & Configuration](./lang-reuse.md)

* **Input/Output Configuration (Front-Matter):** Defines input requirements (using `input` keyword) and expected output format (using `output` keyword with JSON Schema).
* **Prompt Template:** Embeds variables from input configuration or prompt settings into messages using Jinja2 templates (`{{variable_name}}`).
* **Custom Script Types:** Allows defining reusable script types (`type: type`) for code and configuration inheritance.

### [Programmable Prompt Engine Language - AI Capabilities](./lang-ai.md)

* **Advanced AI Replacement:** Use double brackets (`[[Response]]`) to trigger AI execution, store the response in a variable (`prompt.Response`), and use it within the script.
* **AI Parameter Control:** Fine-tune AI behavior by passing parameters within double brackets (e.g., `[[Answer:temperature=0.7]]`).
* **Constrained AI Responses:** Limit AI outputs to a predefined set of options (e.g., `[[FRUITS:|Apple|Banana]]`).

#### [Programmable Prompt Engine Language - Message Text Formatting](./lang-formatting.md)

The role messages can be formatted using Jinja2 templates and advanced replacement features.

* **Jinja2 Templates:**  Reference variables from input configuration or prompt settings using double curly braces (e.g., `{{name}}`).
* **Advanced AI Replacement:** As described above, triggers AI execution and stores the response.
* **External Script Replacement:**  Invoke external scripts using the `@` symbol (e.g., `@say_hi_script(param1=value1)`).
* **Internal Instruction Replacement:**  Call internal instructions similarly (e.g., `@$instruction(param1=value1)`).
* **Regular Expression Replacement:** Use `/RegExp/[RegOpts]:Answer[:index_or_group_name]` for pattern-based replacement on the `Answer` variable.

### [Programmable Prompt Engine Language - Script Capabilities](./lang-script.md)

* **Chaining Outputs:** The `->` operator connect script outputs to subsequent instructions or scripts, creating complex workflows.
* **Instruction Invocation:** The `$` prefix calls script instructions (e.g., `$fn: {param1:value1}`).
* **Control Flow:** Directives like `$if`, `$pipe`, `$set`, `$get`, `$print`, `$echo` provide control flow mechanisms.
* **Event-Driven Architecture:** Functions like `$on`, `$once`, `$emit` and `$off` enable event-based programming for flexible script behavior.
* **JavaScript Extension:** The `!fn` directive allows declaring JavaScript functions to extend script functionality.

### VI. Execution & Output

* **Streaming Output:** PPE scripts use streaming output by default for LLM responses.
* **Auto LLM Execution:** If a script contains prompt messages (`system`, `user`) and the LLM (`$AI`) hasn't been invoked, PPE will automatically call the LLM at the end.
* **Final Instruction Output:** The output of the last instruction in a script determines the script's final return value.

## [Examples Code Analysis](../examples/)

A series of examples are provided in the `examples` directory for the language learning.

`calculator.ai.yaml`:

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

## [Built-in Libraries Code Analysis](../lib/)

PPE provides a series of built-in libraries in the `lib` directory for common tasks. These libraries can also be regarded as code examples of the language.
