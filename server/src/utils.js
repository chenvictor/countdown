// @flow

const { default: ShortUniqueId } = require('short-unique-id');
const _uid = new ShortUniqueId();
const assert = require('assert');

import type {ID, ErrorResponse, Player, ReadyStates} from './shared';
import {WebSocketServer} from './wsserver';

export const uid = (): ID => {
  const id: ID = _uid.seq();
  return id;
};

export const getPlayerList = (wss: WebSocketServer): Array<Player> => {
  const players = [];
  for (const instance of wss.named_instances) {
    players.push({
      id: instance.id,
      name: (instance.name: any),
    });
  }
  return players;
}; 

export const getReadyStates = (wss: WebSocketServer): ReadyStates => {
  const ready_states = {};
  for (const instance of wss.named_instances) {
    ready_states[instance.id] = instance.ready;
  }
  return ready_states;
};

export const isAllPlayersReady = (wss: WebSocketServer): bool => {
  const players = wss.named_instances;
  if (players.length === 0) {
    return false;
  }
  return players.every(player => player.ready);
}

export const buildError = (message: string): ErrorResponse => ({
  error: true,
  message,
});
