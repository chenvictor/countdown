// @flow

export type EquationValue = number;

export const EQUATION_OPERATOR = {
  ADD: ('+': '+'),
  SUBTRACT: ('-': '-'),
  MULTIPLY: ('*': '*'),
  DIVIDE: ('/': '/'),
};

export type EquationOperator = $Values<typeof EQUATION_OPERATOR>;

/* eslint-disable no-use-before-define */
export type EquationOperation = {
  type: EquationOperator,
  a: Equation,
  b: Equation,
}
/* eslint-enable no-use-before-define */

export type Equation = EquationValue | EquationOperation;
