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

  // TODO: The service you have to create for communicating between the radar config and the radar should be only provided locally
  //  (in the local providers list - only if we need to use it in another service it should be in the global providers list)

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
