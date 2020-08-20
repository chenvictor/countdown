"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Game = void 0;

var _assert = _interopRequireDefault(require("assert"));

var _shared = require("../shared");

var _math = require("../shared/math");

var _wsserver = require("../wsserver");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LARGE_NUMBERS = [100, 75, 50, 25]; // 2 of each number 1-10

const SMALL_NUMBERS = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];

class Game {
  constructor(wss) {
    this.wss = wss;
    this.submissions = new Map();
    this.status = _shared.GAME_STATUS.WAITING;
    this.base_state = {
      current_round: 1,
      total_rounds: 1,
      score: {}
    };

    for (const player of this.wss.named_instances) {
      this.base_state.score[player.id] = 0;
    }

    this.cancelled = false;
  }

  cancel() {
    this.cancelled = true;
  }

  onPlayerSubmit(id, submission) {
    if (this.status != _shared.GAME_STATUS.ROUND_STARTED) {
      return {
        error: true,
        message: "Round not started"
      };
    }

    if (submission.length > 100) {
      return {
        error: true,
        message: "Submission too large"
      };
    }

    this.submissions.set(id, submission);
    return {
      error: false,
      data: null
    };
  }

  _broadcastState(state) {
    this.wss.broadcast({
      type: _shared.EVENT_TYPE.GAME_STATE_UPDATE,
      state
    });
  }

  async _setWaitingState(message, timer) {
    this.status = _shared.GAME_STATUS.WAITING;
    const state = {
      status: this.status,
      ...this.base_state,
      message,
      timer
    };

    this._broadcastState(state);

    await (0, _utils.sleep)(timer * 1000);
  }

  async _setPlayingState(status, target, numbers, timer = null) {
    this.status = status;
    const state = {
      status: this.status,
      ...this.base_state,
      target,
      numbers,
      timer
    };

    this._broadcastState(state);

    if (timer) {
      await (0, _utils.sleep)(timer * 1000);
    }
  }

  async _setShowingState(player_name, player_answer, player_answer_value, player_score, target, numbers, error_message) {
    this.status = _shared.GAME_STATUS.SHOWING_ANSWER;
    const state = {
      status: this.status,
      ...this.base_state,
      player_name,
      player_answer,
      player_answer_value,
      player_score,
      target,
      numbers,
      error_message
    };

    this._broadcastState(state);

    await (0, _utils.sleep)(5 * 1000);
  }

  async run() {
    // TODO: this can be configurable
    const roundLength = _shared.ROUND_LENGTH._30;
    const smalls = (0, _utils.shuffle)(SMALL_NUMBERS);
    const larges = (0, _utils.shuffle)(LARGE_NUMBERS);
    const available_numbers = [...larges.slice(0, 2), ...smalls.slice(0, 4)];
    console.log({
      nums: available_numbers
    });

    while (this.base_state.current_round <= this.base_state.total_rounds) {
      this.submissions.clear(); // Round starting

      if (this.cancelled) return;

      this._setWaitingState('Round Starting...', 3);

      await (0, _utils.sleep)(3000);
      const numbers = [null, null, null, null, null, null];
      if (this.cancelled) return;
      await this._setPlayingState(_shared.GAME_STATUS.ROUND_STARTING, null, numbers); // reveal numbers

      for (let i = 5; i >= 0; i--) {
        await (0, _utils.sleep)(1000);
        numbers[i] = available_numbers[i];
        if (this.cancelled) return;
        await this._setPlayingState(_shared.GAME_STATUS.ROUND_STARTING, null, numbers);
      }

      await (0, _utils.sleep)(2000);
      const target = (0, _utils.rand)(100, 1000);
      console.log({
        target
      });
      if (this.cancelled) return;
      await this._setPlayingState(_shared.GAME_STATUS.ROUND_STARTED, target, numbers, 30);
      if (this.cancelled) return;
      await this._setWaitingState('Round Finished!', 3);

      for (const player of this.wss.named_instances) {
        const submission = this.submissions.get(player.id);
        let errorMessage = null;
        const player_answer = submission || 'No submission';
        let value = null;

        if (submission == null) {
          errorMessage = 'No submission';
        } else {
          const equation = (0, _math.parse)(submission);

          if (typeof equation === 'string') {
            errorMessage = 'Failed to parse submission';
          } else {
            const errorOrValue = (0, _utils.getErrorOrValue)(equation, available_numbers);

            if (typeof errorOrValue === 'string') {
              errorMessage = errorOrValue;
            } else {
              value = errorOrValue;
            }
          }
        }

        const score = value ? (0, _utils.getScore)(Math.abs(target - value)) : 0;
        console.log({
          errorMessage,
          player_answer,
          value,
          score
        });
        this.base_state.score[player.id] += score;
        await this._setShowingState(player.name || 'error getting player name', player_answer, value, score, target, available_numbers, errorMessage);
      }

      if (this.cancelled) return;
      this.base_state.current_round += 1;
    }

    this.base_state.current_round = this.base_state.total_rounds; //calc winner

    let maxPoints = 0;

    for (const [_, points] of Object.entries(this.base_state.score)) {
      const pts = points;

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

}

exports.Game = Game;
;