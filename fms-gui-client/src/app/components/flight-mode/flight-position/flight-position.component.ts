import {Component, ViewChild} from '@angular/core';
import {PositionService} from '../../../shared/services/visualization/position/position.service';
import {RadarComponent} from '../../visualization/radar/radar.component';
import {Position} from '../../../shared/model/flight/position';
import {environment} from '../../../../environments/environment';
import {RadarUtil} from '../../../shared/utils/visualization/radar/radar.util';
import {PositionUtil} from '../../../shared/utils/position/position.util';
import {Point} from '../../../shared/model/point.model';
import {RadarForm} from '../../../shared/forms/radar.form';
import {AbstractRadar} from '../../visualization/radar/radar.abstract';
import {RadarConfigService} from '../../../shared/services/visualization/radar-config/radar-config.service';

@Component({
  selector: 'app-flight-position',
  templateUrl: './flight-position.component.html',
  styleUrls: ['./flight-position.component.scss'],
  providers: [RadarConfigService]
})
export class FlightPositionComponent extends AbstractRadar {

  @ViewChild(RadarComponent)
  private radar: RadarComponent;

  /**
   * Stores the current range of the radar (e.g. max. 1000m)
   */
  private range: number;

  /**
   * Tells how much the distance should get multiplied, if we are outside of the bounds or too close to the center
   * E.g. if we have a maximum of 1000m and we have a value outside of this bound, then with the multiplier = 2,
   * the new maximum should be 2000m
   * TODO: The user should be able to change this value (maybe with advanced options)
   * -> should be changed via the radar-config
   */
  private rangeMultiplier: number;

  /**
   * Stores the last position received from the FMS
   */
  private lastPosition: Position;

  constructor(protected positionService: PositionService, protected radarForm: RadarForm) {
    super(positionService, radarForm);
    this.lastPosition = this.center;

    this.range = environment.visualization.radar.position.range.max;
    this.rangeMultiplier = environment.visualization.radar.position.range.multiplier;
    this.numOfCircles = environment.visualization.radar.equidistant.circles;
  }

  onNewPosition(position: Position): void {
    this.lastPosition = position;
    this.calculateNewDomain();

    this.radar.addPoint(this.getNewPoint());
  }

  private calculateNewDomain(): void {
    const radius = PositionUtil.calculateDistanceInMeters(this.center, this.lastPosition);
    const domainMax = RadarUtil.getNewDomainMax(radius, this.range, this.numOfCircles, this.rangeMultiplier);
    if (this.range < domainMax) {
      this.domainChangedSource.next(domainMax);
    }
  }

  onRotation(rotation: number): void {
    this.radar.rotate(rotation);
  }

  onRangeChange(range: number): void {
    this.range = range;
  }

  // Will be called by the subscriptions, no need to call it in this component manually
  redraw(): void {
    this.radar.redraw();
  }

  /**
   * Returns the latest point to be drawn on the radar
   */
  getNewPoint(): Point {
    return this.calculatePointOnRadar(this.lastPosition);
  }

  private calculatePointOnRadar(position: Position): Point {
    // Get the distance from the center to the new position
    const radius = PositionUtil.calculateDistanceInMeters(this.center, position);
    const normalizedDirection = PositionUtil.getNormalizedDirection(this.center, position);

    // We need the factor to adjust the radar distance from the center
    const factor = radius / this.range;

    return RadarUtil.getPositionOnRadar(normalizedDirection, factor);
  }
}
