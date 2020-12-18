import {Position} from '../../../shared/model/flight/position';
import {Observable, Subject, Subscription} from 'rxjs';
import {AfterViewInit, Directive, OnDestroy} from '@angular/core';
import {PositionService} from '../../../shared/services/visualization/position/position.service';
import {Point} from '../../../shared/model/point.model';
import {RadarConfigService} from '../../../shared/services/visualization/radar-config/radar-config.service';
import {environment} from '../../../../environments/environment';

/**
 * This is the base class for every component, which uses the radar
 */
@Directive()
export abstract class AbstractRadarDirective implements AfterViewInit, OnDestroy {

  /**
   * Stores all subscriptions, from which we need to unsubscribe as soon as the component gets destroyed (to avoid memory leaks)
   */
  private subscriptions: Array<Subscription>;

  /**
   * Describes the current center position (latitude, longitude)
   * The user is able to change this value inside the radar config
   */
  protected center: Position;

  /**
   * The number of equidistant circles to be displayed
   * TODO: The user should be able to change this value (maybe with advanced options) -> should be changed via the radar-config
   */
  protected numOfCircles: number;

  // Observable number resource
  domainChangedSource: Subject<number>;

  // Observable number stream
  domainChanged$: Observable<number>;

  protected constructor(protected positionService: PositionService, protected radarConfigService: RadarConfigService) {
    this.subscriptions = [];
    const center = environment.visualization.radar.position.center;
    this.center = new Position(center.longitude, center.latitude);

    this.domainChangedSource = new Subject<number>();
    this.domainChanged$ = this.domainChangedSource.asObservable();
  }

  ngAfterViewInit(): void {
    this.subscribeToPositionChange();
    this.subscribeToCenterChange();
    this.subscribeToRotationChange();
    this.subscribeToDomainChange();
    this.subscribeToResetZoom();
    // this.subscribeToEquidistantCircleChange();
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
      .subscribe(position => {
        this.onNewPosition(position);
        this.redraw();
      });
    this.subscriptions.push(lastPositionSubscription);
  }

  /**
   * Subscribes to a change of the center, put in by the user
   * As soon as the center changes, we want to recalculate the positions on the radar
   */
  private subscribeToCenterChange(): void {
    const latitudeSubscription = this.radarConfigService.latitudeChanged$.subscribe(latitude => {
      this.center.latitude = latitude;
      this.redraw();
    });
    const longitudeSubscription = this.radarConfigService.longitudeChanged$.subscribe(longitude => {
      this.center.longitude = longitude;
      this.redraw();
    });
    this.subscriptions.push(latitudeSubscription, longitudeSubscription);
  }

  private subscribeToRotationChange(): void {
    const rotationSubscription = this.radarConfigService.rotationChanged$.subscribe(angleDifference => this.onRotation(angleDifference));
    this.subscriptions.push(rotationSubscription);
  }

  private subscribeToResetZoom(): void {
    const resetZoomSubscription = this.radarConfigService.resetZoomClicked$.subscribe(() => this.onZoomReset());
    this.subscriptions.push(resetZoomSubscription);
  }

  /**
   * Subscribes to a change of the domain
   * As soon as the domain changes, we want to recalculate the positions on the radar
   */
  private subscribeToDomainChange(): void {
    const domainSubscription = this.domainChanged$
      .subscribe(newDomain => {
        this.onRangeChange(newDomain);
        this.redraw();
      });
    this.subscriptions.push(domainSubscription);
  }

  /**
   * Tells what happens when we receive a new position
   * @param position the latest position from the FMS
   */
  abstract onNewPosition(position: Position): void;

  /**
   * Tells what happens when we receive a new rotation angle
   * @param rotation the angle in radians
   */
  abstract onRotation(rotation: number): void;

  /**
   * Tells what happens when we receive a new domain
   * @param newDomain the new domain max value
   */
  abstract onRangeChange(newDomain: number): void;

  /**
   * Tells what happens when we receive a 'reset zoom' event
   */
  abstract onZoomReset(): void;

  /**
   * Redraws the radar
   */
  abstract redraw(): void;

  /**
   * Returns the last/new point that need to be drawn on the radar
   */
  abstract getNewPoint(): Point;
}
