import { lowerKeyMirror } from './BrickUtils';

export const organizerDefaultPhoto = () => '/photos/organizers/default';
export const organizerPhotos = ({ uid }) => `/photos/organizers/${uid}`;
export const organizer = ({ uid }) => `/organizers/${uid}`;

export const eventBase = () => '/events';
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