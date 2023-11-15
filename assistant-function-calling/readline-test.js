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

async function main() {
  let continueConversation = true;
  let answers = [];

  do  {
    let answer = await askRLineQuestion("What is a food you like? ");
    answers.push(answer.trim());
    console.log(`Oh, so you like: ${answers.join(", ")}`);
    const continueAsking = await askRLineQuestion(
      "Do you want to keep having a conversation? (yes/no) ",
    );
    continueConversation = continueAsking.toLowerCase().includes("y");
  } while (continueConversation);

  console.log("Bye!\n");
  readline.close();
}

main()