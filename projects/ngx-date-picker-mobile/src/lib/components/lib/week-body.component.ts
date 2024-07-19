import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { DateHelperService } from '../../i18n/date-helper.service';
import { DateBodyRow, DateCell, PanelSelector } from './interface';
import { END_DAY_OF_WEEK, FIRST_DAY_OF_WEEK, transCompatFormat } from './util';
import { getInputFormat } from '../../utils';
import { AbstractPanelBody } from './abstract-panel-body.component';
import { CandyDate } from '../../utils/candy-date';
import { TimePickerModel } from '../../type';
@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'week-body',
  templateUrl: './abstract-panel-body.html',
  styles: []
})
export class WeekBodyComponent extends AbstractPanelBody {
  
  
   constructor(private dateHelper: DateHelperService, private cdr: ChangeDetectorRef) { 
    super();
  }


  private getVeryShortWeekFormat(): string {
    return 'EEEEE';
  }
  makeHeadRow(): DateCell[] {
    const weekDays: DateCell[] = [];
    const start = this.activeDate.calendarStart({ weekStartsOn: FIRST_DAY_OF_WEEK });
    for (let colIndex = 0; colIndex < this.MAX_COL; colIndex++) {
      const day = start.addDays(colIndex);
      weekDays.push({
        trackByIndex: null,
        value: day.nativeDate,
        title: this.dateHelper.format(day.nativeDate, 'E'), // eg. Tue
        content: this.dateHelper.format(day.nativeDate, this.getVeryShortWeekFormat()), // eg. Tu,
        isSelected: false,
        isDisabled: false,
        onClick(): void {},
        onMouseEnter(): void {}
      });
    }
    return weekDays;
  }

  makeBodyRows(): DateBodyRow[] {
    return this.makeRows();
  }


  makeRows() {
   let blockList: Array<DateBodyRow> = [];
    const currentYear = this.activeDate.getYear();
    let activeDate = this.activeDate.clone();
    for(let i = 0; i < 12; i++) {
      const block: DateBodyRow = {
        isActive: false,
        content: `${currentYear}年${i + 1}月`,
        children: this.makeDaysOfMonth(activeDate.setMonth(i)),
        trackByIndex: i,
        dateCells: []
      }
      blockList.push(block)
    }
    return blockList;

  }

  makeDaysOfMonth(activeDate: CandyDate) {
    const weekRows: DateBodyRow[] = [];
    const firstDayOfMonth = activeDate.calendarStart({ weekStartsOn: FIRST_DAY_OF_WEEK });

    for (let week = 0; week < this.MAX_ROW; week++) {
      const weekStart = firstDayOfMonth.addDays(week * 7);
      const row: DateBodyRow = {
        isActive: false,
        dateCells: [],
        trackByIndex: week
      };

      for (let day = 0; day < 7; day++) {
        const date = weekStart.addDays(day);
        const dateFormat = transCompatFormat(getInputFormat(this.mode));
        const title = this.dateHelper.format(date.nativeDate, dateFormat);
        const label = this.dateHelper.format(date.nativeDate, 'dd');
        const cell: DateCell = {
          trackByIndex: day,
          value: date.nativeDate,
          label,
          isSelected: false,
          isDisabled: false,
          isToday: false,
          title,
          content: date.isSameMonth(activeDate) ? `${date.getDate()}` : '',
          // onClick: () => console.log('click'),
          onMouseEnter: () => console.log('mouse enter'),
          onClick: () => this.changeValueFromInside(date),
          // onMouseEnter: () => this.cellHover.emit(date)
        };

        this.addCellProperty(cell, date, activeDate);

        if (this.showWeek && !row.weekNum) {
          row.weekNum = this.dateHelper.getISOWeek(date.nativeDate);
        }
        const isSameDay = !Array.isArray(this.value) && date.isSameDay(this.value);
        row.isActive = isSameDay;
        row.dateCells.push(cell);
      }
      row.classMap = {
        [`${this.prefixCls}-week-panel-row`]: this.showWeek,
        [`${this.prefixCls}-week-panel-row-selected`]: this.showWeek && row.isActive
      };
      weekRows.push(row);
    }
    return weekRows;
  }
  addCellProperty(cell: DateCell, date: CandyDate, activeDate?: CandyDate): void {
    if (this.hasRangeValue()) {
      const [startHover, endHover] = this.hoverValue;
      const [startSelected, endSelected] = this.selectedValue;
      // Selected
    
      if (startHover && endHover) {
        cell.isHoverStart = startHover.isSameDay(date);
        cell.isHoverEnd = endHover.isSameDay(date);
        cell.isLastCellInPanel = date.isLastDayOfMonth();
        cell.isFirstCellInPanel = date.isFirstDayOfMonth();
        cell.isInHoverRange = startHover.isBeforeDay(date) && date.isBeforeDay(endHover);
      }
      cell.isStartSingle = (startSelected && !endSelected) as boolean;
      cell.isEndSingle = (!startSelected && endSelected) as boolean;
      cell.isInSelectedRange = startSelected?.isBeforeDay(date) && date.isBeforeDay(endSelected as CandyDate);
      cell.isRangeStartNearHover = startSelected && cell.isInHoverRange;
      cell.isRangeEndNearHover = endSelected && cell.isInHoverRange;

      if (startSelected?.isSameDay(date) || (cell.trackByIndex === FIRST_DAY_OF_WEEK && cell.isInSelectedRange )) {
        cell.isSelectedStart = true;
        cell.isSelected = true;
      }

      if (endSelected?.isSameDay(date) || cell.trackByIndex === END_DAY_OF_WEEK && cell.isInSelectedRange) {
        cell.isSelectedEnd = true;
        cell.isSelected = true;
      }

    }


    // cell.isToday = date.isToday();
    cell.isSelected = date.isSameDay(this.value);
    cell.isDisabled = !!this.disabledDate?.(date.nativeDate);
    cell.classMap = this.getClassMap(cell, activeDate);
  }

  override getClassMap(cell: DateCell, activeDate?: CandyDate): { [key: string]: boolean } {
    const date = new CandyDate(cell.value);
    const isStartOrEndOfWeek = [FIRST_DAY_OF_WEEK, END_DAY_OF_WEEK].includes(cell.trackByIndex);
    return {
      ...super.getClassMap(cell),
      [`${this.prefixCls}-cell-today`]: !!cell.isToday,
      [`${this.prefixCls}-cell-in-view`]: date.isSameMonth(activeDate as CandyDate) && !isStartOrEndOfWeek
      
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
    this.times.length = 0;
    for(let hour = 0; hour < 24; hour++) {
      const hourObj: TimePickerModel = {
        label: hour + '时',
        value: hour,
        children: []
      };
      this.times.push(hourObj);
      for(let minute = 0; minute < 60; minute++) {
        const minuteObj:TimePickerModel = {
          label: minute + '分',
          value: minute,
          children: []
        };
        hourObj.children.push(minuteObj);
        for(let second = 0; second < 60; second++) {
          const secondObj = {
            label: second + '秒',
            value: second,
            children: []
          };
          minuteObj.children.push(secondObj);
        }
      }
    }
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    const dateFormat = transCompatFormat(getInputFormat(this.mode, this.showTime));
   
    return this.dateHelper.format(date, dateFormat);
  }


}
