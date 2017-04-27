import { either, both, identity, ifElse, is, call, always, unless, isNil } from 'ramda';
import cuid from 'cuid';

const lazyEnsurer = call;
const primitiveEnsurer = always;
const lazyOrPrimitiveEnsurer = (defValue) => either(both(is(Function, defValue), lazyEnsurer(defValue)), primitiveEnsurer(defValue));

export const makeEnsurer = (pred, defValue) => ifElse(pred, identity, lazyOrPrimitiveEnsurer(defValue));
export const makeNilEnsurer = makeEnsurer(isNil);

export const ensureCuid = makeNilEnsurer(cuid);