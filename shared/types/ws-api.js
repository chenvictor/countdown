// @flow

import type {ID, Player} from './index';

export type ErrorResponse = {|
  error: true,
  message: string,
|};

export type OkResponse = {|
  error: false,
  data: any,
|};

export type Response = ErrorResponse | OkResponse;

export type RawResponse = {|
  m_id: ID,
  response: Response,
|};

export type UpdateNameRequest = {|
  type: 'update_name',
  newName: string,
|};

export type Request = UpdateNameRequest;

export type RawRequest = {|
  m_id: ID,
  request: Request,
|};

export type GameStateUpdate = {|
  players?: Array<Player>,
|};

export type GameStateUpdateEvent = {|
  type: 'state_update',
  state: GameStateUpdate,
|};

export type Event = GameStateUpdateEvent;