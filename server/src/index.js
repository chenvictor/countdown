// @flow

import type {Player, Request, Response} from '../../shared/types';

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

const ERROR = {
  NAME_TAKEN: 'This name is taken',
};

const playerNames = new Set<string>();

const onConnection = (wss: WebSocketServer, ws: WebSocketInstance) => {
  console.debug(`instance connected: ${ws.id}`);
  ws.sendPlayerList({
    players: getPlayerList(wss)
  });
};

const onDisconnection = (wss: WebSocketServer, ws: WebSocketInstance) => {
  console.debug(`instance disconnected: ${ws.id}`);
  if (ws.name) {
    playerNames.delete(ws.name);
  }
};

const onRequest = (wss: WebSocketServer, ws: WebSocketInstance, request: Request): Response => {
  console.log(`request from client: ${ws.id}`, {request});
  const {newName} = request;
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
  wss.broadcastPlayerList({
    players: getPlayerList(wss),
  });
  return {
    error: false,
    data: null,
  };
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
