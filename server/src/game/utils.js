// @flow

import assert from 'assert';

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
