const { Expression, Operator, Game } = require("./game.js");

let foundSolutions = [];
let nodes = 0;

/** @param {Game} game @param {number[]} numbers @param {Expression} last */
function search(game, numbers, last) {
  if (numbers.length <= 0 || last.absoluteScore(game.target) === 0) {
    return last;
  }

  const current = last.copy();

  for (const number of numbers) {
    const operator = current.push(new Operator());
    current.push(number);

    for (let i = 0; i < 4; i++) {
      const value = current.value;

      if (game.scoreExpression(current) > 0) {
        foundSolutions.push(current.copy());
      }

      if (isNaN(value)) {
        operator.next();
        continue;
      }

      nodes++;
      search(game, numbers.filter(n => n !== number), current);

      operator.next();
    }

    current.pop();
    current.pop();
  }
}

function solve(game) {
  foundSolutions = [];
  nodes = 0;

  for (let i = 0; i < 6; i++) {
    search(game, game.numbers.filter(n => n !== game.numbers[i]), new Expression([game.numbers[i]]));
  }

  console.log(`info: Nodes: ${nodes}`)

  pruneDuplicates(foundSolutions);

  let perfectCount = 0;
  for (const solution of foundSolutions) {
    if (game.scoreExpression(solution) === 10) {
      perfectCount++;
    }
  }

  return {
    found: foundSolutions,
    perfectCount: perfectCount,
    count: foundSolutions.length,
  };
}

function pruneDuplicates(list) {
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      if (list[i].equals(list[j])) {
        list.splice(j, 1);
        j--;
      }
    }
  }

  return list;
}

module.exports = {
  solve,
};