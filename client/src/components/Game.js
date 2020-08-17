// @flow

import React from 'react';

import type {Player, ReadyStates, GameState, LobbyState} from '../shared';
import {LOBBY_STATE} from '../shared';

import Lobby from './Lobby';
import GameInner from './game';

type Props = {|
  me: Player,
  readyStates: ReadyStates,
  lobbyState: ?LobbyState,
  gameState: ?GameState,
|};

const Game = ({
  me,
  readyStates,
  lobbyState,
  gameState,
}: Props) => {
  const isReady: bool = Boolean(readyStates[me.id]);
  switch (lobbyState) {
    case null:
    case LOBBY_STATE.WAITING_FOR_PLAYERS:
      return <Lobby isReady={isReady} />;
    case LOBBY_STATE.IN_GAME:
      return <GameInner gameState={gameState} />
    default:
      console.error('Unexpected lobby state!', lobbyState);
      return null;
  }
};

export default Game;
