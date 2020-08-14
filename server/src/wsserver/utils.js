// @flow

const assert = require('assert');

import type {RawRequest} from '../../../shared/types/ws-api';

const parseRequest = (raw: string): ?RawRequest => {
  let parsed = null;
  try {
    parsed = JSON.parse(raw);
    assert('m_id' in parsed);
    assert('request' in parsed);
    return {
      m_id: parsed.m_id,
      request: parsed.request,
    };
  } catch {
    console.warn('error parsing request', raw);
    return null;
  }
};

module.exports = {
  parseRequest,
};