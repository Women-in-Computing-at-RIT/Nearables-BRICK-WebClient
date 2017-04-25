import firebase from './firebase';

import StartupActions from './redux/Startup';
import AuthActions from './redux/Auth';

export function firebaseSubscriptions(dispatch) {
  // Fired when Auth system is initialized
  firebase.auth().onAuthStateChanged((user) => {
    dispatch(StartupActions.startupAuth(user));
  });
}