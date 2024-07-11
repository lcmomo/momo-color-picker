import { TestBed } from '@angular/core/testing';

import { NgxQuarterService } from './ngx-quarter.service';

describe('NgxQuarterService', () => {
  let service: NgxQuarterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxQuarterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
