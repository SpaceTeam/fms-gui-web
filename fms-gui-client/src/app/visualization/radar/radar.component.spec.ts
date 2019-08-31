import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RadarComponent} from './radar.component';
import {Position} from '../../shared/model/flight/position';
import {before} from 'selenium-webdriver/testing';

describe('RadarComponent', () => {
  let component: RadarComponent;
  let fixture: ComponentFixture<RadarComponent>;

  const positions: Array<Position> = [
    new Position(0,0),
    new Position(-6.283185307, 15.70796327),  // -2 PI, 5 PI
    new Position(103.6725576, -50.26548246),   // 33 PI, -16 PI
    new Position(-34.55751919, -87.9645943), // 11 PI, 28 PI,
    new Position(180, 90)
  ];

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
    describe(`${positions[0].toString()} should be (in [lat,lon] format)`, () => {
      beforeEach(() => {
        component.center = positions[0];
      });

      describe('in the case of only one (or zero) values in the positions array', () => {
        it(`[0,0] for ${positions[0].toString()}`, () => {
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([0,0]);
        });
        it(`[16,7] for ${positions[1].toString()}`, () => {
          component.positions.push(positions[1]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([16,7]);
        });
        it(`[51,104] for ${positions[2].toString()}`, () => {
          component.positions.push(positions[2]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([51,104]);
        });
        it(`[88,35] for ${positions[3].toString()}`, () => {
          component.positions.push(positions[3]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([88,35]);
        });
        it(`[90,180] for ${positions[4].toString()}`, () => {
          component.positions.push(positions[4]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
      });
      describe('in the case of exactly two values in the positions array', () => {
        it(`[16,7] for ${positions[0].toString()} and ${positions[1]}`, () => {
          component.positions.push(positions[0], positions[1]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([16,7]);
        });
        it(`[51,104] for ${positions[0].toString()} and ${positions[2]}`, () => {
          component.positions.push(positions[0], positions[2]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([51,104]);
        });
        it(`[88,35] for ${positions[0].toString()} and ${positions[3]}`, () => {
          component.positions.push(positions[0], positions[3]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([88,35]);
        });
        it(`[90,180] for ${positions[0].toString()} and ${positions[4]}`, () => {
          component.positions.push(positions[0], positions[4]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[51,104] for ${positions[1].toString()} and ${positions[2]}`, () => {
          component.positions.push(positions[1], positions[2]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([51,104]);
        });
        it(`[88,35] for ${positions[1].toString()} and ${positions[3]}`, () => {
          component.positions.push(positions[1], positions[3]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([88,35]);
        });
        it(`[90,180] for ${positions[1].toString()} and ${positions[4]}`, () => {
          component.positions.push(positions[1], positions[4]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[88,104] for ${positions[2].toString()} and ${positions[3]}`, () => {
          component.positions.push(positions[2], positions[3]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([88,104]);
        });
        it(`[90,180] for ${positions[2].toString()} and ${positions[4]}`, () => {
          component.positions.push(positions[2], positions[4]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[3].toString()} and ${positions[4]}`, () => {
          component.positions.push(positions[3], positions[4]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
      });
      describe('in the case of exactly three values in the positions array', () => {
        it(`[51,104] for ${positions[0].toString()}, ${positions[1].toString()} and ${positions[2].toString()}`, () => {
          component.positions.push(positions[0], positions[1], positions[2]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([51,104]);
        });
        it(`[88,35] for ${positions[0].toString()}, ${positions[1].toString()} and ${positions[3].toString()}`, () => {
          component.positions.push(positions[0], positions[1], positions[3]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([88,35]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[1].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[0], positions[1], positions[4]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[88,104] for ${positions[0].toString()}, ${positions[2].toString()} and ${positions[3].toString()}`, () => {
          component.positions.push(positions[0], positions[2], positions[3]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([88,104]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[2].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[0], positions[2], positions[4]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[0], positions[3], positions[4]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[88,104] for ${positions[1].toString()}, ${positions[2].toString()} and ${positions[3].toString()}`, () => {
          component.positions.push(positions[1], positions[2], positions[3]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([88,104]);
        });
        it(`[90,180] for ${positions[1].toString()}, ${positions[2].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[1], positions[2], positions[4]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[1].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[1], positions[3], positions[4]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[2].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[2], positions[3], positions[4]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
      });
      describe('in the case of exactly four values in the positions array', () => {
        it(`[88,104] for ${positions[0].toString()}, ${positions[1].toString()}, ${positions[2].toString()} and ${positions[3].toString()}`, () => {
          component.positions.push(positions[0], positions[1], positions[2], positions[3]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([88,104]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[1].toString()}, ${positions[2].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[0], positions[1], positions[2], positions[4]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[1].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[0], positions[1], positions[3], positions[4]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[2].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[0], positions[2], positions[3], positions[4]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[1].toString()}, ${positions[2].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[1], positions[2], positions[3], positions[4]);
          const latDistance = component.distanceToBorder('latitude');
          const lonDistance = component.distanceToBorder('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
      });

      it('[90,180] in the case of all five values in the positions array', () => {
        component.positions.push(...positions);
        const latDistance = component.distanceToBorder('latitude');
        const lonDistance = component.distanceToBorder('longitude');
        expect([latDistance, lonDistance]).toEqual([90,180]);
      })
    });
  });

  xdescribe('distance from center', () => {
    describe(`${positions[0].toString()} should be`, () => {
      beforeEach(() => {
        component.center = positions[0];
      });

      it('0 for center', () => {
        const latitude = component.positionInDiagram(component.center, 'latitude');
        const longitude = component.positionInDiagram(component.center, 'longitude');
        expect([latitude, longitude]).toEqual([0, 0]);
      });
    });
  });

  describe('interpolationValue from', () => {
    describe(`${positions[0].toString()} to`, () => {
      beforeEach(() => {
        component.center = positions[0];
      });

      xdescribe(`${positions[0].toString()} should be`, () => {
        it(`[0,0] for ${positions[0]}`, () => {
          const x = positions[0];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([0,0]);
        });
        xit(`[0,0] for ${positions[1]}`, () => {
          const x = positions[1];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([0,0]);
        });
        xit(`[0,0] for ${positions[2]}`, () => {
          const x = positions[2];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([0,0]);
        });
        xit(`[0,0] for ${positions[3]}`, () => {
          const x = positions[3];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([0,0]);
        });
        xit(`[0,0] for ${positions[4]}`, () => {
          const x = positions[4];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([0,0]);
        });
      });
      describe(`${positions[1].toString()} should be`, () => {

        beforeEach(() => {
          component.positions.push(positions[1]);
        });

        it(`[0,1] for ${positions[0]}`, () => {
          const x = positions[0];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude', true);
          expect([latitude, longitude]).toEqual([0,1]);
        });
        xit(`[1,0] for ${positions[1]}`, () => {
          const x = positions[1];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude', true);
          expect([latitude, longitude]).toEqual([1,0]);
        });
        it(`throwing a RangeError for ${positions[2]}`, () => {
          const x = positions[2];
          expect(() => component.interpolationValue(x, 'latitude'))
            .toThrow(new RangeError(`Error: ${x.latitude} is out of bound between [${component.center.latitude},${component.distanceToBorder('latitude')}]`));
          expect(() => component.interpolationValue(x, 'longitude'))
            .toThrow(new RangeError(`Error: ${x.longitude} is out of bound between [${component.center.longitude},${component.distanceToBorder('longitude')}]`));
        });
        it(`throwing a RangeError for ${positions[3]}`, () => {
          const x = positions[3];
          expect(() => component.interpolationValue(x, 'latitude'))
            .toThrow(new RangeError(`Error: ${x.latitude} is out of bound between [${component.center.latitude},${component.distanceToBorder('latitude')}]`));
          expect(() => component.interpolationValue(x, 'longitude'))
            .toThrow(new RangeError(`Error: ${x.longitude} is out of bound between [${component.center.longitude},${component.distanceToBorder('longitude')}]`));
        });
        it(`throwing a RangeError for ${positions[4]}`, () => {
          const x = positions[4];
          expect(() => component.interpolationValue(x, 'latitude'))
            .toThrow(new RangeError(`Error: ${x.latitude} is out of bound between [${component.center.latitude},${component.distanceToBorder('latitude')}]`));
          expect(() => component.interpolationValue(x, 'longitude'))
            .toThrow(new RangeError(`Error: ${x.longitude} is out of bound between [${component.center.longitude},${component.distanceToBorder('longitude')}]`));
        });
      });
    });
  });

  xdescribe('radius in 2D from center', () => {
    describe('[lon:0,lat:0] should be', () => {

    });
  });
});
