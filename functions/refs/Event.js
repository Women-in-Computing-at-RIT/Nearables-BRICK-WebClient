const eventBase = () => '/events';
const event = ({ id }) => `/${eventBase()}/${id}`;
const eventCreator = ({ id }) => `/events/${id}/organizer`;
const eventActivity = ({ id, uid }) => `${eventActivityBase()}/${id}/${uid}`;
const eventActivityBase = () => '/activity';

/**
 * @param {string} id
 */
const eventBroadcasts = ({ id }) => `/broadcasts/${id}`;


module.exports = {
  eventBase,
  event,
  eventCreator,
  eventActivity,
  eventActivityBase,
  eventBroadcasts,
};
