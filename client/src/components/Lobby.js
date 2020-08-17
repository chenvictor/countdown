// @flow

import React, {useContext, useState} from 'react';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import WSContext from '../WSContext';

type Props = {|
  isReady: bool,
|};

const Lobby = ({
  isReady,
}: Props) => {
  const [isLoading, setIsLoading] = useState<bool>(false);
  const [error, setError] = useState<?string>(null);
  const client = useContext(WSContext);

  const onSwitch = (): void => {
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
    <FormControl component='fieldset'>
      <FormLabel component='legend'>Game will start once all players are ready!</FormLabel>
      <FormGroup aria-label='position' row>
        <FormControlLabel
          control={<Switch name='temp' disabled={isLoading} checked={isReady} onChange={onSwitch} />}
          label='Ready'
          labelPlacement="start"
        />
        {error && <FormHelperText className='ml-4' error={true}>{error}</FormHelperText>}
      </FormGroup>
    </FormControl>
  );
};

export default Lobby;