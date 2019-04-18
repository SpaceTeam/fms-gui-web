import {Flags} from './flags.model';
import {ServoPos} from './servo-pos.model';

export class Status {
  flags: Flags;
  timestamp: number;      // TODO: Why in milliseconds? Number or dateTime?
  rocketState: number;    // TODO: Not an enum?
  flightSubstate: number; // TODO: Not an enum?
  servoPos: ServoPos;
  sepadet_adc_value: number;
  radio_tx_byte_counter: number;
  flash_adr: number;
  seven_segment_value: string;  // TODO: Not an enum?
  cpu_load: number;
  igniter_adc_voltage: number;
  liftoff_timestamp: number;    // TODO: Number or dateTime?
  apogee_timestamp: number;     // TODO: Number or dateTime?
  mainchute_timestamp: number;  // TODO: Number or dateTime?
  landing_timestamp: number;    // TODO: Number or dateTime?
  igniter_1_voltage: number;
  igniter_2_voltage: number;
  igniter_3_voltage: number;
  igniter_4_voltage: number;
  igniter_hpower_voltage: number;
  orientation_of_fms: string;   // TODO: Not an enum?

  // Attribute
  localTimestamp: Date;
}
