"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildError = exports.isAllPlayersReady = exports.getReadyStates = exports.getPlayerList = exports.uid = void 0;

var _wsserver = require("./wsserver");

const {
  default: ShortUniqueId
} = require('short-unique-id');

const _uid = new ShortUniqueId();

const assert = require('assert');

const uid = () => {
  const id = _uid.seq();

  return id;
};

exports.uid = uid;

const getPlayerList = wss => {
  const players = [];

  for (const instance of wss.named_instances) {
    players.push({
      id: instance.id,
      name: instance.name
    });
  }

  return players;
};

exports.getPlayerList = getPlayerList;

const getReadyStates = wss => {
  const ready_states = {};

  for (const instance of wss.named_instances) {
    ready_states[instance.id] = instance.ready;
  }

  return ready_states;
};

exports.getReadyStates = getReadyStates;

const isAllPlayersReady = wss => {
  const players = wss.named_instances;

  if (players.length === 0) {
    return false;
  }

  return players.every(player => player.ready);
};

exports.isAllPlayersReady = isAllPlayersReady;

const buildError = message => ({
  error: true,
  message
});

exports.buildError = buildError;