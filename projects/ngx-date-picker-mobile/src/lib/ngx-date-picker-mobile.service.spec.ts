import { TestBed } from '@angular/core/testing';

import { NgxDatePickerMobileService } from './ngx-date-picker-mobile.service';

describe('NgxDatePickerMobileService', () => {
  let service: NgxDatePickerMobileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxDatePickerMobileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
