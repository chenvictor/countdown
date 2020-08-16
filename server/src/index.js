// @flow

import type {Player, Request, OkResponse, ErrorResponse, Response, ReadyStates} from './shared';
import {REQUEST_TYPE} from './shared';

const {WebSocketServer, WebSocketInstance} = require('./wsserver');

const port = 3001;

const getPlayerList = (wss: WebSocketServer): Array<Player> => {
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

const getReadyStates = (wss: WebSocketServer): ReadyStates => {
  const ready_states = {};
  for (const instance of wss.instances) {
    if (instance.name) {
      ready_states[instance.id] = instance.ready;
    }
  }
  return ready_states;
};

const ERROR = {
  NAME_TAKEN: 'This name is taken',
};

const playerNames = new Set<string>();

const onConnection = (wss: WebSocketServer, ws: WebSocketInstance) => {
  console.debug(`instance connected: ${ws.id}`);
  ws.sendPlayerList(getPlayerList(wss));
  {
    // // temp assign name for faster dev
    // playerNames.add('foobar');
    // ws.name = 'foobar';
    // wss.broadcastPlayerList(getPlayerList(wss));
  }
};

const onDisconnection = (wss: WebSocketServer, ws: WebSocketInstance) => {
  console.debug(`instance disconnected: ${ws.id}`);
  if (ws.name) {
    playerNames.delete(ws.name);
  }
};

const OK_RESPONSE: OkResponse = {
  error: false,
  data: null,
};

const buildError = (message: string): ErrorResponse => ({
  error: true,
  message,
});

const onRequest = (wss: WebSocketServer, ws: WebSocketInstance, request: Request): Response => {
  console.debug(`request from client: ${ws.id}`, {request});
  switch (request.type) {
    case REQUEST_TYPE.UPDATE_NAME:
      const newName = request.newName;
      if (playerNames.has(newName)) {
        return {
          error: true,
          message: ERROR.NAME_TAKEN,
        };
      }
      if (ws.name) {
        playerNames.delete(ws.name);
      }
      ws.name = newName;
      playerNames.add(ws.name);
      wss.broadcastPlayerList(getPlayerList(wss));
      wss.broadcastReadyStates(getReadyStates(wss));
      return OK_RESPONSE;
    case REQUEST_TYPE.TOGGLE_READY:
      ws.ready = !ws.ready;
      wss.broadcastReadyStates(getReadyStates(wss));
      return OK_RESPONSE;
    case REQUEST_TYPE.SUBMIT_ANSWER:
      console.error('not yet implemented');
      return buildError('not yet implemented');
  }
  return buildError('unknown request');
};

const onMessage = (wss: WebSocketServer, ws: WebSocketInstance, message: string): void => {
  console.log(`message from client: ${ws.id}`, {message});
}

new WebSocketServer(
  port,
  {
    onConnection,
    onDisconnection,
  },
  {
    onRequest,
    onMessage,
  }
);
