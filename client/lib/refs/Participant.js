export const participantEvents = ({ uid }) => `/participant-events/${uid}`;
export const participantEventDetails = ({ uid, eventId }) => `${participantEvents({ uid })}/${eventId}`;
export const eventParticipant = ({ id }) => `/participants/${id}`;
