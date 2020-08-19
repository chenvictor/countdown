// @flow

import React, {useContext, useState} from 'react';
import type {Node} from 'react';

import type {GameState, Response, SubmitAnswerRequest } from '../../shared';
import {REQUEST_TYPE, GAME_STATUS} from '../../shared';

import NumbersDisplay from './NumbersDisplay';
import NumbersInput from './NumbersInput';
import Waiting from './Waiting';

import WSContext from '../../WSContext';

type Props = {|
  gameState: ?GameState,
|};

const GameInner = ({
  gameState
}: Props): Node => {
  const client = useContext(WSContext);
  const [submitting, setSubmitting] = useState(false);
  const [inputMessage, setInputMessage] = useState<?string>(null);

  const submitValue = (value: string) => {
    const req: SubmitAnswerRequest = {
      type: REQUEST_TYPE.SUBMIT_ANSWER,
      text: value,
    };
    setSubmitting(true);
    setInputMessage(null);
    client.send(req).then((res: Response) => {
      setSubmitting(false);
      if (res.error) {
        setInputMessage(`Error: ${res.message}`);
      } else {
        setInputMessage('Answer Submitted!');
      }
    });
  };

  if (gameState == null) {
    return <div>game state loading</div>;
  }

  switch (gameState.status) {
    case GAME_STATUS.WAITING:
      return <Waiting message={gameState.message} timer={gameState.timer}/>
    case GAME_STATUS.ROUND_STARTING:
    case GAME_STATUS.ROUND_STARTED:
    case GAME_STATUS.ROUND_FINISHED:
      return (
        <div>
            <NumbersDisplay 
              target={gameState.target}
              numbers={gameState.numbers}
            />
            {
              gameState.target &&
                <NumbersInput
                  submitValue={submitValue}
                  inputMessage={inputMessage}
                  setInputMessage={setInputMessage}
                  isSubmitting={submitting}
                  numbers={gameState.numbers}
                  timer={gameState.timer}
                />
            }
        </div>
      );
    default:
      return null;
  }
};

export default GameInner;