// @flow

import React, {useEffect, useState} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import type {ID, Player, ReadyStates} from '../../shared';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import PlayerList from './components/PlayerList';
import Setup from './components/Setup';
import Game from './components/Game';

import WebSocketClient from './wsclient';

import WSContext from './WSContext';

const _ws = new WebSocketClient('ws://localhost:3001');

const App = () => {
  // Hooks
  const [connecting, setConnecting] = useState(true);
  const [players, setPlayers] = useState<Array<Player>>([]);
  const [readyStates, setReadyStates] = useState<ReadyStates>({});
  const [id, setId] = useState<?ID>(null);

  const me = players.find(player => player.id === id);

  useEffect(() => {
    _ws.setCallbacks({
      onConnectionChange: (connected): void => {
        setTimeout(() => {
          setConnecting(!connected);
        }, 250);
      },
      onPlayerListUpdate: setPlayers,
      onIDUpdate: setId,
      onReadyStatesUpdate: setReadyStates,
    });
  }, []);

  return (
    <WSContext.Provider value={_ws}>
      <Container className='my-5'>
        <Jumbotron>
          <Row>
          <Col xs={3}>
            <PlayerList me={me} players={players} readyStates={readyStates} />
          </Col>
          <Col>
            {me
              ? <Game />
              : <Setup />
            }
          </Col>
          </Row>
        </Jumbotron>
        <Dialog
          open={connecting}
          p={5}
        >
          <DialogContent>
            <div>Connecting to server...</div>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      </Container>
    </WSContext.Provider>
  );
}

export default App;

export type { Player };