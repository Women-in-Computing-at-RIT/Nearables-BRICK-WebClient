import R, { either, both, identity, ifElse, is, call, always, pipe, map, toLower, toUpper, isNil } from 'ramda';
import keyMirror from 'keymirror';
import cuid from 'cuid';

const lazyEnsurer = call;
const primitiveEnsurer = always;
const lazyOrPrimitiveEnsurer = (defValue) => either(both(is(Function, defValue), lazyEnsurer(defValue)), primitiveEnsurer(defValue));

export const makeEnsurer = (pred, defValue) => ifElse(pred, identity, lazyOrPrimitiveEnsurer(defValue));
export const makeNilEnsurer = makeEnsurer(isNil);

export const ensureCuid = makeNilEnsurer(cuid);
const mapExceptFirst = (mapping) => (array) => {
  const args = array.slice(1);
  return [array[0], ...map(mapping)(args)];
};

const mapFirstOnly = (mapping) => (array) => {
  return [mapping(array[0]), ...array.slice(1)];
};

const charArrToString = R.join('');

export const snakeToLowerCamel = pipe(toLower, R.split(/\B_\B/g), mapExceptFirst(pipe(mapFirstOnly(toUpper), charArrToString)), charArrToString);
export const snakeToUpperCase = pipe(snakeToLowerCamel, toUpper);

export const keyMirrorTransform = (transform) => pipe(keyMirror, map(transform));
export const lowerKeyMirror = keyMirrorTransform(toLower);