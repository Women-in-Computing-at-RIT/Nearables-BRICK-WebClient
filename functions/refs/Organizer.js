const organizerEvents = ({ uid }) => `/organizer-events/${uid}`;
const organizerDefaultPhoto = () => '/photos/organizers/default';
const organizerPhotos = ({ uid }) => `/photos/organizers/${uid}`;
const organizer = ({ uid }) => `/organizers/${uid}`;

module.exports = {
  organizer,
  organizerPhotos,
  organizerEvents,
  organizerDefaultPhoto,
};
