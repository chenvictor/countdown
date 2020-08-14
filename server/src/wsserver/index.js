// @flow

const WebSocket = require('ws');
const assert = require('assert');

import type {ID, GameStateUpdate, GameStateUpdateEvent, RawResponse, Response, Request} from '../../../shared/types';

const {uid} = require('../utils');

const {parseRequest} = require('./utils');

type InstanceHandlers = {
  onRequest: (WebSocketServer, WebSocketInstance, Request) => Response,
  onMessage: (WebSocketServer, WebSocketInstance, string) => void,
};

class WebSocketInstance {
  id: ID;
  _wss: WebSocketServer;
  _ws: any;
  name: ?string;
  
  constructor(
    id: ID,
    server: WebSocketServer,
    ws: any,
    callbacks: InstanceHandlers,
  ) {
    this.id = id;
    this._wss = server;
    this._ws = ws;
    this.name = null;
    this._ws.on(
      "message",
      (message: string) => {
        const request = parseRequest(message);
        if (request == null) {
          callbacks.onMessage(this._wss, this, message);
          return;
        }
        const response = callbacks.onRequest(this._wss, this, request.request);
        const rawResponse: RawResponse = {
          m_id: request.m_id,
          response,
        };
        this._ws.send(JSON.stringify(rawResponse));
      },
    );
  }
  
  sendPlayerList(state: GameStateUpdate): void {
    if (this._ws.readyState === WebSocket.OPEN) {
      const event: GameStateUpdateEvent = {
        type: "state_update",
        state,
      };
      this._ws.send(JSON.stringify(event));
    }
  }
}

type ServerHandlers = {
  onConnection: (WebSocketServer, WebSocketInstance) => void,
  onDisconnection: (WebSocketServer, WebSocketInstance) => void,
};

class WebSocketServer {
  _wss: any;
  _instances: Map<ID, WebSocketInstance>;
  constructor(
    port: number,
    handlers: ServerHandlers,
    instanceHandlers: InstanceHandlers,
  ) {
    this._wss = new WebSocket.Server(
      {
        port,
      },
      () => {
        console.log(`WebSocket Server started on port ${port}`);
      },
    );
    this._instances = new Map();
    this._wss.on(
      "connection",
      ws => {
        console.debug("socket opened");
        let id: ID = uid();
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
        ws.on(
          "close",
          () => {
            console.debug("socket closed");
            handlers.onDisconnection(this, instance);
            this._instances.delete(id);
          },
        );
      },
    );
  }
  
  get instances(): Array<WebSocketInstance> {
    return [...this._instances.values()];
  }
  
  broadcastPlayerList(state: GameStateUpdate): void {
    this._instances.forEach(instance => instance.sendPlayerList(state));
  }
};

module.exports = {
  WebSocketServer,
  WebSocketInstance,
};