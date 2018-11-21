import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightmodeComponent } from './flightmode.component';

describe('FlightmodeComponent', () => {
  let component: FlightmodeComponent;
  let fixture: ComponentFixture<FlightmodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightmodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightmodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
