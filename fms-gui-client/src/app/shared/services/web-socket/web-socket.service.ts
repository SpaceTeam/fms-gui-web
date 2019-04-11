import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor() { }

  /**
   * Creates a simple web-socket
   * @param host the hostname, e.g. localhost
   * @param port the port to be used, e.g. 8080
   * @param path the path to the subscribe endpoint, e.g. subscribe
   * @param secure defines the security, e.g. ws or wss
   * @example host: localhost, port: 8080, path: subscribe, secure: true -> new WebSocket("wss://localhost:8080/subscribe");
   */
  createSocket(host: string, port?: number, path?: string, secure?: boolean): WebSocket {

    // Define a default port, if the port is not given
    if (!port) {
      port = 80;
    }

    let protocol = 'wss';

    // If security is not given, assume simple TCP connection
    if (!secure) {
      protocol = 'ws';
    }

    // Define default path (root)
    if (!path) {
      path = '';
    }

    return new WebSocket(protocol + '://' + host + ':' + port + '/' + path);
  }
}
