// @flow

import {w3cwebsocket} from 'websocket';

import type {ID, Response, RawRequest, Request, Player, UpdateNameRequest} from '../../../shared/types';

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
};

export default class WebSocketClient {
  ws: any;
  ready: boolean;
  message_id: number;
  requests: Map<ID, PendingRequest>;
  constructor(url: string) {
    this.ws = new w3cwebsocket('ws://localhost:3001');
    this.ready = false;
    this.message_id = 0;
    this.requests = new Map();
  }

  setCallbacks(callbacks: ClientCallbacks): void {
    this.ws.onopen = () => {
      callbacks.onConnectionChange(true);
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
        });
        return;
      }
      console.warn('unknown message format', {data});
    };
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
      type: 'name_update',
      newName: name,
    };
    return this.send(request);
  }

};
