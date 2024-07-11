
import { Direction } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  CandyDate,
  cloneDate,
  CompatibleValue,
  NormalizedMode,
  SingleValue,
  wrongSortOrder
} from '../../utils/candy-date';
import { FunctionProp } from 'ng-zorro-antd/core/types';
import { NzCalendarI18nInterface } from 'ng-zorro-antd/i18n';

import { QuarterPickerService } from '../../services/quarter-picker.service';
import {
  CompatibleDate,
  DisabledDateFn,
  DisabledTimeFn,
  DisabledTimePartial,
  NzDateMode,
  PresetRanges,
  RangePartType,
  SupportTimeOptions
} from '../../type/standard-types';
import { getTimeConfig, isAllowedDate, PREFIX_CLASS } from '../../utils/util';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'date-range-popup',
  exportAs: 'dateRangePopup',
  templateUrl: './date-range-popup.component.html' 
  
})
export class DateRangePopupComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isRange!: boolean;
  @Input() inline: boolean = false;
  @Input() showWeek!: boolean;
  @Input() locale!: NzCalendarI18nInterface | undefined;
  @Input() disabledDate?: DisabledDateFn;
  @Input() disabledTime?: DisabledTimeFn; // This will lead to rebuild time options
  @Input() showToday!: boolean;
  @Input() showNow!: boolean;
  @Input() showTime!: SupportTimeOptions | boolean;
  @Input() extraFooter?: TemplateRef<void> | string;
  @Input() ranges?: PresetRanges;
  @Input() dateRender?: string | TemplateRef<Date> | FunctionProp<TemplateRef<Date> | string>;
  @Input() panelMode!: NzDateMode | NzDateMode[];
  @Input() defaultPickerValue!: CompatibleDate | undefined | null;
  @Input() dir: Direction = 'ltr';

  @Output() readonly panelModeChange = new EventEmitter<NzDateMode | NzDateMode[]>();
  @Output() readonly calendarChange = new EventEmitter<CompatibleValue>();
  @Output() readonly resultOk = new EventEmitter<void>(); // Emitted when done with date selecting

  prefixCls: string = PREFIX_CLASS;
  endPanelMode: NzDateMode | NzDateMode[] = 'date';
  timeOptions: SupportTimeOptions | SupportTimeOptions[] | null = null;
  hoverValue: SingleValue[] = []; // Range ONLY
  checkedPartArr: boolean[] = [false, false];
  destroy$ = new Subject();

  get hasTimePicker(): boolean {
    return !!this.showTime;
  }

  get hasFooter(): boolean {
    return this.showToday || this.hasTimePicker || !!this.extraFooter || !!this.ranges;
  }

  constructor(
    public quarterPickerService: QuarterPickerService,
    public cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private host: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    merge(this.quarterPickerService.valueChange$, this.quarterPickerService.inputPartChange$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateActiveDate();
        this.cdr.markForCheck();
      });

    this.ngZone.runOutsideAngular(() => {
      fromEvent(this.host.nativeElement, 'mousedown')
        .pipe(takeUntil(this.destroy$))
        .subscribe(event => event.preventDefault());
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Parse showTime options
    if (changes['showTime'] || changes['disabledTime']) {
      if (this.showTime) {
        this.buildTimeOptions();
      }
    }
    if (changes['panelMode']) {
      this.endPanelMode = this.panelMode;
    }
    if (changes['defaultPickerValue']) {
      this.updateActiveDate();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  updateActiveDate(): void {
    const activeDate = this.quarterPickerService.hasValue()
      ? this.quarterPickerService.value
      : this.quarterPickerService.makeValue(this.defaultPickerValue!);
    this.quarterPickerService.setActiveDate(
      activeDate,
      this.hasTimePicker,
      this.getPanelMode(this.endPanelMode) as NormalizedMode
    );
  }

  onClickOk(): void {
    const inputIndex = { left: 0, right: 1 }[this.quarterPickerService.activeInput];
    const value: CandyDate = this.isRange
      ? (this.quarterPickerService.value  as unknown as  CandyDate[])[inputIndex]
      : (this.quarterPickerService.value as unknown as CandyDate);
    this.changeValueFromSelect(value);
    this.resultOk.emit();
  }

  onClickToday(value: CandyDate): void {
    this.changeValueFromSelect(value, !this.showTime);
  }

  onCellHover(value: CandyDate): void {
    if (!this.isRange) {
      return;
    }
    const otherInputIndex = { left: 1, right: 0 }[this.quarterPickerService.activeInput];
    const base = (this.quarterPickerService.value as unknown as CandyDate[])[otherInputIndex]!;
    if (base) {
      if (base.isBeforeDay(value)) {
        this.hoverValue = [base, value];
      } else {
        this.hoverValue = [value, base];
      }
    }
  }

  onPanelModeChange(mode: NzDateMode, partType?: RangePartType): void {
    if (this.isRange) {
      const index = this.quarterPickerService.getActiveIndex(partType);
      if (index === 0) {
        this.panelMode = [mode, this.panelMode[1]] as NzDateMode[];
      } else {
        this.panelMode = [this.panelMode[0], mode] as NzDateMode[];
      }
    } else {
      this.panelMode = mode;
    }
    this.panelModeChange.emit(this.panelMode);
  }

  onActiveDateChange(value: CandyDate, partType: RangePartType): void {
    if (this.isRange) {
      const activeDate: SingleValue[] = [];
      activeDate[this.quarterPickerService.getActiveIndex(partType)] = value;
      this.quarterPickerService.setActiveDate(
        activeDate,
        this.hasTimePicker,
        this.getPanelMode(this.endPanelMode, partType) as NormalizedMode
      );
    } else {
      this.quarterPickerService.setActiveDate(value);
    }
  }

  onSelectTime(value: CandyDate, partType?: RangePartType): void {
    if (this.isRange) {
      const newValue = cloneDate(this.quarterPickerService.value) as SingleValue[];
      const index = this.quarterPickerService.getActiveIndex(partType);
      newValue[index] = this.overrideHms(value, newValue[index]);
      this.quarterPickerService.setValue(newValue);
    } else {
      const newValue = this.overrideHms(value, this.quarterPickerService.value as CandyDate);
      this.quarterPickerService.setValue(newValue); // If not select a date currently, use today
    }
    this.quarterPickerService.inputPartChange$.next(null as any);
    this.buildTimeOptions();
  }

  changeValueFromSelect(value: CandyDate, emitValue: boolean = true): void {
    if (this.isRange) {
      const selectedValue: SingleValue[] = cloneDate(this.quarterPickerService.value) as CandyDate[];
      const checkedPart: RangePartType = this.quarterPickerService.activeInput;
      let nextPart: RangePartType = checkedPart;

      selectedValue[this.quarterPickerService.getActiveIndex(checkedPart)] = value;
      this.checkedPartArr[this.quarterPickerService.getActiveIndex(checkedPart)] = true;
      this.hoverValue = selectedValue;

      if (emitValue) {
        if (this.inline) {
          // For UE, Should always be reversed, and clear vaue when next part is right
          nextPart = this.reversedPart(checkedPart);
          if (nextPart === 'right') {
            selectedValue[this.quarterPickerService.getActiveIndex(nextPart)] = null;
            this.checkedPartArr[this.quarterPickerService.getActiveIndex(nextPart)] = false;
          }
          this.quarterPickerService.setValue(selectedValue);
          this.calendarChange.emit(selectedValue);
          if (this.isBothAllowed(selectedValue) && this.checkedPartArr[0] && this.checkedPartArr[1]) {
            this.clearHoverValue();
            this.quarterPickerService.emitValue$.next();
          }
        } else {
          /**
           * if sort order is wrong, clear the other part's value
           */
          if (wrongSortOrder(selectedValue)) {
            nextPart = this.reversedPart(checkedPart);
            selectedValue[this.quarterPickerService.getActiveIndex(nextPart)] = null;
            this.checkedPartArr[this.quarterPickerService.getActiveIndex(nextPart)] = false;
          }

          this.quarterPickerService.setValue(selectedValue);
          /**
           * range date usually selected paired,
           * so we emit the date value only both date is allowed and both part are checked
           */
          if (this.isBothAllowed(selectedValue) && this.checkedPartArr[0] && this.checkedPartArr[1]) {
            this.calendarChange.emit(selectedValue);
            this.clearHoverValue();
            this.quarterPickerService.emitValue$.next();
          } else if (this.isAllowed(selectedValue)) {
            nextPart = this.reversedPart(checkedPart);
            this.calendarChange.emit([value.clone()]);
          }
        }
      } else {
        this.quarterPickerService.setValue(selectedValue);
      }
      this.quarterPickerService.inputPartChange$.next(nextPart);
    } else {
      this.quarterPickerService.setValue(value);
      this.quarterPickerService.inputPartChange$.next('' as any);

      if (emitValue && this.isAllowed(value)) {
        this.quarterPickerService.emitValue$.next();
      }
    }

    this.buildTimeOptions();
  }

  reversedPart(part: RangePartType): RangePartType {
    return part === 'left' ? 'right' : 'left';
  }

  getPanelMode(panelMode: NzDateMode | NzDateMode[], partType?: RangePartType): NzDateMode {
    if (this.isRange) {
      return panelMode[this.quarterPickerService.getActiveIndex(partType)] as NzDateMode;
    } else {
      return panelMode as NzDateMode;
    }
  }

  // Get single value or part value of a range
  getValue(partType?: RangePartType): CandyDate {
    if (this.isRange) {
      return ((this.quarterPickerService.value as CandyDate[]) || [])[this.quarterPickerService.getActiveIndex(partType)];
    } else {
      return this.quarterPickerService.value as CandyDate;
    }
  }

  getActiveDate(partType?: RangePartType): CandyDate {
    if (this.isRange) {
      return (this.quarterPickerService.activeDate as CandyDate[])[this.quarterPickerService.getActiveIndex(partType)];
    } else {
      return this.quarterPickerService.activeDate as CandyDate;
    }
  }

  disabledStartTime: DisabledTimeFn = (value: Date | Date[]) => this.disabledTime && this.disabledTime(value, 'start');

  disabledEndTime: DisabledTimeFn = (value: Date | Date[]) => this.disabledTime && this.disabledTime(value, 'end');

  isOneAllowed(selectedValue: SingleValue[]): boolean {
    const index = this.quarterPickerService.getActiveIndex();
    const disabledTimeArr = [this.disabledStartTime, this.disabledEndTime];
    return isAllowedDate(selectedValue[index]!, this.disabledDate, disabledTimeArr[index]);
  }

  isBothAllowed(selectedValue: SingleValue[]): boolean {
    return (
      isAllowedDate(selectedValue[0]!, this.disabledDate, this.disabledStartTime) &&
      isAllowedDate(selectedValue[1]!, this.disabledDate, this.disabledEndTime)
    );
  }

  isAllowed(value: CompatibleValue, isBoth: boolean = false): boolean {
    if (this.isRange) {
      return isBoth ? this.isBothAllowed(value as CandyDate[]) : this.isOneAllowed(value as CandyDate[]);
    } else {
      return isAllowedDate(value as CandyDate, this.disabledDate, this.disabledTime);
    }
  }

  getTimeOptions(partType?: RangePartType): SupportTimeOptions | null {
    if (this.showTime && this.timeOptions) {
      return this.timeOptions instanceof Array
        ? this.timeOptions[this.quarterPickerService.getActiveIndex(partType)]
        : this.timeOptions;
    }
    return null;
  }

  onClickPresetRange(val: PresetRanges[keyof PresetRanges]): void {
    const value = typeof val === 'function' ? val() : val;
    if (value) {
      this.quarterPickerService.setValue([new CandyDate(value[0]), new CandyDate(value[1])]);
      this.quarterPickerService.emitValue$.next();
    }
  }

  onPresetRangeMouseLeave(): void {
    this.clearHoverValue();
  }

  onHoverPresetRange(val: PresetRanges[keyof PresetRanges]): void {
    if (typeof val !== 'function') {
      this.hoverValue = [new CandyDate(val[0]), new CandyDate(val[1])];
    }
  }

  getObjectKeys(obj?: PresetRanges): string[] {
    return obj ? Object.keys(obj) : [];
  }

  show(partType: RangePartType): boolean {
    const hide = this.showTime && this.isRange && this.quarterPickerService.activeInput !== partType;
    return !hide;
  }

  private clearHoverValue(): void {
    this.hoverValue = [];
  }

  private buildTimeOptions(): void {
    if (this.showTime) {
      const showTime = typeof this.showTime === 'object' ? this.showTime : {};
      if (this.isRange) {
        const value = this.quarterPickerService.value as CandyDate[];
        this.timeOptions = [
          this.overrideTimeOptions(showTime, value[0], 'start'),
          this.overrideTimeOptions(showTime, value[1], 'end')
        ];
      } else {
        this.timeOptions = this.overrideTimeOptions(showTime, this.quarterPickerService.value as CandyDate);
      }
    } else {
      this.timeOptions = null;
    }
  }

  private overrideTimeOptions(
    origin: SupportTimeOptions,
    value: CandyDate,
    partial?: DisabledTimePartial
  ): SupportTimeOptions {
    let disabledTimeFn;
    if (partial) {
      disabledTimeFn = partial === 'start' ? this.disabledStartTime : this.disabledEndTime;
    } else {
      disabledTimeFn = this.disabledTime;
    }
    return { ...origin, ...getTimeConfig(value, disabledTimeFn) };
  }

  private overrideHms(newValue: CandyDate | null, oldValue: CandyDate | null): CandyDate {
    newValue = newValue || new CandyDate();
    oldValue = oldValue || new CandyDate();
    return oldValue.setHms(newValue.getHours(), newValue.getMinutes(), newValue.getSeconds());
  }
}
