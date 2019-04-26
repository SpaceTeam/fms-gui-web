import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from './main/main.component';
import {StatuspanelComponent} from './statuspanel/statuspanel.component';
import {FlightmodeComponent} from './flightmode/flightmode.component';
import {ControlsComponent} from './controls/controls.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {CardsComponent} from './cards/cards.component';

const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'statuspanel', component: StatuspanelComponent},
  { path: 'flightmode', component: FlightmodeComponent},
  { path: 'controls', component: ControlsComponent},
  { path: 'cards', component: CardsComponent},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
