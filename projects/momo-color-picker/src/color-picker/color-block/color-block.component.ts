import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { NzSizeLDSType } from 'ng-zorro-antd/core/types';

// import { NgAntdColorPickerModule } from './src/ng-antd-color-picker.module';
import { defaultColor } from '../utils/util';

@Component({
  selector: 'nz-color-block',
  exportAs: 'NzColorBlock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // imports: [NgAntdColorPickerModule],
  templateUrl: './color-block.component.html',
  host: {
    class: 'ant-color-picker-inline',
    '[class.ant-color-picker-inline-sm]': `nzSize === 'small'`,
    '[class.ant-color-picker-inline-lg]': `nzSize === 'large'`
  }
})
export class NzColorBlockComponent {
  @Input() nzColor: string = defaultColor.toHexString();
  @Input() nzSize: NzSizeLDSType = 'default';
  @Output() readonly nzOnClick = new EventEmitter<boolean>();

  constructor() {}
}