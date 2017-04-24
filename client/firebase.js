import AppConf from './config/AppConfig';
import * as firebase from 'firebase';
import FirebaseGeoFire from 'geofire';

firebase.initializeApp(AppConf.firebase);

const geoFireRef = firebase.database().ref().push();

export const GeoFire = new FirebaseGeoFire(geoFireRef);
export default firebase;