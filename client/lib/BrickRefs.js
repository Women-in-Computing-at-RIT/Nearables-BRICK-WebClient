import { lowerKeyMirror } from './BrickUtils';

export const organizerDefaultPhoto = () => '/photos/organizers/default';
export const organizerPhotos = ({ uid }) => `/photos/organizers/${uid}`;
export const organizer = ({ uid }) => `/organizers/${uid}`;

export const eventBase = () => '/events';

// TODO Broadcasts
export const eventBroadcasts = ({ id }) => `/broadcasts/${id}`;
export const eventGeneralBroadcasts = ({ id }) => `${eventBroadcasts({ id })}/general`;
export const eventAttackBroadcasts = ({ id }) => `${eventBroadcasts({ id })}/attack`;
export const eventDefenseBroadcasts = ({ id }) => `${eventBroadcasts({ id })}/defense`;


// TODO
export const participantEvents = ({ uid }) => `/participant-events/${uid}`;
export const participantEventDetails = ({ uid, eventId }) => `${participantEvents({ uid })}/${eventId}`;
export const eventParticipant = ({ id }) => `/participants/${id}`;
export const eventAttackers = ({ id }) => `${eventParticipant({ id })}/attackers`;
export const eventDefenders = ({ id }) => `${eventParticipant({ id })}/defenders`;

// TODO
export const eventTasks = ({ id }) => `/tasks/${id}`;

// TODO Teams
export const eventTeams = ({ id }) => `/teams/${id}`;
export const eventTeamDetail = ({ id, teamId }) => `${eventTeams({ id })}/${teamId}`;

export const event = ({ id }) => `/${eventBase()}/${id}`;
export const eventCreator = ({ id }) => `/events/${id}/organizer`;

export const organizerEvents = ({ uid }) => `/organizer-events/${uid}`;

export const RefEvents = lowerKeyMirror({
  VALUE: null,
  CHILD_ADDED: null,
  CHILD_CHANGED: null,
  CHILD_MOVED: null,
  CHILD_REMOVED: null,
});

export default {
  organizer,
  organizerDefaultPhoto,
  organizerPhotos,
  organizerEvents,
  eventBase,
  event,
  eventCreator,
};
