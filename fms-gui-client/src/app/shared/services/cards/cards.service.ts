import {Injectable} from '@angular/core';
import {NameValuePair} from '../../model/name-value-pair/name-value-pair.model';
import {FmsDataService} from '../fms-data/fms-data.service';
import {WebSocketService} from '../../model/service/web-socket.service.model';

@Injectable({
  providedIn: 'root'
})
export class CardsService extends WebSocketService<NameValuePair> {

  constructor(private fmsDataService: FmsDataService) {
    super();
  }

  /**
   * Returns the value to a given path
   * @param path to a variable
   * @use get("status/flags") returns an array
   */
  public getValue(path: string): string | number | boolean | Array<NameValuePair> {
    return this.fmsDataService.getValue(path);
  }
}
