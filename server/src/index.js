// @flow

import type {ID, Player, Request, OkResponse, ErrorResponse, Response, ReadyStates, LobbyState, LobbyStateUpdateEvent} from './shared';
import {EVENT_TYPE, REQUEST_TYPE, LOBBY_STATE} from './shared';

const {WebSocketServer, WebSocketInstance} = require('./wsserver');
const {buildError, getPlayerList, getReadyStates, isAllPlayersReady} = require('./utils');
import {Game} from './game';

const port = 3001;

const ERROR = {
  NAME_TAKEN: 'This name is taken',
};

const OK_RESPONSE: OkResponse = {
  error: false,
  data: null,
};

// Lobby State stuff
const playerNames = new Set<string>();
let lobbyState: LobbyState = LOBBY_STATE.WAITING_FOR_PLAYERS;
// Game State stuff
let currentGame: ?Game = null;

const setLobbyState = (newState: LobbyState, wss: WebSocketServer): bool => {
  if (newState === lobbyState) {
    return false;
  }
  lobbyState = newState;
  const event: LobbyStateUpdateEvent = {
    type: EVENT_TYPE.LOBBY_STATE_UPDATE,
    state: lobbyState,
  };
  console.log('lobby state:', lobbyState);
  wss.broadcast(event);
  if (lobbyState === LOBBY_STATE.WAITING_FOR_PLAYERS) {
    // reset ready state, use _instances to mutate
    wss._instances.forEach(ws => ws.ready = false);
    console.log(getReadyStates(wss));
    wss.broadcastReadyStates(getReadyStates(wss));
  }
  return true;
};

const runGame = async (wss: WebSocketServer) => {
  if(setLobbyState(LOBBY_STATE.IN_GAME, wss)) {
    console.log('running game');
    currentGame = new Game(wss);
    await currentGame.run();
    setLobbyState(LOBBY_STATE.WAITING_FOR_PLAYERS, wss);
    currentGame = null;
  }
}

const startGame = (wss: WebSocketServer) => {
  runGame(wss).then(() => {
    console.log('done running game');
  });
};

const onConnection = (wss: WebSocketServer, ws: WebSocketInstance) => {
  console.debug(`instance connected: ${ws.id}`);
  ws.sendPlayerList(getPlayerList(wss));
  {
    // temp assign name for faster dev
    if (playerNames.size === 0) {
      playerNames.add('foobar');
      ws.name = 'foobar';
      wss.broadcastPlayerList(getPlayerList(wss));
    }
  }
};

const onDisconnection = (wss: WebSocketServer, ws: WebSocketInstance) => {
  console.debug(`instance disconnected: ${ws.id}`);
  if (ws.name) {
    playerNames.delete(ws.name);
    wss.broadcastPlayerList(getPlayerList(wss));
  }
  if (wss.named_instances.length === 0) {
    setLobbyState(LOBBY_STATE.WAITING_FOR_PLAYERS, wss);
  }
};

const onRequest = (wss: WebSocketServer, ws: WebSocketInstance, request: Request): Response => {
  console.debug(`request from client: ${ws.id}`, {request});
  switch (request.type) {
    case REQUEST_TYPE.UPDATE_NAME:
      const newName = request.newName;
      if (ws.name === null && lobbyState !== LOBBY_STATE.WAITING_FOR_PLAYERS) {
        return buildError('Game has already started');
      }
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
      if (lobbyState === LOBBY_STATE.WAITING_FOR_PLAYERS) {
        ws.ready = !ws.ready;
        wss.broadcastReadyStates(getReadyStates(wss));
        if (isAllPlayersReady(wss)) {
          startGame(wss);
        }
        return OK_RESPONSE;
      } else {
        return buildError('game already started');
      }
    case REQUEST_TYPE.SUBMIT_ANSWER:
      if (currentGame == null) {
        return {
          error: true,
          message: 'Game not running',
        };
      }
      return currentGame.onPlayerSubmit(ws.id, request.text);
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
