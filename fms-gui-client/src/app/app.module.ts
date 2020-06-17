import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {MaterialModule} from './material.module';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {NavComponent} from './components/nav/nav.component';
import {FlightModeComponent} from './components/flight-mode/flight-mode.component';
import {MainComponent} from './components/main/main.component';
import {StatusPanelComponent} from './components/status-panel/status-panel.component';
import {ControlsComponent} from './components/controls/controls.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {CardsComponent} from './components/cards/cards.component';
import {LoadingComponent} from './components/loading/loading.component';
import {AlertComponent} from './components/alert/alert.component';
import {StatusHighlightDirective} from './shared/directives/status-highlight/status-highlight.directive';
import {RadarComponent} from './components/visualization/radar/radar.component';
import {StatusMatrixComponent} from './components/visualization/status-matrix/status-matrix.component';
import {SharedModule} from './shared/shared.module';
import {MatrixComponent} from './components/status-panel/matrix/matrix.component';
import {FlagsComponent} from './components/status-panel/flags/flags.component';
import {AttributesListComponent} from './components/status-panel/matrix/attributes-list/attributes-list.component';
import {LastPositionDataComponent} from './components/flight-mode/last-position-data/last-position-data.component';
import {FlightDirectionComponent} from './components/flight-mode/flight-direction/flight-direction.component';
import {FlightPositionComponent} from './components/flight-mode/flight-position/flight-position.component';
import {RadarConfigComponent} from './components/visualization/radar/radar-config/radar-config.component';
import {TimestampBrushComponent} from './components/timestamp-brush/timestamp-brush.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    AppComponent,
    NavComponent,
    FlightModeComponent,
    StatusPanelComponent,
    MainComponent,
    ControlsComponent,
    PageNotFoundComponent,
    CardsComponent,
    LoadingComponent,
    AlertComponent,
    StatusHighlightDirective,
    RadarComponent,
    StatusMatrixComponent,
    MatrixComponent,
    FlagsComponent,
    AttributesListComponent,
    LastPositionDataComponent,
    FlightDirectionComponent,
    FlightPositionComponent,
    RadarConfigComponent,
    TimestampBrushComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
