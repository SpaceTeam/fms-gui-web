import {Logger} from '../../logger/logger';

export class DuplicateEntryException extends Error {
  constructor(msg: string) {
    super(msg);
    Logger.error(msg);
  }
}
