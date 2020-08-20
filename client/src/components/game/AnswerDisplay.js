// @flow

import React from 'react';
import Grid from '@material-ui/core/Grid';

type Props = {|
  player_name: string,
  player_answer: ?string,
  player_answer_value: ?number,
  player_score: number,
  error_message: ?string,
|};

const AnswerDisplay = ({
  player_name,
  player_answer,
  player_answer_value,
  player_score,
  error_message,
}: Props) => {
  return (
    <Grid container spacing={8}>
      <Grid item xs align='center'>
        {
          player_answer
            ? (
              <React.Fragment>
                <h4>{player_name}'s answer</h4>
                <h5>{player_answer || 'None'}</h5>
              </React.Fragment>
            )
            : null
        }
        {
          player_answer_value != null
            ? <h5>= {player_answer_value}</h5>
            : <h5>{error_message || 'error'}</h5>
        }
        {
          <h5>Score: {player_score}</h5>
        }
      </Grid>
    </Grid>
  );
};

export default AnswerDisplay;
