// @flow

import React, {useContext, useState} from 'react';
import Switch from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';

import WSContext from '../WSContext';

type Props = {|
  isReady: bool,
|};

const Lobby = ({
  isReady,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<?string>(null);
  const client = useContext(WSContext);

  const onSwitch = (e): void => {
    const checked: bool = e.target.checked;
    setIsLoading(true);
    setError(null);
    client.sendToggleReadyUpdate().then(response => {
      setIsLoading(false);
      if (response.error) {
        setError(response.message);
      }
    });
  };
 
  return (
    <FormControl comonent='fieldset'>
      <FormLabel component='legend'>Game will start once all players are ready!</FormLabel>
      <FormGroup aria-label='position' row>
        <FormControlLabel
          value="start"
          control={<Switch disabled={isLoading} onChange={onSwitch} />}
          label='Ready'
          labelPlacement="start"
        />
        {error && <FormHelperText error={true}>{error}</FormHelperText>}
      </FormGroup>
    </FormControl>
  );
};

export default Lobby;