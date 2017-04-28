import cuid from 'cuid';
import moment from 'moment';

export class Event {
  
  constructor({id = cuid(), name, startTime, duration, location = {}, attackingPoints = 0, defendingPoints = 0}) {
    this.id = id;
    this.name = name;
    this.startTime = moment(startTime);
    this.duration = moment.duration(duration);
    this.attackingPoints = attackingPoints;
    this.defendingPoints = defendingPoints;
    
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
