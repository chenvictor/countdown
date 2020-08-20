"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ROUND_LENGTH = exports.GAME_STATUS = exports.PLAYING_GAME_STATUS = exports.MAIN_GAME_STATUS = void 0;
const MAIN_GAME_STATUS = {
  WAITING: 'waiting',
  SHOWING_ANSWER: 'showing_answer'
};
exports.MAIN_GAME_STATUS = MAIN_GAME_STATUS;
const PLAYING_GAME_STATUS = {
  ROUND_STARTING: 'round_starting',
  ROUND_STARTED: 'round_started',
  ROUND_FINISHED: 'round_finished'
};
exports.PLAYING_GAME_STATUS = PLAYING_GAME_STATUS;
const GAME_STATUS = { ...MAIN_GAME_STATUS,
  ...PLAYING_GAME_STATUS
};
exports.GAME_STATUS = GAME_STATUS;
const ROUND_LENGTH = {
  _30: 30
};
exports.ROUND_LENGTH = ROUND_LENGTH;