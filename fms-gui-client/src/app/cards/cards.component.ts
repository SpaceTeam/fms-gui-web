import { Component, OnInit } from '@angular/core';
import {Card} from '../shared/model/card.model';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  title: string = 'Cards';

  /**
   * The cards on the right side
   */
  cards: Card[];

  constructor() {
  }

  ngOnInit() {
  }

}
