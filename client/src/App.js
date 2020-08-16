// @flow

import React, {useEffect, useState} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import type {ID, Player, ReadyStates} from './shared';
import {EVENT_TYPE} from './shared';

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
      onEvent: (event): void => {
        switch(event.type) {
          case EVENT_TYPE.ID_UPDATE:
            setId(event.id);
            break;
          case EVENT_TYPE.PLAYER_LIST_UPDATE:
            setPlayers(event.players);
            break;
          case EVENT_TYPE.READY_STATES_UPDATE:
            setReadyStates(event.ready_states);
            break;
          case EVENT_TYPE.LOBBY_STATE_UPDATE:
            console.log('lobby state update', event.state);
            break;
          default:
            console.error('unknown event', event);
        }
      },
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
              ? <Game me={me} readyStates={readyStates} />
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