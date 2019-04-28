import {environment as env} from '../../../environments/environment';
import {WebSocketProperties} from '../model/web-socket/web-socket.properties.model';

export namespace ServerProperties {

  /**
   * FMS Properties
   */
  export const SERVER_FMS_PROPERTIES: WebSocketProperties = {
    host: env.server.host,
    port: env.server.port,
    path: env.server.subscribe.fms,
    secure: env.server.secure
  };

  /**
   * Cards Properties
   */
  export const SERVER_CARDS_PROPERTIES: WebSocketProperties = {
    host: env.server.host,
    port: env.server.port,
    path: env.server.subscribe.cards,
    secure: env.server.secure
  };

  /**
   * Controls Properties
   */
  export const SERVER_CONTROLS_PROPERTIES: WebSocketProperties = {
    host: env.server.host,
    port: env.server.port,
    path: env.server.subscribe.controls,
    secure: env.server.secure
  };
}
