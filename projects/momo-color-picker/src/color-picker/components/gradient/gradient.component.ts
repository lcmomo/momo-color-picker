import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { Color } from '../../interfaces/color';
import { HsbaColorType } from '../../interfaces/type';
import { generateColor } from '../../utils/util';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'base-color-gradient',
  templateUrl: './gradient.component.html'
})
export class BaseGradientComponent implements OnInit, OnChanges {
  @Input() colors: Color[] | string[] = [];
  @Input() direction: string = 'to right';
  @Input() type: HsbaColorType = 'hue';

  gradientColors: string = '';

  constructor() {}

  ngOnInit(): void {
    this.useMemo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { colors, type } = changes;
    if (colors || type) {
      this.useMemo();
    }
  }

  useMemo(): void {
    this.gradientColors = this.colors
      .map((color, idx) => {
        const result = generateColor(color);
        if (this.type === 'alpha' && idx === this.colors.length - 1) {
          result.setAlpha(1);
        }
        return result.toRgbString();
      })
      .join(',');
  }
}