import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {RadarComponent} from '../../visualization/radar/radar.component';
import {PositionService} from '../../../shared/services/visualization/position/position.service';

@Component({
  selector: 'app-flight-direction',
  templateUrl: './flight-direction.component.html',
  styleUrls: ['./flight-direction.component.scss']
})
export class FlightDirectionComponent implements AfterViewInit {

  @ViewChild(RadarComponent)
  private radar: RadarComponent;

  constructor(private positionService: PositionService) {
  }

  ngAfterViewInit(): void {
  }
}
