import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from './components/main/main.component';
import {StatusPanelComponent} from './components/status-panel/status-panel.component';
import {FlightModeComponent} from './components/flight-mode/flight-mode.component';
import {ControlsComponent} from './components/controls/controls.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {CardsComponent} from './components/cards/cards.component';

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
