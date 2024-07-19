import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractPanelHeader } from './abstract-panel-header.component';
import { DateHelperService } from '../../i18n/date-helper.service';
import { PanelSelector } from './interface';
import { transCompatFormat } from './util';
import { getInputFormat } from '../../utils';
@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'week-header',
  templateUrl: './abstract-panel-header.html',
  styles: []
})
export class WeekHeaderComponent extends AbstractPanelHeader {
  constructor(private dateHelper: DateHelperService) { 
    super();
  }

  getSelectors(): PanelSelector[] {
    return [
      {
        className: `${this.prefixCls}-month-btn`,
        title: this.title,
        onClick: () => console.log('click'),
        label: this.dateHelper.format(this.value.nativeDate, transCompatFormat(getInputFormat('year')))
      }
    ];
  }


}
