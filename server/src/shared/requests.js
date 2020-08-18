// @flow

import type {ID} from './index';
import type {Equation} from './math'

// Client -> Server requests
export const REQUEST_TYPE = {
  UPDATE_NAME: ('update_name': 'update_name'),
  TOGGLE_READY: ('toggle_ready': 'toggle_ready'),
  SUBMIT_ANSWER: ('submit_answer': 'submit_answer'),
};

export type UpdateNameRequest = {|
  type: typeof REQUEST_TYPE.UPDATE_NAME,
  newName: string,
|};

export type ToggleReadyRequest = {|
  type: typeof REQUEST_TYPE.TOGGLE_READY,
|};

export type SubmitAnswerRequest = {|
  type: typeof REQUEST_TYPE.SUBMIT_ANSWER,
  equation: Equation,
  text: string,
|};

export type Request = UpdateNameRequest | ToggleReadyRequest | SubmitAnswerRequest;

export type RawRequest = {|
  m_id: ID,
  request: Request,
|};
