import {Injectable} from '@angular/core';
import {NameValuePair} from '../../model/name-value-pair/name-value-pair.model';
import {WebSocketUtil} from '../../utils/web-socket/web-socket.util';
import {ServerProperties} from '../../properties/server.properties';
import {FmsDataService} from '../fms-data/fms-data.service';
import {WebSocketService} from '../../model/service/web-socket.model';

@Injectable({
  providedIn: 'root'
})
export class CardsService extends WebSocketService<NameValuePair> {

  /**
   * A static starter, similar to a constructor, but without the need of creating an instance to start this service
   */
  constructor(private fmsDataService: FmsDataService) {
    super();

    // Open a websocket to the server, which will last over the whole application
    WebSocketUtil.newConnection(this, ServerProperties.SERVER_CARDS_PROPERTIES);
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
