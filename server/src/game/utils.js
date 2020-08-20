// @flow

import assert from 'assert';

import {evaluate, getNumbers} from '../shared/math';
import type {Equation} from '../shared/math';

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
export const rand = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// Shuffle an array of numbers
// adapted from https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
export const shuffle = (from: Array<number>): Array<number> => {
  const n = from.length;
  const a = [...from];
  for (let i = 0; i < n-2; i++) {
    const j = rand(i, n);
    const x = a[i];
    const y= a[j];
    a[i] = y;
    a[j] = x;
  }
  return a;
};

// See https://en.wikipedia.org/wiki/Countdown_(game_show)#Numbers_round
export const getScore = (difference: number): number => {
  if (difference === 0) {
    return 10;
  } else if (difference <= 5) {
    return 7;
  } else if (difference <= 10) {
    return 5;
  }
  return 0;
}

export const getErrorOrValue = (equation: Equation, available_numbers: Array<number>): (string | number) => {
  const count = new Map<number, number>();
  for (const num of available_numbers) {
    const cur = count.get(num) || 0;
    count.set(num, cur+1)
  }
  for (const rem of getNumbers(equation)) {
    const cur = count.get(rem) || 0;
    if (cur === 0) {
      return `${rem} was used more times than it appears`;
    }
    count.set(rem, cur-1);
  }
  const val = evaluate(equation);
  if (!val) {
    return 'Equation is invalid';
  }
  return val;
};