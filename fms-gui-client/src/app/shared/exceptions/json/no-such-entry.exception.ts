import {Logger} from '../../logger/logger';

export class NoSuchEntryException extends Error {
  constructor(msg: string) {
    super(msg);
    Logger.error(msg);
  }
}
