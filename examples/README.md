# Programmable Prompt Engine (PPE) Script Examples 🤖

This directory contains a collection of example scripts to demonstrate the capabilities of the Programmable Prompt Engine (PPE). Each example showcases a different use case and highlights how to effectively leverage PPE's features.

## Example Scripts

* **`calculator`:**
  * A simple calculator agent that demonstrates how to use the `->` operator to connect script outputs to subsequent scripts, creating complex workflows.
  * **Workflow:**
    1. The LLM receives a mathematical expression (`content`).
    2. It processes the expression and outputs a thought process (`thinking`).
    3. The `extract-calc-result` script then extracts the final calculated result from the LLM's output.
* **`extract-calc-result`:**
  * This script defines an AI workflow for extracting the result of a calculated math problem from text.
  * **Input:**  The script receives the LLM's output (`content`) as input.
  * **Output:** A JSON object containing:
    * **`result`**: The final calculated result (number, object, boolean, or string).
    * **`steps`**:  A list of steps taken by the LLM during the calculation process.
    * **`answer`**: The LLM's final answer.
* **`resolve-math-problem.ai`:**
  * A demo agent for resolving math problems.
  * **Input:**  Takes a user's math problem as a string.
  * **Workflow:**
    * If `content` is provided, it starts the problem-solving process.
    * If no `content` is provided, it greets the user and introduces itself as a math assistant.
* **`call-translator`:**
  * This example showcases how to invoke the `translator` lib script.
* **`char-dobby`:**
  * An interactive demo featuring a character agent named Dobby.
  * Demonstrates the use of the `type` keyword in the configuration section.
* **`recipe`:**
  * A Multilingual Recipe Assistant demo
  * **Key Features:**
    * **Multilingual Support:** Understands and responds in multiple languages.
    * **Cuisine Specificity:** Provides recipes from a specific cuisine.
    * **Ingredient-Based Recommendations:** Suggests recipes based on available ingredients.
    * **JSON Output Format:** Optionally outputs responses in JSON format.
  * **Input:**
    * `ingredients`: A list of available ingredients.
    * `cuisine`: (Optional) Desired cuisine type.
    * `lang`: (Optional)  User's preferred language.
    * `json`: (Optional) Boolean flag for JSON output.
  * **Output:**
    * An array of recipe objects, each containing:
      * `recipeName`: Name of the recipe.
      * `instructions`: Cooking steps.
      * `ingredients`: Ingredient list with `name` and `amount`.
      * `reason`: Rationale behind the suggestion.
* **`translator-simple`:**
  * A simple translator agent demo.
  * **Translation Task:** Translate text from one language to another.
  * **Input:**
    * `content`: Text to be translated (required).
    * `target`: Target language (required).
    * `lang`: Original language (optional).
  * **Output:**
    * A JSON object containing:
    * `translation`: The translated text.
    * `original`: The original text.
    * `lang`: The original language.
    * `target_lang`: The target language.
    * `reason`: Explanation of the translation process (optional).
  * **Parameters:**
    * `continueOnLengthLimit`:  Allows translation to continue even if the text exceeds a length limit.
    * `maxRetry`: Specifies the maximum number of retries for the translation.
    * `response_format`: Sets the output format to JSON.
