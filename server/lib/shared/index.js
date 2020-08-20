"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  LOBBY_STATE: true
};
exports.LOBBY_STATE = void 0;

var _requests = require("./requests");

Object.keys(_requests).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _requests[key];
    }
  });
});

var _responses = require("./responses");

Object.keys(_responses).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _responses[key];
    }
  });
});

var _events = require("./events");

Object.keys(_events).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _events[key];
    }
  });
});

var _game = require("./game");

Object.keys(_game).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _game[key];
    }
  });
});

/**
 * After changing, run
 * cp -r shared client/src && cp -r shared server/src
 */
const LOBBY_STATE = {
  WAITING_FOR_PLAYERS: 'waiting_for_players',
  IN_GAME: 'in_game'
};
exports.LOBBY_STATE = LOBBY_STATE;