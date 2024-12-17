# Programmable Prompt Engine (PPE) Script Runtime Libraries 🤖

This directory contains a collection of Programmable Prompt Engine (PPE) Script Runtime Library files.

## char type

**Introduction:**

This script defines a new "char" type for Programmable Prompt Engine (PPE). The "char" type enables the description and embodiment of fictional characters within a conversational setting.

**Key Functionalities:**

* **Character Definition:** Allows users to specify a character's name, description, and additional characteristics (e.g., birthdate, personality traits) through a structured YAML format.
* **Role-Playing:**  Facilitates LLM-driven role-playing where the model interacts as the defined character.
* **Contextualization:** Provides system prompts to guide the LLM in adopting a character persona and engaging in natural dialogue.

**Input/Output Configuration:**

This script defines a type that can be used to describe character. In other scripts, refer to this type by setting `type: char`.
For the character type scripts, the following fields need to be configured:

* name: character name, required
* description: character specific description
* character: other characteristic object of the character

Usage: In your script, set `type: char` in front-matter configuration to use this type. eg:

```yaml
---
name: Dobby
type: char
description: A friendly house elf.
character:
  birth:
    date: "28 June (year unknown)"
---
user: Who are you?
# the following messages will be shown in the chat under the `---`
---
assistant: I am Dobby. Dobby is happy.
```

## file

**Introduction:**

This file defines a simple text file/url loader library for the Programmable Prompt Engine (PPE).

**Key Functionality:**

* **Loads text files:** Reads the contents of text files specified by a file path or url.
* **Environment Variable Support:** Allows use of environment variables within file paths (e.g., "$HOME/documents/document.md").
* **Prompt Integration:** Designed to be integrated into PPE prompts, allowing users to reference file content directly within prompts (e.g., `user: summary the following file content: [[@file(document.md)]]`).

**Input Configuration:**

* **`content`:** (Required) A string representing the file path to be loaded.

**Output Configuration:**

* **`type: "string"`:** Returns the loaded file content as a string. The output is formatted with the filename and file content separated by a newline.

**Usage Example:**

```yaml
user: summary the following file content: [[@file(document.md)]]
```

This prompt instructs the PPE to load the content of "document.md" and then summarize the loaded text.

**Workflow:**

1. The PPE encounters the `[[@file(document.md)]]` directive in the prompt.
2. The PPE invokes the `file.ai.yaml` library.
3. The library uses the `loadFile()` function to read the file content from "document.md" (resolving any environment variables in the path).
4. The loaded content is returned as a string, formatted with the filename and content.
5. The PPE continues processing the prompt, now with access to the loaded file content.

## json

The `json.ai.yaml` file defines a Programmable Prompt Engine (PPE) script runtime library for extracting content from an input string and structuring it as a JSON object according to a user-specified JSON schema.

**Key Features:**

* **JSON Extraction:** Extracts content from a string input (`content`) and converts it into a JSON object.
* **Schema-Driven:** Utilizes a user-defined JSON schema (`output`) to dictate the structure and types of fields within the generated JSON object.

**Input/Output Configuration:**

* **Input:**
  * `content`: The raw text string containing the data to be extracted.
  * `output`: A YAML representation of a JSON schema, specifying the structure and data types for the output JSON object.
* **Output:** A JSON object containing the extracted data, structured according to the provided JSON schema.

**Usage Example:**

```yaml
---
# define your JSON Schema
output:
  type: "object"
  properties:
    name:
      type: "string"
    age:
      type: "integer"
---
...
assistant: "[[THE_CONTENT]]"
# the assistant's response and output will be passed into the `json` script:
-> json(output=output)
```

In this example, the `json` script will extract data from the assistant's response and structure it as a JSON object with two fields: `name` (string) and `age` (integer), according to the provided JSON schema.

**Workflow:**

1. **Define JSON Schema:** The user specifies a JSON schema in the `output` field, defining the structure and data types of the desired JSON output.
2. **Extract Content:** The PPE script receives the raw content (`content`) from a preceding step, such as an assistant's response.
3. **Apply Schema:** The script applies the JSON schema to the extracted content, converting it into a structured JSON object.
4. **Output JSON:** The script outputs the generated JSON object, conforming to the user-defined schema.

## summary

**Introduction:**

This file defines a Programmable Prompt Engine (PPE) Script Runtime Library for text summarization. It's a powerful tool designed to condense large chunks of text into concise, informative summaries.

**Key Functionality:**

- **Summarization:** The core function is to generate detailed summaries of provided text content, capturing the key points and main themes.
- **File Input:** It allows for input via either direct text content or a file path, making it versatile for various use cases.
- **Length Control:**  An optional "len" parameter enables users to specify an approximate maximum length for the generated summary.

