import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgAntdColorPickerComponent } from './ng-antd-color-picker.component';

describe('NgAntdColorPickerComponent', () => {
  let component: NgAntdColorPickerComponent;
  let fixture: ComponentFixture<NgAntdColorPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgAntdColorPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgAntdColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
