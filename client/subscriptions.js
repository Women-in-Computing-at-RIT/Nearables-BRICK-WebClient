import firebase from './firebase';

import StartupActions from './redux/Startup';

export function firebaseSubscriptions(dispatch) {
  // Fired when Auth system is initialized
  firebase.auth().onAuthStateChanged(() => {
    dispatch(StartupActions.startupAuth());
  });
}