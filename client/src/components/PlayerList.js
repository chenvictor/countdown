// @flow
import React from 'react';

import type {Player} from '../App';

import ListGroup from 'react-bootstrap/ListGroup';

type Props = {
  players: Array<Player>,
};

const PlayerList = ({
  players
}: Props) => {
  return <div>
    <h2>Players</h2>
    {players.length === 0
      ? <h4>Waiting for players to join...</h4>
      : <ListGroup>
        {players.map(player => (
          <ListGroup.Item key={player.id}>{player.name}</ListGroup.Item>
        ))}
      </ListGroup>
    }
  </div>
};

export default PlayerList;

