import cuid from 'cuid';
import moment from 'moment';

const defaultLocation = {
  label: '',
  location: {
    lat: 0,
    lng: 0,
  },
  placeId: '',
};

export default class Event {
  
  /**
   *
   * @param {string=} id
   * @param {string} name
   * @param {Date|moment.Moment} startTime
   * @param {number|moment.Duration} duration
   * @param location
   */
  constructor({id = cuid(), name, startTime, duration, location = {...defaultLocation}}) {
    this.id = id;
    this.name = name;
    this.startTime = moment(startTime);
    this.duration = moment.duration(duration);
    
    this.location = location;
  }
  
  get endTime() {
    return this.startTime.clone().add(this.duration);
  }
  
  toJSON = () => ({
    id: this.id,
    name: this.name,
    startTime: this.startTime.toJSON(),
    duration: this.duration.toJSON(),
    attackingPoints: this.attackingPoints,
    defendingPoints: this.defendingPoints,
    location: {
      label: this.location.label || '',
      location: this.location.location || {
        lat: 0,
        lng: 0,
      },
      placeId: this.location.placeId || '',
    },
  });
}

export {
  Event,
};
