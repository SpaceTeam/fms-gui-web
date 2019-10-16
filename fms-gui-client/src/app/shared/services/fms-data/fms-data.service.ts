import {Injectable} from '@angular/core';
import {NameValuePair} from '../../model/name-value-pair/name-value-pair.model';
import {NameValuePairUtils} from '../../utils/NameValuePair.util';
import {WebSocketService} from '../../model/service/web-socket.service.model';
import {ServerProperties} from '../../properties/server.properties';
import SERVER_FMS_PROPERTIES = ServerProperties.SERVER_FMS_PROPERTIES;

/**
 * This service class gets the data from an FMS end point and provides functions for that data
 */
@Injectable({
  providedIn: 'root'
})
export class FmsDataService extends WebSocketService<NameValuePair> {

  constructor() {
    super(SERVER_FMS_PROPERTIES.path);
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
    if (this.allData.length <= 1) {
      return false;
    } else {
      return NameValuePairUtils.isDifferent(
        NameValuePairUtils.getValueFromTree(path, this.allData[this.allData.length - 1]),
        NameValuePairUtils.getValueFromTree(path, this.allData[this.allData.length - 2])
      );
    }
  }
}
