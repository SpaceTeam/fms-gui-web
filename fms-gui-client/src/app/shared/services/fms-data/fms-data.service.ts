import {Injectable} from '@angular/core';
import {WebSocketUtil} from '../../utils/web-socket/web-socket.util';
import {ServerProperties} from '../../properties/server.properties';
import {NameValuePair} from '../../model/name-value-pair/name-value-pair.model';
import {Utils} from '../../utils/Utils';
import {WebSocketService} from '../../model/service/web-socket.model';

/**
 * This service class gets the data from an FMS end point and provides functions for that data
 */
@Injectable({
  providedIn: 'root'
})
export class FmsDataService extends WebSocketService<NameValuePair> {

  /**
   * A static starter, similar to a constructor, but without the need of creating an instance to start this service
   */
  constructor() {
    super();

    // Open a websocket to the server,which will last over the whole application
    WebSocketUtil.newConnection(this, ServerProperties.SERVER_FMS_PROPERTIES);
  }

  /**
   * Returns the value to a given path
   * @param path to a variable
   * @use get("status/flags") returns an array
   */
  public getValue(path: string): string | number | boolean | Array<NameValuePair> {
    return Utils.getValueFromTree(path, this.data);
  }
}
