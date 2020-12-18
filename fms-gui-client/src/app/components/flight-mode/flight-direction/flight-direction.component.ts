import {Component} from '@angular/core';
import {AbstractRadarDirective} from '../../visualization/radar/radar.abstract.directive';
import {Point} from '../../../shared/model/point.model';
import {Position} from '../../../shared/model/flight/position';
import {PositionService} from '../../../shared/services/visualization/position/position.service';
import {RadarConfigService} from '../../../shared/services/visualization/radar-config/radar-config.service';

@Component({
  selector: 'app-flight-direction',
  templateUrl: './flight-direction.component.html',
  styleUrls: ['./flight-direction.component.scss'],
  providers: [RadarConfigService]
})
export class FlightDirectionComponent extends AbstractRadarDirective {

  // TODO: Implement the flight direction component
  constructor(protected positionService: PositionService, protected radarConfigService: RadarConfigService) {
    super(positionService, radarConfigService);
  }

  onNewPosition(position: Position): void {
  }

  onRotation(rotation: number): void {
  }

  redraw(): void {
  }

  getNewPoint(): Point {
    return null;
  }

  onRangeChange(newDomain: number): void {
  }

  onZoomReset(): void {
  }
}
