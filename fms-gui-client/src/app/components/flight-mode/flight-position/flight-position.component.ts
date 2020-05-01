import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
export class FlightPositionComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(RadarComponent)
  private radar: RadarComponent;

  private subscriptions: Array<Subscription>;
  private center: Position;
  private domainMax: number;
  private domainMultiplier: number;
  private minimumDomain: number;
  private numOfCircles: number;
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
    this.minimumDomain = environment.visualization.radar.position.domain.min;
    this.numOfCircles = environment.visualization.radar.equidistant.circles;

    this.subscriptions = [];
    this.subscribeToPositionChange();
    this.subscribeToCenterChange();
    this.subscribeToRotationChange();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // Set the range axis
    this.redrawAxis(AxisEnum.Y_AXIS);
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

  private onNewPosition(position: Position): void {
    this.lastPosition = position;
    this.redraw();
  }

  private onNewCenter(position: Position): void {
    this.center = position;
    this.redraw();
  }

  private onRotation(rotation: number): void {
    this.radar.rotate(rotation);
  }

  private redraw(): void {
    const radius = PositionUtil.calculateDistanceInMeters(this.center, this.lastPosition);
    const newDomainMax = RadarUtil.getNewDomainMax(radius, this.domainMax, this.numOfCircles, this.domainMultiplier);

    // If the range has changed, we also want to update the radar
    if (this.domainMax !== newDomainMax) {
      // Update radar range
      this.domainMax = newDomainMax;
      this.redrawAxis(AxisEnum.Y_AXIS);
    }
    this.radar.drawPositions(this.getPoints(this.lastPosition));
  }

  private redrawAxis(axisEnum: AxisEnum): void {
    this.radar.clearAxis();
    this.radar.setAxis(axisEnum, this.domainMax, this.numOfCircles);
  }

  private getPoints(position: Position): Array<Point> {
    // Get the distance from the center to the new position
    const radius = PositionUtil.calculateDistanceInMeters(this.center, position);
    const normalizedDirection = PositionUtil.getNormalizedDirection(this.center, position);

    // We need the factor to adjust the radar distance from the center
    const factor = radius / this.domainMax;

    return [RadarUtil.getPositionOnRadar(normalizedDirection, factor)];
  }
}
