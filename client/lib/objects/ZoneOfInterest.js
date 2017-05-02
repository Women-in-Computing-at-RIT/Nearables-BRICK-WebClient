import cuid from 'cuid';

/** @typedef {{lat: number, lng: number}} ZonePoint*/

export class ZoneOfInterest {
  
  /**
   * @param {string=} id
   * @param {[ZonePoint]} points
   * @param {string} name
   * @param {string} description
   */
  constructor({ id = cuid(), points, name, description }) {
    this.id = id;
    this.points = points;
    this.name = name;
    this.description = description;
  }
  
  toJSON = () => ({
    id: this.id,
    points: this.points,
    name: this.name,
    description: this.description,
    notes: this.notes,
  });
  
}
