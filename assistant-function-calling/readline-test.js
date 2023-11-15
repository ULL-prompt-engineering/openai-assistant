const readline  = require('readline').createInterface({
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
    const answer = await askRLineQuestion("What is your favorite food? ")
    console.log(`Oh, so your favorite food is ${answer}`)
    readline.close();
}

main()