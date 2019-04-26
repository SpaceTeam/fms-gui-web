import {environment as env} from '../../../environments/environment';
import {WebSocketProperties} from '../model/web-socket/web-socket.properties.model';

export namespace ServerProperties {

  /**
   * The server's properties, which will be converted into a URL
   */
  export const SERVER_PROPERTIES: WebSocketProperties = {
    host: env.server.host,
    port: env.server.port,
    path: env.server.subscribe,
    secure: env.server.secure
  };
}
