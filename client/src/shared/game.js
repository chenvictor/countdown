// @flow

export const GAME_STATUS = {
  ROUND_STARTING: ('round_starting': 'round_starting'),
  ROUND_STARTED: ('round_started': 'round_started'),
  ROUND_FINISHED: ('round_finished': 'round_finished'),
};

export type GameStatus = $Values<typeof GAME_STATUS>;

export const ROUND_LENGTH = {
  _30: (30: 30),
};

export type RoundLength = $Values<typeof ROUND_LENGTH>;

export type GameState = {|
  status: GameStatus,
  message: string,
  current_round: number,
  total_rounds: number,
  timer: number,
  target: ?number,
  numbers: Array<?number>,
|};