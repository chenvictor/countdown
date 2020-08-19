// @flow

export const MAIN_GAME_STATUS = {
  WAITING: ('waiting': 'waiting'),
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

export type BaseGameState = {|
  current_round: number,
  total_rounds: number,
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

export type GameState = WaitingGameState | PlayingGameState;
