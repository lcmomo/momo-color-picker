/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, TemplateRef } from '@angular/core';
import { CandyDate } from 'ng-zorro-antd/core/time';
import { FunctionProp, NzSafeAny } from 'ng-zorro-antd/core/types';
import { isNonEmptyString, isTemplateRef } from 'ng-zorro-antd/core/util';
import { NzCalendarI18nInterface } from 'ng-zorro-antd/i18n';
import { DateBodyRow, DateCell } from './interface';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class AbstractTable implements OnInit, OnChanges {
  isTemplateRef = isTemplateRef;
  isNonEmptyString = isNonEmptyString;
  headRow: DateCell[] = [];
  bodyRows: DateBodyRow[] = [];
  MAX_ROW = 6;
  MAX_COL = 7;

  @Input() prefixCls: string = 'ngx-picker';
  @Input() value!: CandyDate;
  @Input() locale!: NzCalendarI18nInterface;
  @Input() activeDate: CandyDate = new CandyDate();
  @Input() showWeek: boolean = false;
  @Input() selectedValue: CandyDate[] = []; // Range ONLY
  @Input() hoverValue: CandyDate[] = []; // Range ONLY
  @Input() disabledDate?: (d: Date) => boolean;
  @Input() cellRender?: string | TemplateRef<Date> | FunctionProp<TemplateRef<Date> | string>;
  @Input() fullCellRender?: string | TemplateRef<Date> | FunctionProp<TemplateRef<Date> | string>;

  @Output() readonly valueChange = new EventEmitter<CandyDate>();
  @Output() readonly cellHover = new EventEmitter<CandyDate>(); // Emitted when hover on a day by mouse enter

  protected render(): void {
    if (this.activeDate) {
      this.headRow = this.makeHeadRow();
      this.bodyRows = this.makeBodyRows();
    }
  }

  trackByBodyRow(_index: number, item: DateBodyRow): NzSafeAny {
    return item.trackByIndex;
  }

  trackByBodyColumn(_index: number, item: DateCell): NzSafeAny {
    return item.trackByIndex;
  }

  hasRangeValue(): boolean {
    return this.selectedValue?.length > 0 || this.hoverValue?.length > 0;
  }

  getClassMap(cell: DateCell): { [key: string]: boolean } {
    return {
      [`ngx-picker-cell`]: true,
      [`ngx-picker-cell-in-view`]: true,
      [`ngx-picker-cell-selected`]: cell.isSelected,
      [`ngx-picker-cell-disabled`]: cell.isDisabled,
      [`ngx-picker-cell-in-range`]: !!cell.isInSelectedRange,
      [`ngx-picker-cell-range-start`]: !!cell.isSelectedStart,
      [`ngx-picker-cell-range-end`]: !!cell.isSelectedEnd,
      [`ngx-picker-cell-range-start-single`]: !!cell.isStartSingle,
      [`ngx-picker-cell-range-end-single`]: !!cell.isEndSingle,
      [`ngx-picker-cell-range-hover`]: !!cell.isInHoverRange,
      [`ngx-picker-cell-range-hover-start`]: !!cell.isHoverStart,
      [`ngx-picker-cell-range-hover-end`]: !!cell.isHoverEnd,
      [`ngx-picker-cell-range-hover-edge-start`]: !!cell.isFirstCellInPanel,
      [`ngx-picker-cell-range-hover-edge-end`]: !!cell.isLastCellInPanel,
      [`ngx-picker-cell-range-start-near-hover`]: !!cell.isRangeStartNearHover,
      [`ngx-picker-cell-range-end-near-hover`]: !!cell.isRangeEndNearHover
    };
  }

  abstract makeHeadRow(): DateCell[];
  abstract makeBodyRows(): DateBodyRow[];

  ngOnInit(): void {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeDate'] && !changes['activeDate'].currentValue) {
      this.activeDate = new CandyDate();
    }

    if (
      changes['disabledDate'] ||
      changes['locale'] ||
      changes['showWeek'] ||
      this.isDateRealChange(changes['activeDate']) ||
      this.isDateRealChange(changes['value']) ||
      this.isDateRealChange(changes['selectedValue']) ||
      this.isDateRealChange(changes['hoverValue'])
    ) {
      this.render();
    }
  }

  private isDateRealChange(change: SimpleChange): boolean {
    if (change) {
      const previousValue: CandyDate | CandyDate[] = change.previousValue;
      const currentValue: CandyDate | CandyDate[] = change.currentValue;
      if (Array.isArray(currentValue)) {
        return (
          !Array.isArray(previousValue) ||
          currentValue.length !== previousValue.length ||
          currentValue.some((value, index) => {
            const previousCandyDate = previousValue[index];
            return previousCandyDate instanceof CandyDate ? previousCandyDate.isSameDay(value) : previousCandyDate !== value;
          })
        );
      } else {
        return !this.isSameDate(previousValue as CandyDate, currentValue);
      }
    }
    return false;
  }

  private isSameDate(left: CandyDate, right: CandyDate): boolean {
    return (!left && !right) || (left && right && right.isSameDay(left));
  }
}
