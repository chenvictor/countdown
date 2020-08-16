// @flow

import React from 'react';

import type {Player, ReadyStates} from '../shared';

import Lobby from './Lobby';

type Props = {|
  me: Player,
  readyStates: ReadyStates,
|};

const Game = ({
  me,
  readyStates
}: Props) => {
  const isReady: bool = Boolean(readyStates[me.id]);
  return <Lobby isReady={isReady} />;
};

export default Game;