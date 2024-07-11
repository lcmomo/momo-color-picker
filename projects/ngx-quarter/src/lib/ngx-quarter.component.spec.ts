import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxQuarterComponent } from './ngx-quarter.component';

describe('NgxQuarterComponent', () => {
  let component: NgxQuarterComponent;
  let fixture: ComponentFixture<NgxQuarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxQuarterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxQuarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
