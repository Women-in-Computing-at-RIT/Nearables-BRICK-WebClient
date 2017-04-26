import {T, project, isEmpty, keys, groupWith, dissoc, or, is, isNil, unless, both, and, has, propIs, partial, pipe, always, map, isArrayLike, head, invoker, reject, ifElse, when } from 'ramda';

class JsonSerializable {
  
  constructor() {
    this._attachToJson.bind(this)();
  }
  
  _attachToJson() {
    this.toJSON = defaultToJson(this);
  }
}

const nest                    = groupWith(T);

const isJson                  = is(Object);
const isImmutable             = both(has('asMutable'), propIs(Function, 'asMutable'));
const isToJsonable            = and(has('toJSON'), propIs(Function, 'toJSON'));
const isJsonSerializable      = or(is(JsonSerializable), isToJsonable);

const fromImmutable           = invoker(0, 'asMutable');
const serialize               = invoker(0, 'toJSON');
const lazyToJson              = (o) => convertToJson(o);
const lazyHandleNested        = (x) => handleNested(x);

const noFunctions             = reject(is(Function));
const noProto                 = pipe(dissoc('__proto__'), dissoc('prototype'));
const cleanup                 = pipe(noFunctions, noProto);

const tryPlainJson            = when(isJson, lazyToJson);
const tryImmutable            = ifElse(isImmutable, fromImmutable, tryPlainJson);

const serializeNested         = ifElse(isJsonSerializable, serialize, tryImmutable);
const serializeArray          = map(when(isJson, lazyHandleNested));
const handleNested            = pipe(cleanup, map(ifElse(isArrayLike, serializeArray, unless(isNil, serializeNested))));

const makeProjection          = pipe(nest, partial(project));
const makePseudoIdentity      = always(map(cleanup));

const makeToJsonFromPropNames = ifElse(isEmpty, makePseudoIdentity, makeProjection);
const makeToJsonFromObject    = pipe(cleanup, keys, makeToJsonFromPropNames);
const makeDefaultToJson       = ifElse(isArrayLike, makeToJsonFromPropNames, makeToJsonFromObject);

const defaultToJson = (self) => () => pipe(makeDefaultToJson(self), head, handleNested)([self]);
const convertToJson = (o) => isNil(o) ? o : defaultToJson(o)(o);

export default convertToJson;
const makeToJsonMethod = defaultToJson;

export {
  JsonSerializable,
  makeToJsonMethod,
  nest,
  isJson,
  isJsonSerializable,
  isToJsonable,
  lazyToJson,
};