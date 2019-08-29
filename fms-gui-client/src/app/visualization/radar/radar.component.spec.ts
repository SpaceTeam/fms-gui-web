import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadarComponent } from './radar.component';
import {Position} from '../../shared/model/flight/position';

describe('RadarComponent', () => {
  let component: RadarComponent;
  let fixture: ComponentFixture<RadarComponent>;

  let position1: Position;
  let position2: Position;
  let position3: Position;

  beforeAll(() => {
    position1 = {longitude: 52, latitude: 16, altitude: 0, timestamp: 0};
    position2 = {longitude: 55, latitude: -23, altitude: 0, timestamp: 0};
    position3 = {longitude: 56, latitude: 17, altitude: 0, timestamp: 0};
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.center = {longitude: 50, latitude: 15, altitude: 0, timestamp: 0};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('distance to border from center should be', () => {
    it('[1,1] for center', () => {
      const latDistance = component.calculateDistanceToBorder('latitude');
      const lonDistance = component.calculateDistanceToBorder('longitude');
      expect([latDistance, lonDistance]).toEqual([1,1]);
    });

    it('[2,3] for position1', () => {
      component.positions.push(position1);
      const latDistance = component.calculateDistanceToBorder('latitude');
      const lonDistance = component.calculateDistanceToBorder('longitude');
      expect([latDistance, lonDistance]).toEqual([2,3]);
    });

    it('[9,6] for position2', () => {
      component.positions.push(position2);
      const latDistance = component.calculateDistanceToBorder('latitude');
      const lonDistance = component.calculateDistanceToBorder('longitude');
      expect([latDistance, lonDistance]).toEqual([9,6]);
    });

    it('[3,7] for position3', () => {
      component.positions.push(position3);
      const latDistance = component.calculateDistanceToBorder('latitude');
      const lonDistance = component.calculateDistanceToBorder('longitude');
      expect([latDistance, lonDistance]).toEqual([3,7]);
    });

    it('[9,6] for position1 and position2', () => {
      component.positions.push(position1, position2);
      const latDistance = component.calculateDistanceToBorder('latitude');
      const lonDistance = component.calculateDistanceToBorder('longitude');
      expect([latDistance, lonDistance]).toEqual([9,6]);
    });

    it('[3,7] for position1 and position3', () => {
      component.positions.push(position1, position3);
      const latDistance = component.calculateDistanceToBorder('latitude');
      const lonDistance = component.calculateDistanceToBorder('longitude');
      expect([latDistance, lonDistance]).toEqual([3,7]);
    });

    it('[9,7] for position2 and position3', () => {
      component.positions.push(position2, position3);
      const latDistance = component.calculateDistanceToBorder('latitude');
      const lonDistance = component.calculateDistanceToBorder('longitude');
      expect([latDistance, lonDistance]).toEqual([9,7]);
    });

    it('[9,7] for position1, position2 and position3', () => {
      component.positions.push(position1, position2, position3);
      const latDistance = component.calculateDistanceToBorder('latitude');
      const lonDistance = component.calculateDistanceToBorder('longitude');
      expect([latDistance, lonDistance]).toEqual([9,7]);
    });
  });
});
