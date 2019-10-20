import {PositionType} from '../../model/flight/position.type';
import {Position} from '../../model/flight/position';

export namespace PositionUtil {

  /**
   * Calculates the distance of the given position from the center, based on the given type
   * It scales with the outer most point (the length between the center and edge varies with the outer most point)
   *
   * Also called the 'lerp' method (see https://en.wikipedia.org/wiki/Linear_interpolation)
   *
   * @param position of the point of interest
   * @param type used for calculating the distance from the center
   * @param size the size of the window in which should be interpolated
   * @param center the center position of the window
   * @param positions the positions to be taken in account when calculating the interpolated value
   * @return the interpolated position in the window
   */
  export function interpolatedPositionInSquare(
    position: Position,
    type: PositionType,
    size: number,
    center: Position,
    positions: Array<Position>): number {
    const x_0 = size / 2;
    const x_1 = size;

    const t = interpolationValue(position, type, center, positions);
    return roundNumber((1 - t) * x_0 + t * x_1);
  }

  /**
   * This method returns the 't' value, for a linear interpolation
   *
   * The general method we would like to use is a simple linear interpolation between values of one dimension:
   * x = (1 - t) * x_0 + t * x1
   *
   * To get the 't', we just have to reform the upper equation to
   * t = (x / x_0 - 1) / (x_1 / x_0 - 1)
   *
   * It is possible, that either x_0, x_1 or both are zero, so we have to take care of this
   *
   * @param position contains the 'x' we need to use for the calculation
   * @param type the specific value we want to use for the interpolation
   * @param center the center position of the window
   * @param positions the positions to be taken in account when calculating the interpolated value
   * @return a number between [-1,1]
   */
  export function interpolationValue(position: Position, type: PositionType, center: Position, positions: Array<Position>): number {
    const distance = longestDistance(type, center, positions);
    const x_0 = roundNumber(center[type]);
    const x_1 = roundNumber(x_0 + distance); // upper bound
    const l = roundNumber(x_0 - distance);  // lower bound
    const x = roundNumber(position[type]);
    let value;

    // Check whether the number is in the range between the numbers
    if (!(l <= x && x <= x_1)) {
      throw new RangeError(`Error: ${x} is out of bounds between [${l},${x_1}]`);
    }
    // Check whether there is any range
    if (x_0 === x_1) {
      value = 0;
    } else if (x_0 === 0) {
      // Check if the lower border is 0 (a DivideByZeroException would then occur)
      value = x / x_1;
    } else if (x_1 === 0) {
      // Check, if the upper border is 0
      value = 1 - x / x_0;
    } else {
      // Calculate the simple interpolation value
      value = (x - x_0) / (x_1 - x_0);
    }
    return roundNumber(value);
  }

  /**
   * Calculates the distance from the center of the diagram to the border (outer most element)
   * This is then needed in the 'interpolatedPositionInSquare' method
   * We use the following formula for the calculation of distance d:
   *
   * d = |p_max[type]| - |p_0[type]|
   *
   * @param type a property name of 'Position', e.g. 'longitude' or 'latitude'
   * @param center (redundant)
   * @param positions (redundant)
   * @return the maximum property distance from the center to the border of the SVG
   */
  export function longestDistance(type: PositionType, center: Position, positions: Array<Position>): number {
    const arr = [center, ...positions];

    // 1) Get only the needed values from the positions array, map them to be the difference between the center and the new point
    const typeArray = Array
      .from(arr, position => position[type])
      .map(value => Math.abs(value - center[type]));

    // 2) Return the maximum distance
    const max = Math.max(...typeArray);
    return roundNumber(max);
  }

  /**
   * Returns the normalized direction from 'origin' to 'target'
   * @param target x_1
   * @param origin x_0
   * @return the normalized direction from the origin to the target
   */
  export function getNormalizedDirection(target: Position, origin: Position): Position {
    const direction = getDirection(target, origin);
    const length = Math.sqrt(Math.pow(direction.longitude, 2) + Math.pow(direction.latitude, 2));
    if (length === 0) {
      return new Position(0, 0);
    }
    return new Position(roundNumber(direction.longitude / length), roundNumber(direction.latitude / length));
  }

  /**
   * Returns the direction from point 'origin' (x_0) to point 'target' (x_1)
   * @param target x_1
   * @param origin x_0
   * @return the direction from the origin to the target
   */
  export function getDirection(target: Position, origin: Position): Position {
    return new Position(roundNumber(target.longitude - origin.longitude), roundNumber(target.latitude - origin.latitude));
  }

  /**
   * Rounds a given number 'num' with a precision of 6 decimal places (default value)
   * @param num the number to be rounded
   * @return a rounded number num with 6 decimal places
   */
  export function roundNumber(num: number): number {
    return Math.round(num * Math.pow(10, 6)) / Math.pow(10, 6);
  }

  /**
   * Returns a new Position object from the given object
   * We need this, since when running the code, the parameters of an inline function are mapped to normal 'objects' and do not possess
   * the class methods
   * @param position the position to be mapped
   * @return the position with the classes properties
   */
  export function newPosition(position: Position) {
    return new Position(position.longitude, position.latitude, position.altitude, position.timestamp);
  }
}
