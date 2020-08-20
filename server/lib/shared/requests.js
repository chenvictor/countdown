"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REQUEST_TYPE = void 0;
// Client -> Server requests
const REQUEST_TYPE = {
  UPDATE_NAME: 'update_name',
  TOGGLE_READY: 'toggle_ready',
  SUBMIT_ANSWER: 'submit_answer'
};
exports.REQUEST_TYPE = REQUEST_TYPE;