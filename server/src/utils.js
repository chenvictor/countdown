// @flow

const { default: ShortUniqueId } = require('short-unique-id');
const _uid = new ShortUniqueId();

import type {ID} from '../../shared';

const uid = (): ID => {
  const id: ID = _uid.seq();
  return id;
};

module.exports = {
  uid,
};