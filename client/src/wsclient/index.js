// @flow

import {w3cwebsocket} from 'websocket';

import type {ID, Response, RawRequest, Request, ReadyStates, Player, UpdateNameRequest, ToggleReadyRequest} from '../shared';
import {REQUEST_TYPE} from '../shared';

import {parseResponse, parseEvent, handleEvent} from './utils';
import {uid} from '../utils';

export type WebSocketMessage = {
  players?: Array<Player>,
};

type PendingRequest = {
  resolve: (Response) => void,
  timeout: any,
};

const TIMEOUT = 1000;

type ClientCallbacks = {
  onIDUpdate: (?ID) => void,
  onPlayerListUpdate: (Array<Player>) => void,
  onConnectionChange: (bool) => void,
  onReadyStatesUpdate: (ReadyStates) => void,
};

export default class WebSocketClient {
  url: string;
  ws: any;
  ready: boolean;
  message_id: number;
  requests: Map<ID, PendingRequest>;
  callbacks: ?ClientCallbacks;
  constructor(url: string) {
    this.url = url;
    this.ws = null;
    this.ready = false;
    this.message_id = 0;
    this.requests = new Map();
    this.callbacks = null;
    this._connect();
  }

  _connect(): void {
    if (this.ws) {
      this.ws.close();
    }
    this.ws = new w3cwebsocket(this.url);
    this._attachCallbacks();
  }

  _attachCallbacks(): void {
    const callbacks = this.callbacks;
    if (!callbacks) {
      return;
    }
    this.ws.onopen = () => {
      callbacks.onConnectionChange(true);
    };
    this.ws.onclose = () => {
      callbacks.onConnectionChange(false);
      console.warn('connection closed, attempting to reconnect');
      this.ws = null;
      this._connect();
    };
    this.ws.onmessage = ({data}: {data: string}) => {
      const rawResponse = parseResponse(data);
      if (rawResponse) {
        this._resolveRequest(rawResponse.m_id, rawResponse.response);
        return;
      }
      const event = parseEvent(data);
      if (event) {
        handleEvent(event, {
          onPlayerListUpdate: callbacks.onPlayerListUpdate,
          onIDUpdate: callbacks.onIDUpdate,
          onReadyStatesUpdate: callbacks.onReadyStatesUpdate,
        });
        return;
      }
      console.warn('unknown message format', {data});
    };
    this.ws.onerror = (e) => {
      console.error('socket error, closing connection', e);
      this.ws.close();
    };
  }

  setCallbacks(callbacks: ClientCallbacks): void {
    this.callbacks = callbacks;
    this._attachCallbacks();
  }

  _resolveRequest(id: ID, response: ?Response): void {
    const noWarn = response == null;
    response = response ?? {
      error: true,
      message: 'TIMEOUT',
    };
    const request = this.requests.get(id);
    if (request == null) {
      if (!noWarn) {
        console.warn(`request ID ${id} is not pending`);
      }
      return;
    }
    clearTimeout(request.timeout);
    request.resolve(response);
    this.requests.delete(id);
  }

  async send(request: Request): Promise<Response> {
    const m_id = uid();
    const payload: RawRequest = {
      m_id,
      request,
    };
    this.ws.send(JSON.stringify(payload));
    return new Promise<Response>(resolve => {
      this.requests.set(m_id, {
        resolve,
        timeout: setTimeout(() => {
          this._resolveRequest(m_id, null);
        }, TIMEOUT),
      })
    });
  }

  async sendNameUpdate(name: string): Promise<Response> {
    const request: UpdateNameRequest = {
      type: REQUEST_TYPE.UPDATE_NAME,
      newName: name,
    };
    return this.send(request);
  }

  async sendToggleReadyUpdate(): Promise<Response> {
    const request: ToggleReadyRequest = {
      type: REQUEST_TYPE.TOGGLE_READY,
    };
    return this.send(request);
  }

};
