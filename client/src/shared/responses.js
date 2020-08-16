// @flow

import type {ID} from './index';

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
