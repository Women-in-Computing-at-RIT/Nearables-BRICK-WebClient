import { lowerKeyMirror } from '../utils';

export * from './Organizer';
export * from './Participant';
export * from './Event';

export const RefEvents = lowerKeyMirror({
  VALUE: null,
  CHILD_ADDED: null,
  CHILD_CHANGED: null,
  CHILD_MOVED: null,
  CHILD_REMOVED: null,
});

export default {
  EventTypes: RefEvents,
  ...require('./Event'),
  ...require('./Participant'),
  ...require('./Organizer'),
};
