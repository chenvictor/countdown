// @flow

import type {Event, Player, ID, RawResponse} from '../shared/types';
import assert from 'assert';

export function parseResponse(raw: string): ?RawResponse {
  let parsed = null;
  try {
    parsed = JSON.parse(raw);
    assert('m_id' in parsed);
    assert('response' in parsed);
    return {
      m_id: parsed.m_id,
      response: parsed.response,
    };
  } catch {
    return null;
  }
};

export function parseEvent(raw: string): ?Event {
  let parsed = null;
  try {
    parsed = JSON.parse(raw);
    assert('type' in parsed);
    return parsed;
  } catch {
    return null;
  }
}

type EventHandlers = {
  onIDUpdate: (?ID) => void,
  onPlayerListUpdate: (Array<Player>) => void,
};

export function handleEvent(event: Event, {
  onIDUpdate,
  onPlayerListUpdate,
}: EventHandlers): void {
  switch (event.type) {
    case 'player_list_update':
      onPlayerListUpdate(event.players);
      break;
    case 'id_update':
      onIDUpdate(event.id);
      break;
    default:
      console.error('unknown event type: ', (event: any));
  }
}