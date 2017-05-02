import cuid from 'cuid';
import GeoFire from 'geofire';
import moment from 'moment';

export class PointOfInterest {
  
  /**
   * @param {string=} id
   * @param {number} lat
   * @param {number} lng
   * @param {string} name
   * @param {string} description
   * @param {moment.Duration|number} duration
   * @param {object=} notes
   */
  constructor({ id = cuid(), lat, lng, name, description, duration, notes = {} }) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.name = name;
    this.description = description;
    this.duration = moment.duration(duration);
    this.notes = notes;
  }
  
  /**
   * @param {PointOfInterest|{lat: number, lng: number}} location
   * @returns {number} Distance in kilometers between this PointOfInterest and the other location
   */
  getDistanceTo(location) {
    const a = [this.lat, this.lng];
    const b = [location.lat, location.lng];
    
    return GeoFire.distance(a, b);
  }
  
  toJSON = () => ({
    id: this.id,
    lat: this.lat,
    lng: this.lng,
    name: this.name,
    description: this.description,
    duration: this.duration.toJSON(),
    notes: this.notes,
  });
  
}
