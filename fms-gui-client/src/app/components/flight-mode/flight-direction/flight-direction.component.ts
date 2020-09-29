import {Component} from '@angular/core';
import {AbstractRadar} from '../../visualization/radar/radar.abstract';
import {Point} from '../../../shared/model/point.model';
import {Position} from '../../../shared/model/flight/position';
import {PositionService} from '../../../shared/services/visualization/position/position.service';
import {RadarForm} from '../../../shared/forms/radar.form';
import {RadarConfigService} from '../../../shared/services/visualization/radar-config/radar-config.service';

@Component({
  selector: 'app-flight-direction',
  templateUrl: './flight-direction.component.html',
  styleUrls: ['./flight-direction.component.scss'],
  providers: [RadarConfigService]
})
export class FlightDirectionComponent extends AbstractRadar {

  constructor(protected positionService: PositionService, protected radarForm: RadarForm) {
    super(positionService, radarForm);
  }

  onNewPosition(position: Position): void {
    // TODO: Implement me
  }

  onRotation(rotation: number): void {
    // TODO: Implement me
  }

  redraw(): void {
    // TODO: Implement me
  }

  getNewPoint(): Point {
    // TODO: Implement me
    return null;
  }

  onRangeChange(newDomain: number): void {
    // TODO: Implement me
  }
}
