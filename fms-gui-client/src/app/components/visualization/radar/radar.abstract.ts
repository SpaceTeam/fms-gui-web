import {Position} from '../../../shared/model/flight/position';
import {Observable, Subject, Subscription} from 'rxjs';
import {AfterViewInit, Directive, OnDestroy} from '@angular/core';
import {PositionService} from '../../../shared/services/visualization/position/position.service';
import {RadarForm} from '../../../shared/forms/radar.form';
import {environment} from '../../../../environments/environment';
import {Point} from '../../../shared/model/point.model';
import {RadarUtil} from '../../../shared/utils/visualization/radar/radar.util';

/**
 * This is the base class for every component, which uses the radar
 */
@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class AbstractRadar implements AfterViewInit, OnDestroy {

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

  protected constructor(protected positionService: PositionService, protected radarForm: RadarForm) {
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
    const centerSubscription = this.radarForm.centerChanged$
      .subscribe(position => {
        this.onNewCenter(position);
        this.redraw();
      });
    this.subscriptions.push(centerSubscription);
  }

  /**
   * Subscribes to a change of the angle, put in by the user
   * As soon as the angle changes, we want to recalculate the positions on the radar
   */
  private subscribeToRotationChange(): void {
    const rotationSubscription = this.radarForm.rotationChanged$
      .subscribe(angleInDegrees => {
        this.onRotation(RadarUtil.toRadians(angleInDegrees));
        this.redraw();
      });
    this.subscriptions.push(rotationSubscription);
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
   * Tells what happens when we receive a new center
   * @param position the new center position entered by the user
   */
  private onNewCenter(position: Position): void {
    this.center = position;
  }

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
   * Redraws the radar
   */
  abstract redraw(): void;

  /**
   * Returns the last/new point that need to be drawn on the radar
   */
  abstract getNewPoint(): Point;
}
