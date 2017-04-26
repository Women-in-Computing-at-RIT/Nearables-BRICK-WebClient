import { either, hasIn, when, ifElse, both, identity, map, isArrayLike, pipe, always, invoker, is, propIs } from 'ramda';

const invokeToJson    = invoker(0, 'toJSON');
const invokeAsMutable = invoker(0, 'asMutable');
const nothing         = always(null);
const isObject        = is(Object);

const isImmutable       = both(hasIn('asMutable'), propIs(Function, 'asMutable'));
const isFirebaseObject  = both(hasIn('toJSON'), propIs(Function, 'toJSON'));
const isEasyToCoerce    = either(isImmutable, isFirebaseObject);
const isProcessable     = either(isObject, isArrayLike);

const coerceFirebase  = ifElse(isFirebaseObject, invokeToJson, nothing);
const coerceImmutable = ifElse(isImmutable, invokeAsMutable, nothing);
const easyCoerce      = either(coerceFirebase, coerceImmutable);

const coerceObject = when(isObject, (x) => toJsonEnsured(x));
const coerceArray  = when(isArrayLike, map((x) => toJsonEnsured(x)));
const coerceToJson = pipe(coerceObject, coerceArray, identity);

const forceCoerce   = map(coerceToJson);
const toJson        = ifElse(isEasyToCoerce, easyCoerce, forceCoerce);
const toJsonEnsured = when(isProcessable, toJson);

/**
 * Given an object, attempts to return a JSON representation of that object. A JSON representation
 * is a Plain Object representation. That is, only easily serializable properties are kept.
 *
 * If the object is already a Plain Object, it is simply returned. If the object is an array then
 * a mapped array is returned where this function is the mapping. If the object is a Firebase Object with a toJSON
 * method then the result of toJSON is returned. If the object is an Immutable object with an asMutable method then
 * the result of running ensureJson(object.asMutable()) is returned.
 *
 * If all conditions fail, an error is thrown unless `force` is set to true. In that case the function makes a
 * best effort attempt to return some JSON representation. Ultimately, this falls back to iterating through the keys
 * and picking out JSON-eligible values. All JSON-eligible values are kept and returned. All other properties are
 * dropped from the result.
 *
 * @param object Object to check
 * @returns {*} Json Representation of given object (Simple JavaScript Object)
 * @throws Error If not given an object OR if all conditions fail and `force` is set to false.
 */
export default toJsonEnsured;
