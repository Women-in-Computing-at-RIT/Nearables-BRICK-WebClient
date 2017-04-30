import cuid from 'cuid';
import keyMirror from 'keymirror';

/**
 * @typedef {null}
 */
export const ActivityTypes = keyMirror({
  DISCOVERY: null,
  SOCIALIZE: null,
  FEEDBACK : null,
  SPECIAL  : null,
});

export class Activity {
  
  /**
   * @param {string=} id
   * @param {number=} timestamp
   * @param {string} uid
   * @param {ActivityTypes} type
   * @param {object} data
   */
  constructor({ id = cuid(), timestamp = Date.now(), uid, type, data }) {
    this.id = id;
    this.uid = uid;
    this.timestamp = timestamp;
    this.type = type;
    this.data = data;
  }
  
  toJSON = () => ({
    id: this.id,
    uid: this.uid,
    timestamp: this.timestamp,
    type: this.type,
    data: this.data,
  });
  
  /**
   * @param {string} uid
   * @param {PointOfInterest} poi
   * @returns {Activity}
   */
  static newDiscovery(uid, poi) {
    return new Activity({
      uid,
      type: ActivityTypes.DISCOVERY,
      data: {
        poi: poi.toJSON(),
      },
    });
  }
  
  /**
   * @param {string} localUid
   * @param {string} otherUid
   * @param {{lat: number, lng: number}=} location
   * @returns {Activity}
   */
  static newSocialize(localUid, otherUid, location) {
    return new Activity({
      uid: localUid,
      type: ActivityTypes.SOCIALIZE,
      data: {
        friend: otherUid,
        location: location != null ? location : null,
      },
    });
  }
  
  /**
   * @param {string} uid
   * @param {PointOfInterest} poi
   * @returns {Activity}
   */
  static newFeedback(uid, poi) {
    return new Activity({
      uid,
      type: ActivityTypes.FEEDBACK,
      data: {
        poi: poi.toJSON(),
      },
    });
  }
  
  /**
   * @param {string} uid
   * @param {string} reason
   * @param {number} points
   * @returns {Activity}
   */
  static newSpecial(uid, reason, points) {
    return new Activity({
      uid,
      type: ActivityTypes.SPECIAL,
      data: {
        reason,
        points,
      },
    });
  }
}
