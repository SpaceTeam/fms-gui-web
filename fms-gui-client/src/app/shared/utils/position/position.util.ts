import {Injectable} from '@angular/core';
import {PositionType} from '../../model/flight/position.type';
import {Position} from '../../model/flight/position';

@Injectable({
  providedIn: 'root'
})
export class PositionUtil {
  // Static class
  private constructor() {}

  public static roundNumber(num: number): number {
    return Math.round(num * Math.pow(10, 6)) / Math.pow(10, 6);
  }

  /**
   * Calculates the distance from the center of the diagram to the border (outer most element)
   * This is then needed in the 'interpolatedPositionInSquare' method
   * We use the following formula for the calculation of distance d:
   *
   * d = |p_max[type]| - |p_0[type]|
   *
   * @param type a property name of 'Position', e.g. 'longitude' or 'latitude'
   * @param center
   * @param positions
   * @return the maximum property distance from the center to the border of the SVG
   */
  public static longestDistance(type: PositionType, center: Position, positions: Array<Position>): number {
    const arr = [center, ...positions];

    // 1) Get only the needed values from the positions array, map them to be the difference between the center and the new point
    const typeArray = Array
      .from(arr, position => position[type])
      .map(value => Math.abs(value - center[type]));

    // 2) Return the maximum distance
    const max = Math.max(...typeArray);
    return PositionUtil.roundNumber(max);
  }

  public static getNormalizedDirection(position: Position, center: Position): Position {
    const direction = PositionUtil.getDirection(position, center);
    const length = Math.sqrt(Math.pow(direction.longitude, 2) + Math.pow(direction.latitude, 2));
    return new Position(direction.latitude / length, direction.longitude / length);
  }

  public static getDirection(position: Position, center: Position): Position {
    return new Position(position.longitude - center.longitude, position.latitude - center.latitude);
  }
}
