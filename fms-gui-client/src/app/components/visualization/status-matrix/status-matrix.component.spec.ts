import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusMatrixComponent } from './status-matrix.component';

describe('StatusMatrixComponent', () => {
  let component: StatusMatrixComponent;
  let fixture: ComponentFixture<StatusMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
