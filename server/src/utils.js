// @flow

const { default: ShortUniqueId } = require('short-unique-id');
const _uid = new ShortUniqueId();

import type {ID, ErrorResponse, Player, ReadyStates} from './shared';
import {WebSocketServer} from './wsserver';

export const uid = (): ID => {
  const id: ID = _uid.seq();
  return id;
};

export const getPlayerList = (wss: WebSocketServer): Array<Player> => {
  const players = [];
  for (const instance of wss.instances) {
    if (instance.name) {
      players.push({
        id: instance.id,
        name: instance.name,
      });
    }
  }
  return players;
}; 

export const getReadyStates = (wss: WebSocketServer): ReadyStates => {
  const ready_states = {};
  for (const instance of wss.instances) {
    if (instance.name) {
      ready_states[instance.id] = instance.ready;
    }
  }
  return ready_states;
};

export const buildError = (message: string): ErrorResponse => ({
  error: true,
  message,
});
