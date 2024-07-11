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
import { FunctionProp } from 'ng-zorro-antd/core/types';
import { NzCalendarI18nInterface } from 'ng-zorro-antd/i18n';

import { DisabledDateFn, NzDateMode, RangePartType, SupportTimeOptions } from '../../type/standard-types';
import { PREFIX_CLASS } from '../../utils/util';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'inner-popup',
  exportAs: 'innerPopup',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inner-popup.component.html'
})
export class InnerPopupComponent implements OnChanges {
  @Input() activeDate!: CandyDate;
  @Input() endPanelMode!: NzDateMode;
  @Input() panelMode!: NzDateMode;
  @Input() showWeek!: boolean;
  @Input() locale!: NzCalendarI18nInterface;
  @Input() showTimePicker!: boolean;
  @Input() timeOptions!: SupportTimeOptions | null;
  @Input() disabledDate?: DisabledDateFn;
  @Input() dateRender?: string | TemplateRef<Date> | FunctionProp<TemplateRef<Date> | string>;
  @Input() selectedValue!: CandyDate[]; // Range ONLY
  @Input() hoverValue!: CandyDate[]; // Range ONLY
  @Input() value!: CandyDate;
  @Input() partType!: RangePartType;

  @Output() readonly panelModeChange = new EventEmitter<NzDateMode>();
  // TODO: name is not proper
  @Output() readonly headerChange = new EventEmitter<CandyDate>(); // Emitted when user changed the header's value
  @Output() readonly selectDate = new EventEmitter<CandyDate>(); // Emitted when the date is selected by click the date panel
  @Output() readonly selectTime = new EventEmitter<CandyDate>();
  @Output() readonly cellHover = new EventEmitter<CandyDate>(); // Emitted when hover on a day by mouse enter

  prefixCls: string = PREFIX_CLASS;

  /**
   * Hide "next" arrow in left panel,
   * hide "prev" arrow in right panel
   *
   * @param direction
   * @param panelMode
   */
  enablePrevNext(direction: 'prev' | 'next', panelMode: NzDateMode): boolean {
    return !(
      !this.showTimePicker &&
      panelMode === this.endPanelMode &&
      ((this.partType === 'left' && direction === 'next') || (this.partType === 'right' && direction === 'prev'))
    );
  }

  onSelectTime(date: Date): void {
    this.selectTime.emit(new CandyDate(date));
  }

  // The value real changed to outside
  onSelectDate(date: CandyDate | Date): void {
    const value = date instanceof CandyDate ? date : new CandyDate(date);
    const timeValue = this.timeOptions && this.timeOptions.nzDefaultOpenValue;

    // Display timeValue when value is null
    if (!this.value && timeValue) {
      value.setHms(timeValue.getHours(), timeValue.getMinutes(), timeValue.getSeconds());
    }

    this.selectDate.emit(value);
  }

  onChooseMonth(value: CandyDate): void {
    this.activeDate = this.activeDate.setMonth(value.getMonth());
    if (this.endPanelMode === 'month') {
      this.value = value;
      this.selectDate.emit(value);
    } else {
      this.headerChange.emit(value);
      this.panelModeChange.emit(this.endPanelMode);
    }
  }

  onChooseQuarter(value: CandyDate): void {
    this.activeDate = this.activeDate.setQuarter(value.getQuarter());
    this.value = value;
    this.selectDate.emit(value);
  }

  onChooseYear(value: CandyDate): void {
    this.activeDate = this.activeDate.setYear(value.getYear());
    if (this.endPanelMode === 'year') {
      this.value = value;
      this.selectDate.emit(value);
    } else {
      this.headerChange.emit(value);
      this.panelModeChange.emit(this.endPanelMode);
    }
  }

  onChooseDecade(value: CandyDate): void {
    this.activeDate = this.activeDate.setYear(value.getYear());
    if (this.endPanelMode === 'decade') {
      this.value = value;
      this.selectDate.emit(value);
    } else {
      this.headerChange.emit(value);
      this.panelModeChange.emit('year');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeDate'] && !changes['activeDate'].currentValue) {
      this.activeDate = new CandyDate();
    }
    // New Antd vesion has merged 'date' ant 'time' to one panel,
    // So there is not 'time' panel
    if (changes['panelMode'] && changes['panelMode'].currentValue === 'time') {
      this.panelMode = 'date';
    }
  }
}
