// @flow

import type {ID, Player, ReadyStates, LobbyState, GameState} from './index';

// Server -> Client events
export const EVENT_TYPE = {
  PLAYER_LIST_UPDATE: ('player_list_update': 'player_list_update'),
  READY_STATES_UPDATE: ('ready_states_update': 'ready_states_update'),
  ID_UPDATE: ('id_update': 'id_update'),
  LOBBY_STATE_UPDATE: ('lobby_state_update': 'lobby_state_update'),
  GAME_STATE_UPDATE: ('game_state_update': 'game_state_update'),
};

export type PlayerListUpdateEvent = {|
  type: typeof EVENT_TYPE.PLAYER_LIST_UPDATE,
  players: Array<Player>,
|};

export type ReadyStatesUpdateEvent = {|
  type: typeof EVENT_TYPE.READY_STATES_UPDATE,
  ready_states: ReadyStates,
|};

export type IDUpdateEvent = {|
  type: typeof EVENT_TYPE.ID_UPDATE,
  id: ?ID,
|};

export type LobbyStateUpdateEvent = {|
  type: typeof EVENT_TYPE.LOBBY_STATE_UPDATE,
  state: LobbyState,
|};

export type GameStateUpdateEvent = {|
  type: typeof EVENT_TYPE.GAME_STATE_UPDATE,
  state: GameState,
|};

export type Event =
  PlayerListUpdateEvent |
  IDUpdateEvent |
  ReadyStatesUpdateEvent |
  LobbyStateUpdateEvent |
  GameStateUpdateEvent;