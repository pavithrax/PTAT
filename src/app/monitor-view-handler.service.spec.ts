import { TestBed } from '@angular/core/testing';

import { MonitorViewHandlerService } from './monitor-view-handler.service';

describe('MonitorViewHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonitorViewHandlerService = TestBed.get(MonitorViewHandlerService);
    expect(service).toBeTruthy();
  });
});
