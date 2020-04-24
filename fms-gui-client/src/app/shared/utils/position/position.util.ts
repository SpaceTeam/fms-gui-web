import {Position} from '../../model/flight/position';
import {Point} from '../../model/point.model';

export namespace PositionUtil {

  /**
   * Returns the distance in meters between the two given points
   * (see https://en.wikipedia.org/wiki/Versine#hav)
   * Accuracy: ~5 m
   *
   * @param start the starting position
   * @param end the ending position
   */
  export function calculateDistanceInMeters(start: Position, end: Position): number {
    const R = 6371000;  // earth radius in meters

    const dLat = toRadians(end.latitude - start.latitude);
    const dLon = toRadians(end.longitude - start.longitude);
    const lat1 = toRadians(start.latitude);
    const lat2 = toRadians(end.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  export function toRadians(num: number): number {
    return num * Math.PI / 180;
  }

  /**
   * Returns a point which provides the normalized direction from the start to the end position
   * Max. number of decimal places: 3
   *
   * @param start the start position
   * @param end the end position
   */
  export function getNormalizedDirection(start: Position, end: Position): Point {
    const diff = new Point(end.longitude - start.longitude, end.latitude - start.latitude);
    const length = Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2));

    diff.x = length !== 0 ? diff.x / length : 0;
    diff.y = length !== 0 ? diff.y / length : 0;

    // Round coordinates to 3 decimal places
    const decimalPlaces = 3;
    diff.x = roundToDecimalPlaces(diff.x, decimalPlaces);
    diff.y = roundToDecimalPlaces(diff.y, decimalPlaces);

    return diff;
  }

  /**
   * Returns a number with maximum 'decimalPlaces' decimal places
   * E.g. 0.44444 should be 'rounded' to 0.444, if 'decimalPlaces' is 3
   *
   * @param num the number to be rounded
   * @param decimalPlaces the maximum number of decimal places allowed
   */
  export function roundToDecimalPlaces(num: number, decimalPlaces: number): number {
    const precision = Math.pow(10, decimalPlaces);
    return Math.round(num * precision) / precision;
  }
}
