/**
 * This defines a properties object we need for creating a new WebSocket
 */
interface WebSocketProperties {
  /**
   * The server's host name, e.g. localhost
   */
  host: string;

  /**
   * The server's port, e.g. 8080
   */
  port?: number;

  /**
   * The path to a specific endpoint, e.g. subscribe
   */
  path?: string;

  /**
   * Defines, if we use a secure connection or not
   */
  secure?: boolean;
}
