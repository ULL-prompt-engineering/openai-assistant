# Assistants 

## Reference

* <https://platform.openai.com/docs/assistants/overview?lang=node.js>
* <https://platform.openai.com/playground?assistant=asst_ZG6Cq4ic0J40UBkeMS50ssDA&mode=assistant&thread=thread_E6YhgNVnFUeQvNN6Ekr7tRl9>
* <https://youtu.be/BqnyGSLQMS8?si=1sMWH-CB5RWFyRAf> OpenAI Assistants API Tutorial - Playground & NodeJS Youtube

* [OpenAI Assistants API Tutorial - Playground & NodeJS](https://youtu.be/BqnyGSLQMS8?si=zaZFYXBQPVVhZn6U) https://youtu.be/BqnyGSLQMS8?si=zaZFYXBQPVVhZn6U

## OpenAI Playground

<https://platform.openai.com/playground>

### Left Panel

- Assistant:
  - functions: Function calling lets you describe custom functions of your app or external APIs to the assistant. This allows the assistant to intelligently call those functions by outputting a JSON object containing relevant arguments. 
  - See <https://platform.openai.com/docs/assistants/overview> for more information. This starter guide walks through the key steps to create and run an Assistant that uses [Code Interpreter](https://platform.openai.com/docs/assistants/tools/code-interpreter).
  - Code interpreter: [Code Interpreter](https://platform.openai.com/docs/assistants/tools/code-interpreter) enables the assistant to write and run code. This tool can process files with diverse data and formatting, and generate files such as graphs

## Assistants API

The Assistants API allows you to build AI assistants within your own applications. An Assistant has instructions and can leverage models, [tools](https://platform.openai.com/docs/assistants/tools), and knowledge to respond to user queries. The Assistants API currently supports three types of [tools](https://platform.openai.com/docs/assistants/tools): 

1. Code Interpreter, 
2. Retrieval, and 
3. Function calling. 

You can explore the capabilities of the Assistants API using the Assistants playground or by building a step-by-step integration outlined in this guide. At a high level, a typical integration of the Assistants API has the following flow:

1. Create an Assistant in the API by defining its custom instructions and picking a model. If helpful, enable tools like Code Interpreter, Retrieval, and Function calling.
2. Create a Thread when a user starts a conversation.
3. Add Messages to the Thread as the user ask questions.
4. Run the Assistant on the Thread to trigger responses. This automatically calls the relevant tools.

The Assistants API is in **beta** and we are actively working on adding more functionality. Share your feedback in our Developer Forum!

This starter guide walks through the key steps to create and run an Assistant that uses Code Interpreter.


### Assistants playground

In addition to the [Assistants API](https://platform.openai.com/docs/api-reference/assistants), we also provide an [Assistants playground](https://platform.openai.com/playground?mode=assistant) (sign in required). The playground is a great way to explore the capabilities of the Assistants API and learn how to build your own Assistant without writing any code.

### Step 1: Create an Assistant

An Assistant represents an entity that can be configured to respond to users’ Messages using several parameters like:

- **Instructions**: how the Assistant and model should behave or respond
- **Model**: you can specify any GPT-3.5 or GPT-4 models, including fine-tuned models. The Retrieval tool requires gpt-3.5-turbo-1106 and gpt-4-1106-preview models.
- **Tools**: the API supports Code Interpreter and Retrieval that are built and hosted by OpenAI.
- **Functions**: the API allows you to define custom function signatures, with similar behavior as OpenAI [function calling](https://platform.openai.com/docs/guides/function-calling) feature.

In this example, we're [creating an Assistant](https://platform.openai.com/docs/api-reference/assistants/createAssistant) that is a **personal math tutor**, with the Code Interpreter tool enabled:

Calls to the Assistants API require that you pass a *beta HTTP header*. This is handled automatically if you’re using OpenAI’s official Python or Node.js SDKs.

```yml
OpenAI-Beta: assistants=v1
```

For instance:

```js 
const assistant = await openai.beta.assistants.create({
  name: "Math Tutor",
  instructions: "You are a personal math tutor. Write and run code to answer math questions.",
  tools: [{ type: "code_interpreter" }],
  model: "gpt-4-1106-preview"
});
```

### Step 2: Create a Thread

A Thread represents a conversation. We recommend [creating one Thread](https://platform.openai.com/docs/api-reference/threads/createThread) per user as soon as the user initiates the conversation. Pass any user-specific context and files in this thread by [creating Messages](https://platform.openai.com/docs/api-reference/messages/createMessage).

```js
const thread = await openai.beta.threads.create();
```

Threads don’t have a size limit. You can pass as many Messages as you want to a Thread. 

The API will ensure that requests to the model fit within the maximum context window, 
using relevant optimization techniques such as truncation.

### Step 3: Add a Message to a Thread

A Message contains text, and optionally any [files](https://platform.openai.com/docs/assistants/tools/supported-files) that you allow the user to upload. 

[Messages need to be added to a specific Thread](https://platform.openai.com/docs/api-reference/messages/createMessage). 

```js
const message = await openai.beta.threads.messages.create(
  thread.id,
  {
    role: "user",
    content: "I need to solve the equation `3x + 11 = 14`. Can you help me?"
  }
);
```

Now if you [list Messages in Thread](https://platform.openai.com/docs/api-reference/messages/listMessages), 
you will see that this message is added to the thread on creation:

```js
{
  "object": "list",
  "data": [
    {
      "created_at": 1696995451,
      "id": "msg_4rb1Skx3XgQZEe4PHVRFQhr0",
      "object": "thread.message",
      "thread_id": "thread_34p0sfdas0823smfv",
      "role": "user",
      "content": [{
        "type": "text",
        "text": {
          "value": "I need to solve the equation `3x + 11 = 14`. Can you help me?",
          "annotations": []
        }
          }],
        ...
```

### Step 4: Run the Assistant

For the Assistant to respond to the user message, you need to [create a Run](https://platform.openai.com/docs/api-reference/runs/createRun). This makes the Assistant read the Thread and decide whether to call tools (if they are enabled) or simply use the model to best answer the query. As the run progresses, the assistant appends Messages to the thread with the `role="assistant"`.

You can [optionally pass additional instructions](https://platform.openai.com/docs/api-reference/runs/createRun#runs-createrun-instructions) to the Assistant while creating the Run but note that these instructions override the default instructions of the Assistant:

```js
const run = await openai.beta.threads.runs.create(
  thread.id,
  { 
    assistant_id: assistant.id,
    instructions: "Please address the user as Jane Doe. The user has a premium account."
  }
);
```

### Step 5: Check the Run status

This creates a Run in a queued status. You can periodically [retrieve the Run](https://platform.openai.com/docs/api-reference/runs/getRun) to check on its [status](https://platform.openai.com/docs/assistants/how-it-works/run-lifecycle) to see if it has moved to completed.

```js
const run = await openai.beta.threads.runs.retrieve(
  thread.id,
  run.id
);
```

And finally, display them to the user! 
During this Run, the Assistant added two new Messages to the Thread. Here is an example of what that might look like:


|ROLE |	CONTENT |
|:-----|:-------- |
|user | I need to solve the equation 3x + 11 = 14. Can you help me? |
assistant | Certainly, Jane Doe. To solve the equation (3x + 11 = 14) for (x), you'll want to isolate (x) on one side of the equation. Here's how you can do that: 1. Subtract 11 from both sides of the equation to get (3x = 3). 2. Then, divide both sides by 3 to solve for (x). Let me calculate the value of (x) for you. 
| assistant | The solution to the equation (3x + 11 = 14) is (x = 1).|


You can also retrieve the [Run Steps](https://platform.openai.com/docs/api-reference/runs/listRunSteps) of this Run if you'd like to explore or display the inner workings of the Assistant and its tools.