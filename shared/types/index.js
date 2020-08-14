// @flow

export type ID = string;

export type Player = {|
  id: ID,
  name: ?string,
|};

export * from './ws-api';