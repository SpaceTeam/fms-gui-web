import {Component, OnInit} from '@angular/core';
import {CardsService} from '../shared/services/cards/cards.service';
import {NameValuePairUtils} from '../shared/utils/NameValuePairUtils';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  title = 'Cards';

  Utils = NameValuePairUtils;

  constructor(private cardsService: CardsService) {
  }

  ngOnInit() {
  }

}
