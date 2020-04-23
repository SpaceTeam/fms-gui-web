import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionService} from '../../../shared/services/visualization/position/position.service';
import {RadarComponent} from '../../visualization/radar/radar.component';
import {Subscription} from 'rxjs';
import {BrushService} from '../../../shared/services/visualization/brush/brush.service';
import {Position} from '../../../shared/model/flight/position';
import {environment} from '../../../../environments/environment';

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
  private range: number;
  private rangeMultiplier: number;
  private minimumRange: number;
  private numOfCircles: number;

  constructor(private positionService: PositionService, private brushService: BrushService) {
    this.subscriptions = [];
    this.subscribeToPositionChange();

    const center = environment.visualization.radar.position.center;
    this.center = new Position(center.longitude, center.latitude);

    this.range = environment.visualization.radar.position.range.defaultValue;
    this.rangeMultiplier = environment.visualization.radar.position.range.multiplier;
    this.minimumRange = environment.visualization.radar.position.range.min;
    this.numOfCircles = environment.visualization.radar.equidistant.circles;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Subscribes to a change of the position, sent by the FMS
   * As soon as the position changes, we want to recalculate the position on the radar
   */
  private subscribeToPositionChange(): void {
    const lastPositionSubscription = this.positionService.positionAnnounced$
      .subscribe(position => this.radar.drawPositions([position]));
    this.subscriptions.push(lastPositionSubscription);
  }
}
