# Build a chatbot with the new OpenAI Assistant API and Function Calling

## References

* Build a chatbot with the new OpenAI Assistant API and Function Calling: <https://dev.to/esponges/build-the-new-openai-assistant-with-function-calling-52f5> by Fernando González Tostado Nov 14 2023.
  * Repo: <https://github.com/esponges/openai-beta-assistant>
* Cookbook. Assistants API Overview (Python SDK): <https://cookbook.openai.com/examples/assistants_api_overview_python>
* Tutorial: Get started with the new OpenAI Assistants API by Ralf Elfving <https://medium.com/@ralfelfving/tutorial-get-started-with-the-new-openai-assistants-api-7049c2517bfe>

## Execution 1

```
➜  assistant-function-calling git:(main) ✗ ts-node app.ts

Hello there, I'm a Math assistant. We'll start with a small quiz.

Quiz :
 displayQuiz
Question: Explain why the sum of two even numbers is always even.
      _
```

Then I answered:

```
      By the distributive law: `2*n+2*p=2*(n+p)`
```

Then the assistant replied with a new question:
    
```
Question: What is the value of x in the equation 2x + 3 = 15?

      Options: 5,6,7,8
      _
```
I answered:

```
      6
```
    
Then the assistant answered:
        
```
Your responses from the quiz :
 [ 'By the distributive law: `2*n+2*p=2*(n+p)`\n', '6\n' ]
Great job on both questions!

1. Your explanation for why the sum of two even numbers is correct. It's indeed because you can factor out a 2, which means the sum is still a multiple of 2, and hence even.

2. You chose the correct answer for the value of \( x \) in the equation \( 2x + 3 = 15 \). The solution is \( x = 6 \), which you can find by subtracting 3 from both sides and then dividing by 2. 

Do you want to keep having a conversation? (yes/no) _
```

Please, take notice of how the LLM uses  $\LaTeX$ to write the formulae like $2x + 3 = 15$

To the last question I answered:

```
Do you want to keep having a conversation? (yes/no) n
Alrighty then, I hope you learned something!
```

## Execution 2

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
Please, take notice of
1. How the LLM uses  $\LaTeX$ to write the formulae like $2^3 \times 5^2$ and $8 \times 25$
2. The discussion about the answer to the second question. The assistant is able to understand that I spotted the correct answer but may have marked it incorrectly. This seems to be an allucination or may be due to the `"\n"` at the end of the `"200\n"`.


To the last question I answered:

```
Do you want to keep having a conversation? (yes/no) no
Alrighty then, I hope you learned something!
```