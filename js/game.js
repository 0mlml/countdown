class Operator {
  static Add = '+';
  static Subtract = '-';
  static Multiply = '*';
  static Divide = '/';

  static #operators = ['+', '-', '*', '/'];

  get all() {
    return Operator.#operators;
  }

  #index;
  constructor(operator = '+') {
    this.operator = operator;
    this.#index = Operator.#operators.indexOf(operator);
  }

  toString() {
    return this.operator;
  }

  #hasLooped = false;

  get hasLooped() {
    return this.#hasLooped;
  }

  next() {
    if (this.#index === Operator.#operators.length - 1) {
      this.#hasLooped = true;
    }

    this.#index = (this.#index + 1) % Operator.#operators.length;
    this.operator = Operator.#operators[this.#index];
  }

  back() {
    this.#index = (this.#index - 1 + Operator.#operators.length) % Operator.#operators.length;
    this.operator = Operator.#operators[this.#index];
  }

  atEnd() {
    return this.#index === Operator.#operators.length - 1;
  }

  eval(left, right) {
    switch (this.operator) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        if (right === 0 || left % right !== 0) {
          return NaN;
        }
        return left / right;
      default:
        return NaN;
    }
  }

  copy() {
    return new Operator(this.operator);
  }
}

class Expression {
  constructor(sequence) {
    this.sequence = [];
    if (!(sequence instanceof Array) && sequence !== undefined) {
      throw new Error('Invalid sequence (not an array)\ntype: ' + typeof sequence);
    }

    for (let i = 0; i < sequence.length; i++) {
      if (i % 2 === 0 && typeof sequence[i] != 'number') {
        throw new Error('Invalid sequence (even index not a number)');
      }
      if (i % 2 === 1 && !(sequence[i] instanceof Operator)) {
        throw new Error('Invalid sequence (odd index not an operator)');
      }
      this.sequence.push(sequence[i]);
    }
  }

  pop() {
    return this.sequence.pop();
  }

  push(item) {
    if (this.sequence.length % 2 === 0 && typeof item != 'number') {
      throw new Error(`Invalid push to sequence (even index not a number)\nitem: ${item}\nseq: ${this.sequence}`);
    }

    if (this.sequence.length % 2 === 1 && !(item instanceof Operator)) {
      throw new Error('Invalid push to sequence (odd index not an operator)\nitem: ' + item);
    }

    this.sequence.push(item);
    return item;
  }

  get value() {
    if (this.sequence.length === 0) {
      return NaN;
    }

    if (this.sequence.length === 1) {
      return this.sequence[0];
    }

    if (this.sequence.length % 2 === 0) {
      throw new Error('Evaluating sequence ending with operator (even length)');
    }

    let value = this.sequence[0];
    for (let i = 1; i < this.sequence.length; i += 2) {
      if (this.sequence[i] === undefined || this.sequence[i + 1] === undefined) {
        break;
      }

      value = this.sequence[i].eval(value, this.sequence[i + 1]);
      if (isNaN(value)) {
        return NaN;
      }
    }

    return value;
  }

  absoluteScore(target) {
    return Math.abs(target - this.value);
  }

  copy() {
    return new Expression(this.sequence.slice().map(item => {
      if (item instanceof Operator) {
        return item.copy();
      }
      return item;
    }));
  }

  equals(other) {
    if (!(other instanceof Expression)) {
      return false;
    }

    if (this.sequence.length !== other.sequence.length) {
      return false;
    }

    for (let i = 0; i < this.sequence.length; i++) {
      if (this.sequence[i] !== other.sequence[i]) {
        return false;
      }
    }

    return true;
  }

  get last() {
    return this.sequence[this.sequence.length - 1];
  }

