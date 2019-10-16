/**
 * This is a static class, providing additional functionality for visualizations
 */
export namespace VisualizationUtil {
  export function roundNumberToFixedDecimalPlaces(num: number, decimal: number): number {
    const power = Math.pow(10, decimal);
    return Math.round(num * power) / power;
  }
}
