import { TestBed } from '@angular/core/testing';

import { CardsService } from './cards.service';

describe('CardsService', () => {

  let service: CardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(CardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Cards JSON should be present', () => {
    // Requires: Server to be running
    expect(service.isDataPresent).toBeTruthy();
  });
});
