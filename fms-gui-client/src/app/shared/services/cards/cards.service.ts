import { Injectable } from '@angular/core';
import {Card} from '../../model/card.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  // TODO: Save the url in a properties / YAML file
  // TODO: Change this url as soon as we have a server to contact!
  /**
   * Contains the url of the server where we can get the json file
   */
  cardsUrl = 'assets/cards/';

  settingsUrl = 'assets/settings/';

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Gets all cards for a specific screen -> The cards are provided in a setting file
   * e.g. screen is "statuspanel", then it gets all cards, which are provided in statuspanel.cards.json
   * TODO: As the cards should move to the server, this method is only a temporary solution
   */
  public getCards(screen: string): Card[] {
    if (!screen) { return null; }

    const cards: Card[] = [];

    // TODO: Implement me!
    this.getJSON(screen).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.getCard(data[i]).subscribe(card => cards.push(card));
      }
    });

    return cards;
  }

  public getJSON(json: string): Observable<any> {
    return this.http.get(this.settingsUrl + json + '.cards.json');
  }

  public getCard(card: string): Observable<Card> {
    return this.http.get<Card>(this.cardsUrl + card + '.card.json');
  }
}
