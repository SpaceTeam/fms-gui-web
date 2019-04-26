import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from './main/main.component';
import {StatusPanelComponent} from './status-panel/status-panel.component';
import {FlightModeComponent} from './flight-mode/flight-mode.component';
import {ControlsComponent} from './controls/controls.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {CardsComponent} from './cards/cards.component';

const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'status-panel', component: StatusPanelComponent},
  { path: 'flight-mode', component: FlightModeComponent},
  { path: 'controls', component: ControlsComponent},
  { path: 'cards', component: CardsComponent},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
