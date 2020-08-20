"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EVENT_TYPE = void 0;
// Server -> Client events
const EVENT_TYPE = {
  PLAYER_LIST_UPDATE: 'player_list_update',
  READY_STATES_UPDATE: 'ready_states_update',
  ID_UPDATE: 'id_update',
  LOBBY_STATE_UPDATE: 'lobby_state_update',
  GAME_STATE_UPDATE: 'game_state_update'
};
exports.EVENT_TYPE = EVENT_TYPE;