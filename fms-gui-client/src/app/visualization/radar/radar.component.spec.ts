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
    new Position(103.6725576, -50.26548246),  // 33 PI, -16 PI
    new Position(-34.55751919, -87.9645943),  // -11 PI, -28 PI,
    new Position(180, 90)
  ];

  function rangeErrorMsg(x: number, center: number, distance: number): string {
    const l = center - distance;
    const u = center + distance;
    return `Error: ${component.roundNumber(x)} is out of bounds between [${component.roundNumber(l)},${component.roundNumber(u)}]`;
  }

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

    component.size = 600;
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
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([0,0]);
        });
        it(`[15.707963,6.283185] for ${positions[1].toString()}`, () => {
          component.positions.push(positions[1]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([15.707963,6.283185]);
        });
        it(`[50.265482,103.672558] for ${positions[2].toString()}`, () => {
          component.positions.push(positions[2]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([50.265482,103.672558]);
        });
        it(`[87.964594,34.557519] for ${positions[3].toString()}`, () => {
          component.positions.push(positions[3]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([87.964594,34.557519]);
        });
        it(`[90,180] for ${positions[4].toString()}`, () => {
          component.positions.push(positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
      });
      describe('in the case of exactly two values in the positions array', () => {
        it(`[15.707963,6.283185] for ${positions[0].toString()} and ${positions[1]}`, () => {
          component.positions.push(positions[0], positions[1]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([15.707963,6.283185]);
        });
        it(`[50.265482,103.672558] for ${positions[0].toString()} and ${positions[2]}`, () => {
          component.positions.push(positions[0], positions[2]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([50.265482,103.672558]);
        });
        it(`[87.964594,34.557519] for ${positions[0].toString()} and ${positions[3]}`, () => {
          component.positions.push(positions[0], positions[3]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([87.964594,34.557519]);
        });
        it(`[90,180] for ${positions[0].toString()} and ${positions[4]}`, () => {
          component.positions.push(positions[0], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[50.265482,103.672558] for ${positions[1].toString()} and ${positions[2]}`, () => {
          component.positions.push(positions[1], positions[2]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([50.265482,103.672558]);
        });
        it(`[87.964594,34.557519] for ${positions[1].toString()} and ${positions[3]}`, () => {
          component.positions.push(positions[1], positions[3]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([87.964594,34.557519]);
        });
        it(`[90,180] for ${positions[1].toString()} and ${positions[4]}`, () => {
          component.positions.push(positions[1], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[87.964594,103.672558] for ${positions[2].toString()} and ${positions[3]}`, () => {
          component.positions.push(positions[2], positions[3]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([87.964594,103.672558]);
        });
        it(`[90,180] for ${positions[2].toString()} and ${positions[4]}`, () => {
          component.positions.push(positions[2], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[3].toString()} and ${positions[4]}`, () => {
          component.positions.push(positions[3], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
      });
      describe('in the case of exactly three values in the positions array', () => {
        it(`[50.265482,103.672558] for ${positions[0].toString()}, ${positions[1].toString()} and ${positions[2].toString()}`, () => {
          component.positions.push(positions[0], positions[1], positions[2]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([50.265482,103.672558]);
        });
        it(`[87.964594,34.557519] for ${positions[0].toString()}, ${positions[1].toString()} and ${positions[3].toString()}`, () => {
          component.positions.push(positions[0], positions[1], positions[3]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([87.964594,34.557519]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[1].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[0], positions[1], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[87.964594,103.672558] for ${positions[0].toString()}, ${positions[2].toString()} and ${positions[3].toString()}`, () => {
          component.positions.push(positions[0], positions[2], positions[3]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([87.964594,103.672558]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[2].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[0], positions[2], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[0], positions[3], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[87.964594,103.672558] for ${positions[1].toString()}, ${positions[2].toString()} and ${positions[3].toString()}`, () => {
          component.positions.push(positions[1], positions[2], positions[3]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([87.964594,103.672558]);
        });
        it(`[90,180] for ${positions[1].toString()}, ${positions[2].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[1], positions[2], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[1].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[1], positions[3], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[2].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[2], positions[3], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
      });
      describe('in the case of exactly four values in the positions array', () => {
        it(`[87.964594,103.672558] for ${positions[0].toString()}, ${positions[1].toString()}, ${positions[2].toString()} and ${positions[3].toString()}`, () => {
          component.positions.push(positions[0], positions[1], positions[2], positions[3]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([87.964594,103.672558]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[1].toString()}, ${positions[2].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[0], positions[1], positions[2], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[1].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[0], positions[1], positions[3], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[2].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[0], positions[2], positions[3], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[1].toString()}, ${positions[2].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          component.positions.push(positions[1], positions[2], positions[3], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
      });
      it('[90,180] in the case of all five values in the positions array', () => {
        component.positions.push(...positions);
        const latDistance = component.longestDistance('latitude');
        const lonDistance = component.longestDistance('longitude');
        expect([latDistance, lonDistance]).toEqual([90,180]);
      })
    });
    describe(`${positions[1].toString()} should be (in [lat,lon] format)`, () => {
      beforeEach(() => {
        component.center = positions[1];
      });

      describe('in the case of only one (or zero) values in the positions array', () => {
        // 00000, 00001, 00010, 00100, 01000, 10000
        // none, 0, 1, 2, 3, 4
        it(`[15.707963,6.283185] for ${positions[0].toString()}`, () => {
          component.positions.push(positions[0]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([15.707963,6.283185]);
        });
        it(`[0,0] for ${positions[1].toString()}`, () => {
          // component.positions.push(positions[1]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([0,0]);
        });
        it(`[65.973446,109.955743] for ${positions[2].toString()}`, () => {
          component.positions.push(positions[2]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([65.973446,109.955743]);
        });
        it(`[103.672558,28.274334] for ${positions[3].toString()}`, () => {
          component.positions.push(positions[3]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([103.672558,28.274334]);
        });
        it(`[74.292037,186.283185] for ${positions[4].toString()}`, () => {
          component.positions.push(positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([74.292037,186.283185]);
        });
      });
      describe('in the case of exactly two values in the positions array', () => {
        // 00011, 00101, 00110, 01001, 01010, 01100, 10001, 10010, 10100, 11000
        // 01, 02, 12, 03, 13, 23, 04, 14, 24, 34
        // 01, 02, 03, 04, 12, 13, 14, 23, 24, 34
        it(`[15.707963, 6.283185] for ${positions[0]} and ${positions[1]}`, () => {
          component.positions.push(positions[0], positions[1]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([15.707963, 6.283185]);
        });
        it(`[65.973446,109.955743] for ${positions[0]} and ${positions[2]}`, () => {
          component.positions.push(positions[0], positions[2]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([65.973446,109.955743]);
        });
        it(`[103.672558,28.274334] for ${positions[0]} and ${positions[3]}`, () => {
          component.positions.push(positions[0], positions[3]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([103.672558,28.274334]);
        });
        it(`[74.292037,186.283185] for ${positions[0]} and ${positions[4]}`, () => {
          component.positions.push(positions[0], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([74.292037,186.283185]);
        });
        it(`[65.973446,109.955743] for ${positions[1]} and ${positions[2]}`, () => {
          component.positions.push(positions[1], positions[2]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([65.973446,109.955743]);
        });
        it(`[103.672558,28.274334] for ${positions[1]} and ${positions[3]}`, () => {
          component.positions.push(positions[1], positions[3]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([103.672558,28.274334]);
        });
        it(`[74.292037,186.283185] for ${positions[1]} and ${positions[4]}`, () => {
          component.positions.push(positions[1], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([74.292037,186.283185]);
        });
        it(`[103.672558,109.955743] for ${positions[2]} and ${positions[3]}`, () => {
          component.positions.push(positions[2], positions[3]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([103.672558,109.955743]);
        });
        it(`[74.292037,186.283185] for ${positions[2]} and ${positions[4]}`, () => {
          component.positions.push(positions[2], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([74.292037,186.283185]);
        });
        it(`[103.672558,186.283185] for ${positions[3]} and ${positions[4]}`, () => {
          component.positions.push(positions[3], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([103.672558,186.283185]);
        });
      });
      describe('in the case of exactly three values in the positions array', () => {
        // 00111, 01011, 01101, 01110, 10011, 10101, 10110, 11001, 11010, 11100
        // 012, 013, 023, 123, 014, 024, 124, 034, 134, 234
        // 012, 013, 014, 023, 024, 034, 123, 124, 134, 234
        it(`[65.973446,109.955743] for ${positions[0]}, ${positions[1]} and ${positions[2]}`, () => {
          component.positions.push(positions[0], positions[1], positions[2]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([65.973446,109.955743]);
        });
        it(`[103.672558,28.274334] for ${positions[0]}, ${positions[1]} and ${positions[3]}`, () => {
          component.positions.push(positions[0], positions[1], positions[3]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([103.672558,28.274334]);
        });
        it(`[74.292037,186.283185] for ${positions[0]}, ${positions[1]} and ${positions[4]}`, () => {
          component.positions.push(positions[0], positions[1], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([74.292037,186.283185]);
        });
        it(`[103.672558,109.955743] for ${positions[0]}, ${positions[2]} and ${positions[3]}`, () => {
          component.positions.push(positions[0], positions[2], positions[3]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([103.672558,109.955743]);
        });
        it(`[74.292037,186.283185] for ${positions[0]}, ${positions[2]} and ${positions[4]}`, () => {
          component.positions.push(positions[0], positions[2], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([74.292037,186.283185]);
        });
        it(`[103.672558,186.283185] for ${positions[0]}, ${positions[3]} and ${positions[4]}`, () => {
          component.positions.push(positions[0], positions[3], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([103.672558,186.283185]);
        });
        it(`[103.672558,109.955743] for ${positions[1]}, ${positions[2]} and ${positions[3]}`, () => {
          component.positions.push(positions[1], positions[2], positions[3]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([103.672558,109.955743]);
        });
        it(`[74.292037,186.283185] for ${positions[1]}, ${positions[2]} and ${positions[4]}`, () => {
          component.positions.push(positions[1], positions[2], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([74.292037,186.283185]);
        });
        it(`[103.672558,186.283185] for ${positions[1]}, ${positions[3]} and ${positions[4]}`, () => {
          component.positions.push(positions[1], positions[3], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([103.672558,186.283185]);
        });
        it(`[103.672558,186.283185] for ${positions[2]}, ${positions[3]} and ${positions[4]}`, () => {
          component.positions.push(positions[2], positions[3], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([103.672558,186.283185]);
        });
      });
      describe('in the case of exactly four values in the positions array', () => {
        // 01111, 10111, 11011, 11101, 11110
        // 0123, 0124, 0134, 0234, 1234
        it(`[103.672558,109.955743] for ${positions[0]}, ${positions[1]}, ${positions[2]}, ${positions[3]}`, () => {
          component.positions.push(positions[0], positions[1], positions[2], positions[3]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([103.672558,109.955743]);
        });
        it(`[74.292037,186.283185] for ${positions[0]}, ${positions[1]}, ${positions[2]}, ${positions[4]}`, () => {
          component.positions.push(positions[0], positions[1], positions[2], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([74.292037,186.283185]);
        });
        it(`[103.672558,186.283185] for ${positions[0]}, ${positions[1]}, ${positions[3]}, ${positions[4]}`, () => {
          component.positions.push(positions[0], positions[1], positions[3], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([103.672558,186.283185]);
        });
        it(`[103.672558,186.283185] for ${positions[0]}, ${positions[2]}, ${positions[3]}, ${positions[4]}`, () => {
          component.positions.push(positions[0], positions[2], positions[3], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([103.672558,186.283185]);
        });
        it(`[103.672558,186.283185] for ${positions[1]}, ${positions[2]}, ${positions[3]}, ${positions[4]}`, () => {
          component.positions.push(positions[1], positions[2], positions[3], positions[4]);
          const latDistance = component.longestDistance('latitude');
          const lonDistance = component.longestDistance('longitude');
          expect([latDistance, lonDistance]).toEqual([103.672558,186.283185]);
        });
      });
      it('[103.672558,186.283185] in the case of all five values in the positions array', () => {
        // 11111
        // 01234
        component.positions.push(...positions);
        const latDistance = component.longestDistance('latitude');
        const lonDistance = component.longestDistance('longitude');
        expect([latDistance, lonDistance]).toEqual([103.672558,186.283185]);
      });
    });
  });

  describe('position in the diagram', () => {
    describe(`${positions[0].toString()} should be`, () => {
      beforeEach(() => {
        component.center = positions[0];
      });

      describe('in the case of only one (or zero) values in the positions array', () => {
        it(`[300,300] for center (${positions[0]})`, () => {
          // component.positions.push(positions[0])
          const latitude = component.positionInDiagram(component.center, 'latitude');
          const longitude = component.positionInDiagram(component.center, 'longitude');
          expect([latitude, longitude]).toEqual([300,300]);
        });
        it(`[600,0] for ${positions[1]}`, () => {
          const position = positions[1];
          component.positions.push(position);
          const latitude = component.positionInDiagram(position, 'latitude');
          const longitude = component.positionInDiagram(position, 'longitude');
          expect([latitude, longitude]).toEqual([600,0]);
        });
        it(`[0,600] for ${positions[2]}`, () => {
          const position = positions[2];
          component.positions.push(position);
          const latitude = component.positionInDiagram(position, 'latitude');
          const longitude = component.positionInDiagram(position, 'longitude');
          expect([latitude, longitude]).toEqual([0,600]);
        });
        it(`[0,0] for ${positions[3]}`, () => {
          const position = positions[3];
          component.positions.push(position);
          const latitude = component.positionInDiagram(position, 'latitude');
          const longitude = component.positionInDiagram(position, 'longitude');
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`[600,600] for ${positions[4]}`, () => {
          const position = positions[4];
          component.positions.push(position);
          const latitude = component.positionInDiagram(position, 'latitude');
          const longitude = component.positionInDiagram(position, 'longitude');
          expect([latitude, longitude]).toEqual([600,600]);
        });
      });
      describe('in the case of exactly two values in the positions array', () => {
        let x, y;
        let pos1, pos2;

        // 01, 02, 03, 04, 12, 13, 14, 23, 24, 34
        it(`${positions[0]} and ${positions[1]}`, () => {
          pos1 = positions[0];
          pos2 = positions[1];
          component.positions.push(pos1, pos2);

          y = component.positionInDiagram(pos1, 'latitude');
          x = component.positionInDiagram(pos1, 'longitude');
          expect([x, y]).toEqual([300,300]);

          y = component.positionInDiagram(pos2, 'latitude');
          x = component.positionInDiagram(pos2, 'longitude');
          expect([x, y]).toEqual([0,600]);
        });
        it(`${positions[0]} and ${positions[2]}`, () => {
          pos1 = positions[0];
          pos2 = positions[2];

          component.positions.push(pos1, pos2);

          y = component.positionInDiagram(pos1, 'latitude');
          x = component.positionInDiagram(pos1, 'longitude');
          expect([x, y]).toEqual([300,300]);

          y = component.positionInDiagram(pos2, 'latitude');
          x = component.positionInDiagram(pos2, 'longitude');
          expect([x, y]).toEqual([600,0]);
        });
        it(`${positions[0]} and ${positions[3]}`, () => {
          pos1 = positions[0];
          pos2 = positions[3];

          component.positions.push(pos1, pos2);

          y = component.positionInDiagram(pos1, 'latitude');
          x = component.positionInDiagram(pos1, 'longitude');
          expect([x, y]).toEqual([300,300]);

          y = component.positionInDiagram(pos2, 'latitude');
          x = component.positionInDiagram(pos2, 'longitude');
          expect([x, y]).toEqual([0,0]);
        });
        it(`${positions[0]} and ${positions[4]}`, () => {
          pos1 = positions[0];
          pos2 = positions[4];

          component.positions.push(pos1, pos2);

          y = component.positionInDiagram(pos1, 'latitude');
          x = component.positionInDiagram(pos1, 'longitude');
          expect([x, y]).toEqual([300,300]);

          y = component.positionInDiagram(pos2, 'latitude');
          x = component.positionInDiagram(pos2, 'longitude');
          expect([x, y]).toEqual([600,600]);
        });
        it(`${positions[1]} and ${positions[2]}`, () => {
          pos1 = positions[1];
          pos2 = positions[2];
          component.positions.push(pos1, pos2);

          y = component.positionInDiagram(pos1, 'latitude');
          x = component.positionInDiagram(pos1, 'longitude');
          expect([x, y]).toEqual([281.8182,393.75]);

          y = component.positionInDiagram(pos2, 'latitude');
          x = component.positionInDiagram(pos2, 'longitude');
          expect([x, y]).toEqual([600, 0]);
        });
        xit(`${positions[1]} and ${positions[3]}`, () => {
          pos1 = positions[1];
          pos2 = positions[3];
          component.positions.push(pos1, pos2);

          y = component.positionInDiagram(pos1, 'latitude');
          x = component.positionInDiagram(pos1, 'longitude');
          expect([x, y]).toEqual([]);

          y = component.positionInDiagram(pos2, 'latitude');
          x = component.positionInDiagram(pos2, 'longitude');
          expect([x, y]).toEqual([]);
        });
        xit(`${positions[1]} and ${positions[4]}`, () => {
          pos1 = positions[1];
          pos2 = positions[4];
          component.positions.push(pos1, pos2);

          y = component.positionInDiagram(pos1, 'latitude');
          x = component.positionInDiagram(pos1, 'longitude');
          expect([x, y]).toEqual([]);

          y = component.positionInDiagram(pos2, 'latitude');
          x = component.positionInDiagram(pos2, 'longitude');
          expect([x, y]).toEqual([]);
        });
        xit(`${positions[2]} and ${positions[3]}`, () => {
          pos1 = positions[2];
          pos2 = positions[3];
          component.positions.push(pos1, pos2);

          y = component.positionInDiagram(pos1, 'latitude');
          x = component.positionInDiagram(pos1, 'longitude');
          expect([x, y]).toEqual([]);

          y = component.positionInDiagram(pos2, 'latitude');
          x = component.positionInDiagram(pos2, 'longitude');
          expect([x, y]).toEqual([]);
        });
        xit(`${positions[2]} and ${positions[4]}`, () => {
          pos1 = positions[2];
          pos2 = positions[4];
          component.positions.push(pos1, pos2);

          y = component.positionInDiagram(pos1, 'latitude');
          x = component.positionInDiagram(pos1, 'longitude');
          expect([x, y]).toEqual([]);

          y = component.positionInDiagram(pos2, 'latitude');
          x = component.positionInDiagram(pos2, 'longitude');
          expect([x, y]).toEqual([]);
        });
        xit(`${positions[3]} and ${positions[4]}`, () => {
          pos1 = positions[3];
          pos2 = positions[4];
          component.positions.push(pos1, pos2);

          y = component.positionInDiagram(pos1, 'latitude');
          x = component.positionInDiagram(pos1, 'longitude');
          expect([x, y]).toEqual([]);

          y = component.positionInDiagram(pos2, 'latitude');
          x = component.positionInDiagram(pos2, 'longitude');
          expect([x, y]).toEqual([]);
        });
      });
    });
  });

  describe('interpolationValue from', () => {
    describe(`${positions[0].toString()} to`, () => {
      beforeEach(() => {
        component.center = positions[0];
      });

      describe(`${positions[0].toString()} should be`, () => {
        it(`[0,0] for ${positions[0].toString()}`, () => {
          const x = positions[0];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`throwing a RangeError for ${positions[1].toString()}`, () => {
          const x = positions[1];
          expect(() => component.interpolationValue(x, 'latitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, component.center.latitude, component.longestDistance('latitude'))));
          expect(() => component.interpolationValue(x, 'longitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, component.center.longitude, component.longestDistance('longitude'))));
        });
        it(`throwing a RangeError for ${positions[2].toString()}`, () => {
          const x = positions[2];
          expect(() => component.interpolationValue(x, 'latitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, component.center.latitude, component.longestDistance('latitude'))));
          expect(() => component.interpolationValue(x, 'longitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, component.center.longitude, component.longestDistance('longitude'))));
        });
        it(`throwing a RangeError for ${positions[3].toString()}`, () => {
          const x = positions[3];
          expect(() => component.interpolationValue(x, 'latitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, component.center.latitude, component.longestDistance('latitude'))));
          expect(() => component.interpolationValue(x, 'longitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, component.center.longitude, component.longestDistance('longitude'))));
        });
        it(`throwing a RangeError for ${positions[4].toString()}`, () => {
          const x = positions[4];
          expect(() => component.interpolationValue(x, 'latitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, component.center.latitude, component.longestDistance('latitude'))));
          expect(() => component.interpolationValue(x, 'longitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, component.center.longitude, component.longestDistance('longitude'))));
        });
      });
      describe(`${positions[1].toString()} should be`, () => {
        beforeEach(() => {
          component.positions.push(positions[1]);
        });

        it(`[0,0] for ${positions[0].toString()}`, () => {
          const x = positions[0];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`[1,-1] for ${positions[1].toString()}`, () => {
          const x = positions[1];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([1,-1]);
        });
        it(`throwing a RangeError for ${positions[2].toString()}`, () => {
          const x = positions[2];
          expect(() => component.interpolationValue(x, 'latitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, component.center.latitude, component.longestDistance('latitude'))));
          expect(() => component.interpolationValue(x, 'longitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, component.center.longitude, component.longestDistance('longitude'))));
        });
        it(`throwing a RangeError for ${positions[3].toString()}`, () => {
          const x = positions[3];
          expect(() => component.interpolationValue(x, 'latitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, component.center.latitude, component.longestDistance('latitude'))));
          expect(() => component.interpolationValue(x, 'longitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, component.center.longitude, component.longestDistance('longitude'))));
        });
        it(`throwing a RangeError for ${positions[4].toString()}`, () => {
          const x = positions[4];
          expect(() => component.interpolationValue(x, 'latitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, component.center.latitude, component.longestDistance('latitude'))));
          expect(() => component.interpolationValue(x, 'longitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, component.center.longitude, component.longestDistance('longitude'))));
        });
      });
      describe(`${positions[2].toString()} should be`, () => {
        beforeEach(() => {
          component.positions.push(positions[2]);
        });

        it(`[0,0] for ${positions[0].toString()}`, () => {
          const x = positions[0];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`[0.3125,-0.060606] for ${positions[1].toString()}`, () => {
          const x = positions[1];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([0.3125,-0.060606]);
        });
        it(`[-1,1] for ${positions[2].toString()}`, () => {
          const x = positions[2];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([-1,1]);
        });
        it(`throwing a RangeError for latitude and interpolation for longitude should be '' for ${positions[3].toString()}}`, () => {
          const x = positions[3];
          expect(() => component.interpolationValue(x, 'latitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, component.center.latitude, component.longestDistance('latitude'))));
          const longitude = component.interpolationValue(x, 'longitude');
          expect(longitude).toEqual(component.roundNumber(-1/3));
        });
        it(`throwing a RangeError for ${positions[4].toString()}`, () => {
          const x = positions[4];
          expect(() => component.interpolationValue(x, 'latitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, component.center.latitude, component.longestDistance('latitude'))));
          expect(() => component.interpolationValue(x, 'longitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, component.center.longitude, component.longestDistance('longitude'))));
        });
      });
      describe(`${positions[3].toString()} should be`, () => {
        beforeEach(() => {
          component.positions.push(positions[3]);
        });

        it(`[0,0] for ${positions[0].toString()}`, () => {
          const x = positions[0];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`[0.178571,-0.181818] for ${positions[1].toString()}`, () => {
          const x = positions[1];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([0.178571,-0.181818]);
        });
        it(`throwing a RangeError for longitude and should be -0.571429 for ${positions[2].toString()}`, () => {
          const x = positions[2];
          const latitude = component.interpolationValue(x, 'latitude');
          expect(latitude).toEqual(-0.571429);
          expect(() => component.interpolationValue(x, 'longitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, component.center.longitude, component.longestDistance('longitude'))));
        });
        it(`[-1,-1] for ${positions[3].toString()}`, () => {
          const x = positions[3];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([-1,-1]);
        });
        it(`throwing a RangeError for ${positions[4].toString()}`, () => {
          const x = positions[4];
          expect(() => component.interpolationValue(x, 'latitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, component.center.latitude, component.longestDistance('latitude'))));
          expect(() => component.interpolationValue(x, 'longitude'))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, component.center.longitude, component.longestDistance('longitude'))));
        });
      });
      describe(`${positions[4].toString()} should be`, () => {
        beforeEach(() => {
          component.positions.push(positions[4]);
        });

        it(`[0,0] for ${positions[0].toString()}`, () => {
          const x = positions[0];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`[0.174533,-0.034907] for ${positions[1].toString()}`, () => {
          const x = positions[1];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([0.174533,-0.034907]);
        });
        it(`[-0.558505,0.575959] for ${positions[2].toString()}`, () => {
          const x = positions[2];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([-0.558505,0.575959]);
        });
        it(`[-0.977384,-0.191986] for ${positions[3].toString()}`, () => {
          const x = positions[3];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([-0.977384,-0.191986]);
        });
        it(`[1,1] for ${positions[4].toString()}`, () => {
          const x = positions[4];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([1,1]);
        });
      });
    });
    describe(`${positions[1].toString()} to`, () => {
      beforeEach(() => {
        component.center = positions[1];
      });

      describe(`${positions[0].toString()} should be`, () => {
        beforeEach(() => {
          component.positions.push(positions[0]);
        });

        it(`[-1,1] for ${positions[0].toString()}`, () => {
          const x = positions[0];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([-1,1]);
        });
        it(`[0,0] for ${positions[1].toString()}`, () => {
          const x = positions[1];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`throwing a RangeError for  ${positions[2].toString()}`, () => {
          const x = positions[2];
          expect(() => component.interpolationValue(x, 'latitude')).toThrow(jasmine.any(RangeError));
          expect(() => component.interpolationValue(x, 'longitude')).toThrow(jasmine.any(RangeError));
        });
        it(`throwing a RangeError for  ${positions[3].toString()}`, () => {
          const x = positions[3];
          expect(() => component.interpolationValue(x, 'latitude')).toThrow(jasmine.any(RangeError));
          expect(() => component.interpolationValue(x, 'longitude')).toThrow(jasmine.any(RangeError));
        });
        it(`throwing a RangeError for  ${positions[4].toString()}`, () => {
          const x = positions[4];
          expect(() => component.interpolationValue(x, 'latitude')).toThrow(jasmine.any(RangeError));
          expect(() => component.interpolationValue(x, 'longitude')).toThrow(jasmine.any(RangeError));
        });
      });
      describe(`${positions[1].toString()} should be`, () => {
        beforeEach(() => {
          component.positions.push(positions[1]);
        });

        it(`throwing a RangeError for ${positions[0].toString()}`, () => {
          const x = positions[0];
          expect(() => component.interpolationValue(x, 'latitude')).toThrow(jasmine.any(RangeError));
          expect(() => component.interpolationValue(x, 'longitude')).toThrow(jasmine.any(RangeError));
        });
        it(`[0,0] for ${positions[1].toString()}`, () => {
          const x = positions[1];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`throwing a RangeError for ${positions[2].toString()}`, () => {
          const x = positions[2];
          expect(() => component.interpolationValue(x, 'latitude')).toThrow(jasmine.any(RangeError));
          expect(() => component.interpolationValue(x, 'longitude')).toThrow(jasmine.any(RangeError));
        });
        it(`throwing a RangeError for ${positions[3].toString()}`, () => {
          const x = positions[3];
          expect(() => component.interpolationValue(x, 'latitude')).toThrow(jasmine.any(RangeError));
          expect(() => component.interpolationValue(x, 'longitude')).toThrow(jasmine.any(RangeError));
        });
        it(`throwing a RangeError for ${positions[4].toString()}`, () => {
          const x = positions[4];
          expect(() => component.interpolationValue(x, 'latitude')).toThrow(jasmine.any(RangeError));
          expect(() => component.interpolationValue(x, 'longitude')).toThrow(jasmine.any(RangeError));
        });
      });
      describe(`${positions[2].toString()} should be`, () => {
        beforeEach(() => {
          component.positions.push(positions[2]);
        });

        it(`[-0.238095,0.057143] for ${positions[0].toString()}`, () => {
          const x = positions[0];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([-0.238095,0.057143]);
        });
        it(`[0,0] for ${positions[1].toString()}`, () => {
          const x = positions[1];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`[-1,1] for ${positions[2].toString()}`, () => {
          const x = positions[2];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([-1,1]);
        });
        it(`throwing a range error for the latitude and have longitude -0.257143 for ${positions[3].toString()}`, () => {
          const x = positions[3];
          expect(() => component.interpolationValue(x, 'latitude')).toThrow(jasmine.any(RangeError));
          const longitude = component.interpolationValue(x, 'longitude');
          expect(longitude).toEqual(-0.257143);
        });
        it(`throwing a range error for ${positions[4].toString()}`, () => {
          const x = positions[4];
          expect(() => component.interpolationValue(x, 'latitude')).toThrow(jasmine.any(RangeError));
          expect(() => component.interpolationValue(x, 'longitude')).toThrow(jasmine.any(RangeError));
        });
      });
      describe(`${positions[3].toString()} should be`, () => {
        beforeEach(() => {
          component.positions.push(positions[3]);
        });

        it(`[-0.151515,0.222222] for ${positions[0].toString()}`, () => {
          const x = positions[0];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([-0.151515,0.222222]);
        });
        it(`[0,0] for ${positions[1].toString()}`, () => {
          const x = positions[1];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`throwing a range error for longitude and latitude -0.636364 for ${positions[2].toString()}`, () => {
          const x = positions[2];
          expect(component.interpolationValue(x, 'latitude')).toEqual(-0.636364);
          expect(() => component.interpolationValue(x, 'longitude')).toThrow(jasmine.any(RangeError));
        });
        it(`[-1,-1] for ${positions[3].toString()}`, () => {
          const x = positions[3];
          const latitude = component.interpolationValue(x, 'latitude');
          const longitude = component.interpolationValue(x, 'longitude');
          expect([latitude, longitude]).toEqual([-1,-1]);
        });
        it(`throwing a range error for longitude and latitude 0.716603 for ${positions[4].toString()}`, () => {
          const x = positions[4];
          expect(component.interpolationValue(x, 'latitude')).toEqual(0.716603);
          expect(() => component.interpolationValue(x, 'longitude')).toThrow(jasmine.any(RangeError));
        });
      });
    });
  });
});
