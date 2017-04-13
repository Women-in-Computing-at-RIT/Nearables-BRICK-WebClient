import AppConf from './config/AppConfig';

export const FbConfig = AppConf.firebase;
export const FbReduxConfig = {
    userProfile: 'organizers',
    enableLogging: true
};

export const FirebaseRedux = require('react-redux-firebase');
export default FirebaseRedux;