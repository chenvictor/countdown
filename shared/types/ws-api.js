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
  type: 'name_update',
  newName: string,
|};

export type Request = UpdateNameRequest;

export type RawRequest = {|
  m_id: ID,
  request: Request,
|};

export type PlayerListUpdateEvent = {|
  type: 'player_list_update',
  players: Array<Player>,
|};

export type IDUpdateEvent = {|
  type: 'id_update',
  id: ?ID,
|};

export type Event = PlayerListUpdateEvent | IDUpdateEvent;