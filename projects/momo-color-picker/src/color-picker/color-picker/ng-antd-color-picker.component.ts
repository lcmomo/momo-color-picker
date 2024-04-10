import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { Color } from '../interfaces/color';


import { ColorGenInput, ColorValue, HsbaColorType } from '../interfaces/type';

import { defaultColor, generateColor } from '../utils/util';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ng-antd-color-picker',
  templateUrl:'./color-picker.component.html' 
  
})
export class NgAntdColorPickerComponent implements OnInit, OnChanges {
  @Input() value: ColorValue;
  @Input() defaultValue: ColorValue;
  @Output() readonly nzOnChange = new EventEmitter<{ color: Color; type?: HsbaColorType }>();
  @Output() readonly nzOnChangeComplete = new EventEmitter<HsbaColorType>();
  @Input() panelRenderHeader: TemplateRef<void> | null = null;
  @Input() panelRenderFooter: TemplateRef<void> | null = null;
  @Input() disabledAlpha: boolean = false;
  @Input() disabled: boolean = false;

  colorValue: Color | null = null;
  alphaColor: string = '';

  hueColor: string[] = [
    'rgb(255, 0, 0) 0%',
    'rgb(255, 255, 0) 17%',
    'rgb(0, 255, 0) 33%',
    'rgb(0, 255, 255) 50%',
    'rgb(0, 0, 255) 67%',
    'rgb(255, 0, 255) 83%',
    'rgb(255, 0, 0) 100%'
  ];

  gradientColors: string[] = ['rgba(255, 0, 4, 0) 0%', this.alphaColor];

  toRgbString: string = this.colorValue?.toRgbString() || '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.setColorValue(this.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { value, defaultValue } = changes;
    if (value || defaultValue) {
      this.setColorValue(this.value);
    }
  }

  hasValue(value: ColorValue): boolean {
    return !!value;
  }

  setColorValue(color: ColorValue): void {
    let mergeState;
    if (this.hasValue(color)) {
      mergeState = color;
    } else if (this.hasValue(this.defaultValue)) {
      mergeState = this.defaultValue;
    } else {
      mergeState = defaultColor;
    }
    this.colorValue = generateColor(mergeState as ColorGenInput);
    this.setAlphaColor(this.colorValue);
    this.toRgbString = this.colorValue?.toRgbString() || '';
    this.cdr.detectChanges();
  }

  setAlphaColor(colorValue: Color): void {
    const rgb = generateColor(colorValue.toRgbString());
    this.alphaColor = rgb.toRgbString();
    this.gradientColors = ['rgba(255, 0, 4, 0) 0%', this.alphaColor];
    this.cdr.markForCheck();
  }

  handleChange(color: Color, type?: HsbaColorType): void {
    this.setColorValue(color);
    this.nzOnChange.emit({ color, type });
  }
}
