export const eventBase = () => '/events';
export const event = ({ id }) => `/${eventBase()}/${id}`;
export const eventCreator = ({ id }) => `/events/${id}/organizer`;
export const eventActivity = ({ id, uid }) => `${eventActivityBase()}/${id}/${uid}`;
export const eventActivityBase = () => '/activity';

/**
 * @param {string} id
 */
export const eventBroadcasts = ({ id }) => `/broadcasts/${id}`;
