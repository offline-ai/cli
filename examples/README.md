# Examples

* `calculator`: a simple calculator demo agent to demo use the `->` call the external script.
  * **Purpose:**  It demonstrates how to use an LLM to calculate mathematical expressions.
  * **Workflow:**
    * The LLM receives a mathematical expression as input (`content`).
    * It processes the expression and outputs a thought process (`thinking`).
    * A separate script (`extract-calc-result`) then extracts the final calculated result from the LLM's output.
* `extract-calc-result`: This file defines an AI workflow for extracting the result of a calculated math problem from a given text.
  * **Input:**  The script receives the LLM's output (`content`) as input.
  * **Output:** The script outputs a JSON object containing:
    * **`result`**: The final calculated result (can be a number, object, boolean, or string).
    * **`steps`**:  A list of steps taken by the LLM during the calculation process.
    * **`answer`**: The LLM's final answer, which can also be a number or string.
* `resolve-math-problem.ai`: demo to resolve the math problem.
  * **Input:**  Takes a user's math problem as a string.
  * **System:**  Instructs the AI to analyze the problem carefully, break it down step-by-step, and accurately identify key relationships to arrive at the solution.
  * **Workflow:**
    * If a `content` is provided, it assumes an API call and starts the problem-solving process.
    * If no `content` is provided, it greets the user and introduces itself as a math assistant.
* `call-translator`: It aims to showcase how to invoke the `translator` script.
* `char-dobby`: the character agent demo.
* `recipe`: a Multilingual Recipe Assistant demo
  * **Key Features:**
    * **Multilingual Support:** The agent can understand and respond in multiple languages, as specified by the user's `lang` input.
    * **Cuisine Specificity:** Users can request recipes from a specific cuisine type, indicated by the `cuisine` input.
    * **Ingredient-Based Recommendations:** The core functionality is to suggest recipes based on a list of available ingredients provided by the user in the `ingredients` input.
    * **JSON Output Format:** The agent can optionally output its response in JSON format, controlled by the `json` input.
  * **Input:**
    * `ingredients`: A list of strings representing the available ingredients.
    * `cuisine`: (Optional) A string specifying the desired cuisine type.
    * `lang`: (Optional) A string indicating the user's preferred language.
    * `json`: (Optional) A boolean flag indicating whether JSON output is desired.
  * **Output:**
    * An array of recipe objects, each containing:
      * `recipeName`: A string representing the name of the recipe.
      * `instructions`: An array of strings outlining the cooking steps.
      * `ingredients`: An array of ingredient objects, each with `name` and `amount` properties.
      * `reason`: A string explaining the rationale behind the recipe suggestion.
* `translator-simple`: a simple translator agent demo.
  * **Translation Task:** The primary function is to translate text from one language to another.
  * **Input:** The AI takes three main inputs:
    * `content`: The text to be translated (required).
    * `target`: The target language for the translation (required).
    * `lang`: The original language of the content (optional).
  * **Output:** The AI returns a JSON object containing:
    * `translation`: The translated text.
    * `original`: The original text.
    * `lang`: The original language.
    * `target_lang`: The target language.
    * `reason`: A string explaining the translation process (optional).
  * **Parameters:**
    * `continueOnLengthLimit`:  Allows translation to continue even if the text exceeds a length limit.
    * `maxRetry`: Specifies the maximum number of retries for the translation.
    * `response_format`: Sets the output format to JSON.
