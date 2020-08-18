// @flow

import React, {useState} from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import {parse} from '../../shared/math/utils';

type Props = {|
  submitValue: (string) => void,
  numbers: Array<?number>,
|};

const NumbersInput = ({
  submitValue,
  numbers,
}: Props) => {
  const [error, setError] = useState<?string>(null);
  const [value, setValue] = useState<string>('');

  const onSubmit = () => {
    const equationOrError = parse(value);
    if (typeof equationOrError === 'string') {
      setError(equationOrError);
    } else {
      submitValue(value);
    }
  };
  const onChange = (e) => {
    const val = e.target.value;
    if (val.length === 0) {
      setError('empty');
    } else {
      setError(null);
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
            error={Boolean(error)}
            helperText={error}
          />
        </Grid>
      </Grid>
      <Grid container spacing={8}>
        <Grid item xs align='center'>
          <Button onClick={onSubmit} color='primary' variant='contained'>Submit</Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default NumbersInput;