import { TestBed } from '@angular/core/testing';

import { MetricManagerExecutionsService } from './metric-manager-executions.service';

describe('MetricManagerExecutionsService', () => {
  let service: MetricManagerExecutionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetricManagerExecutionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
