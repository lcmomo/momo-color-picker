import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerMobileDemoComponent } from './date-picker-mobile-demo.component';

describe('DatePickerMobileDemoComponent', () => {
  let component: DatePickerMobileDemoComponent;
  let fixture: ComponentFixture<DatePickerMobileDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatePickerMobileDemoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePickerMobileDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
