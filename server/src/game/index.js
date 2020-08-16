// @flow

import {EVENT_TYPE} from '../shared';
import {WebSocketServer, WebSocketInstance} from '../wsserver';
import {sleep} from './utils';

export class Game {
  wss: WebSocketServer;

  constructor(wss: WebSocketServer) {
    this.wss = wss;
  }

  async run() {
    this.wss.broadcast({
      type: EVENT_TYPE.GAME_STATE_UPDATE,
      state: {},
    });
    await sleep(2000);
    this.wss.broadcast({
      type: EVENT_TYPE.GAME_STATE_UPDATE,
      state: {},
    });
  }

};
