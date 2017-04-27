const fs = require('fs');
const path = require('path');

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

const gcs = require('@google-cloud/storage')({
  projectId: 'brick-game-ea6a1',
  credentials: require('./BRICK Game-d471973f9e01.json'),
});

const spawn = require('child-process-promise').spawn;


admin.initializeApp(functions.config().firebase);

const gcsPhotoPath = (uid) => `photos/organizers/${uid}`;
const organizerPath = (uid) => `/organizers/${uid}`;
const brickStorageBucket = gcs.bucket('brick-game-ea6a1.appspot.com');

exports.createOrganizerPhotoOnCreation = functions.auth.user().onCreate((event) => {
  const user = event.data;
  const { uid, photoURL } = user;
  
  const file = brickStorageBucket.file(gcsPhotoPath(uid));
  const tmpFilePath = `/tmp/${uid}/avatar`;
  
  return fetch(photoURL)
    .then(function(response) {
      return response.buffer();
    })
    .then(function(buffer) {
      return spawn('mkdir', ['-p', path.dirname(tmpFilePath)]).then(() => Promise.resolve(buffer));
    })
    .then(function(buffer) {
      return new Promise(function (resolve, reject) {
        const fd = fs.openSync(tmpFilePath, 'w');
    
        fs.writeFile(fd, buffer, function (err) {
          fs.closeSync(fd);
          if (err)
            reject(err);
          else
            resolve();
        });
      });
    })
    .then(function() {
      return spawn('convert', [tmpFilePath, '-thumbnail', '500x500', tmpFilePath]);
    })
    .then(function() {
      const localRead = fs.createReadStream(tmpFilePath);
      const remoteWrite = file.createWriteStream();
      localRead.pipe(remoteWrite);

      return Promise.resolve();
    });
});

/**
 * Delete organizer profile when user is deleted.
 *
 * @type {CloudFunction<UserRecord>}
 */
exports.deleteUserProfileOnDeath = functions.auth.user().onDelete((event) => {
  const { uid } = event.data;
  const file = brickStorageBucket.file(gcsPhotoPath(uid));
  const organizerRef = admin.database().ref(organizerPath(uid));
  
  return Promise.all([
    organizerRef.remove(),
    file.delete(),
  ]);
});