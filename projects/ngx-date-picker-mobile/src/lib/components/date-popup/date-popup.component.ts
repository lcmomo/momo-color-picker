
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { PREFIX_CLASS } from '../../utils';
import { DateMode, SupportTimeOptions } from '../../type';
import { NzCalendarI18nInterface, NzI18nService } from '../../i18n';
import { CandyDate, CompatibleValue, wrongSortOrder } from '../../utils/candy-date';
import { NgxDatePickerMobileService } from '../../ngx-date-picker-mobile.service';
import { DatePickerOptions } from '../../directives/date-picker-options.provider';
import { CalendarPropsType, CalendarStateType } from './date-popup.props.component';


function getInputValue(mode: DateMode, startDate?: Date, endDate?: Date) {
  const startValue =  new CandyDate(startDate);
  const endValue =  new CandyDate(endDate);
  const isDescMode = ['quarter', 'year'];
  if (!endDate) return [startValue];
  if(wrongSortOrder([startValue, endValue]) && !isDescMode.includes(mode)) {
  return [startValue, endValue];    
  }
  return [endValue, startValue];
  // return isDescMode.includes(mode) ? [endValue, startValue] : [startValue, endValue];
// return [Math.min(startDate, endDate)]
  

}

export const  DateTypeTitle = {
  date: '日期',
  time: '时间',
  year: '年份',
  week: '周',
  month: '月份',
  quarter: '季度',
  decade: '年度'
}

@Component({
  selector: 'date-popup',
  templateUrl: './date-popup.component.html',
  styles: []
})
export class DatePopupComponent implements OnInit {
  @Input() mode: DateMode = 'date';
  @Input() locale!: NzCalendarI18nInterface;
  @Input() isRange: boolean = false;
  @Input() timeOptions!: SupportTimeOptions | null;
  @Input() value!: Date;
  @Input() startValue!: Date;
  @Input() endValue!: Date;
  @Input() inputValue!: Array<CandyDate |undefined>;
  @Input() showTime!: boolean;

  
  @Output() valueChange = new EventEmitter<Date>();
  @Output() readonly headerChange = new EventEmitter<CandyDate>(); // Emitted when user changed the header's value
  @Output() readonly selectDate = new EventEmitter<CandyDate>(); // Emitted when the date is selected by click the date panel
  
  prefixCls: string = PREFIX_CLASS;
  activeDate: CandyDate = new CandyDate();

  state = {
    showTimePicker: false,
    timePickerTitle: '',
    value: this.value,
    startValue: this.startValue,
    endValue: this.endValue,
    inputValue: this.inputValue,
    disConfirmBtn: false,
    activeDate: this.activeDate,
    clientHight: 0
  }

  props: CalendarPropsType =  {
      mode: this.mode,
      isRange: this.isRange,
      showTime: this.showTime,
      timeOptions: this.timeOptions,
      showClean: this.showClean,
      showClose: this.showClose,
      showWeek: this.showWeek
  };
    get showClean() {
    return this.mode === 'date';
  }

  get showClose() {
    return !this.showClean;
  }

  get title() {
    return `选择${DateTypeTitle[this.mode]}`;
  }

  get showWeek() {
    return this.mode === 'date';
  }

  constructor(public datePickerService: NgxDatePickerMobileService, private options: DatePickerOptions, private overlayRef: OverlayRef) {};

  ngOnInit(): void {
   
    
    this.initValue();
    console.log("this.", this.options)
  }


  getActiveDate(): CandyDate {
    if (this.isRange) {
      return (this.inputValue as CandyDate[])[0]
    } else {
      return this.datePickerService.activeDate as CandyDate;
    }
  }

  onSelectDate(date: CandyDate | Date): void {
    const value = date instanceof CandyDate ? date : new CandyDate(date);
    const timeValue = this.timeOptions && this.timeOptions.nzDefaultOpenValue;

    // Display timeValue when value is null
    if (!this.value && timeValue) {
      value.setHms(timeValue.getHours(), timeValue.getMinutes(), timeValue.getSeconds());
    }

    this.selectDate.emit(value);

    console.log("selectedValue: ", value)
    const newState = this.handleSelectDate(value, false, {startValue: this.state.startValue, endValue: this.state.endValue}, this.props);
   
    this.state = {
      ...this.state,
      ...newState
    }
    console.log("newState: ", newState)
}

  setState() {

  }

