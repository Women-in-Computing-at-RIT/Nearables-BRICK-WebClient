import AppConf from './config/AppConfig';
import * as firebase from 'firebase';

firebase.initializeApp(AppConf.firebase)

export const FbReduxConfig = {
  userProfile: 'organizers',
  enableLogging: true
};

export default firebase;