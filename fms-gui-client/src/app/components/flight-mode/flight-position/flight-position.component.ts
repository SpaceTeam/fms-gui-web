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
import d3 = require('d3');

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

  constructor(private positionService: PositionService, private brushService: BrushService) {
    const center = environment.visualization.radar.position.center;
    this.center = new Position(center.longitude, center.latitude);

    this.domainMax = environment.visualization.radar.position.domain.max;
    this.domainMultiplier = environment.visualization.radar.position.domain.multiplier;
    this.minimumDomain = environment.visualization.radar.position.domain.min;
    this.numOfCircles = environment.visualization.radar.equidistant.circles;

    this.subscriptions = [];
    this.subscribeToPositionChange();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // Set the range axis
    this.redrawAxis(AxisEnum.X_AXIS);
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

  // TODO: Clean up this method
  private onNewPosition(position: Position): void {
    // Whenever a new position is received, it is possible, that we need to adjust the range
    const radius = PositionUtil.calculateDistanceInMeters(this.center, position);
    const newDomainMax = RadarUtil.getNewDomainMax(radius, this.domainMax, this.numOfCircles, this.domainMultiplier);

    // If the range has changed, we also want to update the radar
    if (this.domainMax !== newDomainMax) {
      // Update radar range
      this.domainMax = newDomainMax;
      this.redrawAxis(AxisEnum.X_AXIS);
      console.log(`New domain max: ${newDomainMax}`);
      console.log(`Radius: ${radius}`);
    }

    // We need the factor to adjust the actual distance from the center
    const factor = radius / this.domainMax;

    const point = PositionUtil.getNormalizedDirection(this.center, position);
    const positionOnRadar = RadarUtil.getPositionOnRadar(point, factor);

    this.radar.drawPositions([positionOnRadar]);
  }

  private redrawAxis(axisEnum: AxisEnum): void {
    const scale = d3.scaleLinear()
      .domain([0, this.domainMax])
      .range([50, 100]);
    this.radar.setAxis(axisEnum, scale, this.numOfCircles);
  }
}
