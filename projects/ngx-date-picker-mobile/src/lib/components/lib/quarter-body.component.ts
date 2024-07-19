import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { DateHelperService } from '../../i18n/date-helper.service';
import { DateBodyRow, DateCell, PanelSelector } from './interface';
import { END_DAY_OF_WEEK, FIRST_DAY_OF_WEEK, transCompatFormat } from './util';
import { getInputFormat } from '../../utils';
import { AbstractPanelBody } from './abstract-panel-body.component';
import { CandyDate } from '../../utils/candy-date';
import { TimePickerModel } from '../../type';
import { startOfQuarter } from 'date-fns';
import { getQuarterFromDate } from '../../utils/util';
@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'quarter-body',
  templateUrl: './abstract-panel-body.html',
  styles: []
})
export class QuarterBodyComponent extends AbstractPanelBody {
  override MAX_ROW = 1;
  override MAX_COL = 4;
  
   constructor(private dateHelper: DateHelperService, private cdr: ChangeDetectorRef) { 
    super();
  }


  private getVeryShortWeekFormat(): string {
    return 'EEEEE';
  }
  makeHeadRow(): DateCell[] {
   return [];
  }

  makeBodyRows(): DateBodyRow[] {
    return this.makeRows();
  }


  makeRows() {
   let blockList: Array<DateBodyRow> = [];
    const currentYear = this.activeDate.getYear();
    const propMaxYear = this.maxDate?.getFullYear();
    const propMinYear = this.minDate?.getFullYear();

    const maxYear = !propMaxYear ? currentYear :  Math.max(currentYear, propMaxYear);
    const minYear = !propMinYear ? 1900 : Math.min(currentYear, propMinYear);

    for(let year = minYear; year <= maxYear; year++) {
      const block: DateBodyRow = {
        isActive: false,
        content: `${year}年`,
        children: this.makeQuarterOfYear(this.activeDate.setYear(year)),
        trackByIndex: year,
        dateCells: []
      }
      blockList.push(block)
    }
    return blockList;

  }

  makeQuarterOfYear(activeDate: CandyDate) {
    const dateCells: DateCell[] = [];
    const months: DateBodyRow[] = [{ dateCells, trackByIndex: 0 }];
    let quarterValue = 1;

    for (let colIndex = 1; colIndex <= this.MAX_COL; colIndex++, quarterValue++) {
      const date = activeDate.setQuarter(quarterValue);
      const isDisabled = this.isDisabledQuarter(date);

      const content = getQuarterFromDate(date.nativeDate);
      const cell: DateCell = {
        trackByIndex: colIndex,
        value: date.nativeDate,
        isDisabled,
        isSelected: date.isSameQuarter(this.value),
        content,
        title: content,
        classMap: {},
        onClick: () => this.changeValueFromInside(date),
        onMouseEnter: function (): void {
          throw new Error('Function not implemented.');
        }
      };

      this.addCellProperty(cell, date, activeDate);
      dateCells.push(cell);
    }
    return months;
  }

  private isDisabledQuarter(quarter: CandyDate): boolean {
    if (!this.disabledDate) {
      return false;
    }

    const firstDayOfQuarter = new CandyDate(startOfQuarter(quarter.nativeDate));
    for (let date = firstDayOfQuarter; date.getQuarter() === quarter.getQuarter(); date = date.addMonths(1)) {
      if (!this.disabledDate(date.nativeDate)) {
        return false;
      }
    }
    return true;
  }

  addCellProperty(cell: DateCell, month: CandyDate, activeDate?: CandyDate): void {
    if (this.hasRangeValue()) {
      const [startHover, endHover] = this.hoverValue;
      const [startSelected, endSelected] = this.selectedValue;

   
      if (startHover && endHover) {
        cell.isHoverStart = startHover.isSameQuarter(month);
        cell.isHoverEnd = endHover.isSameQuarter(month);
        cell.isLastCellInPanel = month.getQuarter() === 4;
        cell.isFirstCellInPanel = month.getQuarter() === 1;
        cell.isInHoverRange = startHover.isBeforeQuarter(month) && month.isBeforeQuarter(endHover);
      }
      cell.isStartSingle = startSelected && !endSelected;
      cell.isEndSingle = (!startSelected && endSelected) as boolean;
      cell.isInSelectedRange = startSelected?.isBeforeQuarter(month) && month?.isBeforeQuarter(endSelected as CandyDate);
      cell.isRangeStartNearHover = startSelected && cell.isInHoverRange;
      cell.isRangeEndNearHover = endSelected && cell.isInHoverRange;

      if (startSelected?.isSameQuarter(month) || (month.getQuarter() === 1 && cell.isInSelectedRange)) {
        cell.isSelectedStart = true;
        cell.isSelected = true;
      }

      if (endSelected?.isSameQuarter(month) || (month.getQuarter() === 4 && cell.isInSelectedRange)) {
        cell.isSelectedEnd = true;
        cell.isSelected = true;
      }

    } else if (month.isSameQuarter(this.value)) {
      cell.isSelected = true;
    }
    cell.classMap = this.getClassMap(cell, activeDate);
  
  }

  override getClassMap(cell: DateCell, activeDate?: CandyDate): { [key: string]: boolean } {
    const date = new CandyDate(cell.value);
    return {
      ...super.getClassMap(cell),
      [`${this.prefixCls}-cell-today`]: !!cell.isToday,
      [`${this.prefixCls}-cell-in-view`]: !!date.isSameYear(activeDate as CandyDate)
      
    };
  }

  private changeValueFromInside(value: CandyDate): void {
    this.activeDate = this.activeDate.setYear(value.getYear()).setMonth(value.getMonth()).setDate(value.getDate());
    this.valueChange.emit(this.activeDate); 
    if (!this.activeDate.isSameMonth(this.value)) {
      this.render();
    }
    this.showTimePicker = true; 
  }

  /**
   * 生成时间选择器的内容
   */
  generateTimePickers(){
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    const dateFormat = transCompatFormat(getInputFormat(this.mode, this.showTime));
   
    return this.dateHelper.format(date, dateFormat);
  }


}
