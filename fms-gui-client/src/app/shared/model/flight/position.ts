export class Position {
  longitude: number;
  latitude: number;
  altitude: number;
  timestamp: number;

  constructor(longitude: number, latitude: number, altitude?: number, timestamp?: number) {
    this.longitude = longitude;
    this.latitude = latitude;
    this.altitude = altitude ? altitude : 0;
    this.timestamp = timestamp ? timestamp : 0;
  }

  /**
   * A simple 'equals' checker, which checks if all values of the both positions are the same
   * @param position the other position to be checked
   */
  equals(position: Position): boolean {
    return this.latitude === position.latitude &&
      this.longitude === position.longitude &&
      this.altitude === position.altitude &&
      this.timestamp === position.timestamp;
  }
}
