import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RadarComponent} from './radar.component';
import {Position} from '../../shared/model/flight/position';

describe('RadarComponent', () => {
  let component: RadarComponent;
  let fixture: ComponentFixture<RadarComponent>;

  let position1: Position;
  let position2: Position;
  let position3: Position;

  beforeAll(() => {
    position1 = new Position(52, 16);
    position2 = new Position(55, -23);
    position3 = new Position(56, 17);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RadarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('distance to border from', () => {
    describe('[lon:50, lat:15] should be', () => {
      beforeEach(() => {
        component.center = new Position(50, 15);
      });

      it('testing the test', () => {
        expect(component.center).toEqual(new Position(50, 15));
      });

      it('[1,1] for center', () => {
        const latDistance = component.calculateDistanceToBorder('latitude');
        const lonDistance = component.calculateDistanceToBorder('longitude');
        expect([latDistance, lonDistance]).toEqual([1, 1]);
      });

      it('[2,3] for position1', () => {
        component.positions.push(position1);
        const latDistance = component.calculateDistanceToBorder('latitude');
        const lonDistance = component.calculateDistanceToBorder('longitude');
        expect([latDistance, lonDistance]).toEqual([2, 3]);
      });

      it('[9,6] for position2', () => {
        component.positions.push(position2);
        const latDistance = component.calculateDistanceToBorder('latitude');
        const lonDistance = component.calculateDistanceToBorder('longitude');
        expect([latDistance, lonDistance]).toEqual([9, 6]);
      });

      it('[3,7] for position3', () => {
        component.positions.push(position3);
        const latDistance = component.calculateDistanceToBorder('latitude');
        const lonDistance = component.calculateDistanceToBorder('longitude');
        expect([latDistance, lonDistance]).toEqual([3, 7]);
      });

      it('[9,6] for position1 and position2', () => {
        component.positions.push(position1, position2);
        const latDistance = component.calculateDistanceToBorder('latitude');
        const lonDistance = component.calculateDistanceToBorder('longitude');
        expect([latDistance, lonDistance]).toEqual([9, 6]);
      });

      it('[3,7] for position1 and position3', () => {
        component.positions.push(position1, position3);
        const latDistance = component.calculateDistanceToBorder('latitude');
        const lonDistance = component.calculateDistanceToBorder('longitude');
        expect([latDistance, lonDistance]).toEqual([3, 7]);
      });

      it('[9,7] for position2 and position3', () => {
        component.positions.push(position2, position3);
        const latDistance = component.calculateDistanceToBorder('latitude');
        const lonDistance = component.calculateDistanceToBorder('longitude');
        expect([latDistance, lonDistance]).toEqual([9, 7]);
      });

      it('[9,7] for position1, position2 and position3', () => {
        component.positions.push(position1, position2, position3);
        const latDistance = component.calculateDistanceToBorder('latitude');
        const lonDistance = component.calculateDistanceToBorder('longitude');
        expect([latDistance, lonDistance]).toEqual([9, 7]);
      });
    });
    describe('[lon:0, lat:0] should be', () => {
      beforeEach(() => {
        component.center = new Position(0, 0);
      });

      it('testing the test', () => {
        expect(component.center).toEqual(new Position(0, 0));
      });

      it('[1,1] for center', () => {
        const latDistance = component.calculateDistanceToBorder('latitude');
        const lonDistance = component.calculateDistanceToBorder('longitude');
        expect([latDistance, lonDistance]).toEqual([1,1]);
      });

      it('[17,53] for position1', () => {
        component.positions.push(position1);
        const latDistance = component.calculateDistanceToBorder('latitude');
        const lonDistance = component.calculateDistanceToBorder('longitude');
        expect([latDistance, lonDistance]).toEqual([17,53]);
      });

      it('[24,56] for position2', () => {
        component.positions.push(position2);
        const latDistance = component.calculateDistanceToBorder('latitude');
        const lonDistance = component.calculateDistanceToBorder('longitude');
        expect([latDistance, lonDistance]).toEqual([24,56]);
      });

      it('[18,57] for position3', () => {
        component.positions.push(position3);
        const latDistance = component.calculateDistanceToBorder('latitude');
        const lonDistance = component.calculateDistanceToBorder('longitude');
        expect([latDistance, lonDistance]).toEqual([18,57]);
      });

      it('[24,56] for position1 and position2', () => {
        component.positions.push(position1, position2);
        const latDistance = component.calculateDistanceToBorder('latitude');
        const lonDistance = component.calculateDistanceToBorder('longitude');
        expect([latDistance, lonDistance]).toEqual([24,56]);
      });

      it('[18,57] for position1 and position3', () => {
        component.positions.push(position1, position3);
        const latDistance = component.calculateDistanceToBorder('latitude');
        const lonDistance = component.calculateDistanceToBorder('longitude');
        expect([latDistance, lonDistance]).toEqual([18,57]);
      });

      it('[24,57] for position2 and position3', () => {
        component.positions.push(position2, position3);
        const latDistance = component.calculateDistanceToBorder('latitude');
        const lonDistance = component.calculateDistanceToBorder('longitude');
        expect([latDistance, lonDistance]).toEqual([24,57]);
      });

      it('[24,57] for position1, position2 and position3', () => {
        component.positions.push(position1, position2, position3);
        const latDistance = component.calculateDistanceToBorder('latitude');
        const lonDistance = component.calculateDistanceToBorder('longitude');
        expect([latDistance, lonDistance]).toEqual([24,57]);
      });
    });
  });

  describe('distance from center', () => {
    describe('[lon:50, lat:15] should be', () => {
      beforeEach(() => {
        component.center = new Position(50, 15);
      });

      it('0 for center', () => {
        const latitude = component.calculateDistanceFromCenter(component.center, 'latitude');
        const longitude = component.calculateDistanceFromCenter(component.center, 'longitude');
        expect([latitude, longitude]).toEqual([0, 0]);
      });
    });
    describe('[lon:0,lat:0] should be', () => {
      beforeEach(() => {
        component.center = new Position(0, 0);
      });

      it('0 for center', () => {
        const latitude = component.calculateDistanceFromCenter(component.center, 'latitude');
        const longitude = component.calculateDistanceFromCenter(component.center, 'longitude');
        expect([latitude, longitude]).toEqual([0, 0]);
      });
    });
  });
});
