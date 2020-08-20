// @flow
import React from 'react';

import type {Player, ReadyStates} from '../shared';
import type {Score} from '../shared/game';

import ListGroup from 'react-bootstrap/ListGroup';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import Tooltip from '@material-ui/core/Tooltip';

type Props = {
  me: ?Player,
  players: Array<Player>,
  readyStates: ReadyStates,
  score: ?Score,
};

const PlayerList = ({
  me,
  players,
  readyStates,
  score,
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
          let readyState = null;
          const points = score
            ? ` - ${(score[player.id] || 0)}`
            : null;
          if (me) {
            readyState = (
              <span className='mr-1'>
                {
                  readyStates[player.id]
                    ? (
                      <Tooltip title={`${player.name} is ready`}>
                        <CheckBoxOutlinedIcon />
                      </Tooltip>
                    )
                    : (
                      <Tooltip title={`${player.name} is not ready`}>
                        <CheckBoxOutlineBlankOutlinedIcon />
                      </Tooltip>
                    )
                }
              </span>
            );
          }
          return <ListGroup.Item key={player.id}>{readyState}{text}{points}</ListGroup.Item>;
        })}
      </ListGroup>
    }
  </div>
};

export default PlayerList;

