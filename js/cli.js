// Node CLI entry point

if (window === undefined && module !== undefined) {
  const { Game } = require('./game.js');
  const { solve } = require('./solver.js');
}

function play() {
  const randomLargeCount = Math.floor(Math.random() * 5);
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

}

(() => {
  const times = parseInt(process.argv[2]) || 1;
  for (let i = 0; i < times; i++) {
    play();
  }
})();