import is from 'is_js';

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
 * @returns {*} Json Representation of given object (Simple JavaScript Object) [False by Default]
 * @throws Error If not given an object OR if all conditions fail and `force` is set to false.
 */
export default function ensureJson(object) {
  if (is.not.object(object))
    throw new Error('Attempt to turn something that isn\'t an object into JSON.');
  
  if (is.array(object))
    return object.map(x => ensureJson(x));
  
  // Firebase Objects
  if ('toJSON' in object) {
    return object.toJSON();
  }
  
  // Immutables
  if ('asMutable' in object)
    return ensureJson(object.asMutable());
  // Best Effort Attempt to convert some object to a JSON representation
  return forceToJson(object);
}

function forceToJson(object) {
  const keys = Object.keys(object);
  const result = {};
  for (const key of keys) {
    let value = object[key];
    
    // Ignore functions and prototype properties
    if (is.function(value) || key.indexOf('proto') >= 0 || key.indexOf('prototype') >= 0)
      continue;
    
    // Deal with nested structures (or at least try to)
    if (is.object(value))
      value = ensureJson(value);
    else if (is.array(value)) {
      value = value.map(x => ensureJson(x));
    }
    
    result[key] = value;
  }
  
  
  return result;
}