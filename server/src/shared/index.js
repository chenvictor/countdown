// @flow

/**
 * After changing, run
 * cp -r shared client/src && cp -r shared server/src
 */

export type ID = string;

export type Player = {|
  id: ID,
  name: string,
|};

export type ReadyStates = {|
  [ID]: bool,
|};

export const LOBBY_STATE = {
  WAITING_FOR_PLAYERS: ('waiting_for_players': 'waiting_for_players'),
  IN_GAME: ('in_game': 'in_game'),
};

export type LobbyState = $Values<typeof LOBBY_STATE>;

export * from './requests';
export * from './responses';
export * from './events';
export * from './game';