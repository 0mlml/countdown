const { scoreSolution } = require("./game.js");

class Operation {
  static UNKNOWN = "UNKNOWN";
  static ADD = "ADD";
  static SUBTRACT = "SUBTRACT";
  static MULTIPLY = "MULTIPLY";
  static DIVIDE = "DIVIDE";
}

class Solution {
  constructor() {
    this.target = 0;
    this.score = 0;
    this.current_value = 0;
    this.num_count = 0;
    this.numbers = new Array(6).fill(0);
    this.op_count = 0;
    this.operations = new Array(5).fill(Operation.UNKNOWN);
  }
}

class SolutionList {
  constructor() {
    this.found = [];
    this.count = 0;
  }
}

function evaluateSolution(solution) {
  if (solution.op_count === 0) {
    solution.score = 1000000;
    solution.current_value = solution.numbers[0];
    return;
  }

  let value = solution.numbers[0];

  for (let i = 0; i < solution.op_count; i++) {
    switch (solution.operations[i]) {
      case Operation.ADD:
        value += solution.numbers[i + 1];
        break;
      case Operation.SUBTRACT:
        value -= solution.numbers[i + 1];
        break;
      case Operation.MULTIPLY:
        value *= solution.numbers[i + 1];
        break;
      case Operation.DIVIDE:
        value /= solution.numbers[i + 1];
        break;
      default:
        return;
    }
  }

  solution.current_value = value;
  solution.score = Math.abs(solution.target - value);
}

const MAX_SOLUTIONS = 100;

let foundSolution = [];
let foundSolutionCount = 0;

function search(numsLeft, last) {
  let best = Object.assign({}, last);  // Deep copy

  if (numsLeft.length <= 0 || best.score === 0) {
    return best;
  }

  for (let numIndex = 0; numIndex < numsLeft.length; numIndex++) {
    for (let op of [Operation.ADD, Operation.SUBTRACT, Operation.MULTIPLY, Operation.DIVIDE]) {
      if (op === Operation.DIVIDE && numsLeft[numIndex] === 0) continue;

      let solution = Object.assign({}, last);  // Deep copy

      if (solution.num_count === 6 || solution.op_count === 5) {
        return best;
      }

      solution.numbers[solution.num_count] = numsLeft[numIndex];
      solution.num_count++;
      solution.operations[solution.op_count] = op;
      solution.op_count++;

      evaluateSolution(solution);

      if (solution.score < best.score) {
        best = solution;
        if (best.score === 0 && foundSolutionCount <= MAX_SOLUTIONS) {
          foundSolution[foundSolutionCount++] = best;
          return best;
        }
      }

      let nextNumsLeft = numsLeft.filter((_, index) => index !== numIndex);
      let recursiveSolution = search(nextNumsLeft, solution);

      if (recursiveSolution.score < best.score) {
        best = recursiveSolution;
      }
    }
  }

  return best;
}

function solve(game) {
  let solution = new Solution();
  solution.score = 1000000;
  solution.target = game.target;

  let combinedNumbers = [...game.small, ...game.large];
  foundSolution = [];
  foundSolutionCount = 0;

  for (let i = 0; i < 6; i++) {
    let numsLeft = combinedNumbers.filter((_, index) => index !== i);
    let newSolution = search(numsLeft, solution);

    if (newSolution.score < solution.score) {
      solution = newSolution;
    }
  }

  if (foundSolutionCount <= 0 && scoreSolution(solution.current_value, solution.target) > 0) {
    foundSolution[foundSolutionCount++] = solution;
  }

  return {
    found: foundSolution,
    count: foundSolutionCount
  };
}

function areSolutionsEqual(a, b) {
  if (a.current_value !== b.current_value) return false;

  for (let i = 0; i < 6; i++) {
    if (a.numbers[i] !== b.numbers[i]) return false;
  }

  for (let i = 0; i < 5; i++) {
    if (a.operations[i] !== b.operations[i]) return false;
  }

  return true;
}

function pruneDuplicates(list) {
  for (let i = 0; i < list.count; i++) {
    for (let j = i + 1; j < list.count;) {
      if (areSolutionsEqual(list.found[i], list.found[j])) {
        list.found.splice(j, 1);
        list.count--;
      } else {
        j++;
      }
    }
  }
}

function operationToString(operation) {
  switch (operation) {
    case Operation.ADD: return '+';
    case Operation.SUBTRACT: return '-';
    case Operation.MULTIPLY: return '*';
    case Operation.DIVIDE: return '/';
    default: return '?';
  }
}

function printSolution(solution) {
  if (solution.op_count === 0 || solution.num_count === 0) {
    console.log("Solution is invalid");
    return;
  }

  let needParenthesis = (solution.operations[0] === Operation.ADD || solution.operations[0] === Operation.SUBTRACT);
  let output = needParenthesis ? "(" : "";

  let numIndex = 0;
  let opIndex = 0;
  while (opIndex < solution.op_count && numIndex < solution.num_count) {
    output += solution.numbers[numIndex++];
    if (!solution.numbers[numIndex]) break;

    let opChar = operationToString(solution.operations[opIndex]);
    if ((opChar === '*' || opChar === '/') && needParenthesis) {
      output += `) ${opChar} `;
      needParenthesis = false;
    } else {
      output += ` ${opChar} `;
    }
    opIndex++;
  }

  if (numIndex < solution.num_count) {
    output += solution.numbers[numIndex];
  }

  if (needParenthesis) output += ")";
  output += ` = ${solution.current_value}`;

  console.log(output);
}

module.exports = {
  solve,
  printSolution,
  pruneDuplicates,
};