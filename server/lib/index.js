"use strict";

var _shared = require("./shared");

var _game = require("./game");

const {
  WebSocketServer,
  WebSocketInstance
} = require('./wsserver');

const {
  buildError,
  getPlayerList,
  getReadyStates,
  isAllPlayersReady
} = require('./utils');

const port = 3001;
const ERROR = {
  NAME_TAKEN: 'This name is taken'
};
const OK_RESPONSE = {
  error: false,
  data: null
}; // Lobby State stuff

const playerNames = new Set();
let lobbyState = _shared.LOBBY_STATE.WAITING_FOR_PLAYERS; // Game State stuff

let currentGame = null;

const setLobbyState = (newState, wss) => {
  if (newState === lobbyState) {
    return false;
  }

  lobbyState = newState;
  const event = {
    type: _shared.EVENT_TYPE.LOBBY_STATE_UPDATE,
    state: lobbyState
  };
  console.log('lobby state:', lobbyState);
  wss.broadcast(event);

  if (lobbyState === _shared.LOBBY_STATE.WAITING_FOR_PLAYERS) {
    // reset ready state, use _instances to mutate
    wss._instances.forEach(ws => ws.ready = false);

    if (currentGame) {
      currentGame.cancel();
      currentGame = null;
    }

    wss.broadcastReadyStates(getReadyStates(wss));
  }

  return true;
};

const runGame = async wss => {
  if (setLobbyState(_shared.LOBBY_STATE.IN_GAME, wss)) {
    console.log('running game');

    if (currentGame) {
      currentGame.cancel();
    }

    currentGame = new _game.Game(wss);
    await currentGame.run();
    setLobbyState(_shared.LOBBY_STATE.WAITING_FOR_PLAYERS, wss);
    currentGame = null;
  }
};

const startGame = wss => {
  runGame(wss).then(() => {
    console.log('done running game');
  });
};

const onConnection = (wss, ws) => {
  console.debug(`instance connected: ${ws.id}`);
  ws.sendPlayerList(getPlayerList(wss));
  {// temp assign name for faster dev
  }
};

const onDisconnection = (wss, ws) => {
  console.debug(`instance disconnected: ${ws.id}`);

  if (ws.name) {
    playerNames.delete(ws.name);
    wss.broadcastPlayerList(getPlayerList(wss));
  }

  if (wss.named_instances.length === 0) {
    setLobbyState(_shared.LOBBY_STATE.WAITING_FOR_PLAYERS, wss);
  }
};

const onRequest = (wss, ws, request) => {
  console.debug(`request from client: ${ws.id}`, {
    request
  });

  switch (request.type) {
    case _shared.REQUEST_TYPE.UPDATE_NAME:
      const newName = request.newName;

      if (ws.name === null && lobbyState !== _shared.LOBBY_STATE.WAITING_FOR_PLAYERS) {
        return buildError('Game has already started');
      }

      if (playerNames.has(newName)) {
        return {
          error: true,
          message: ERROR.NAME_TAKEN
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

    case _shared.REQUEST_TYPE.TOGGLE_READY:
      if (lobbyState === _shared.LOBBY_STATE.WAITING_FOR_PLAYERS) {
        ws.ready = !ws.ready;
        wss.broadcastReadyStates(getReadyStates(wss));

        if (isAllPlayersReady(wss)) {
          startGame(wss);
        }

        return OK_RESPONSE;
      } else {
        return buildError('game already started');
      }

    case _shared.REQUEST_TYPE.SUBMIT_ANSWER:
      if (currentGame == null) {
        return {
          error: true,
          message: 'Game not running'
        };
      }

      return currentGame.onPlayerSubmit(ws.id, request.text);
  }

  return buildError('unknown request');
};

const onMessage = (wss, ws, message) => {
  console.log(`message from client: ${ws.id}`, {
    message
  });
};

new WebSocketServer(port, {
  onConnection,
  onDisconnection
}, {
  onRequest,
  onMessage
});