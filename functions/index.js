const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const organizerPath = (uid) => `/organizers/${uid}`;

/**
 * Delete organizer profile when user is deleted.
 *
 * @type {CloudFunction<UserRecord>}
 */
exports.deleteUserProfileOnDeath = functions.auth.user().onDelete((event) => {
  const { uid } = event.data;
  
  return admin.database().ref(organizerPath(uid)).remove();
});