// @flow

import React from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import NumberSpinner from './NumberSpinner';

type Props = {|
  target: ?number,
  numbers: Array<?number> | Array<number>,
|};

const NumbersDisplay = ({
  target,
  numbers,
}: Props) => {
  const spinTarget = numbers.every(num => num != null);
  return (
    <React.Fragment>
      <Grid container spacing={8}>
        <Grid item xs align='center'>
          <h4>Target</h4>
          <Box>
            {target || (spinTarget && <NumberSpinner />) || '...'}
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={8}>
        <Grid item xs align='center'>
          <b>Numbers:</b>
          <br/>
          <ButtonGroup
            variant='text'
            color='secondary'
            disableRipple
            >
            {
              numbers.map((number, index) => (
                <Button key={index}>{number || '?'}</Button>
              ))
            }
          </ButtonGroup>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default NumbersDisplay;