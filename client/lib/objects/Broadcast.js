import cuid from 'cuid';
import moment from 'moment';

import keyMirror from 'keymirror';

export const BroadcastTags = keyMirror({
  NOT_PROVIDED: null,
  NOTHING: null,
  NOTIFY: null,
});

const defaultLocation = {
  lng: 0,
  lat: 0,
  rad: Infinity,
};

export default class Broadcast {
  
  /**
   * @param {string} id
   * @param {string} eventId
   * @param {string} author
   * @param {string} message
   * @param {number} expiry
   * @param {number|Date} timestamp
   * @param {number} lng
   * @param {number} lat
   * @param {number} rad
   * @param {?string} action
   */
  constructor({id = cuid(), eventId, author, message, expiry = Infinity, timestamp = Date.now(), spec: {lng, lat, rad} = defaultLocation, action = BroadcastTags.NOTIFY}) {
    this.id = id;
    this.eventId = eventId;
    this.author = author;
    this.message = message;
    this.timestamp = moment(timestamp).valueOf();
    this.spec = {
      lng,
      lat,
      rad: rad === -1 ? Infinity : rad,
    };
    this.expiry = expiry;
    this.action = action || BroadcastTags.NOT_PROVIDED;
  }
  
  get isExpired() {
    const now = moment();
    return this.expiry !== Infinity && now.isSameOrBefore(moment(this.timestamp).add(moment.duration(this.expiry)));
  }
  
  get isLocationBased() {
    return this.spec.rad !== Infinity;
  }
  
  toJSON = () => ({
    id: this.id,
    eventId: this.eventId,
    author: this.author,
    message: this.message,
    timestamp: this.timestamp,
    spec: {
      lat: this.spec.lat,
      lng: this.spec.lng,
      rad: this.spec.rad === Infinity ? -1 : this.spec.rad,
    },
    action: this.action,
  });
}

export {
  Broadcast,
};
