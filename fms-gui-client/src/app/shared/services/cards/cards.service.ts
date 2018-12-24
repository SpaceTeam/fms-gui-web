import { Injectable } from '@angular/core';
import {Card} from "../../model/card.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Gets all cards for a specific screen -> The cards are provided in a setting file
   * e.g. screen is "statuspanel", then it gets all cards, which are provided in statuspanel.cards.json
   * TODO: As the cards should move to the server, this method is only a temporary solution
   */
  public getCards(screen: string): Card[] {
    if(!screen){
      // TODO: Implement me!
    }
    return null;
  }
}
