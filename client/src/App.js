// @flow

import React, {useEffect, useState} from 'react';
import { w3cwebsocket as WebSocket } from 'websocket';

import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import PlayerList from './components/PlayerList';
import Lobby from './Lobby';

const client = new WebSocket('ws://localhost:3001');

type Player = {
  id: string,
  name: string,
};

const App = () => {
  // Hooks
  const [players, setPlayers] = useState<Array<Player>>([]);
  const [id, setId] = useState(null);

  const onopen = () => {
    console.log('ws connected');
  };
  const onmessage = (message) => {
    console.log('message received', message);
    const {players, init} = JSON.parse(message);
    if (players) {
      setPlayers(players);
    }
    if (init) {
      setId(null);
    }
  };

  setPlayers(false);

  useEffect(() => {
    client.onopen = onopen;
    client.onmessage = onmessage;
  }, []);

  return (
    <Container className='my-5'>
      <Jumbotron>
        <Row>
        <Col xs={3}>
          <PlayerList players={players} />
        </Col>
        <Col>
          {id
            ? <h4>id is {id}</h4>
            : <Lobby />
          }
        </Col>
        </Row>
      </Jumbotron>
    </Container>
  );
}

export default App;
