// @flow

import React, {useContext, useEffect, useState} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import type {ID, Player} from '../../shared/types';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import PlayerList from './components/PlayerList';
import Setup from './Setup';

import type {WebSocketMessage} from './wsclient';
import WebSocketClient from './wsclient';

import WSContext from './WSContext';

type Props = {||};

const App = (props: Props) => {
  // Hooks
  const [connecting, setConnecting] = useState(true);
  const [players, setPlayers] = useState<Array<Player>>([]);
  const [id, setId] = useState<?ID>(null);

  useEffect(() => {
    window._ws = new WebSocketClient('ws://localhost:3001', {
      onConnectionChange: (connected): void => {
        setTimeout(() => {
          setConnecting(!connected);
        }, 250);
      },
      onStateUpdate: (gameStateUpdate): void => {
        const updatePlayers = gameStateUpdate.players;
        if (updatePlayers) {
          setPlayers(updatePlayers);
        }
      },
    });
  }, []);

  return (
    <WSContext.Provider value={window._ws}>
      <Container className='my-5'>
        <Jumbotron>
          <Row>
          <Col xs={3}>
            <PlayerList players={players} />
          </Col>
          <Col>
            {id
              ? <h4>id is {id}</h4>
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

export default React.memo<Props>(App);

export type { Player };