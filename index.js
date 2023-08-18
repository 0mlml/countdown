const readline = require('readline');
const { newGame, newSetGame, printGame } = require('./game.js');
const { solve, pruneDuplicates, printSolution } = require('./solver');

const DEFAULT_RUNS_COUNT = 1;

function generateLargeCount() {
  return Math.floor(Math.random() * 5);
}

async function interactiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log("info: running interactively");
    console.log("Enter target:");

    rl.question('', (targetStr) => {
      let shouldValidate = true;
      if (targetStr[targetStr.length - 1] === 's') {
        shouldValidate = false;
        targetStr = targetStr.slice(0, -1);
      }

      const target = parseInt(targetStr);

      console.log("Enter numbers (%d %d %d %d %d %d):");

      rl.question('', (numsStr) => {
        const nums = numsStr.split(' ').map(Number);

        const game = newSetGame(target, nums, shouldValidate);

        console.log("info: New game:");
        printGame(game);

        const solution = solve(game);

        pruneDuplicates(solution);

        console.log(`info: Found: ${solution.count}`);
        for (let i = 0; i < solution.count; i++) {
          printSolution(solution.found[i]);
        }

        rl.close();
        resolve();
      });
    });
  });
}

async function main() {
  const runsCountArg = process.argv[2] || DEFAULT_RUNS_COUNT;
  let runsCount = parseInt(runsCountArg);

  if (isNaN(runsCount) || runsCount <= 0) {
    runsCount = DEFAULT_RUNS_COUNT;
  }

  if (!runsCountArg) {
    await interactiveMode();
  } else {
    console.log(`info: count provided, running with no input for ${runsCount} runs`);

    for (let runIndex = 0; runIndex < runsCount; runIndex++) {
      const largeCount = generateLargeCount();
      const smallCount = 6 - largeCount;

      const game = newGame(smallCount, largeCount);

      console.log("info: New game:");
      printGame(game);

      const solution = solve(game);

      pruneDuplicates(solution);

      console.log(`info: Found: ${solution.count}`);
      for (let i = 0; i < solution.count; i++) {
        printSolution(solution.found[i]);
      }
    }
  }
}

main();