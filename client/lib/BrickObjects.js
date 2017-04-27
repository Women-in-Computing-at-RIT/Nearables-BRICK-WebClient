import { ensureCuid } from './BrickUtils';
import moment from 'moment';

export class Event {
  attackingPoints = 0;
  defendingPoints = 0;
  
  constructor({id, name, startTime, duration}) {
    this.id = ensureCuid(id);
    this.name = name;
    this.startTime = moment(startTime);
    this.duration = moment.duration(duration);
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
  });
}