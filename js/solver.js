if (window === undefined && module !== undefined) {
  const { Expression, Operator, Game } = require("./game.js");
}

let foundSolutions = [];
let nodes = 0;

function search(game, numbers, last) {
  if (numbers.length <= 0 || last.absoluteScore(game.target) === 0) {
    return last;
  }

  const current = last.copy();

  for (let i in numbers) {
    const operator = current.push(new Operator());
    current.push(numbers[i]);

    for (let j = 0; j < 4; j++) {
      const value = current.value;

      if (game.scoreExpression(current) > 0) {
        foundSolutions.push(current.copy());
      }

      if (isNaN(value)) {
        operator.next();
        continue;
      }

      nodes++;
      search(game, numbers.slice(0, i).concat(numbers.slice(i + 1)), current);

      operator.next();
    }

    current.pop();
    current.pop();
  }
}

function solve(game) {
  foundSolutions = [];
  nodes = 0;

  for (let i in game.numbers) {
    search(game, game.numbers.slice(0, i).concat(game.numbers.slice(i + 1)), new Expression([game.numbers[i]]));
  }

  console.log(`info: Nodes: ${nodes}`)

  pruneDuplicates(foundSolutions);

  let sorted = foundSolutions.sort((a, b) => {
    return a.absoluteScore(game.target) - b.absoluteScore(game.target);
  });

  let perfectCount = 0;
  for (const solution of sorted) {
    if (game.scoreExpression(solution) === 10) {
      perfectCount++;
    } else {
      break;
    }
  }

  return {
    found: sorted,
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

if (window === undefined && module !== undefined) {
  module.exports = {
    solve,
  };
}