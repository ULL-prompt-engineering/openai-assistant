# Learning the OpenAI Assistants API

## Folders in this Repo

- [assistant-function-calling](assistant-function-calling/README.md)
- [fernando-assistant-function-calling](fernando-assistant-function-calling/README.md)
- [assistants-and-playground](assistants-and-playground/README.md)

## Assistants

1. Assistants can call OpenAI’s [models](https://platform.openai.com/docs/models) with specific instructions to tune their personality and capabilities.
2. Assistants can access **multiple tools in parallel**. These can be both 
   1. OpenAI-hosted tools — like [Code interpreter](https://platform.openai.com/docs/assistants/tools/code-interpreter) and [Knowledge retrieval](https://platform.openai.com/docs/assistants/tools/knowledge-retrieval) or 
   2. tools you build / host (via [Function calling](https://platform.openai.com/docs/assistants/tools/function-calling)).
3. Assistants can access **persistent Threads**. Threads simplify AI application development by storing message history and truncating it when the conversation gets too long for the model’s context length. You create a Thread once, and simply append Messages to it as your users reply.
4. Assistants can access [Files](https://platform.openai.com/docs/assistants/tools/supported-files) in several formats — either as part of their creation or as part of Threads between Assistants and users. When using tools, Assistants can also create files (e.g., images, spreadsheets, etc) and cite files they reference in the Messages they create.

## References

### Assistant Function Calling

* Build a chatbot with the new OpenAI Assistant API and Function Calling: <https://dev.to/esponges/build-the-new-openai-assistant-with-function-calling-52f5> by Fernando González Tostado Nov 14 2023.
  * Repo: <https://github.com/esponges/openai-beta-assistant>
* Cookbook. Assistants API Overview (Python SDK): <https://cookbook.openai.com/examples/assistants_api_overview_python>
* Tutorial: Get started with the new OpenAI Assistants API by Ralf Elfving <https://medium.com/@ralfelfving/tutorial-get-started-with-the-new-openai-assistants-api-7049c2517bfe>

### Assistants and Playground

* <https://platform.openai.com/docs/assistants/overview?lang=node.js>
* See <https://youtu.be/BqnyGSLQMS8?si=1sMWH-CB5RWFyRAf> "OpenAI Assistants API Tutorial - Playground & NodeJS" at Youtube
* [OpenAI Assistants API Tutorial - Playground & NodeJS](https://youtu.be/BqnyGSLQMS8?si=zaZFYXBQPVVhZn6U) https://youtu.be/BqnyGSLQMS8?si=zaZFYXBQPVVhZn6U