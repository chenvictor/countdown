// @flow

import assert from 'assert';

export const assertNonNull = <T>(vals: Array<?T>): Array<T> => {
  vals.forEach(v => assert(v != null));
  const _vals: Array<T> = (vals: any);
  return _vals;
};

export const filterNulls = <T>(array: Array<?T>): Array<T> => {
  const _res: Array<T> = (array.filter(val => val != null) : any);
  return _res; 
};
