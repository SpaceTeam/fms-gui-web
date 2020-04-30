export class Position {
  longitude: number;
  latitude: number;
  altitude: number;
  timestamp: number;

  constructor(longitude: number, latitude: number, altitude: number = 0, timestamp: number = 0) {
    this.longitude = longitude;
    this.latitude = latitude;
    this.altitude = altitude;
    this.timestamp = timestamp;
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

  toString(): string {
    return `[lon:${this.longitude},lat:${this.latitude},alt:${this.altitude},time:${this.timestamp}]`;
  }
}
