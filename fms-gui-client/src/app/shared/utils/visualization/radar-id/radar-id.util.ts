/**
 * A helper util, for managing the different ids of the radar
 */
export namespace RadarIdUtil {

  /**
   * Returns the id of the radar SVG
   * @param id the radar's id
   */
  export function getSVGId(id: string): string {
    return `${id}-svg`;
  }

  /**
   * Returns the id of the radar's container
   * @param id the radar's id
   */
  export function getContainerId(id: string): string {
    return `${id}-container`;
  }

  /**
   * Returns the id of the radar's group element
   * @param id the radar's id
   */
  export function getSVGGroupId(id: string): string {
    return `${id}-g`;
  }

  /**
   * Returns the id of the equidistant circle group
   * @param id the radar's id
   */
  export function getEquidistantCirclesId(id: string): string {
    return `${id}-equidistant-circles`;
  }

  /**
   * Returns the id of the direction group
   * @param id the radar's id
   */
  export function getDirectionId(id: string): string {
    return `${id}-directions`;
  }

  /**
   * Returns the id of the axis group
   * @param id the radar's id
   */
  export function getAxisId(id: string): string {
    return `${id}-axis`;
  }

  /**
   * Returns the id of the circle group (the circles which are drawn on the radar)
   * @param id the radar's id
   */
  export function getCircleId(id: string): string {
    return `${id}-circles`;
  }
}
