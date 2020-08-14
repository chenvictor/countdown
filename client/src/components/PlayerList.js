// @flow
import React from 'react';

import type {Player} from '../App';

import ListGroup from 'react-bootstrap/ListGroup';

type Props = {
  me: ?Player,
  players: Array<Player>,
};

const PlayerList = ({
  me,
  players
}: Props) => {
  return <div>
    <h2>Players</h2>
    {players.length === 0
      ? <h4>Waiting for players to join...</h4>
      : <ListGroup>
        {players.map(player => {
          const text = me && me.id === player.id
            ? `${player.name} (You)`
            : player.name;
          return <ListGroup.Item key={player.id}>{text}</ListGroup.Item>;
        })}
      </ListGroup>
    }
  </div>
};

export default PlayerList;

