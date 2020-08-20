"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorOrValue = exports.getScore = exports.shuffle = exports.rand = exports.sleep = void 0;

var _assert = _interopRequireDefault(require("assert"));

var _math = require("../shared/math");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
}; // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random


exports.sleep = sleep;

const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}; // Shuffle an array of numbers
// adapted from https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm


exports.rand = rand;

const shuffle = from => {
  const n = from.length;
  const a = [...from];

  for (let i = 0; i < n - 2; i++) {
    const j = rand(i, n);
    const x = a[i];
    const y = a[j];
    a[i] = y;
    a[j] = x;
  }

  return a;
}; // See https://en.wikipedia.org/wiki/Countdown_(game_show)#Numbers_round


exports.shuffle = shuffle;

const getScore = difference => {
  if (difference === 0) {
    return 10;
  } else if (difference <= 5) {
    return 7;
  } else if (difference <= 10) {
    return 5;
  }

  return 0;
};

exports.getScore = getScore;

const getErrorOrValue = (equation, available_numbers) => {
  const count = new Map();

  for (const num of available_numbers) {
    const cur = count.get(num) || 0;
    count.set(num, cur + 1);
  }

  for (const rem of (0, _math.getNumbers)(equation)) {
    const cur = count.get(rem) || 0;

    if (cur === 0) {
      return `${rem} was used more times than it appears`;
    }

    count.set(rem, cur - 1);
  }

  const val = (0, _math.evaluate)(equation);

  if (!val) {
    return 'Equation is invalid';
  }

  return val;
};

exports.getErrorOrValue = getErrorOrValue;