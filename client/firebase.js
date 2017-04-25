import AppConf from './config/AppConfig';
import * as firebase from 'firebase';
import FirebaseGeoFire from 'geofire';

firebase.initializeApp(AppConf.firebase);

const geoFireRef = firebase.database().ref('_geoFire');

export const GeoFire = new FirebaseGeoFire(geoFireRef);
export const Firebase = firebase;

export default firebase;