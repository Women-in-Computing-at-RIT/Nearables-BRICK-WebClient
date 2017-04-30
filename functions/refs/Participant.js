const participantEvents = ({ uid }) => `/participant-events/${uid}`;
const participantEventDetails = ({ uid, eventId }) => `${participantEvents({ uid })}/${eventId}`;
const eventParticipant = ({ id }) => `/participants/${id}`;

module.exports = {
  participantEvents,
  participantEventDetails,
  eventParticipant,
};
