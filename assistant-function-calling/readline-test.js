const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askRLineQuestion(question) {
  return new Promise((resolve, _reject) => {
    readline.question(question, (answer) => {
      resolve(`${answer}\n`);
    });
  });
}

async function displayQuiz(name, questions) {
  // This function will take the name of the quiz and the questions and it will display them to the user. 
  // It will then wait for the user to answer the questions 
  // and then it will return the responses.
  console.log(`\n${name}\n`);

  const responses = {};

  for (const question of questions) {
    const questionText = question.question_text;
    const questionType = question.question_type;
    const choices = question.choices;

    console.log(`\n${questionText}\n`);

    if (questionType === "MULTIPLE_CHOICE") {
      console.log(`\n${choices.join("\n")}\n`);
    }

    const response = await askRLineQuestion("Your response: \n");

    responses[questionText] = response;
  }
}

async function main() {
  let continueConversation = true;

  while (continueConversation) {
    const answer = await askRLineQuestion("What is a food you like? ")
    console.log(`Oh, so you like ${answer}`)
    const continueAsking = await askRLineQuestion(
      "Do you want to keep having a conversation? (yes/no) ",
    );
    continueConversation = continueAsking.toLowerCase().includes("y");

    // If the continueConversation state is falsy show an ending message
  }

  console.log("Bye!\n");
  readline.close();
}

main()