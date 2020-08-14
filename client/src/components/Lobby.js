// @flow

import React, {useState} from 'react';

import Button from './CustomButton';

type Props = {|

|};

const Lobby = (props: Props) => {
  const [isReady, setReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleReady = () => setReady(!isReady);
  return <Button variant={isReady ? 'success' : 'danger'} isLoading={isLoading} text='Toggle Ready' onClick={toggleReady} />
};

export default Lobby;