import {AlertTypeEnum} from '../../enums/alert-type.enum';
import {WebSocketProperties} from '../web-socket/web-socket.properties.model';

export class AlertMessage {
  activeAlert: AlertTypeEnum;
  errorMessage: string;
  informationMessage: string;
  successMessage: string;
  warningMessage: string;

  setMessages(properties: WebSocketProperties): void {
    this.errorMessage = `Failed to connect to ${properties.host}:${properties.port}`;
    this.successMessage = `Connection to ${properties.host}:${properties.port} was successful`;
    this.informationMessage = `Connected to ${properties.host}:${properties.port}`;
    this.warningMessage = `No connection`;
  }
}
