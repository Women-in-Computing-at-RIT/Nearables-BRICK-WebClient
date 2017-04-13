import AppConf from './config/AppConfig';
import * as firebase from 'firebase';
firebase.initializeApp(AppConf.firebase);
export default firebase;