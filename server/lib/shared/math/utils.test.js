"use strict";

// flow-disable-line
const {
  parse,
  evaluate,
  getNumbers
} = require('./utils');

const basic = '1+2';
const complex = ['1+4/2*9-10', '4/6*2'];
const invalidCharacters = ['foobar+3', '1.0+9', '3-a'];
const invalidDivision = ['4/3', '4/0', '4/(3-3)'];
const parseable = [basic, ...complex, ...invalidDivision];
const unparseable = [...invalidCharacters];
const valid = {
  '1+1': 2,
  '3*5+3': 18,
  '3*(5+3)': 24,
  '12/1': 12,
  '12/3*4': 1,
  '1+4/2-9': -6
};
test('returns equation for parseable equations', () => {
  parseable.forEach(eqn => {
    expect(typeof parse(eqn)).not.toBe('string');
  });
});
test('return string for unparseable equations', () => {
  unparseable.forEach(eqn => {
    expect(typeof parse(eqn)).toBe('string');
  });
});
test('it parses, but fails to evaluate bad division', () => {
  invalidDivision.forEach(eqn => {
    const expr = parse(eqn);
    expect(typeof expr).not.toBe('string');
    const value = evaluate(expr);
    expect(value).toBeNull();
  });
});
test('parses and evaluates', () => {
  for (const [eqn, value] of Object.entries(valid)) {
    const expr = parse(eqn);
    expect(typeof expr).not.toBe('string');
    expect(evaluate(expr)).toBe(value);
  }
});
test('extracts numbers', () => {
  const expr = '1+3+10';
  const numbers = getNumbers(parse(expr));
  numbers.sort();
  const expected = [1, 3, 10];
  expected.sort();
  expect(numbers).toEqual(expected);
});
test('extracts numbers 2', () => {
  const expr = '1+9-100/50';
  const numbers = getNumbers(parse(expr));
  numbers.sort();
  const expected = [1, 9, 50, 100];
  expected.sort();
  expect(numbers).toEqual(expected);
});