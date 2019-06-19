import {Injectable} from '@angular/core';
import {Logger} from '../../logger/logger';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {WebSocketProperties} from '../../model/web-socket/web-socket.properties.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  public static createUrl(properties: WebSocketProperties): string {
    // Define a default port, if the port is not given
    if (!properties.port) {
      properties.port = 80;
    }

    let protocol = 'wss';

    // If security is not given, assume simple TCP connection
    if (!properties.secure) {
      protocol = 'ws';
    }

    // Define default path (root)
    if (!properties.path) {
      properties.path = '';
    }

    return protocol + '://' + properties.host + ':' + properties.port + '/' + properties.path;
  }

  /**
   * Opens a WebSocket to the server and reacts to changes
   * @param socket
   * @param socketProperties
   * @param onMessage
   */
  public static connectWebSocket<T>(
    socket: WebSocketSubject<T>,
    socketProperties: WebSocketProperties,
    onMessage: (msg: T) => any
  ): WebSocketSubject<T> {
    if (!socket) {
      return this.createWebSocket(socket, socketProperties, onMessage);
    }
    return socket;
  }

  /**
   * Creates a new {@link WebSocketSubject}
   * @param socket
   * @param socketProperties
   * @param onMessage
   */
  private static createWebSocket<T>(
    socket: WebSocketSubject<T>,
    socketProperties: WebSocketProperties,
    onMessage: (msg: T) => any
  ): WebSocketSubject<T> {
    socket = webSocket(WebSocketService.createUrl(socketProperties));

    // Listening for messages from the server
    socket.subscribe(
      msg => onMessage(msg),            // Called whenever there is a message from the server
      err => {
        // Called if the WebSocket API signals some kind of error
        Logger.error(err);

        // TODO: return an error (so that we can display it in the UI)
      },
      () => Logger.log('complete')   // Called when connection is closed (for whatever reason)
    );

    // For pushing messages to the server, see: https://rxjs-dev.firebaseapp.com/api/webSocket/webSocket

    return socket;
  }
}
