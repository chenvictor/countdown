// @flow

import type {GameState} from '../shared';
import {EVENT_TYPE, GAME_STATUS, ROUND_LENGTH} from '../shared';
import {WebSocketServer, WebSocketInstance} from '../wsserver';
import {sleep, shuffle, rand} from './utils';

const LARGE_NUMBERS = [100, 75, 50, 25];
// 2 of each number 1-10
const SMALL_NUMBERS = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];

export class Game {
  wss: WebSocketServer;

  constructor(wss: WebSocketServer) {
    this.wss = wss;
  }

  async run() {
    // TODO: this can be configurable
    const roundLength = ROUND_LENGTH._30;
    const total_rounds = 5;
    const current_round = 1;
    const smalls = shuffle(SMALL_NUMBERS);
    const larges = shuffle(LARGE_NUMBERS);
    const nums = [...larges.slice(0, 2), ...smalls.slice(0, 4)];
    console.log(nums);

    const state: GameState = {
      status: GAME_STATUS.ROUND_STARTING,
      message: 'Reveal numbers',
      current_round,
      total_rounds,
      timer: roundLength,
      target: null,
      numbers: [null, null, null, null, null, null],
    };
    // Round starting
    this.wss.broadcast({
      type: EVENT_TYPE.GAME_STATE_UPDATE,
      state,
    });
    // reveal numbers
    for (let i = 5; i >= 0; i--) {
      await sleep(1000);
      state.numbers[i] = nums[i];
      this.wss.broadcast({
        type: EVENT_TYPE.GAME_STATE_UPDATE,
        state,
      })
    }
    await sleep(3000);
    state.target = rand(100, 1000);
    state.message = 'Reveal target';
    this.wss.broadcast({
      type: EVENT_TYPE.GAME_STATE_UPDATE,
      state,
    })
    // pause 30 secs
    await sleep(30000);
  }

};
