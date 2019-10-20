import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastPositionDataComponent } from './last-position-data.component';

describe('LastPositionDataComponent', () => {
  let component: LastPositionDataComponent;
  let fixture: ComponentFixture<LastPositionDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastPositionDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastPositionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
