import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from './main/main.component';
import {StatuspanelComponent} from './statuspanel/statuspanel.component';
import {FlightmodeComponent} from './flightmode/flightmode.component';

const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'statuspanel', component: StatuspanelComponent},
  { path: 'flightmode', component: FlightmodeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
