// @flow

import type {Equation} from '../../shared/math';
import assert from 'assert';

export const assertNonNull = <T>(vals: Array<?T>): Array<T> => {
  vals.forEach(v => assert(v != null));
  const _vals: Array<T> = (vals: any);
  return _vals;
};

class Stack<T> {
  base: Array<T>;
  constructor() {
    this.base = [];
  }
  push(v: T): void {
    this.base.push(v);
  }
  pop(): void {
    assert(this.base.length > 0);
    this.base.pop();
  }
  get top(): T {
    assert(this.base.length > 0);
    return this.base[this.base.length-1];
  }
  get length(): number {
    return this.base.length;
  }
  get empty(): bool {
    return this.base.length === 0;
  }
};

/**
 * Returns parsed equation or string error if failed to parse
 */
export const parse = (eqn: string): Equation | string => {
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
  const ops = new Set([...'+-*/()']);
  // Tokenize
  const tokens: Array<string> = [];
  for (const c of eqn) {
    if (ops.has(c) || tokens.length === 0) {
      tokens.push(c);
    } else {
      const lIdx = tokens.length-1;
      if (ops.has(tokens[lIdx])) {
        tokens.push(c);
      } else {
        tokens[lIdx] += c;
      }
    }
  }

  // Shunting yard: https://en.wikipedia.org/wiki/Shunting-yard_algorithm#The_algorithm_in_detail
  const precedence = {
    '+': 0,
    '-': 0,
    '/': 1, // lower than multiplication to force multiply first
    '*': 2,
  };
  const output: Array<string> = [];
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
      while (
        !opstack.empty &&
        opstack.top !== '(' && 
        precedence[opstack.top] >= precedence[token]
      ) {
        output.push(opstack.top);
        opstack.pop();
      }
      opstack.push(token);
    }
  }
  while (!opstack.empty) {
    output.push(opstack.top);
    opstack.pop();
  }
  // Build object
  return ((): (Equation | string) => {
    const stack = new Stack<Equation>();
    for (const token of output) {
      if (ops.has(token)) {
        if (stack.length < 2) {
          return 'equation invalid';
        }
        const b = stack.top; stack.pop();
        const a = stack.top; stack.pop();
        stack.push({
          type: token,
          a,
          b,
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
