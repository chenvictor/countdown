// @flow

import type {GameStateUpdate, RawResponse} from '../shared/types/ws-api';
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

export function parseStateUpdate(raw: string): ?GameStateUpdate {
  let parsed = null;
  try {
    parsed = JSON.parse(raw);
    assert(parsed.type === 'state_update');
    return {
      players: parsed.state.players,
    };
  } catch {
    return null;
  }
}
