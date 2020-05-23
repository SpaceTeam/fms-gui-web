import {Component} from '@angular/core';
import {AbstractRadar} from '../../visualization/radar/radar.abstract';
import {Point} from '../../../shared/model/point.model';
import {Position} from '../../../shared/model/flight/position';
import {PositionService} from '../../../shared/services/visualization/position/position.service';
import {RadarForm} from '../../../shared/forms/radar.form';

@Component({
  selector: 'app-flight-direction',
  templateUrl: './flight-direction.component.html',
  styleUrls: ['./flight-direction.component.scss']
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

  getPoints(): Array<Point> {
    // TODO: Implement me
    return undefined;
  }
}
