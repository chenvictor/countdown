// @flow

import React, {useEffect, useRef, useState} from 'react';
import Grid from '@material-ui/core/Grid';

type Props = {|
  message: string,
  timer: number,
|};

const Waiting = ({
  message,
  timer,
}: Props) => {
  const [t, setT] = useState(timer);
  const interval = useRef(null);
  useEffect(() => {
    setT(timer);
    interval.current = setInterval(() => {
      setT(t => t-1);
    }, 1000);
    return () => {
      clearInterval(interval.current);
      interval.current = null;
    };
  }, [timer, message]);
  return (
    <Grid container spacing={8}>
      <Grid item xs align='center'>
        <h3>{message} - {t}</h3>
      </Grid>
    </Grid>
  );
};

export default Waiting;