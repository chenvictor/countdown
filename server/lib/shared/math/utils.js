"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNumbers = exports.evaluate = exports.parse = void 0;

var _assert = _interopRequireDefault(require("assert"));

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Stack {
  constructor() {
    this.base = [];
  }

  push(v) {
    this.base.push(v);
  }

  pop() {
    (0, _assert.default)(this.base.length > 0);
    this.base.pop();
  }

  get top() {
    (0, _assert.default)(this.base.length > 0);
    return this.base[this.base.length - 1];
  }

  get length() {
    return this.base.length;
  }

  get empty() {
    return this.base.length === 0;
  }

}

;
/**
 * Returns parsed equation or string error if failed to parse
 */

const parse = eqn => {
  eqn = eqn.replace(/\s/g, '');

  if (eqn.length === 0) {
    return 'Equation is blank';
  }

  if (eqn.length > 80) {
    return 'Equation is too long';
  }

  const validChars = new Set([...'0123456789+-/*()']);

  if (![...eqn].every(char => validChars.has(char))) {
    return 'Equation should only contain digits (0-9) and operators (+-*/)';
  }

  const ops = new Set([...'+-*/()']); // Tokenize

  const tokens = [];

  for (const c of eqn) {
    if (ops.has(c) || tokens.length === 0) {
      tokens.push(c);
    } else {
      const lIdx = tokens.length - 1;

      if (ops.has(tokens[lIdx])) {
        tokens.push(c);
      } else {
        tokens[lIdx] += c;
      }
    }
  } // Shunting yard: https://en.wikipedia.org/wiki/Shunting-yard_algorithm#The_algorithm_in_detail


  const precedence = {
    '+': 0,
    '-': 0,
    '/': 1,
    // lower than multiplication to force multiply first
    '*': 2
  };
  const output = [];
  const opstack = new Stack();

  for (const token of tokens) {
    if (!ops.has(token)) {
      // number
      output.push(token);
    } else if (token === '(') {
      opstack.push(token);
    } else if (token === ')') {
      if (opstack.empty) return 'mismatched parentheses';

      while (opstack.top !== '(') {
        output.push(opstack.top);
        opstack.pop();
      }

      opstack.pop();
    } else {
      // operator
      while (!opstack.empty && opstack.top !== '(' && precedence[opstack.top] >= precedence[token]) {
        output.push(opstack.top);
        opstack.pop();
      }

      opstack.push(token);
    }
  }

  while (!opstack.empty) {
    output.push(opstack.top);
    opstack.pop();
  } // Build object


  return (() => {
    const stack = new Stack();

    for (const token of output) {
      if (ops.has(token)) {
        if (stack.length < 2) {
          return 'equation invalid';
        }

        const b = stack.top;
        stack.pop();
        const a = stack.top;
        stack.pop();
        stack.push({
          type: token,
          a,
          b
        });
      } else {
        stack.push(Number(token));
      }
    }

    if (stack.length !== 1) {
      return 'equation invalid';
    }

    return stack.top;
  })();
};
/**
 * Return the evaluated value or null if invalid
 */


exports.parse = parse;

const evaluate = eqn => {
  if (typeof eqn === 'number') {
    return eqn;
  } else {
    const a = evaluate(eqn.a);
    const b = evaluate(eqn.b);

    if (!a || !b) {
      return null;
    }

    switch (eqn.type) {
      case _types.EQUATION_OPERATOR.ADD:
        return a + b;

      case _types.EQUATION_OPERATOR.SUBTRACT:
        return a - b;

      case _types.EQUATION_OPERATOR.MULTIPLY:
        return a * b;

      case _types.EQUATION_OPERATOR.DIVIDE:
        if (b === 0 || a % b !== 0) {
          return null;
        }

        return a / b;

      default:
        return null;
    }
  }
};

exports.evaluate = evaluate;

const getNumbers = eqn => {
  if (typeof eqn === 'number') {
    return [eqn];
  }

  return [...getNumbers(eqn.a), ...getNumbers(eqn.b)];
};

exports.getNumbers = getNumbers;