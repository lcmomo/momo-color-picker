import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { CandyDate } from '../../utils/candy-date';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

import { isNonEmptyString, isTemplateRef } from 'ng-zorro-antd/core/util';
import { DateHelperService, NzCalendarI18nInterface } from '../../i18n';
import { transCompatFormat } from '../lib';
import { PREFIX_CLASS } from '../../utils/util';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:component-selector
  selector: 'calendar-footer',
  exportAs: 'calendarFooter',
  templateUrl: './calendar-footer.component.html'
})
export class CalendarFooterComponent implements OnChanges {
  @Input() locale!: NzCalendarI18nInterface;
  @Input() showToday: boolean = false;
  @Input() showNow: boolean = false;
  @Input() hasTimePicker: boolean = false;
  @Input() isRange: boolean = false;

  @Input() okDisabled: boolean = false;
  @Input() disabledDate?: (d: Date) => boolean;
  @Input() extraFooter?: TemplateRef<void> | string;
  @Input() rangeQuickSelector: TemplateRef<NzSafeAny> | null = null;

  @Output() readonly clickOk = new EventEmitter<void>();
  @Output() readonly clickToday = new EventEmitter<CandyDate>();

  prefixCls: string = PREFIX_CLASS;
  isTemplateRef = isTemplateRef;
  isNonEmptyString = isNonEmptyString;
  isTodayDisabled: boolean = false;
  todayTitle: string = '';

  constructor(private dateHelper: DateHelperService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const now: Date = new Date();
    if (changes['disabledDate']) {
      this.isTodayDisabled = !!(this.disabledDate && this.disabledDate(now));
    }
    if (changes['locale']) {
      // NOTE: Compat for DatePipe formatting rules
      const dateFormat: string = transCompatFormat(this.locale.dateFormat);
      this.todayTitle = this.dateHelper.format(now, dateFormat);
    }
  }

  onClickToday(): void {
    const now: CandyDate = new CandyDate();
    this.clickToday.emit(now.clone()); // To prevent the "now" being modified from outside, we use clone
  }
}
