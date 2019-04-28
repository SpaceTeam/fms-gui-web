import { Component, OnInit } from '@angular/core';
import {Card} from '../shared/model/card.model';
import {CardsService} from '../shared/services/cards/cards.service';
import {Utils} from '../shared/utils/Utils';

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

  CardsService = CardsService;
  Utils = Utils;

  constructor(private cardsService: CardsService) {
  }

  ngOnInit() {
  }

}