**Input Configuration:**

The library accepts the following input parameters:

- **content:** The text content to be summarized.
- **file:**  The file path to a text document. The library will load the content from the file if this parameter is provided.
- **len:** An optional integer specifying the desired maximum length of the summary (not strictly enforced but provides an approximate target).

**Output Configuration:**

- **type:** "string" - The output will be a string containing the generated summary.

**Usage Examples:**

The library provides two usage examples:

1. **Prompt Integration:**  Embed the summarization functionality within a prompt by using `@summary(file=document.md)`.

2. **Direct Execution:** Run the library using the command line:

 ```bash
 $ai run -f summary "{file: 'document.md'}"
 ```

**Workflow:**

1. **Input:** The library receives either text content directly or a file path.
2. **File Loading (if applicable):** If a file path is provided, the content is loaded from the file.
3. **Summarization:** The text content is processed to generate a concise summary capturing the key points and essence.
4. **Length Adjustment (optional):** If the "len" parameter is provided, the summary's length is adjusted accordingly, though the result is an approximation.
5. **Output:** The generated summary is returned as a string.

## titleify

**Introduction:** This Programmable Prompt Engine (PPE) Script Runtime Library file defines a function called "titleify" that automatically generates concise and informative titles for given text content.

**Key Functional Points:**

* **Summarization:**  The core function is to summarize input text (either directly provided or loaded from a file) and extract the most representative title.
* **Flexibility:** Accepts both direct text input ("content") and file paths ("file").
* **Length Control:** An optional "len" parameter allows users to specify an approximate maximum length for the generated title.

**Input/Output Configuration:**

* **Input:**
  * "content": The text to be titleified.
  * "file": The path to a text file containing the content.
  * "len": (Optional) An integer specifying the desired maximum title length (approximate).
* **Output:**  A single string representing the generated title.

**Usage Example:**

* **Inline Prompt:** `Title: [[@titleify(file=document.md)]]`
* **Command-Line Execution:**

  ```bash
  $ai run -f titleify "{file: 'document.md'}"
  ```

**Workflow:**

1. **Input Processing:** The script first checks if a "file" input is provided. If so, it loads the content from the specified file path using the `[[@file()]]` function.
2. **Summarization:** The loaded content is then passed to a summarization engine (represented by `[[titles:max_tokens=len]]`). This engine likely utilizes a large language model to generate several potential titles based on the input text and the desired length.
3. **Title Selection:** The script interacts with the user (in an interactive mode) to select the best title from the generated options.
4. **Output:** Finally, the chosen title is returned as the output of the "titleify" function.

## translator

This file defines a Programmable Prompt Engine (PPE) library named "Translator" designed for translating text between languages.

**Key Functionalities:**

- Translates text content or the content of a file into a specified target language.
- Supports both direct invocation and integration within prompts.
- Detects the source language automatically if not provided.

**Input Configuration:**

- `lang`: (Optional) The language of the input content. Defaults to "auto" for automatic detection.
- `file`: (Optional) The file path containing the text to be translated.

- `content`: (Optional) The text to be translated.

- `target`: (Required) The target language for translation.

**Output Configuration:**

- Returns an object with the following properties:

  - `target_text`: The translated text.

  - `source_text`: The original text.
  - `source_lang`: The detected source language.
  - `target_lang`: The target language.

**Usage Examples:**

- **Direct invocation:**

```bash
$ai run --no-chats -f translator "{content:'我爱我的祖国和故乡.', target: 'English'}"
```

- **Integration within a prompt:**

```yaml
assistant: "Translate: [[@translator(file='document.md', target='English')]]"
```

**Workflow:**

1. The library first checks if a file path is provided. If so, it loads the content from the file.
2. If the source language is not specified, it attempts to automatically detect it.
3. It then constructs a prompt for a language model, instructing it to translate the input text into the target language.
4. The translated text, along with the original text, source language, and target language, are returned as an object.

## url

**Introduction:**

This file defines a simple fetch url library for the Programmable Prompt Engine (PPE).

**Key Functionality:**

* **Loads web content from url:** Reads the content specified by a url path.
* **Prompt Integration:** Designed to be integrated into PPE prompts, allowing users to reference url content directly within prompts (e.g., `user: summary the following web page: [[@url("https://example.com/page.html")]]`).

**Input Configuration:**

* **`content`:** (Required) A string representing the url to fetch.

**Output Configuration:**

* **`type: "string"`:** Returns the loaded web content as a string. The output is formatted with the `web url` and `web content` separated by a newline.

**Usage Example:**

```yaml
user: summary the following web content: [[@url("https://example.com/page.html")]]
```

This prompt instructs the PPE to load the content from "https://example.com/page.html" and then summarize the loaded text.
