# Programmable Prompt Engine Language AI Capabilities

Programmable Prompt Engine (PPE) Language is a message-processing language, similar to the YAML format.

PPE is designed to define AI prompt messages and their input/output configurations. It allows for the creation of a reusable and programmable prompt system akin to software engineering practices.

* Message-Based: PPE revolves around defining interactions as a series of messages. Each message has a `role` (e.g., `system`, `assistant`, `user`) and the actual `message content`.
* YAML-Like: PPE uses a syntax similar to YAML, making it human-readable and relatively easy to learn.
* Dialogue Separation: Triple dashes (`---`) or asterisks (`***`) clearly mark the beginning of new dialogue turns, ensuring context is managed effectively.

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

## AI Parameter Control

Fine-tune AI behavior by passing parameters within double brackets (e.g., `[[Answer:temperature=0.7]]`).

**Note**:

* If there is no advanced AI replacement (`[[VAR]]`), the last AI return result will still be stored in `prompt.RESPONSE`. This means that there will be a `[[RESPONSE]]` template variable by default, which can be used to access the AI's return value.
* If parameters are needed, they should be placed after the colon, with multiple parameters separated by commas. eg, `[[RESPONSE:temperature=0.01,top_p=0.8]]`

## Constrained AI Responses

Limit AI Response to Predefined Options.

To restrict the AI's response to only select from a list or choose randomly from local options, use the following format: `[[FRUITS: |apple|apple|orange]]`. This means the AI can only pick one of these three: apple, apple, or orange. If want to select 1-2 options, use `[[FRUITS:|apple|banana|orange:2]]`

If you want to select one randomly from the list using the computer's local random number generator (not the AI), include the `type=random` parameter: `[[FRUITS:|apple|banana|orange:type=random]]`. You can use the shorthand version: `[[FRUITS:|apple|banana|orange:random]]`.
