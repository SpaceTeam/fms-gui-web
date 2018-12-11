import {Component, Input, OnInit} from '@angular/core';
import {RoutesService} from '../services/routes/routes.service';
import {NavItem} from '../model/nav-item.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  title = 'Navigation';

  navItems: NavItem[];

  constructor(
    private routesService: RoutesService
  ) { }

  ngOnInit() {
    this.routesService.getNavItems()
      .subscribe(navItems => {
        this.navItems = navItems;
        for (let i = 0; i < this.navItems.length; i++) {
          console.log(navItems[i]);
        }
      });
  }

}
