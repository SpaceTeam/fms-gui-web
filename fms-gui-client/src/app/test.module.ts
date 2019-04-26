import {NgModule} from '@angular/core';
import {MaterialModule} from './material.module';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  exports: [
    MaterialModule,
    RouterTestingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ]
})

export class TestModule {
}
