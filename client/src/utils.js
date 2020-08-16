// @flow

import type {ID} from './shared';

const {default: ShortUniqueId} = require('short-unique-id');
const _uid = new ShortUniqueId();


export function uid(): ID {
  const id: ID = _uid.seq();
  return id;
};
