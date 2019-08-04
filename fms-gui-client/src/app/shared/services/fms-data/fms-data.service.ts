import {Injectable} from '@angular/core';
import {WebSocketUtil} from '../../utils/web-socket/web-socket.util';
import {ServerProperties} from '../../properties/server.properties';
import {NameValuePair} from '../../model/name-value-pair/name-value-pair.model';
import {NameValuePairUtils} from '../../utils/NameValuePairUtils';
import {WebSocketService} from '../../model/service/web-socket.service.model';

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

    // Register this service
    WebSocketUtil.registerService(this);

    this.path = ServerProperties.SERVER_FMS_PROPERTIES.path;

    // Open a websocket to the server,which will last over the whole application
    WebSocketUtil.newConnection(ServerProperties.SERVER_FMS_PROPERTIES);
  }

  /**
   * Returns the value to a given path
   * @param path to a variable
   * @use get("status/flags") returns an array
   */
  public getValue(path: string): string | number | boolean | Array<NameValuePair> {
    return NameValuePairUtils.getValueFromTree(path, this.data);
  }

  /**
   * Checks, whether the current value is different from the previous one
   * @param path the path to the value to be checked
   * @return true, if the current value is different from the previous one
   */
  public isDifferentValue(path: string): boolean {
    return NameValuePairUtils.isDifferent(
      NameValuePairUtils.getValueFromTree(path, this.allData[this.allData.length - 1]),
      NameValuePairUtils.getValueFromTree(path, this.allData[this.allData.length - 2])
    );
  }
}
