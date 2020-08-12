// @flow

import type {Player} from '../types';

import {w3cwebsocket} from 'websocket';

export type WebSocketMessage = {
  players?: Array<Player>,
};

type WebSocketHandlers = {
  onmessage: (WebSocketPlus, message: WebSocketMessage) => void,
  onopen: (WebSocketPlus) => void,
};

type Request = {
  resolve: (any) => void,
  timeout: any,
};

type WebSocketErrorResponse = {|
  error: true,
  message: string,
|};

export type WebSocketResponse = {
  m_id: number,
  ...WebSocketErrorResponse,
} | {
  error: false,
  m_id: number,
};

const TIMEOUT = 1000;

export default class WebSocketPlus {
  ws: any;
  ready: boolean;
  message_id: number;
  requests: Map<number, Request>;
  constructor(url: string) {
    this.ws = new w3cwebsocket('ws://localhost:3001');
    this.ready = false;
    this.message_id = 0;
    this.requests = new Map();
  }

  setHandlers({
    onmessage,
    onopen
  }: WebSocketHandlers) {
    this.ws.onmessage = ({data}: {data: string}) => {
      console.log('received server message', data);
      let parsed = null;
      try {
        parsed = JSON.parse(data);
      } catch (e) {
        console.error('error parsing server message', data);
        return;
      }
      if (parsed == null) {
        return;
      }
      if ('m_id' in parsed) {
        // check response to message
        const request = this.requests.get(parsed.m_id);
        if (request != null) {
          clearTimeout(request.timeout);
          request.resolve(parsed);
          this.requests.delete(parsed.m_id);
        }
        return;
      }
      onmessage(this, parsed);
     };
    this.ws.onopen = () => {this.ready = true; onopen(this);};
  }

  /**
   * Send without waiting for server response
   */
  send(data: string) {
    if (this.ready) {
      this.ws.send(data);
    } else {
      console.error('ws not open yet!');
    }
  }

  /**
   * Send and wait for server response
   * JSON data pls
   */
  async sendRes(data: any): Promise<WebSocketResponse> {
    const m_id = this.message_id;
    this.message_id += 1;
    const payload = {
      m_id,
      data,
    };
    this.ws.send(JSON.stringify(payload));
    return new Promise<WebSocketResponse>((resolve, _reject) => {
      this.requests.set(m_id, {
        resolve,
        timeout: setTimeout(() => {
          if (this.requests.has(m_id)) {
            resolve({
              error: true,
              m_id,
              message: 'SOCKET TIMEOUT',
            });
            this.requests.delete(m_id);
          }
        }, TIMEOUT),
      })
    });
  }

};
