import { Component, Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewChild, TemplateRef, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { DateBodyRow, DateCell, PanelSelector } from './interface';
import { CandyDate, CompatibleValue } from '../../utils/candy-date';
import { NzCalendarI18nInterface } from '../../i18n';
import { DateMode, TimePickerModel } from '../../type';

@Directive()
export abstract class AbstractPanelBody implements OnInit, OnChanges {
 
  @ViewChild('scrollContent') scrollContent!: ElementRef;
  @ViewChildren('blockElement') blocks!: QueryList<ElementRef>;
  @Input() mode: DateMode = 'date';
  @Input() showClean: boolean = false;
  @Input() showClose: boolean = false;
  @Input() showWeek: boolean = false;
  @Input() title: string = '';
  @Input() value!: CandyDate;
  @Input() startValue!:Date | undefined;
  @Input() endValue!: Date | undefined;
  @Input() activeDate!: CandyDate;
  @Input() inputValue!: Array<CandyDate | undefined>;
  @Input() locale!: NzCalendarI18nInterface;
  @Input() disabledDate?: (d: Date) => boolean;
  @Input() hoverValue: CandyDate[] = []; // Range ONLY
  @Input() selectedValue: Array<CandyDate | undefined> = []; // Range ONLY
  // @Input() showBlockTitle: boolean = true;
  @Input() isRange: boolean = true;
  @Input() showTime: boolean = false;
  @Input() showTimePicker: boolean = false;
  @Input() timePickerTitle: string = '';
  @Input() disConfirmBtn: boolean = false;
  @Input() maxDate?: Date = new Date();
  @Input() minDate?: Date = new Date(1900, 0, 1);


  @Output() valueChange = new EventEmitter<CandyDate>();
  @Output() triggerConfirm = new EventEmitter<any>();
  @Output() timeChange = new EventEmitter<any>();
  @Output() clean = new EventEmitter();

  get showYearTitle(): boolean {
    return this.mode === 'week' || this.showWeek;
  }

  get showBlockTitle(): boolean {
    return ['date', 'quarter'].includes(this.mode);
  }
  prefixCls: string = 'ngx-mobile-picker-panel';
  headRow: DateCell[] = [];
  bodyRows: Array<DateBodyRow> = [];
  MAX_ROW = 5;
  MAX_COL = 7;
  mobileAgent: boolean =  true;
   // 时间选择器内容
  times: Array<TimePickerModel> = [];
   // 具体时间
   time = [0, 0, 0];

  abstract makeHeadRow(): DateCell[];
  abstract makeBodyRows(): Array<DateBodyRow>;
  abstract generateTimePickers(): void;
  abstract formatDate(date: Date): string;
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
  ngOnInit(): void {
    this.generateTimePickers();
    this.render();
    
  }
  ngAfterViewInit() {
    this.scrollToCurrentDate();
  }

  /**
   * 滚动到当前日期位置
   */
  scrollToCurrentDate(){
    const currentMonthIndex = this.getCurrentDayOfBlockIndex(); // 获取当前月份（0-11）
    const blockElements = this.blocks.toArray();
    if (blockElements[currentMonthIndex]) {
      blockElements[currentMonthIndex].nativeElement.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }
  hasRangeValue(): boolean {
    return this.selectedValue?.length > 0 || this.hoverValue?.length > 0;
  }
  onTimeChange(times: Array<TimePickerModel>) {

    const time = times.map((time: TimePickerModel) => time.value)
    this.timeChange.emit(time);
  }

  getClassMap(cell: DateCell, activeDate?: CandyDate): { [key: string]: boolean } {
    return {
      [`${this.prefixCls}-cell`]: true,
      [`${this.prefixCls}-cell-${this.mode}`]: true,
      [`${this.prefixCls}-in-view`]: true,
      [`${this.prefixCls}-cell-selected`]: cell.isSelected,
      [`${this.prefixCls}-cell-disabled`]: cell.isDisabled,
      [`${this.prefixCls}-cell-in-range`]: !!cell.isInSelectedRange,
      [`${this.prefixCls}-cell-range-start`]: !!cell.isSelectedStart,
      [`${this.prefixCls}-cell-range-end`]: !!cell.isSelectedEnd,
      [`${this.prefixCls}-cell-range-start-single`]: !!cell.isStartSingle,
      [`${this.prefixCls}-cell-range-end-single`]: !!cell.isEndSingle,
      [`${this.prefixCls}-cell-range-hover`]: !!cell.isInHoverRange,
      [`${this.prefixCls}-cell-range-hover-start`]: !!cell.isHoverStart,
      [`${this.prefixCls}-cell-range-hover-end`]: !!cell.isHoverEnd,
      [`${this.prefixCls}-cell-range-hover-edge-start`]: !!cell.isFirstCellInPanel,
      [`${this.prefixCls}-cell-range-hover-edge-end`]: !!cell.isLastCellInPanel,
      [`${this.prefixCls}-cell-range-start-near-hover`]: !!cell.isRangeStartNearHover,
      [`${this.prefixCls}-cell-range-end-near-hover`]: !!cell.isRangeEndNearHover
    };
  }
  protected render(): void {
    if (this.activeDate) {
      this.headRow = this.makeHeadRow();
      this.bodyRows = this.makeBodyRows();
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

  hiddenTimePicker() {
    return;
    if (!this.showTimePicker) return;
    setTimeout(() => {
      this.showTimePicker = false;
    });
    
  }

  onTriggerConfirm() {
    if (this.disConfirmBtn) return;
    this.triggerConfirm.emit();
  }


  getCurrentDayOfBlockIndex(): number {
    let currentMonthIndex = 0;

    switch(this.mode) {
      case 'date': {
        currentMonthIndex = new Date().getMonth();
        break;
      } 
      case 'quarter': {
        const startYear = this.minDate?.getFullYear();
        const currentYear = new Date().getFullYear();
        currentMonthIndex = startYear ? currentYear - startYear : currentYear;
        break;

      }
      default: {

      }
    }

    return currentMonthIndex;
  }
 }
