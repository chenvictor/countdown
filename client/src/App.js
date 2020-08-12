// @flow

import React, {useContext, useEffect, useState} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import type {Player} from './types';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import PlayerList from './components/PlayerList';
import Setup from './Setup';

import type {WebSocketMessage} from './utils/wsplus';

import WSContext from './WSContext';

const App = () => {
  const ws = useContext(WSContext);
  // Hooks
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<Array<Player>>([]);
  const [id, setId] = useState<?string>(null);

  const onopen = (ws) => {
    console.debug('ws connected');
    setTimeout(() => setLoading(false), 250);
  };
  const onmessage = (ws, message: WebSocketMessage) => {
    console.log(message);
    if (message.players) {
      setPlayers(message.players);
    }
  };

  useEffect(() => {
    ws.setHandlers({
      onopen,
      onmessage,
    });
  }, [ws]);

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
            : <Setup setId={setId}/>
          }
        </Col>
        </Row>
      </Jumbotron>
      <Dialog
        open={loading}
        p={5}
      >
        <DialogContent>
          <div>Connecting to server...</div>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default App;

export type { Player };