import { TestBed } from '@angular/core/testing';

import { ManagerApiService } from './manager-api.service';

describe('ManagerApiService', () => {
  let service: ManagerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
