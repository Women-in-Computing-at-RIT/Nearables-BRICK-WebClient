const keyMirror = require('keymirror');
const { pipe, toLower, map } = require('ramda');

/**
 *
 * @param {function(string):string} transform
 * @returns {function(Object):Object}
 */
const keyMirrorTransform = (transform) => pipe(keyMirror, map(transform));

/**
 * @type {function(Object):Object}
 */
const lowerKeyMirror = keyMirrorTransform(toLower);

const RefEvents = lowerKeyMirror({
  VALUE: null,
  CHILD_ADDED: null,
  CHILD_CHANGED: null,
  CHILD_MOVED: null,
  CHILD_REMOVED: null,
});

module.exports = {
  EventTypes: RefEvents,
  Event: require('./Event'),
  Participant: require('./Participant'),
  Organizer: require('./Organizer'),
  lowerKeyMirror,
};
