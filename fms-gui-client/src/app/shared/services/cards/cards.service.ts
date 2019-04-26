import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  // TODO: Save the url in a properties / YAML file
  // TODO: Change this url as soon as we have a server to contact!
  // TODO: Create a WebSocket connection, which gives you an array of Cards
  constructor() { }

  /**
   * Gets all cards for a specific screen -> The cards are provided in a setting file
   * e.g. screen is "status-panel", then it gets all cards, which are provided in status-panel.cards.json
   * TODO: As the cards should move to the server, this method is only a temporary solution
   */
}
