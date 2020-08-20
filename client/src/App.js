// @flow

import React, {useEffect, useState} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import type {ID, Player, ReadyStates, LobbyState, GameState} from './shared';
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
  const [lobbyState, setLobbyState] = useState<?LobbyState>(null);
  const [gameState, setGameState] = useState<?GameState>(null);
  const [id, setId] = useState<?ID>(null);

  const me = players.find(player => player.id === id);

  useEffect(() => {
    _ws.setCallbacks({
      onConnectionChange: (connected): void => {
        setTimeout(() => {
          setConnecting(!connected);
          if (!connected) {
            setId(null);
          }
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
            setLobbyState(event.state);
            break;
          case EVENT_TYPE.GAME_STATE_UPDATE:
            setGameState(event.state);
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
          {
            //testing stuff
            <div>
            </div>
          }
          <Row>
          <Col xs={3}>
            <PlayerList
              me={me}
              players={players}
              readyStates={readyStates}
              score={gameState && gameState.score}
            />
          </Col>
          <Col>
            {me
              ? <Game
                  me={me}
                  readyStates={readyStates}
                  lobbyState={lobbyState}
                  gameState={gameState}
                  players={players}
                />
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