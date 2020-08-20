// @flow

import assert from 'assert';

import type {ID, BaseGameState, PlayingGameState, ShowingGameState, WaitingGameState, GameState, PlayingGameStatus, GameStatus, Response} from '../shared';
import {EVENT_TYPE, GAME_STATUS, ROUND_LENGTH} from '../shared';
import type {Equation} from '../shared/math';
import {parse, evaluate, getNumbers} from '../shared/math';
import {WebSocketServer, WebSocketInstance} from '../wsserver';
import {sleep, shuffle, rand, getErrorOrValue, getScore} from './utils';

const LARGE_NUMBERS = [100, 75, 50, 25];
// 2 of each number 1-10
const SMALL_NUMBERS = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];

export class Game {
  wss: WebSocketServer;
  submissions: Map<ID, string>;
  status: GameStatus;
  base_state: BaseGameState;
  cancelled: bool;
  
  constructor(wss: WebSocketServer) {
    this.wss = wss;
    this.submissions = new Map();
    this.status = GAME_STATUS.WAITING;
    this.base_state = {
      current_round: 1,
      total_rounds: 1,
      score: {},
    };
    for (const player of this.wss.named_instances) {
      this.base_state.score[player.id] = 0;
    }
    this.cancelled = false;
  }

  cancel() {
    this.cancelled = true;
  }
  
  onPlayerSubmit(id: ID, submission: string): Response {
    if (this.status != GAME_STATUS.ROUND_STARTED) {
      return {
        error: true,
        message: "Round not started",
      };
    }
    if (submission.length > 100) {
      return {
        error: true,
        message: "Submission too large",
      };
    }
    this.submissions.set(id, submission);
    return {
      error: false,
      data: null,
    };
  }
  
  _broadcastState(state: ?GameState): void {
    this.wss.broadcast(
      {
        type: EVENT_TYPE.GAME_STATE_UPDATE,
        state,
      },
    );
  }
  
  async _setWaitingState(message: string, timer: number) {
    this.status = GAME_STATUS.WAITING;
    const state: WaitingGameState = {
      status: this.status,
      ...this.base_state,
      message,
      timer,
    };
    this._broadcastState(state);
    await sleep(timer*1000);
  }
  
  async _setPlayingState(
    status: PlayingGameStatus,
    target: ?number,
    numbers: Array<?number>,
    timer: ?number = null,
  ) {
    this.status = status;
    const state: PlayingGameState = {
      status: this.status,
      ...this.base_state,
      target,
      numbers,
      timer,
    };
    this._broadcastState(state);
    if (timer) {
      await sleep(timer*1000);
    }
  }

  async _setShowingState(
    player_name: string,
    player_answer: ?string,
    player_answer_value: ?number,
    player_score: number,
    target: number,
    numbers: Array<number>,
    error_message: ?string,
  ) {
    this.status = GAME_STATUS.SHOWING_ANSWER;
    const state: ShowingGameState = {
      status: this.status, 
      ...this.base_state,
      player_name,
      player_answer,
      player_answer_value,
      player_score,
      target,
      numbers,
      error_message,
    };
    this._broadcastState(state);
    await sleep(5*1000);
  }
  
  async run() {
    // TODO: this can be configurable
    const roundLength = ROUND_LENGTH._30;
    const smalls = shuffle(SMALL_NUMBERS);
    const larges = shuffle(LARGE_NUMBERS);
    const available_numbers = [...larges.slice(0, 2), ...smalls.slice(0, 4)];
    console.log({nums: available_numbers});
    
    while (this.base_state.current_round <= this.base_state.total_rounds) {
      this.submissions.clear();
      // Round starting
      if (this.cancelled) return;
      this._setWaitingState('Round Starting...', 3);
      await sleep(3000);
      const numbers: Array<?number> = [null, null, null, null, null, null];
      if (this.cancelled) return;
      await this._setPlayingState(GAME_STATUS.ROUND_STARTING, null, numbers);
      // reveal numbers
      for (let i = 5; i >= 0; i--) {
        await sleep(1000);
        numbers[i] = available_numbers[i];
        if (this.cancelled) return;
        await this._setPlayingState(GAME_STATUS.ROUND_STARTING, null, numbers);
      }
      await sleep(2000);
      const target = rand(100, 1000);
      console.log({target});
      if (this.cancelled) return;
      await this._setPlayingState(GAME_STATUS.ROUND_STARTED, target, numbers, 30);
      if (this.cancelled) return;
      await this._setWaitingState('Round Finished!', 3);
      for (const player of this.wss.named_instances) {
        const submission: ?string = this.submissions.get(player.id);
        let errorMessage: ?string = null;
        const player_answer = submission || 'No submission';
        let value = null;
        if (submission == null) {
          errorMessage = 'No submission';
        } else {
          const equation: (Equation | string) = parse(submission);
          if (typeof equation === 'string') {
            errorMessage = 'Failed to parse submission';
          } else {
            const errorOrValue = getErrorOrValue(equation, available_numbers);
            if (typeof errorOrValue === 'string') {
              errorMessage = errorOrValue;
            } else {
              value = errorOrValue;
            }
          }
        }
        const score = value
          ? getScore(Math.abs(target-value))
          : 0;
        console.log({errorMessage, player_answer, value, score});
        this.base_state.score[player.id] += score;
        await this._setShowingState(player.name || 'error getting player name', player_answer, value, score, target, available_numbers, errorMessage);
      }
      if (this.cancelled) return;
      this.base_state.current_round += 1;
    }
    this.base_state.current_round = this.base_state.total_rounds;
    //calc winner
    let maxPoints: number = 0;
    for (const [_, points] of Object.entries(this.base_state.score)) {
      const pts: number = (points: any);
      if (pts > maxPoints) {
        maxPoints = pts;
      }
    }
    const winners = this.wss.named_instances.filter(player => this.base_state.score[player.id] === maxPoints).map(player => player.name || 'name error');
    console.log(winners);
    const summaryString = `Game over!
      With ${maxPoints} points, the winners are:
      ${winners.join(', ')}
    `;
    await this._setWaitingState(summaryString, 5);
    this._broadcastState(null);
  }
};
