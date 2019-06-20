import { Component, OnInit } from '@angular/core';
import {CardsService} from '../shared/services/cards/cards.service';
import {Utils} from '../shared/utils/Utils';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  title: string = 'Cards';

  CardsService = CardsService;
  Utils = Utils;

  constructor() {
  }

  ngOnInit() {
  }

}
