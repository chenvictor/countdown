// @flow

export type EquationValue = number;

export const EQUATION_OPERATOR = {
  ADD: ('+', '+'),
  SUBTRACT: ('-': '-'),
  MULTIPLY: ('*': '*'),
  DIVIDE: ('/': '/'),
};

export type EquationOperator = $Values<typeof EQUATION_OPERATOR>;

export type EquationOperation = {
  type: EquationOperator,
  a: Equation,
  b: Equation,
}

export type Equation = EquationValue | EquationOperation;