  initValue() {
    this.value = this.options.value as Date;
    this.startValue = this.options.startValue as Date;
    this.endValue = this.options.endValue as Date;
    this.isRange = this.options.isRange;
    this.showTime = this.options.showTime;
    this.datePickerService.isRange = this.isRange;
    const value = this.isRange ? [this.startValue, this.endValue] : this.value;
    this.inputValue = this.datePickerService.makeValue(value) as CandyDate[] ;
    this.activeDate = this.getActiveDate();
    this.mode = this.options.mode;
    this.state = {
      ...this.state,
      showTimePicker: false,
      timePickerTitle: '',
      value: this.value,
      startValue: this.startValue,
      endValue: this.endValue,
      inputValue: this.inputValue,
      disConfirmBtn: false,
      activeDate: this.activeDate,
      clientHight: 0
    }

    this.props = {
      ...this.props,
      mode: this.mode,
      showWeek: this.showWeek,
      showTime: this.showTime,
      isRange: this.options.isRange,
      maxDate: this.options.maxDate,
      minDate: this.options.minDate,
    }
  }

  updateValue() {

  }

  resetValue() {

  }

  onClose() {
    this.overlayRef.detach();
  }
  handleSelectDate(
    date: CandyDate,
    useDateTime = false,
    oldState: { startValue?: Date; endValue?: Date } = {},
    props = this.props
  ) {
    if (!date) {
      return {} as CalendarStateType;
    }
    let newState = {} as CalendarStateType;
    const { mode, isRange, showTime, pickTime, defaultTimeValue } = props;
    const { startValue, endValue } = oldState;
    const newDate = date.nativeDate;



    // switch (type) {
    //   case 'one':
    //     newState = {
    //       ...newState,
    //       startDate: newDate,
    //       disConfirmBtn: false
    //     };
    //     if (pickTime) {
    //       newState = {
    //         ...newState,
    //         timePickerTitle: locale.selectTime,
    //         showTimePicker: true
    //       };
    //     }
    //     break;

    //   case 'range':
    //     if (!startDate || endDate) {
    //       newState = {
    //         ...newState,
    //         startDate: newDate,
    //         endDate: undefined,
    //         disConfirmBtn: true
    //       };
    //       if (pickTime) {
    //         newState = {
    //           ...newState,
    //           timePickerTitle: locale.selectStartTime,
    //           showTimePicker: true
    //         };
    //       }
    //     } else {
    //       newState = {
    //         ...newState,
    //         timePickerTitle:
    //           +newDate >= +startDate || this.isSameDate(startDate, newDate)
    //             ? locale.selectEndTime
    //             : locale.selectStartTime,
    //         disConfirmBtn: false,
    //         endDate:
    //           pickTime && !useDateTime && (+newDate >= +startDate || this.isSameDate(startDate, newDate))
    //             ? new Date(+mergeDateTime(newDate, startDate) + 3600000)
    //             : newDate
    //       };
    //     }
    //     break;
    // }

    if (!isRange) {
      newState = {
        ...newState,
        startValue: newDate,
        disConfirmBtn: false
      };

      if (showTime) {
        newState = {
          ...newState,
          timePickerTitle: '选择时间',
          showTimePicker: true
        };
      }
    } else {
      if (!startValue || endValue) {
        newState = {
          ...newState,
          startValue: newDate,
          endValue: undefined as unknown as Date,
          inputValue: [date],
          disConfirmBtn: true
        };
        if (showTime) {
          newState = {
            ...newState,
            timePickerTitle: '选择开始时间',
            showTimePicker: true
          };
        }
       } else {
          newState = {
            ...newState,
            timePickerTitle:
              +newDate >= (+new Date(startValue as Date)) || date.isSameDay(new CandyDate(startValue))   
                ? '选择结束时间'
                : '选择开始时间',
            disConfirmBtn: false,
            endValue: showTime && (newDate >= new Date(startValue as Date) || date.isSameDay(new CandyDate(startValue))  )
                        ? new Date(date.nativeDate.getMilliseconds() + 3600000)
                        : newDate,
            inputValue: [new CandyDate(startValue), date],
          };
    }
  }
  
  // newState.inputValue = getInputValue(this.mode, newState.startValue, newState.endValue);

    // this.writeModelData(date)

  return newState;
}

onTimeChange(time: Array<number>) {

const { startValue, endValue } = this.state;
if (endValue) {
  this.state.endValue = new CandyDate(endValue).setHms(time[0], time[1], time[2]).nativeDate;
} else if (startValue) {
  this.state.startValue = new CandyDate(startValue).setHms(time[0], time[1], time[2]).nativeDate;
}
}

onClean() {
  // 清除数据做延迟，否则同步刷新数据导致报错
  setTimeout(() => {
    this.state = {
      ...this.state,
      ...{ startValue: undefined as unknown as Date, endValue: undefined as unknown as Date, showTimePicker: false,  inputValue: [] }
    };
    if (this.props.onClear) {
      this.props.onClear();
    }
  }, 0);
}


onTriggerConfirm() {
  const { startValue, endValue } = this.state;
  const { onConfirm } = this.options;
  if (startValue && endValue && +startValue > +endValue) {
    this.onClose();
    return onConfirm && onConfirm.emit({ startValue: endValue, endValue: startValue });
  }
  if (onConfirm) {
   onConfirm.emit({ startValue, endValue });
  }
  this.onClose();
}


}
