import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadarConfigComponent } from './radar-config.component';

describe('RadarConfigComponent', () => {
  let component: RadarConfigComponent;
  let fixture: ComponentFixture<RadarConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadarConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadarConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
