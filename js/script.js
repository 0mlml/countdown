// Web entry point

if (typeof window === 'undefined' && typeof process !== 'undefined') {
  throw new Error('This script is not meant to be run in a Node environment.');
}

let game = null;

const targetNumberElement = document.getElementById('targetNumber');
const targetNumberErrorElement = document.getElementById('targetNumberError');
const providedNumbersElement = document.getElementById('providedNumbers');
const providedNumbersErrorElement = document.getElementById('providedNumbersError');

const smallNumbersElement = document.getElementById('smallNumbers');
const largeNumbersElement = document.getElementById('largeNumbers');

const generateNumbersElement = document.getElementById('generateNumbers');
const generateNumbersErrorElement = document.getElementById('generateNumbersError');

const startSolveElement = document.getElementById('startSolve');
const solverOutputElement = document.getElementById('solverOutput');

const log = (...args) => {
  solverOutputElement.value += args.join(' ') + '\n';
  console.log(...args);
}

generateNumbersElement.addEventListener('click', () => {
  let smallCount = parseInt(smallNumbersElement.value, 10);
  let largeCount = parseInt(largeNumbersElement.value, 10);

  if (smallCount + largeCount !== 6) {
    generateNumbersErrorElement.textContent = 'Please ensure that the total number of small and large numbers is 6.';
    return;
  } else {
    generateNumbersErrorElement.textContent = '';
  }

  game = new Game(smallCount, largeCount);

  targetNumberElement.value = game.target;
  providedNumbersElement.value = game.numbers.join(' ');
});

const validateTarget = (target) => {
  if (target < 100 || target > 999) {
    targetNumberElement.style.borderColor = "red";
    targetNumberErrorElement.textContent = 'Please enter a three-digit number.';
    return false;
  } else {
    targetNumberElement.style.borderColor = "initial";
    targetNumberErrorElement.textContent = '';
    return true;
  }
}

targetNumberElement.addEventListener('change', () => {
  const value = parseInt(targetNumberElement.value.trim(), 10);
  validateTarget(value);
});

const validateNumbers = (numbers) => {
  if (numbers.length !== 6 || !game.validateNumbers(numbers)) {
    providedNumbersElement.style.borderColor = "red";
    providedNumbersErrorElement.textContent = 'Please enter 6 numbers, (up to) 6 small (1-10) and (up to) 4 large (25, 50, 75, or 100).';
    return false;
  } else {
    providedNumbersElement.style.borderColor = "initial";
    providedNumbersErrorElement.textContent = '';
    return true;
  }
}

providedNumbersElement.addEventListener('change', () => {
  const numbers = providedNumbersElement.value.trim().split(' ').map(num => parseInt(num, 10));
  validateNumbers(numbers);
});

startSolveElement.addEventListener('click', e => {
  if (game === null) {
    game = new Game();
  }

  const targetVal = parseInt(targetNumberElement.value.trim(), 10);
  const numbersVal = providedNumbersElement.value.trim().split(' ').map(num => parseInt(num, 10));
  if (!validateTarget(targetVal) || !validateNumbers(numbersVal)) {
    return;
  }

  game.target = targetVal;
  game.numbers = numbersVal;

  solverOutputElement.value = '';

  log('New game:')
  log(game.toString());

  const start = performance.now();

  const solutionList = solve(game);
  const time = performance.now() - start;

  log(`Solved in ${time.toFixed(2)}ms.`);
  log(`Found: ${solutionList.count} solutions, where ${solutionList.perfectCount} are perfect.\nSolutions:`);
  for (const solution of solutionList.found) {
    log(solution.toString());
  }
});