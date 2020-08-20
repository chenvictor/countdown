// @flow

import React, {useContext, useState} from 'react';
import type {Node} from 'react';

import type {GameState, Player, Response, SubmitAnswerRequest } from '../../shared';
import {REQUEST_TYPE, GAME_STATUS} from '../../shared';

import NumbersDisplay from './NumbersDisplay';
import AnswerDisplay from './AnswerDisplay';
import NumbersInput from './NumbersInput';
import Waiting from './Waiting';

import WSContext from '../../WSContext';

type Props = {|
  gameState: ?GameState,
  players: Array<Player>,
|};

const GameInner = ({
  gameState,
  players,
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

  const mainContent = (() => {
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
      case GAME_STATUS.SHOWING_ANSWER:
        return (
          <div>
              <NumbersDisplay 
                target={gameState.target}
                numbers={gameState.numbers}
              />
              <AnswerDisplay
                player_name={gameState.player_name}
                player_score={gameState.player_score}
                player_answer_value={gameState.player_answer_value} 
                player_answer={gameState.player_answer}
                error_message={gameState.error_message}
              />
          </div>
        );
      default:
        return null;
    }
  })();

  return <div>
    <span>Round {gameState.current_round} of {gameState.total_rounds}</span>
    {mainContent}
  </div>
};

export default GameInner;