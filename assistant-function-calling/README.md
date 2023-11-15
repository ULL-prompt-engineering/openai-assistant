# Build a chatbot with the new OpenAI Assistant API and Function Calling

## References

* Build a chatbot with the new OpenAI Assistant API and Function Calling: <https://dev.to/esponges/build-the-new-openai-assistant-with-function-calling-52f5> by Fernando González Tostado Nov 14 2023.
  * Repo: <https://github.com/esponges/openai-beta-assistant>
* Cookbook. Assistants API Overview (Python SDK): <https://cookbook.openai.com/examples/assistants_api_overview_python>
* Tutorial: Get started with the new OpenAI Assistants API by Ralf Elfving <https://medium.com/@ralfelfving/tutorial-get-started-with-the-new-openai-assistants-api-7049c2517bfe>

## Execution

```
➜  assistant-function-calling git:(main) ✗ ts-node app.ts

Hello there, I'm a Math assistant. We'll start with a small quiz.

Quiz :
 display_quiz
Question: Explain the difference between a prime number and a composite number.

      _
```

I answered:

```
      A composite number can be expressed as the multiplication of two numbers both different of 1. A prime number is the opposite of a composite number
```

Then the assistant replied with a new question:

```
Question: What is the value of the expression 2^3 × 5^2?

      Options: 200,100,40,80
    _
```
To which I answered:

```
      200
```
    
Then the assistant answered:
    
```
Your responses from the quiz :
 [
  'A composite number can be expressed as the multiplication of two numbers both different of 1. A prime number is the opposite of a composite number\n',
  '200\n'
]
Great job on the first question! You correctly explained that a composite number can be expressed as the product of two numbers that are both different from 1, and that a prime number cannot be divided by any other number besides 1 and itself.

However, there was a slight mistake with the second question. The expression \( 2^3 \times 5^2 \) simplifies to \( 8 \times 25 \), which equals 200, and this is one of the options provided. However, your response seems to indicate that you spotted the correct answer but may have marked it incorrectly. The correct answer you identified is indeed "200". Keep up the good work and always double-check your answers on multiple choice questions! 

Do you want to keep having a conversation? (yes/no) 
```