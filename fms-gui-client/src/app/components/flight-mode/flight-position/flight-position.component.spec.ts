import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightPositionComponent } from './flight-position.component';

describe('FlightPositionComponent', () => {
  let component: FlightPositionComponent;
  let fixture: ComponentFixture<FlightPositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightPositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