  toString() {
    if (this.sequence.length === 0) {
      return '';
    }

    let result = this.sequence[0].toString();
    for (let i = 1; i < this.sequence.length; i += 2) {
      const operator = this.sequence[i];
      const nextNumber = this.sequence[i + 1];

      result = `(${result} ${operator.toString()} ${nextNumber})`;
    }

    return `${result.substring(1, result.length - 1)} = ${this.value}`;
  }

}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

class Game {
  constructor(smallCount = 4, largeCount = 2) {
    Object.defineProperty(this, 'numbers', { value: [], writable: true });
    Object.defineProperty(this, 'target', { value: 0, writable: true });
    this.generateNumbers(smallCount, largeCount);
  }

  #smallNumbersOccurances = new Array(10).fill(0);

  static #largeNumbersDef = [25, 50, 75, 100];
  #largeNumbers = [...Game.#largeNumbersDef];
  #largeNumbersIndex = 0;

  generateNumbers(smallCount, largeCount) {
    let numbers = [];

    if (largeCount > 4) {
      largeCount = 4;
    }

    if (largeCount + smallCount !== 6) {
      smallCount = 6 - largeCount;
    }

    this.target = Math.floor(Math.random() * 900) + 100;

    this.#smallNumbersOccurances.fill(0);

    for (let i = 0; i < smallCount; i++) {
      let num = Math.floor(Math.random() * 10) + 1;
      while (this.#smallNumbersOccurances[num] >= 2) {
        num = Math.floor(Math.random() * 10) + 1;
      }
      this.#smallNumbersOccurances[num]++;
      numbers.push(num);
    }

    this.#largeNumbers = [...Game.#largeNumbersDef];
    shuffleArray(this.#largeNumbers);
    this.#largeNumbersIndex = 0;

    for (let i = 0; i < largeCount; i++) {
      numbers.push(this.#largeNumbers[this.#largeNumbersIndex++]);
    }

    this.numbers = numbers;
  }

  validateTarget(target = this.target) {
    if (target < 100 || target > 999) {
      console.log("Invalid game (invalid target).");
      return false;
    }

    return true;
  }

  validateNumbers(numbers = this.numbers) {
    let smallCount = 0;
    let largeCount = 0;

    const smallNumbersOccurrances = new Array(10).fill(0);

    for (const number of numbers) {
      if (number < 1 || number > 100) {
        console.log("Invalid game (invalid number).");
        return false;
      }

      if (number <= 10) {
        if (smallNumbersOccurrances[number] >= 2) {
          console.log("Invalid game (3rd duplicate small number).");
          return false;
        }
        smallCount++;
        smallNumbersOccurrances[number]++;
        continue;
      }

      if (largeCount >= 4) {
        console.log("Invalid game (5th large number).");
        return false;
      }

      if (![25, 50, 75, 100].includes(number)) {
        console.log("Invalid game (invalid large number).");
        return false;
      }

      largeCount++;
    }

    return true;
  }

  toString() {
    return `info: Target: ${this.target}\ninfo: Numbers: ${this.numbers}`;
  }

  get small() {
    const ret = [];
    for (const num of this.numbers) {
      if (num <= 10) {
        ret.push(num);
      } else {
        break;
      }
    }
    return ret;
  }

  get large() {
    const ret = [];
    for (const num of this.numbers) {
      if (num > 10) {
        ret.push(num);
      }
    }
    return ret;
  }

  set numbers(numbers) {
    if (!this.validateNumbers(numbers)) {
      throw new Error('Invalid numbers: ' + numbers);
    }
  }

  set target(target) {
    if (!this.validateTarget(target)) {
      throw new Error('Invalid target');
    }
  }

  scoreExpression(expression) {
    if (isNaN(expression.value)) {
      return 0;
    }

    const diff = Math.abs(this.target - expression.value);

    if (diff === 0) {
      return 10;
    } else if (diff <= 5) {
      return 7;
    } else if (diff <= 10) {
      return 5;
    }

    return 0;
  }
}

module.exports = {
  Game,
  Operator,
  Expression
};