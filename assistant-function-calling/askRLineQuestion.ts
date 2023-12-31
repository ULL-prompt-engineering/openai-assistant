const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function askRLineQuestion(question: string) {
    return new Promise<string>((resolve, _reject) => {
        readline.question(question, (answer: string) => {
            resolve(`${answer}\n`);
        });
    });
}

export  { askRLineQuestion, readline }