class Game {
  constructor() {
    this.target = 0;
    this.small = [];
    this.large = [];
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const smallNumbers = new Array(10).fill(0);

function resetSmall() {
  smallNumbers.fill(0);
}

function genSmall() {
  return Math.floor(Math.random() * 10) + 1;
}

const largeNumbersDef = [25, 50, 75, 100];
let largeNumbers = [...largeNumbersDef];
let largeNumbersIndex = 0;

function shuffleLarge() {
  largeNumbers = [...largeNumbersDef];
  shuffle(largeNumbers);
  largeNumbersIndex = 0;
}

function genLarge() {
  return largeNumbers[largeNumbersIndex++];
}

function genTarget() {
  return Math.floor(Math.random() * 900) + 100;
}

function newGame(smallCount, largeCount) {
  if (largeCount > 4) {
    largeCount = 4;
  }

  if (largeCount + smallCount !== 6) {
    smallCount = 6 - largeCount;
  }

  const game = new Game();

  game.target = genTarget();

  resetSmall();

  for (let i = 0; i < smallCount; i++) {
    let num = genSmall();
    while (smallNumbers[num] >= 2) {
      num = genSmall();
    }
    smallNumbers[num]++;
    game.small[i] = num;
  }

  shuffleLarge();

  for (let i = 0; i < largeCount; i++) {
    game.large[i] = genLarge();
  }

  return game;
}

function newSetGame(target, nums, shouldValidate) {
  if (!shouldValidate) {
    const game = new Game();
    game.target = target;
    game.small = [...nums];
    return game;
  }

  if (target < 100 || target > 999) {
    console.log("Invalid set game (invalid target). Append s to the target to skip validation.");
    return new Game();
  }

  let smallCount = 0;
  let largeCount = 0;

  const localSmallNumbers = new Array(10).fill(0);

  for (let i = 0; i < 6; i++) {
    if (nums[i] <= 10) {
      if (localSmallNumbers[nums[i]] >= 2) {
        console.log("Invalid set game (3rd duplicate small number). Append s to the target to skip validation.");
        return new Game();
      }
      smallCount++;
      localSmallNumbers[nums[i]]++;
      continue;
    }

    if (largeCount >= 4) {
      console.log("Invalid set game (5th large number). Append s to the target to skip validation.");
      return new Game();
    }

    if (![25, 50, 75, 100].includes(nums[i])) {
      console.log("Invalid set game (invalid large number). Append s to the target to skip validation.");
      return new Game();
    }

    largeCount++;
  }

  if (smallCount !== 6 - largeCount) {
    console.log("Invalid set game (wrong number of small numbers). Append s to the target to skip validation.");
    return new Game();
  }

  const game = new Game();
  game.target = target;
  game.small = [...nums];
  return game;
}

function scoreSolution(solution, target) {
  const diff = Math.abs(target - solution);

  if (diff === 0) {
    return 10;
  } else if (diff <= 5) {
    return 7;
  } else if (diff <= 10) {
    return 5;
  }

  return 0;
}

function printGame(game) {
  console.log(`info: Target: ${game.target}`);
  console.log(`info: Numbers: ${game.small.join(' ')} ${game.large.join(' ')}`);
}

module.exports = {
  newGame,
  newSetGame,
  scoreSolution,
  printGame
};