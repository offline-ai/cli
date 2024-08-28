# Programmable Prompt Engine Language Message Text Formatting

Programmable Prompt Engine (PPE) Language is a message-processing language, similar to the YAML format.

PPE is designed to define AI prompt messages and their input/output configurations. It allows for the creation of a reusable and programmable prompt system akin to software engineering practices.

* Message-Based: PPE revolves around defining interactions as a series of messages. Each message has a `role` (e.g., `system`, `assistant`, `user`) and the actual `message content`.
* YAML-Like: PPE uses a syntax similar to YAML, making it human-readable and relatively easy to learn.
* Dialogue Separation: Triple dashes (`---`) or asterisks (`***`) clearly mark the beginning of new dialogue turns, ensuring context is managed effectively.

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

## Advanced AI Substitutions

Double square brackets (e.g., `[[Answer]]`) trigger AI execution, returning the AI's response and assigning it to the `prompt.Answer` variable.

```yaml
system: "You are a calculator. Output result only."
user: "What is 10 + 18?"
assistant: "[[Answer]]"
# Accesses the AI-generated content stored in prompt
# Note: The output of the last instruction in a script determines the script's final return value, so `$echo` is not needed.
# $echo: "?=prompt.Answer"
```

This mechanism allows for dynamic content insertion based on AI responses.

In this example the AI's content is stored in the `prompt.Answer` variable. The assistant's message will also be replaced with:

```bash
$ai run -f test.ai.yaml
28
```

### AI Parameter Control

Fine-tune AI behavior by passing parameters within double brackets (e.g., `[[Answer:temperature=0.7]]`).

**Note**:

* If there is no advanced AI replacement (`[[VAR]]`), the last AI return result will still be stored in `prompt.RESPONSE`. This means that there will be a `[[RESPONSE]]` template variable by default, which can be used to access the AI's return value.
* If parameters are needed, they should be placed after the colon, with multiple parameters separated by commas. eg, `[[RESPONSE:temperature=0.01,top_p=0.8]]`

### Constrained AI Responses

Limit AI Response to Predefined Options.

To restrict the AI's response to only select from a list or choose randomly from local options, use the following format: `[[FRUITS: |apple|apple|orange]]`. This means the AI can only pick one of these three: apple, apple, or orange. If want to select 1-2 options, use `[[FRUITS:|apple|banana|orange:2]]`

If you want to select one randomly from the list using the computer's local random number generator (not the AI), include the `type=random` parameter: `[[FRUITS:|apple|banana|orange:type=random]]`. You can use the shorthand version: `[[FRUITS:|apple|banana|orange:random]]`.

## External Script Invocation Formatting

In messages, we support content substitution by invoking scripts or instructions. The script or instructions must return a string value. For example:

```yaml
user: "#five plus two equals @calculator(5+2)"
```

Notes:

* The prefix `#` indicates immediate formatting of the string.
* The prefix `@` indicates calling an external script with the ID `calculator`. if there are no parameters, you must omit the parentheses.
* If placed within text, ensure there is at least one space before and after. Extra spaces will be removed after substitution.

Here’s an example of how to load a file and generate a summary using this method:

```yaml
user: |-
  Generate a summary for the following file:
  @file(file.txt)
```

## Internal Instruction Invocation Formatting

Internal Instruction Invocation Formatting similarly External Script Invocation Formatting. just add `$` prefix. To call an internal instruction, use the prefix `$`, such as `@$echo`; eg: `@$echo("hi world")`

```yaml
# define a internal instruction by javascript function
!fn |-
  function inc(n) {
    return n + 1
  }
user: "3 increment 1 is: @$inc(3)"
```

## Regular Expression (RegExp) Formatting

You can use regular expressions in messages with the format `/RegExp/[opts]:VAR[:index_or_group_name]` for content replacement. For example:

```yaml
user: |-
  Output the result, wrapped in '<RESULT></RESULT>'
assistant: "[[Answer]]"
---
user: "Based on the following content: /<RESULT>(.+)</RESULT>/:Answer"
```

Parameter descriptions:

* `RegExp`: The regular expression string
* `opts`: Optional parameters used to specify matching options for the regular expression. For example, opts could be i, indicating case-insensitive matching.
* `VAR`: The content to replace, here it is the `Answer` variable that holds the assistant's response.
* `index_or_group_name`: An optional parameter indicating which part of the match from the regular expression should be replaced. This can be a capture group index number (starting from 1) or a named capture group.
  * When this parameter is absent: If there are capturing group, the default is index 1; if there are no capturing, the default is the entire match.

Notes:

* In the message, the regular expression must be separated from other content by spaces.
* If there is no match, the content of `VAR` is returned directly.
