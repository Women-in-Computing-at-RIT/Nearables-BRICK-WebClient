import R, { either, identity, ifElse, is, always, pipe, map, toLower, toUpper, isNil } from 'ramda';
import moment from 'moment';
import keyMirror from 'keymirror';
import cuid from 'cuid';

const lazyEnsurer = (x) => () => x(...arguments);
const primitiveEnsurer = always;

const lazyOrPrimitiveEnsurer = (defValue) =>
  either(
    is(Function, defValue) ? lazyEnsurer(defValue) : R.F,
    primitiveEnsurer(defValue)
  );

export const makeEnsurer = (pred, defValue) =>
  ifElse(
    pred,
    identity,
    lazyOrPrimitiveEnsurer(defValue)
  );

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

export const snakeToLowerCamel =
  pipe(
    toLower,
    R.split(/\B_\B/g),
    mapExceptFirst(
      pipe(
        mapFirstOnly(toUpper),
        charArrToString
      )
    ),
    charArrToString
  );
export const snakeToUpperCase = pipe(snakeToLowerCamel, toUpper);

export const slugToLowerCamel =
  pipe(
    toLower,
    R.split(/\B-\B/g),
    mapExceptFirst(
      pipe(
        mapFirstOnly(toUpper),
        charArrToString
      )
    ),
    charArrToString
  );
export const slugToUpperCase = pipe(slugToLowerCamel, toUpper);

export const lowerCamelToSlug =
  pipe(
    R.replace(/([A-Z])/g, ' $1'),
    R.split(/\b\s/g),
    mapExceptFirst(
      pipe(
        toLower,
        R.prepend('-'),
        charArrToString
      )
    ),
    R.join('')
  );


/**
 * @template T
 * @param {[T]} arr
 * @param {number=} startPoint
 */
export function * makeArrayIterator(arr, startPoint = 0) {
  let idx = startPoint % arr.length;
  
  // eslint-disable-next-line no-constant-condition
  while (true) {
    yield arr[idx++];
    idx %= arr.length;
  }
}

/**
 * @param {number} min Min Inclusive
 * @param {number} max Max Exclusive
 * @returns {number} An integer in the range [min, max)
 */
export const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min));

/**
 * @param {[*]} arr
 * @returns {number}
 */
export const randomIndex = (arr) => randomInt(0, arr.length);

/**
 * @template T
 * @param {Array<T>} arr
 * @returns {T}
 */
export const randomElement = (arr) => arr[randomIndex(arr)];

/**
 *
 * @param {function(string):string} transform
 * @returns {function(Object):Object}
 */
export const keyMirrorTransform = (transform) => pipe(keyMirror, map(transform));

/**
 * @type {function(Object):Object}
 */
export const lowerKeyMirror = keyMirrorTransform(toLower);

/**
 * Inverts the given comparator such that the ordering imposed is reversed. This also allows toggling. If the same
 * comparator is fed through this function then instead of layering more comparators it will alternate between wrapped
 * and unwrapped.
 *
 * The original function is kept around as a property on the new function object. If __brickOriginalOrder exists on the
 * comparator, it contains the unwrapped comparator.
 *
 * @param {function(*,*):number} comp Comparator to invert
 * @returns {function(*, *):number} Inverted version of comparator, not the same as the previous
 */
export const invertComparator = (comp) => {
  //noinspection JSUnresolvedVariable
  if(comp.__brickOriginalOrder) {
    //noinspection JSUnresolvedVariable
    return comp.__brickOriginalOrder;
  } else {
    const reversed = (a, b) => -1*comp(a, b);
    reversed.__brickOriginalOrder = comp;
    return reversed;
  }
};

/**
 * Moment Utiltities
 * @type {{fromDateAndTime: moment.Moment, timeBetween: moment.Duration, timeBetweenDates: moment.Duration}}
 */
export const Moments = {
  fromDateAndTime,
  timeBetween,
  timeBetweenDates,
};

/**
 * Creates a Moment from two Date objects, one representing the Date only, the other representing the Time only.
 * This function *is* naive. It just adds the unix timestamps and passes that to Moment, so any two dates can be sent
 * here, added and returned as a moment.
 *
 * @param {Date} date
 * @param {Date} time
 * @returns {moment.Moment}
 */
function fromDateAndTime(date, time) {
  return moment(date.getTime() + time.getTime());
}

/**
 * Finds the Duration between two Moments. This is essentially a delegate for `moment.duration(b.diff(a))` but
 * this will also ensure a <= b. That is, if a > b as given, a and b will be swapped.
 *
 * @param {moment.Moment} a From Moment
 * @param {moment.Moment} b To Moment
 * @returns {moment.Duration}
 */
function timeBetween(a, b) {
  if (a.isAfter(b))
    [a, b] = [b, a];
  
  return moment.duration(b.diff(a));
}

/**
 * Combines fromDateAndTime and timeBetween to provide a more general utility for 4 dates. Two dates representing a
 * start date and start time and another two dates representing an end date and an end time. The result is a
 * Duration representing the time between A and B. Since this uses timeBetween, if A > B, A and B will be swapped so
 * that A <= B.
 *
 * @param {Date} aDate Start Date
 * @param {Date} aTime Start Time
 * @param {Date} bDate End Date
 * @param {Date} bTime End Time
 * @returns {moment.Duration}
 */
function timeBetweenDates(aDate, aTime, bDate, bTime) {
  const a = Moments.fromDateAndTime(aDate, aTime);
  const b = Moments.fromDateAndTime(bDate, bTime);
  return Moments.timeBetween(a, b);
}
