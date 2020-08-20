"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterNulls = exports.assertNonNull = void 0;

var _assert = _interopRequireDefault(require("assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const assertNonNull = vals => {
  vals.forEach(v => (0, _assert.default)(v != null));
  const _vals = vals;
  return _vals;
};

exports.assertNonNull = assertNonNull;

const filterNulls = array => {
  const _res = array.filter(val => val != null);

  return _res;
};

exports.filterNulls = filterNulls;