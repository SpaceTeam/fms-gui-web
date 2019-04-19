import {Component, OnDestroy, OnInit} from '@angular/core';
import {FmsDataService} from '../shared/services/fms-data/fms-data.service';
import {Card} from '../shared/model/card.model';
import {CardsService} from '../shared/services/cards/cards.service';

@Component({
  selector: 'app-statuspanel',
  templateUrl: './statuspanel.component.html',
  styleUrls: ['./statuspanel.component.scss']
})
export class StatuspanelComponent implements OnInit, OnDestroy {

  /**
   * The component's title, which will be used in the toolbar
   */
  title = 'Status Panel';

  /**
   * The cards on the right side
   */
  cards: Card[];

  /**
   * The separator between labels and texts
   */
  separator = ':';

  constructor(private cardsService: CardsService, public fmsDataService: FmsDataService) {
  }

  ngOnInit() {
    this.cards = this.cardsService.getCards('statuspanel');
  }

  ngOnDestroy(): void {
  }
}
