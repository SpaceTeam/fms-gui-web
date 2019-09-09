import {TestBed} from '@angular/core/testing';
import {PositionUtil} from './position.util';
import {Position} from '../../model/flight/position';

describe('PositionUtil', () => {

  const size = 600;
  
  const positions: Array<Position> = [
    new Position(0,0),
    new Position(-6.283185307, 15.70796327),  // -2 PI, 5 PI
    new Position(103.6725576, -50.26548246),  // 33 PI, -16 PI
    new Position(-34.55751919, -87.9645943),  // -11 PI, -28 PI,
    new Position(180, 90)
  ];
  
  let positionArray: Array<Position>;
  let center: Position;

  function rangeErrorMsg(x: number, center: number, distance: number): string {
    const l = center - distance;
    const u = center + distance;
    return `Error: ${PositionUtil.roundNumber(x)} is out of bounds between [${PositionUtil.roundNumber(l)},${PositionUtil.roundNumber(u)}]`;
  }

  function pi(x: number): number {
    return PositionUtil.roundNumber(x * Math.PI);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    positionArray = [];
  });

  describe('distance to border from', () => {
    describe(`${positions[0].toString()} should be (in [lat,lon] format)`, () => {
      beforeEach(() => {
        center = positions[0];
      });

      describe('in the case of only one (or zero) values in the positions array', () => {
        it(`[0,0] for ${positions[0].toString()}`, () => {
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([0,0]);
        });
        it(`[15.707963,6.283185] for ${positions[1].toString()}`, () => {
          positionArray.push(positions[1]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([15.707963,6.283185]);
        });
        it(`[50.265482,103.672558] for ${positions[2].toString()}`, () => {
          positionArray.push(positions[2]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([50.265482,103.672558]);
        });
        it(`[87.964594,34.557519] for ${positions[3].toString()}`, () => {
          positionArray.push(positions[3]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([87.964594,34.557519]);
        });
        it(`[90,180] for ${positions[4].toString()}`, () => {
          positionArray.push(positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
      });
      describe('in the case of exactly two values in the positions array', () => {
        it(`[15.707963,6.283185] for ${positions[0].toString()} and ${positions[1]}`, () => {
          positionArray.push(positions[0], positions[1]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([15.707963,6.283185]);
        });
        it(`[50.265482,103.672558] for ${positions[0].toString()} and ${positions[2]}`, () => {
          positionArray.push(positions[0], positions[2]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([50.265482,103.672558]);
        });
        it(`[87.964594,34.557519] for ${positions[0].toString()} and ${positions[3]}`, () => {
          positionArray.push(positions[0], positions[3]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([87.964594,34.557519]);
        });
        it(`[90,180] for ${positions[0].toString()} and ${positions[4]}`, () => {
          positionArray.push(positions[0], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[50.265482,103.672558] for ${positions[1].toString()} and ${positions[2]}`, () => {
          positionArray.push(positions[1], positions[2]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([50.265482,103.672558]);
        });
        it(`[87.964594,34.557519] for ${positions[1].toString()} and ${positions[3]}`, () => {
          positionArray.push(positions[1], positions[3]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([87.964594,34.557519]);
        });
        it(`[90,180] for ${positions[1].toString()} and ${positions[4]}`, () => {
          positionArray.push(positions[1], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[87.964594,103.672558] for ${positions[2].toString()} and ${positions[3]}`, () => {
          positionArray.push(positions[2], positions[3]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([87.964594,103.672558]);
        });
        it(`[90,180] for ${positions[2].toString()} and ${positions[4]}`, () => {
          positionArray.push(positions[2], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[3].toString()} and ${positions[4]}`, () => {
          positionArray.push(positions[3], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
      });
      describe('in the case of exactly three values in the positions array', () => {
        it(`[50.265482,103.672558] for ${positions[0].toString()}, ${positions[1].toString()} and ${positions[2].toString()}`, () => {
          positionArray.push(positions[0], positions[1], positions[2]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([50.265482,103.672558]);
        });
        it(`[87.964594,34.557519] for ${positions[0].toString()}, ${positions[1].toString()} and ${positions[3].toString()}`, () => {
          positionArray.push(positions[0], positions[1], positions[3]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([87.964594,34.557519]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[1].toString()} and ${positions[4].toString()}`, () => {
          positionArray.push(positions[0], positions[1], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[87.964594,103.672558] for ${positions[0].toString()}, ${positions[2].toString()} and ${positions[3].toString()}`, () => {
          positionArray.push(positions[0], positions[2], positions[3]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([87.964594,103.672558]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[2].toString()} and ${positions[4].toString()}`, () => {
          positionArray.push(positions[0], positions[2], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          positionArray.push(positions[0], positions[3], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[87.964594,103.672558] for ${positions[1].toString()}, ${positions[2].toString()} and ${positions[3].toString()}`, () => {
          positionArray.push(positions[1], positions[2], positions[3]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([87.964594,103.672558]);
        });
        it(`[90,180] for ${positions[1].toString()}, ${positions[2].toString()} and ${positions[4].toString()}`, () => {
          positionArray.push(positions[1], positions[2], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[1].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          positionArray.push(positions[1], positions[3], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[2].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          positionArray.push(positions[2], positions[3], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
      });
      describe('in the case of exactly four values in the positions array', () => {
        it(`[87.964594,103.672558] for ${positions[0].toString()}, ${positions[1].toString()}, ${positions[2].toString()} and ${positions[3].toString()}`, () => {
          positionArray.push(positions[0], positions[1], positions[2], positions[3]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([87.964594,103.672558]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[1].toString()}, ${positions[2].toString()} and ${positions[4].toString()}`, () => {
          positionArray.push(positions[0], positions[1], positions[2], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[1].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          positionArray.push(positions[0], positions[1], positions[3], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[0].toString()}, ${positions[2].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          positionArray.push(positions[0], positions[2], positions[3], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
        it(`[90,180] for ${positions[1].toString()}, ${positions[2].toString()}, ${positions[3].toString()} and ${positions[4].toString()}`, () => {
          positionArray.push(positions[1], positions[2], positions[3], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([90,180]);
        });
      });
      it('[90,180] in the case of all five values in the positions array', () => {
        positionArray.push(...positions);
        const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
        const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
        expect([latDistance, lonDistance]).toEqual([90,180]);
      })
    });
    describe(`${positions[1].toString()} should be (in [lat,lon] format)`, () => {
      beforeEach(() => {
        center = positions[1];
      });

      describe('in the case of only one (or zero) values in the positions array', () => {
        // 00000, 00001, 00010, 00100, 01000, 10000
        // none, 0, 1, 2, 3, 4
        it(`[15.707963,6.283185] for ${positions[0].toString()}`, () => {
          positionArray.push(positions[0]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([15.707963,6.283185]);
        });
        it(`[0,0] for ${positions[1].toString()}`, () => {
          // positionArray.push(positions[1]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([0,0]);
        });
        it(`[65.973446,109.955743] for ${positions[2].toString()}`, () => {
          positionArray.push(positions[2]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([65.973446,109.955743]);
        });
        it(`[103.672558,28.274334] for ${positions[3].toString()}`, () => {
          positionArray.push(positions[3]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([103.672558,28.274334]);
        });
        it(`[74.292037,186.283185] for ${positions[4].toString()}`, () => {
          positionArray.push(positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([74.292037,186.283185]);
        });
      });
      describe('in the case of exactly two values in the positions array', () => {
        // 00011, 00101, 00110, 01001, 01010, 01100, 10001, 10010, 10100, 11000
        // 01, 02, 12, 03, 13, 23, 04, 14, 24, 34
        // 01, 02, 03, 04, 12, 13, 14, 23, 24, 34
        it(`[15.707963, 6.283185] for ${positions[0]} and ${positions[1]}`, () => {
          positionArray.push(positions[0], positions[1]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([15.707963, 6.283185]);
        });
        it(`[65.973446,109.955743] for ${positions[0]} and ${positions[2]}`, () => {
          positionArray.push(positions[0], positions[2]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([65.973446,109.955743]);
        });
        it(`[103.672558,28.274334] for ${positions[0]} and ${positions[3]}`, () => {
          positionArray.push(positions[0], positions[3]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([103.672558,28.274334]);
        });
        it(`[74.292037,186.283185] for ${positions[0]} and ${positions[4]}`, () => {
          positionArray.push(positions[0], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([74.292037,186.283185]);
        });
        it(`[65.973446,109.955743] for ${positions[1]} and ${positions[2]}`, () => {
          positionArray.push(positions[1], positions[2]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([65.973446,109.955743]);
        });
        it(`[103.672558,28.274334] for ${positions[1]} and ${positions[3]}`, () => {
          positionArray.push(positions[1], positions[3]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([103.672558,28.274334]);
        });
        it(`[74.292037,186.283185] for ${positions[1]} and ${positions[4]}`, () => {
          positionArray.push(positions[1], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([74.292037,186.283185]);
        });
        it(`[103.672558,109.955743] for ${positions[2]} and ${positions[3]}`, () => {
          positionArray.push(positions[2], positions[3]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([103.672558,109.955743]);
        });
        it(`[74.292037,186.283185] for ${positions[2]} and ${positions[4]}`, () => {
          positionArray.push(positions[2], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([74.292037,186.283185]);
        });
        it(`[103.672558,186.283185] for ${positions[3]} and ${positions[4]}`, () => {
          positionArray.push(positions[3], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([103.672558,186.283185]);
        });
      });
      describe('in the case of exactly three values in the positions array', () => {
        // 00111, 01011, 01101, 01110, 10011, 10101, 10110, 11001, 11010, 11100
        // 012, 013, 023, 123, 014, 024, 124, 034, 134, 234
        // 012, 013, 014, 023, 024, 034, 123, 124, 134, 234
        it(`[65.973446,109.955743] for ${positions[0]}, ${positions[1]} and ${positions[2]}`, () => {
          positionArray.push(positions[0], positions[1], positions[2]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([65.973446,109.955743]);
        });
        it(`[103.672558,28.274334] for ${positions[0]}, ${positions[1]} and ${positions[3]}`, () => {
          positionArray.push(positions[0], positions[1], positions[3]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([103.672558,28.274334]);
        });
        it(`[74.292037,186.283185] for ${positions[0]}, ${positions[1]} and ${positions[4]}`, () => {
          positionArray.push(positions[0], positions[1], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([74.292037,186.283185]);
        });
        it(`[103.672558,109.955743] for ${positions[0]}, ${positions[2]} and ${positions[3]}`, () => {
          positionArray.push(positions[0], positions[2], positions[3]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([103.672558,109.955743]);
        });
        it(`[74.292037,186.283185] for ${positions[0]}, ${positions[2]} and ${positions[4]}`, () => {
          positionArray.push(positions[0], positions[2], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([74.292037,186.283185]);
        });
        it(`[103.672558,186.283185] for ${positions[0]}, ${positions[3]} and ${positions[4]}`, () => {
          positionArray.push(positions[0], positions[3], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([103.672558,186.283185]);
        });
        it(`[103.672558,109.955743] for ${positions[1]}, ${positions[2]} and ${positions[3]}`, () => {
          positionArray.push(positions[1], positions[2], positions[3]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([103.672558,109.955743]);
        });
        it(`[74.292037,186.283185] for ${positions[1]}, ${positions[2]} and ${positions[4]}`, () => {
          positionArray.push(positions[1], positions[2], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([74.292037,186.283185]);
        });
        it(`[103.672558,186.283185] for ${positions[1]}, ${positions[3]} and ${positions[4]}`, () => {
          positionArray.push(positions[1], positions[3], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([103.672558,186.283185]);
        });
        it(`[103.672558,186.283185] for ${positions[2]}, ${positions[3]} and ${positions[4]}`, () => {
          positionArray.push(positions[2], positions[3], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([103.672558,186.283185]);
        });
      });
      describe('in the case of exactly four values in the positions array', () => {
        // 01111, 10111, 11011, 11101, 11110
        // 0123, 0124, 0134, 0234, 1234
        it(`[103.672558,109.955743] for ${positions[0]}, ${positions[1]}, ${positions[2]}, ${positions[3]}`, () => {
          positionArray.push(positions[0], positions[1], positions[2], positions[3]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([103.672558,109.955743]);
        });
        it(`[74.292037,186.283185] for ${positions[0]}, ${positions[1]}, ${positions[2]}, ${positions[4]}`, () => {
          positionArray.push(positions[0], positions[1], positions[2], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([74.292037,186.283185]);
        });
        it(`[103.672558,186.283185] for ${positions[0]}, ${positions[1]}, ${positions[3]}, ${positions[4]}`, () => {
          positionArray.push(positions[0], positions[1], positions[3], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([103.672558,186.283185]);
        });
        it(`[103.672558,186.283185] for ${positions[0]}, ${positions[2]}, ${positions[3]}, ${positions[4]}`, () => {
          positionArray.push(positions[0], positions[2], positions[3], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([103.672558,186.283185]);
        });
        it(`[103.672558,186.283185] for ${positions[1]}, ${positions[2]}, ${positions[3]}, ${positions[4]}`, () => {
          positionArray.push(positions[1], positions[2], positions[3], positions[4]);
          const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
          const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
          expect([latDistance, lonDistance]).toEqual([103.672558,186.283185]);
        });
      });
      it('[103.672558,186.283185] in the case of all five values in the positions array', () => {
        // 11111
        // 01234
        positionArray.push(...positions);
        const latDistance = PositionUtil.longestDistance('latitude', center, positionArray);
        const lonDistance = PositionUtil.longestDistance('longitude', center, positionArray);
        expect([latDistance, lonDistance]).toEqual([103.672558,186.283185]);
      });
    });
  });

  xdescribe('position in the diagram', () => {
    describe(`${positions[0].toString()} should be`, () => {
      beforeEach(() => {
        center = positions[0];
      });

      describe('in the case of only one (or zero) values in the positions array', () => {
        it(`[300,300] for center (${positions[0]})`, () => {
          // positionArray.push(positions[0])
          const latitude = PositionUtil.interpolatedPositionInSquare(center, 'latitude', size, center, positionArray);
          const longitude = PositionUtil.interpolatedPositionInSquare(center, 'longitude', size, center, positionArray);
          expect([latitude, longitude]).toEqual([300,300]);
        });
        it(`[600,0] for ${positions[1]}`, () => {
          const position = positions[1];
          positionArray.push(position);
          const latitude = PositionUtil.interpolatedPositionInSquare(center, 'latitude', size, center, positionArray);
          const longitude = PositionUtil.interpolatedPositionInSquare(position, 'longitude', size, center, positionArray);
          expect([latitude, longitude]).toEqual([600,0]);
        });
        it(`[0,600] for ${positions[2]}`, () => {
          const position = positions[2];
          positionArray.push(position);
          const latitude = PositionUtil.interpolatedPositionInSquare(center, 'latitude', size, center, positionArray);
          const longitude = PositionUtil.interpolatedPositionInSquare(position, 'longitude', size, center, positionArray);
          expect([latitude, longitude]).toEqual([0,600]);
        });
        it(`[0,0] for ${positions[3]}`, () => {
          const position = positions[3];
          positionArray.push(position);
          const latitude = PositionUtil.interpolatedPositionInSquare(center, 'latitude', size, center, positionArray);
          const longitude = PositionUtil.interpolatedPositionInSquare(position, 'longitude', size, center, positionArray);
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`[600,600] for ${positions[4]}`, () => {
          const position = positions[4];
          positionArray.push(position);
          const latitude = PositionUtil.interpolatedPositionInSquare(center, 'latitude', size, center, positionArray);
          const longitude = PositionUtil.interpolatedPositionInSquare(position, 'longitude', size, center, positionArray);
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
          positionArray.push(pos1, pos2);

          y = PositionUtil.interpolatedPositionInSquare(pos1, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos1, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([300,300]);

          y = PositionUtil.interpolatedPositionInSquare(pos2, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos2, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([0,600]);
        });
        it(`${positions[0]} and ${positions[2]}`, () => {
          pos1 = positions[0];
          pos2 = positions[2];

          positionArray.push(pos1, pos2);

          y = PositionUtil.interpolatedPositionInSquare(pos1, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos1, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([300,300]);

          y = PositionUtil.interpolatedPositionInSquare(pos2, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos2, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([600,0]);
        });
        it(`${positions[0]} and ${positions[3]}`, () => {
          pos1 = positions[0];
          pos2 = positions[3];

          positionArray.push(pos1, pos2);

          y = PositionUtil.interpolatedPositionInSquare(pos1, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos1, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([300,300]);

          y = PositionUtil.interpolatedPositionInSquare(pos2, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos2, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([0,0]);
        });
        it(`${positions[0]} and ${positions[4]}`, () => {
          pos1 = positions[0];
          pos2 = positions[4];

          positionArray.push(pos1, pos2);

          y = PositionUtil.interpolatedPositionInSquare(pos1, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos1, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([300,300]);

          y = PositionUtil.interpolatedPositionInSquare(pos2, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos2, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([600,600]);
        });
        it(`${positions[1]} and ${positions[2]}`, () => {
          pos1 = positions[1];
          pos2 = positions[2];
          positionArray.push(pos1, pos2);

          y = PositionUtil.interpolatedPositionInSquare(pos1, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos1, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([281.8182,393.75]);

          y = PositionUtil.interpolatedPositionInSquare(pos2, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos2, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([600, 0]);
        });
        xit(`${positions[1]} and ${positions[3]}`, () => {
          pos1 = positions[1];
          pos2 = positions[3];
          positionArray.push(pos1, pos2);

          y = PositionUtil.interpolatedPositionInSquare(pos1, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos1, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([]);

          y = PositionUtil.interpolatedPositionInSquare(pos2, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos2, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([]);
        });
        xit(`${positions[1]} and ${positions[4]}`, () => {
          pos1 = positions[1];
          pos2 = positions[4];
          positionArray.push(pos1, pos2);

          y = PositionUtil.interpolatedPositionInSquare(pos1, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos1, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([]);

          y = PositionUtil.interpolatedPositionInSquare(pos2, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos2, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([]);
        });
        xit(`${positions[2]} and ${positions[3]}`, () => {
          pos1 = positions[2];
          pos2 = positions[3];
          positionArray.push(pos1, pos2);

          y = PositionUtil.interpolatedPositionInSquare(pos1, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos1, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([]);

          y = PositionUtil.interpolatedPositionInSquare(pos2, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos2, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([]);
        });
        xit(`${positions[2]} and ${positions[4]}`, () => {
          pos1 = positions[2];
          pos2 = positions[4];
          positionArray.push(pos1, pos2);

          y = PositionUtil.interpolatedPositionInSquare(pos1, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos1, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([]);

          y = PositionUtil.interpolatedPositionInSquare(pos2, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos2, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([]);
        });
        xit(`${positions[3]} and ${positions[4]}`, () => {
          pos1 = positions[3];
          pos2 = positions[4];
          positionArray.push(pos1, pos2);

          y = PositionUtil.interpolatedPositionInSquare(pos1, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos1, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([]);

          y = PositionUtil.interpolatedPositionInSquare(pos2, 'latitude', size, center, positionArray);
          x = PositionUtil.interpolatedPositionInSquare(pos2, 'longitude', size, center, positionArray);
          expect([x, y]).toEqual([]);
        });
      });
    });
  });

  describe('interpolationValue from', () => {
    describe(`${positions[0].toString()} to`, () => {
      beforeEach(() => {
        center = positions[0];
      });

      describe(`${positions[0].toString()} should be`, () => {
        it(`[0,0] for ${positions[0].toString()}`, () => {
          const x = positions[0];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`throwing a RangeError for ${positions[1].toString()}`, () => {
          const x = positions[1];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, center.latitude, PositionUtil.longestDistance('latitude', center, positionArray))));
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, center.longitude, PositionUtil.longestDistance('longitude', center, positionArray))));
        });
        it(`throwing a RangeError for ${positions[2].toString()}`, () => {
          const x = positions[2];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, center.latitude, PositionUtil.longestDistance('latitude', center, positionArray))));
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, center.longitude, PositionUtil.longestDistance('longitude', center, positionArray))));
        });
        it(`throwing a RangeError for ${positions[3].toString()}`, () => {
          const x = positions[3];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, center.latitude, PositionUtil.longestDistance('latitude', center, positionArray))));
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, center.longitude, PositionUtil.longestDistance('longitude', center, positionArray))));
        });
        it(`throwing a RangeError for ${positions[4].toString()}`, () => {
          const x = positions[4];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, center.latitude, PositionUtil.longestDistance('latitude', center, positionArray))));
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, center.longitude, PositionUtil.longestDistance('longitude', center, positionArray))));
        });
      });
      describe(`${positions[1].toString()} should be`, () => {
        beforeEach(() => {
          positionArray.push(positions[1]);
        });

        it(`[0,0] for ${positions[0].toString()}`, () => {
          const x = positions[0];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`[1,-1] for ${positions[1].toString()}`, () => {
          const x = positions[1];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([1,-1]);
        });
        it(`throwing a RangeError for ${positions[2].toString()}`, () => {
          const x = positions[2];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, center.latitude, PositionUtil.longestDistance('latitude', center, positionArray))));
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, center.longitude, PositionUtil.longestDistance('longitude', center, positionArray))));
        });
        it(`throwing a RangeError for ${positions[3].toString()}`, () => {
          const x = positions[3];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, center.latitude, PositionUtil.longestDistance('latitude', center, positionArray))));
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, center.longitude, PositionUtil.longestDistance('longitude', center, positionArray))));
        });
        it(`throwing a RangeError for ${positions[4].toString()}`, () => {
          const x = positions[4];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, center.latitude, PositionUtil.longestDistance('latitude', center, positionArray))));
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, center.longitude, PositionUtil.longestDistance('longitude', center, positionArray))));
        });
      });
      describe(`${positions[2].toString()} should be`, () => {
        beforeEach(() => {
          positionArray.push(positions[2]);
        });

        it(`[0,0] for ${positions[0].toString()}`, () => {
          const x = positions[0];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`[0.3125,-0.060606] for ${positions[1].toString()}`, () => {
          const x = positions[1];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([0.3125,-0.060606]);
        });
        it(`[-1,1] for ${positions[2].toString()}`, () => {
          const x = positions[2];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([-1,1]);
        });
        it(`throwing a RangeError for latitude and interpolation for longitude should be '' for ${positions[3].toString()}}`, () => {
          const x = positions[3];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, center.latitude, PositionUtil.longestDistance('latitude', center, positionArray))));
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect(longitude).toEqual(PositionUtil.roundNumber(-1/3));
        });
        it(`throwing a RangeError for ${positions[4].toString()}`, () => {
          const x = positions[4];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, center.latitude, PositionUtil.longestDistance('latitude', center, positionArray))));
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, center.longitude, PositionUtil.longestDistance('longitude', center, positionArray))));
        });
      });
      describe(`${positions[3].toString()} should be`, () => {
        beforeEach(() => {
          positionArray.push(positions[3]);
        });

        it(`[0,0] for ${positions[0].toString()}`, () => {
          const x = positions[0];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`[0.178571,-0.181818] for ${positions[1].toString()}`, () => {
          const x = positions[1];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([0.178571,-0.181818]);
        });
        it(`throwing a RangeError for longitude and should be -0.571429 for ${positions[2].toString()}`, () => {
          const x = positions[2];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          expect(latitude).toEqual(-0.571429);
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, center.longitude, PositionUtil.longestDistance('longitude', center, positionArray))));
        });
        it(`[-1,-1] for ${positions[3].toString()}`, () => {
          const x = positions[3];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([-1,-1]);
        });
        it(`throwing a RangeError for ${positions[4].toString()}`, () => {
          const x = positions[4];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.latitude, center.latitude, PositionUtil.longestDistance('latitude', center, positionArray))));
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray))
            .toThrow(new RangeError(rangeErrorMsg(x.longitude, center.longitude, PositionUtil.longestDistance('longitude', center, positionArray))));
        });
      });
      describe(`${positions[4].toString()} should be`, () => {
        beforeEach(() => {
          positionArray.push(positions[4]);
        });

        it(`[0,0] for ${positions[0].toString()}`, () => {
          const x = positions[0];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`[0.174533,-0.034907] for ${positions[1].toString()}`, () => {
          const x = positions[1];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([0.174533,-0.034907]);
        });
        it(`[-0.558505,0.575959] for ${positions[2].toString()}`, () => {
          const x = positions[2];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([-0.558505,0.575959]);
        });
        it(`[-0.977384,-0.191986] for ${positions[3].toString()}`, () => {
          const x = positions[3];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([-0.977384,-0.191986]);
        });
        it(`[1,1] for ${positions[4].toString()}`, () => {
          const x = positions[4];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([1,1]);
        });
      });
    });
    describe(`${positions[1].toString()} to`, () => {
      beforeEach(() => {
        center = positions[1];
      });

      describe(`${positions[0].toString()} should be`, () => {
        beforeEach(() => {
          positionArray.push(positions[0]);
        });

        it(`[-1,1] for ${positions[0].toString()}`, () => {
          const x = positions[0];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([-1,1]);
        });
        it(`[0,0] for ${positions[1].toString()}`, () => {
          const x = positions[1];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`throwing a RangeError for  ${positions[2].toString()}`, () => {
          const x = positions[2];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray)).toThrow(jasmine.any(RangeError));
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray)).toThrow(jasmine.any(RangeError));
        });
        it(`throwing a RangeError for  ${positions[3].toString()}`, () => {
          const x = positions[3];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray)).toThrow(jasmine.any(RangeError));
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray)).toThrow(jasmine.any(RangeError));
        });
        it(`throwing a RangeError for  ${positions[4].toString()}`, () => {
          const x = positions[4];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray)).toThrow(jasmine.any(RangeError));
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray)).toThrow(jasmine.any(RangeError));
        });
      });
      describe(`${positions[1].toString()} should be`, () => {
        beforeEach(() => {
          positionArray.push(positions[1]);
        });

        it(`throwing a RangeError for ${positions[0].toString()}`, () => {
          const x = positions[0];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray)).toThrow(jasmine.any(RangeError));
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray)).toThrow(jasmine.any(RangeError));
        });
        it(`[0,0] for ${positions[1].toString()}`, () => {
          const x = positions[1];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`throwing a RangeError for ${positions[2].toString()}`, () => {
          const x = positions[2];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray)).toThrow(jasmine.any(RangeError));
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray)).toThrow(jasmine.any(RangeError));
        });
        it(`throwing a RangeError for ${positions[3].toString()}`, () => {
          const x = positions[3];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray)).toThrow(jasmine.any(RangeError));
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray)).toThrow(jasmine.any(RangeError));
        });
        it(`throwing a RangeError for ${positions[4].toString()}`, () => {
          const x = positions[4];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray)).toThrow(jasmine.any(RangeError));
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray)).toThrow(jasmine.any(RangeError));
        });
      });
      describe(`${positions[2].toString()} should be`, () => {
        beforeEach(() => {
          positionArray.push(positions[2]);
        });

        it(`[-0.238095,0.057143] for ${positions[0].toString()}`, () => {
          const x = positions[0];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([-0.238095,0.057143]);
        });
        it(`[0,0] for ${positions[1].toString()}`, () => {
          const x = positions[1];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`[-1,1] for ${positions[2].toString()}`, () => {
          const x = positions[2];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([-1,1]);
        });
        it(`throwing a range error for the latitude and have longitude -0.257143 for ${positions[3].toString()}`, () => {
          const x = positions[3];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray)).toThrow(jasmine.any(RangeError));
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect(longitude).toEqual(-0.257143);
        });
        it(`throwing a range error for ${positions[4].toString()}`, () => {
          const x = positions[4];
          expect(() => PositionUtil.interpolationValue(x, 'latitude', center, positionArray)).toThrow(jasmine.any(RangeError));
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray)).toThrow(jasmine.any(RangeError));
        });
      });
      describe(`${positions[3].toString()} should be`, () => {
        beforeEach(() => {
          positionArray.push(positions[3]);
        });

        it(`[-0.151515,0.222222] for ${positions[0].toString()}`, () => {
          const x = positions[0];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([-0.151515,0.222222]);
        });
        it(`[0,0] for ${positions[1].toString()}`, () => {
          const x = positions[1];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([0,0]);
        });
        it(`throwing a range error for longitude and latitude -0.636364 for ${positions[2].toString()}`, () => {
          const x = positions[2];
          expect(PositionUtil.interpolationValue(x, 'latitude', center, positionArray)).toEqual(-0.636364);
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray)).toThrow(jasmine.any(RangeError));
        });
        it(`[-1,-1] for ${positions[3].toString()}`, () => {
          const x = positions[3];
          const latitude = PositionUtil.interpolationValue(x, 'latitude', center, positionArray);
          const longitude = PositionUtil.interpolationValue(x, 'longitude', center, positionArray);
          expect([latitude, longitude]).toEqual([-1,-1]);
        });
        it(`throwing a range error for longitude and latitude 0.716603 for ${positions[4].toString()}`, () => {
          const x = positions[4];
          expect(PositionUtil.interpolationValue(x, 'latitude', center, positionArray)).toEqual(0.716603);
          expect(() => PositionUtil.interpolationValue(x, 'longitude', center, positionArray)).toThrow(jasmine.any(RangeError));
        });
      });
    });
  });

  describe('direction from', () => {
    describe(`${positions[0].toString()} to`, () => {
      it(`${positions[0].toString()} should be (0,0)`, () => {
        const position = PositionUtil.getDirection(positions[0], positions[0]);
        expect([position.longitude, position.latitude]).toEqual([0,0]);
      });
      it(`${positions[1].toString()} should be (-2pi,5pi)`, () => {
        const position = PositionUtil.getDirection(positions[1], positions[0]);
        expect([position.longitude, position.latitude]).toEqual([pi(-2), pi(5)]);
      });
      it(`${positions[2].toString()} should be (33pi,-16pi)`, () => {
        const position = PositionUtil.getDirection(positions[2], positions[0]);
        expect([position.longitude, position.latitude]).toEqual([pi(33), pi(-16)]);
      });
      it(`${positions[3].toString()} should be (-11,-28)`, () => {
        const position = PositionUtil.getDirection(positions[3], positions[0]);
        expect([position.longitude, position.latitude]).toEqual([pi(-11), pi(-28)]);
      });
      it(`${positions[4].toString()} should be (180,90)`, () => {
        const position = PositionUtil.getDirection(positions[4], positions[0]);
        expect([position.longitude, position.latitude]).toEqual([180,90]);
      });
    });
    describe(`${positions[1].toString()} to`, () => {
      it(`${positions[0].toString()} should be (2pi, -5pi)`, () => {
        const position = PositionUtil.getDirection(positions[0], positions[1]);
        expect([position.longitude, position.latitude]).toEqual([pi(2), pi(-5)]);
      });
      it(`${positions[1].toString()} should be (0,0)`, () => {
        const position = PositionUtil.getDirection(positions[1], positions[1]);
        expect([position.longitude, position.latitude]).toEqual([0,0]);
      });
      it(`${positions[2].toString()} should be (35pi, -21pi)`, () => {
        const position = PositionUtil.getDirection(positions[2], positions[1]);
        expect([position.longitude, position.latitude]).toEqual([pi(35), pi(-21)]);
      });
      it(`${positions[3].toString()} should be (-9pi, -33pi)`, () => {
        const position = PositionUtil.getDirection(positions[3], positions[1]);
        expect([position.longitude, position.latitude]).toEqual([pi(-9), pi(-33)]);
      });
      it(`${positions[4].toString()} should be (180+2pi, 90-5pi)`, () => {
        const position = PositionUtil.getDirection(positions[4], positions[1]);
        expect([position.longitude, position.latitude]).toEqual([180 + pi(2), 90 - pi(5)]);
      });
    });
    describe(`${positions[2].toString()} to`, () => {
      it(`${positions[0].toString()} should be (-33pi,16pi)`, () => {
        const position = PositionUtil.getDirection(positions[0], positions[2]);
        expect([position.longitude, position.latitude]).toEqual([pi(-33), pi(16)]);
      });
      it(`${positions[1].toString()} should be (-35pi,21pi)`, () => {
        const position = PositionUtil.getDirection(positions[1], positions[2]);
        expect([position.longitude, position.latitude]).toEqual([pi(-35), pi(21)]);
      });
      it(`${positions[2].toString()} should be (0,0)`, () => {
        const position = PositionUtil.getDirection(positions[2], positions[2]);
        expect([position.longitude, position.latitude]).toEqual([0,0]);
      });
      it(`${positions[3].toString()} should be (-44pi,-12pi)`, () => {
        const position = PositionUtil.getDirection(positions[3], positions[2]);
        expect([position.longitude, position.latitude]).toEqual([pi(-44), pi(-12)]);
      });
      it(`${positions[4].toString()} should be (180 - 33pi,90 + 16pi)`, () => {
        const position = PositionUtil.getDirection(positions[4], positions[2]);
        expect([position.longitude, position.latitude]).toEqual([180 - pi(33), 90 + pi(16)]);
      });
    });
    describe(`${positions[3].toString()} to`, () => {
      it(`${positions[0].toString()} should be (11pi,28pi)`, () => {
        const position = PositionUtil.getDirection(positions[0], positions[3]);
        expect([position.longitude, position.latitude]).toEqual([pi(11), pi(28)]);
      });
      it(`${positions[1].toString()} should be (9pi,33pi)`, () => {
        const position = PositionUtil.getDirection(positions[1], positions[3]);
        expect([position.longitude, position.latitude]).toEqual([pi(9), pi(33)]);
      });
      it(`${positions[2].toString()} should be (44pi,12pi)`, () => {
        const position = PositionUtil.getDirection(positions[2], positions[3]);
        expect([position.longitude, position.latitude]).toEqual([pi(44),pi(12)]);
      });
      it(`${positions[3].toString()} should be (0,0)`, () => {
        const position = PositionUtil.getDirection(positions[3], positions[3]);
        expect([position.longitude, position.latitude]).toEqual([0,0]);
      });
      it(`${positions[4].toString()} should be (180 + 11pi,90 + 28pi)`, () => {
        const position = PositionUtil.getDirection(positions[4], positions[3]);
        expect([position.longitude, position.latitude]).toEqual([180 + pi(11), 90 + pi(28)]);
      });
    });
    describe(`${positions[4].toString()} to`, () => {
      it(`${positions[0].toString()} should be (-180,-90)`, () => {
        const position = PositionUtil.getDirection(positions[0], positions[4]);
        expect([position.longitude, position.latitude]).toEqual([-180 , -90]);
      });
      it(`${positions[1].toString()} should be (-180-2pi,-90+5pi)`, () => {
        const position = PositionUtil.getDirection(positions[1], positions[4]);
        expect([position.longitude, position.latitude]).toEqual([-180 - pi(2), -90 + pi(5)]);
      });
      it(`${positions[2].toString()} should be (-180+33pi,-90-16pi)`, () => {
        const position = PositionUtil.getDirection(positions[2], positions[4]);
        expect([position.longitude, position.latitude]).toEqual([-180 + pi(33),-90 - pi(16)]);
      });
      it(`${positions[3].toString()} should be (-180-11pi,-90-28pi)`, () => {
        const position = PositionUtil.getDirection(positions[3], positions[4]);
        expect([position.longitude, position.latitude]).toEqual([-180 - pi(11),-90 - pi(28)]);
      });
      it(`${positions[4].toString()} should be (0,0)`, () => {
        const position = PositionUtil.getDirection(positions[4], positions[4]);
        expect([position.longitude, position.latitude]).toEqual([0,0]);
      });
    });
  });
});
