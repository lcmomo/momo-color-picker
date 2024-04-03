import { Component, EventEmitter, Input, Output } from '@angular/core';
import { defaultColor } from '../../utils/util';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ng-antd-color-block',
  templateUrl: './ng-antd-color-block.component.html'
})
export class NgAntdColorBlockComponent {
  @Input() color: string = defaultColor.toHsbString();
  @Output() readonly nzOnClick = new EventEmitter<boolean>();
}