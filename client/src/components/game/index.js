// @flow

import React from 'react';

import NumbersDisplay from './NumbersDisplay';
import NumbersInput from './NumbersInput';

import type {GameState} from '../../shared';

type Props = {|
  gameState: ?GameState,
|};

const GameInner = ({
  gameState
}: Props) => {
  const submitValue = (value: string) => {
    console.log('submitting', {value});
  };

  return gameState
    ? (
        <React.Fragment>
          <NumbersDisplay 
            target={gameState.target}
            numbers={gameState.numbers}
          />
          {gameState.target && <NumbersInput submitValue={submitValue} numbers={gameState.numbers}/> }
        </React.Fragment>
      )
      : 'game state loading...';
};

export default GameInner;