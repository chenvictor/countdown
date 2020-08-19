// @flow

import React, {useState} from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import Waiting from './Waiting';

import {parse} from '../../shared/math/utils';

type Props = {|
  numbers: Array<?number>,
  isSubmitting: bool,
  inputMessage: ?string,
  timer: ?number,
  setInputMessage: (?string) => void,
  submitValue: (string) => void,
|};

const NumbersInput = ({
  numbers,
  isSubmitting,
  inputMessage,
  setInputMessage,
  submitValue,
  timer,
}: Props) => {
  const [value, setValue] = useState<string>('');

  const onSubmit = () => {
    const equationOrError = parse(value);
    if (typeof equationOrError === 'string') {
      setInputMessage(`Error: ${equationOrError}`);
    } else {
      submitValue(value);
    }
  };
  const onChange = (e) => {
    const val = e.target.value;
    if (val.length === 0) {
      setInputMessage('Error: empty');
    } else {
      setInputMessage('');
    }
    setValue(val);
  };


  return (
    <React.Fragment>
      <Grid container spacing={8}>
        <Grid item xs align='center'>
          <TextField
            label='Equation'
            rows={4}
            value={value}
            onChange={onChange}
            variant='outlined'
            helperText={inputMessage}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onSubmit();
              }
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={8}>
        <Grid item xs align='center'>
          {
            timer && <Waiting timer={timer} message='Time left'/>
          }
          <Button onClick={onSubmit} color='primary' variant='contained'>Submit</Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default NumbersInput;