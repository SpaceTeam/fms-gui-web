import {Power} from './power.model';
import {ConnectionQualitySens} from './connection-quality-sens.model';
import {Status} from './status.model';

export class FMSData {
  startingTime: Date;           // TODO: Do we need to use date, or can we just use a time type?
  power: Power;
  connectionQualitySens: ConnectionQualitySens;
  status: Status;
}
