import cuid from 'cuid';
import moment from 'moment';

import keyMirror from 'keymirror';

export const BroadcastTags = keyMirror({
  NOT_PROVIDED: null,
  NOTHING: null,
  NOTIFY: null,
});

export const BroadcastTarget = keyMirror({
  ATTACKERS: null,
  DEFENDERS: null,
  NONE: null,
});

export default class Broadcast {
  
  /**
   * @param {string} id
   * @param {string} eventId
   * @param {string} author
   * @param {string} message
   * @param {number|Date} timestamp
   * @param {number} lng
   * @param {number} lat
   * @param {number} rad
   * @param {?string} side
   * @param {?string} action
   */
  constructor({id = cuid(), eventId, author, message, timestamp = new Date(), spec: {lng = 0, lat = 0, rad = Infinity}, side, action = BroadcastTags.NOTIFY}) {
    this.id = id;
    this.eventId = eventId;
    this.author = author;
    this.message = message;
    this.timestamp = moment(timestamp).milliseconds();
    this.spec = {
      lng,
      lat,
      rad,
    };
    this.action = action || BroadcastTags.NOT_PROVIDED;
    this.side = side || BroadcastTarget.NONE;
  }
  
  get isLocationBased() {
    return this.spec.rad !== Infinity;
  }
  
  get isSided() {
    return this.side !== BroadcastTarget.NONE;
  }
  
  toJSON = () => ({
    id: this.id,
    eventId: this.eventId,
    author: this.author,
    message: this.message,
    timestamp: this.timestamp,
    spec: this.spec,
    action: this.action,
    side: this.side,
  });
}

export {
  Broadcast,
};
