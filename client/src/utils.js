// @flow

import type {ID} from './shared/types';

const {default: ShortUniqueId} = require('short-unique-id');
const _uid = new ShortUniqueId();


export function uid(): ID {
  const id: ID = _uid.seq();
  return id;
};
