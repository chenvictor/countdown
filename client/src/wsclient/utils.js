// @flow

import type {Event, RawResponse} from '../shared';
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
