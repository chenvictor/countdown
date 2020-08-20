"use strict";

var _shared = require("../shared");

const WebSocket = require('ws');

const assert = require('assert');

const {
  uid
} = require('../utils');

const {
  parseRequest
} = require('./utils');

class WebSocketInstance {
  constructor(id, server, ws, callbacks) {
    this.id = id;
    this._wss = server;
    this._ws = ws;
    this.name = null;
    this.ready = false;

    this._ws.on('message', message => {
      const request = parseRequest(message);

      if (request == null) {
        callbacks.onMessage(this._wss, this, message);
        return;
      }

      const response = callbacks.onRequest(this._wss, this, request.request);
      const rawResponse = {
        m_id: request.m_id,
        response
      };

      this._ws.send(JSON.stringify(rawResponse));
    });

    const event = {
      type: 'id_update',
      id
    };
    this.send(event);
  }

  send(event) {
    if (this._ws.readyState !== WebSocket.OPEN) {
      console.error(`attempting to send event to ${this.id} but socket is not ready!`);
      return;
    }

    this._ws.send(JSON.stringify(event));
  }

  sendPlayerList(players) {
    const event = {
      type: _shared.EVENT_TYPE.PLAYER_LIST_UPDATE,
      players
    };
    this.send(event);
  }

}

class WebSocketServer {
  constructor(port, handlers, instanceHandlers) {
    this._wss = new WebSocket.Server({
      port
    }, () => {
      console.log(`WebSocket Server started on port ${port}`);
    });
    this._instances = new Map();

    this._wss.on('connection', ws => {
      let id = uid();
      let tries = 3;

      while (this._instances.has(id)) {
        id = uid();
        tries -= 1;

        if (tries === 0) {
          console.error("Failed to assign new ID");
          ws.terminate();
          return;
        }
      }

      const instance = new WebSocketInstance(id, this, ws, instanceHandlers);

      this._instances.set(id, instance);

      handlers.onConnection(this, instance);
      ws.on('close', () => {
        this._instances.delete(id);

        handlers.onDisconnection(this, instance);
      });
    });
  } // Return all instances


  get instances() {
    return [...this._instances.values()];
  } // Return all named instances


  get named_instances() {
    return [...this._instances.values()].filter(instance => instance.name);
  } // Send event to all players


  broadcast(event) {
    this._instances.forEach(instance => instance.send(event));
  } // Send event to all players who have names


  broadcastNamed(event) {
    this._instances.forEach(instance => instance.name && instance.send(event));
  }

  broadcastPlayerList(players) {
    this._instances.forEach(instance => instance.sendPlayerList(players));
  }

  broadcastReadyStates(ready_states) {
    const event = {
      type: _shared.EVENT_TYPE.READY_STATES_UPDATE,
      ready_states
    };
    this.broadcastNamed(event);
  }

}

;
module.exports = {
  WebSocketServer,
  WebSocketInstance
};