// @flow

import type {ID} from './index';

export const MAIN_GAME_STATUS = {
  WAITING: ('waiting': 'waiting'),
  SHOWING_ANSWER: ('showing_answer': 'showing_answer'),
};
export type MainGameStatus = $Values<typeof MAIN_GAME_STATUS>;

export const PLAYING_GAME_STATUS = {
  ROUND_STARTING: ('round_starting': 'round_starting'),
  ROUND_STARTED: ('round_started': 'round_started'),
  ROUND_FINISHED: ('round_finished': 'round_finished'),
};
export type PlayingGameStatus = $Values<typeof PLAYING_GAME_STATUS>;

export const GAME_STATUS = {
  ...MAIN_GAME_STATUS,
  ...PLAYING_GAME_STATUS,
};
export type GameStatus = MainGameStatus | PlayingGameStatus;

export const ROUND_LENGTH = {
  _30: (30: 30),
};
export type RoundLength = $Values<typeof ROUND_LENGTH>;

export type Score = {|
  [ID]: number,
|}

export type BaseGameState = {|
  current_round: number,
  total_rounds: number,
  score: Score,
|};

export type WaitingGameState = {|
  ...BaseGameState,
  status: typeof MAIN_GAME_STATUS.WAITING,
  timer: number,
  message: string,
|};

export type PlayingGameState = {|
  ...BaseGameState,
  status: PlayingGameStatus,
  timer: ?number,
  target: ?number,
  numbers: Array<?number>,
|};

export type ShowingGameState = {|
  ...BaseGameState,
  status: typeof MAIN_GAME_STATUS.SHOWING_ANSWER,
  target: number,
  numbers: Array<number>,
  player_name: string,
  player_answer: ?string,
  player_answer_value: ?number,
  player_score: number,
  error_message: ?string,
|};

export type GameState = WaitingGameState | PlayingGameState | ShowingGameState;
