import { Directive, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { DateMode } from '../type';
import { NzDatePickerI18nInterface, en_US, zh_CN } from '../i18n';
import { Subject } from 'rxjs';


export const LANGUAGES: { [key: string]: any } = {
  en_US,
  zh_CN
  };
@Directive()
export abstract class DatePickerBase {
  @Input() flipFlop: TemplateRef<any> | null = null;
  @Input() isInline: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() nzBackdrop = false;
  @Input() nzOpen?: boolean;
  @Input() isRange: boolean = false;
  @Input() value: Date = new Date();
  @Input() startValue!: Date
  @Input() endValue!: Date; 
  @Input() mode: DateMode = 'date';
  @Input() showTime: boolean = false;
  @Input() showToday: boolean = false;
  @Input() showNow: boolean = false;
  @Input() hasTimePicker: boolean = false;
  @Input() format: string = 'yyyy-MM-dd';
  @Input() placeHolder: string = '';
  @Input() locale!: NzDatePickerI18nInterface;
  @Input() minDate: Date = new Date(Date.now() - 5184000000);
  @Input() maxDate: Date =  new Date(Date.now() + 31536000000);
  

  @Output() onConfirm = new EventEmitter<any>();
  customSeriesColor: string = 'rgb(19, 180, 188)';
  destroyed$: Subject<void> = new Subject();
  LANGUAGES: { [key: string]: any } = LANGUAGES;

  inputValue!: any;
}