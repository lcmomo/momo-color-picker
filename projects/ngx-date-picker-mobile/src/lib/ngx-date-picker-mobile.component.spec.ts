import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDatePickerMobileComponent } from './ngx-date-picker-mobile.component';

describe('NgxDatePickerMobileComponent', () => {
  let component: NgxDatePickerMobileComponent;
  let fixture: ComponentFixture<NgxDatePickerMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxDatePickerMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDatePickerMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
