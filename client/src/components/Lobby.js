// @flow

import React, {useContext, useState} from 'react';

import Button from './CustomButton';

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
  const toggleReady = () => {
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
    <span>
      <Button variant={isReady ? 'success' : 'danger'} isLoading={isLoading} text='Toggle Ready' onClick={toggleReady} />
      {error}
    </span>
  );
};

export default Lobby;