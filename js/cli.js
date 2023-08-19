// Node CLI entry point
const { Game } = require('./game.js');
const { solve } = require('./solver.js');

function generateLargeCount() {
  return Math.floor(Math.random() * 5);
}

(() => {
  const randomLargeCount = generateLargeCount();
  const game = new Game(6 - randomLargeCount, randomLargeCount);

  console.log('info: New game:');
  console.log(game.toString());

  console.time('info: solve');

  const solutionList = solve(game);
  console.timeEnd('info: solve');

  console.log(`info: Found: ${solutionList.count} solutions, where ${solutionList.perfectCount} are perfect.\ninfo: Solutions:`);
  for (const solution of solutionList.found) {
    console.log(solution.toString());
  }

})();