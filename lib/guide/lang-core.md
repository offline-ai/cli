# Programmable Prompt Engine Language - Core Structure

Programmable Prompt Engine (PPE) Language is a message-processing language, similar to the YAML format.

PPE is designed to define AI prompt messages and their input/output configurations. It allows for the creation of a reusable and programmable prompt system akin to software engineering practices.

* Message-Based: PPE revolves around defining interactions as a series of messages. Each message has a `role` (e.g., `system`, `assistant`, `user`) and the actual `message content`.
* YAML-Like: PPE uses a syntax similar to YAML, making it human-readable and relatively easy to learn.
* Dialogue Separation: Triple dashes (`---`) or asterisks (`***`) clearly mark the beginning of new dialogue turns, ensuring context is managed effectively.

## Role-Based Messaging

Each line represents a message in the prompt, with roles (e.g., "`system`," "`assistant`," "`user`") specified using the format "`role`: message". Omitting the role defaults to a user message.
Clearly distinguish different message types (`system` instructions, `user` inputs, `assistant` responses)

```yaml
system: "You are an AI assistant."
# It's user message without role. equivalent to `user: "What is 10 + 18?"`
"What is 10 + 18?"
```

## Dialogue Separation

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
