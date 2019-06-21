import { TestBed } from '@angular/core/testing';

import { WebSocketUtil } from './web-socket.util';

describe('WebSocketUtil', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebSocketUtil = TestBed.get(WebSocketUtil);
    expect(service).toBeTruthy();
  });
});
