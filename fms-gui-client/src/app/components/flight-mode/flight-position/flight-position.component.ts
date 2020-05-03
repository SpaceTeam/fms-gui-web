import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {PositionService} from '../../../shared/services/visualization/position/position.service';
import {RadarComponent} from '../../visualization/radar/radar.component';
import {Subscription} from 'rxjs';
import {BrushService} from '../../../shared/services/visualization/brush/brush.service';
import {Position} from '../../../shared/model/flight/position';
import {environment} from '../../../../environments/environment';
import {RadarUtil} from '../../../shared/utils/visualization/radar/radar.util';
import {PositionUtil} from '../../../shared/utils/position/position.util';
import {AxisEnum} from '../../../shared/enums/axis.enum';
import {Point} from '../../../shared/model/point.model';
import {RadarForm} from '../../../shared/forms/radar.form';

@Component({
  selector: 'app-flight-position',
  templateUrl: './flight-position.component.html',
  styleUrls: ['./flight-position.component.scss']
})
export class FlightPositionComponent implements OnDestroy, AfterViewInit {

  // TODO: Create a parent class, which tells what functions must be implemented by children, which use a radar
  // e.g. subscribe methods, listener, getPoints

  @ViewChild(RadarComponent)
  private radar: RadarComponent;

  /**
   * Stores all subscriptions, from which we need to unsubscribe as soon as the component gets destroyed (to avoid memory leaks)
   */
  private subscriptions: Array<Subscription>;

  /**
   * Describes the current center position (latitude, longitude)
   * The user is able to change this value inside the radar config
   */
  private center: Position;

  /**
   * Stores the current range of the radar (e.g. max. 1000m)
   */
  private domainMax: number;

  /**
   * Tells how much the distance should get multiplied, if we are outside of the bounds or too close to the center
   * E.g. if we have a maximum of 1000m and we have a value outside of this bound, then with the multiplier = 2,
   * the new maximum should be 2000m
   * TODO: The user should be able to change this value (maybe with advanced options)
   */
  private domainMultiplier: number;

  /**
   * The number of equidistant circles to be displayed
   * TODO: The user should be able to change this value (maybe with advanced options)
   */
  private numOfCircles: number;

  /**
   * Stores the last position received from the FMS
   */
  private lastPosition: Position;

  constructor(
    private positionService: PositionService,
    private brushService: BrushService,
    private radarForm: RadarForm
  ) {
    const center = environment.visualization.radar.position.center;
    this.center = new Position(center.longitude, center.latitude);
    this.lastPosition = this.center;

    this.domainMax = environment.visualization.radar.position.domain.max;
    this.domainMultiplier = environment.visualization.radar.position.domain.multiplier;
    this.numOfCircles = environment.visualization.radar.equidistant.circles;

    this.subscriptions = [];
  }

  ngAfterViewInit() {
    this.subscribeToPositionChange();
    this.subscribeToCenterChange();
    this.subscribeToRotationChange();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Subscribes to a change of the position, sent by the FMS
   * As soon as the position changes, we want to recalculate the position on the radar
   */
  private subscribeToPositionChange(): void {
    const lastPositionSubscription = this.positionService.positionAnnounced$.subscribe(position => this.onNewPosition(position));
    this.subscriptions.push(lastPositionSubscription);
  }

  /**
   * Subscribes to a change of the center, put in by the user
   * As soon as the center changes, we want to recalculate the positions on the radar
   */
  private subscribeToCenterChange(): void {
    const centerSubscription = this.radarForm.centerChanged$.subscribe(position => this.onNewCenter(position));
    this.subscriptions.push(centerSubscription);
  }

  /**
   * Subscribes to a change of the rotation, put in by the user
   * As soon as the rotation value changes, we want to rotate the positions on the radar
   */
  private subscribeToRotationChange(): void {
    const rotationSubscription = this.radarForm.rotationChanged$.subscribe(rotation => this.onRotation(rotation));
    this.subscriptions.push(rotationSubscription);
  }

  /**
   * Tells what happens when we receive a new position
   * TODO: This method should be overridden from a super class -> all children, which use the radar, have to implement this method
   * @param position the latest position from the FMS
   */
  private onNewPosition(position: Position): void {
    this.lastPosition = position;
    this.redraw();
  }

  /**
   * Tells what happens when we receive a new center
   * TODO: This method should be overridden from a super class -> all children, which use the radar, have to implement this method
   * @param position the new center position entered by the user
   */
  private onNewCenter(position: Position): void {
    this.center = position;
    this.redraw();
  }

  /**
   * Tells what happens when we receive a new rotation angle
   * TODO: This method should be overridden from a super class -> all children, which use the radar, have to implement this method
   * @param rotation the angle in degrees
   */
  private onRotation(rotation: number): void {
    this.radar.rotate(rotation);
  }

  /**
   * Redraws the radar
   */
  private redraw(): void {
    this.updateDomain();
    this.redrawAxis(AxisEnum.Y_AXIS);
    this.radar.drawPositions(this.getPoints());
  }

  /**
   * Updates the domain max, if needed
   */
  private updateDomain(): void {
    const radius = PositionUtil.calculateDistanceInMeters(this.center, this.lastPosition);
    this.domainMax = RadarUtil.getNewDomainMax(radius, this.domainMax, this.numOfCircles, this.domainMultiplier);
  }

  /**
   * Clears all existing axis and draws only the given axis
   * @param axisEnum the axis to be drawn
   */
  private redrawAxis(axisEnum: AxisEnum): void {
    this.radar.clearAxis();
    this.radar.setAxis(axisEnum, this.domainMax, this.numOfCircles);
  }

  /**
   * Returns the points that need to be drawn on the radar
   * TODO: This method should be overridden from a super class -> all children, which use the radar, have to implement this method
   */
  private getPoints(): Array<Point> {
    // Get the distance from the center to the new position
    const radius = PositionUtil.calculateDistanceInMeters(this.center, this.lastPosition);
    const normalizedDirection = PositionUtil.getNormalizedDirection(this.center, this.lastPosition);

    // We need the factor to adjust the radar distance from the center
    const factor = radius / this.domainMax;

    return [RadarUtil.getPositionOnRadar(normalizedDirection, factor)];
  }

  /**
   * Notifies the radar form, that the rotation inside the radar has changed (when the user dragged the radar)
   * @param angle the rotation angle in radians
   */
  notifyRotationChange(angle: number): void {
    this.radarForm.dragRotation(angle);
  }

  resetZoom(): void {
    this.radar.resetZoom();
  }
}
