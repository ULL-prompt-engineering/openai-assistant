# openai-beta-assistant

See tutorial <https://dev.to/esponges/build-the-new-openai-assistant-with-function-calling-52f5>
by Fernando González Tostado Nov 14 2023.

## Execution of function-calling.ts

```
➜  fernando-assistant-function-calling git:(main) npm run functions

> openai-assistant-test-nov23@1.0.0 functions
> ts-node function-calling.ts


Hello there, I'm a Math assistant. We'll start with a small quiz.

Quiz :
 display_quiz
Question: Explain briefly why a negative number times a negative number results in a positive number.
```
Then I answered:
```
      May be because the opposite of the opposite is the identity?
```
And the assistant replied with a new question:
```
Question: What is the area of a triangle with a base of 6 units and a height of 4 units?
      Options: 12 square units,24 square units,48 square units,Not enough information
```
I answered:
```
      12 square units
```

Then the assistant answered:

```
Your responses from the quiz :
 [
  'May be because the opposite of the opposite is the identity?\n',
  '12 square units\n'
]
> For the first response, your explanation is on the right track. 
We consider the product of two negative numbers to be positive because, in mathematics, 
multiplying two numbers with the same sign results in a positive product. 
This comes from the rules of integer multiplication which maintain that the product of two negatives will yield the opposite of a negative, which is a positive. 
A more formal explanation involves the properties of additive inverses and the distributive law.

For the second question, the response is correct! The area \( A \) of a triangle can be calculated using the formula \( A = \frac{1}{2} \times \text{base} \times \text{height} \). In this case, with a base of 6 units and height of 4 units:

\[ A = \frac{1}{2} \times 6 \times 4 = 12 \]

So the area is indeed 12 square units. Well done! 

Do you want to keep having a conversation? (yes/no) 
```
To which I answered:
```
Do you want to keep having a conversation? (yes/no) no
Alrighty then, I hope you learned something!
```
(Notice how the LLM uses $\LaTeX$ to write the formulae $\[ A = \frac{1}{2} \times 6 \times 4 = 12 \]$)
and the program ended.