import {EventEmitter, Injectable} from "@angular/core";
import { DateMode } from "../type";

@Injectable()
export class DatePickerOptions {

  isRange: boolean = false;

  value: Date | null = new Date;

  startValue: Date | null = new Date();

  endValue: Date | null = new Date();

  mode: DateMode = 'date';
  showTime: boolean = false;
  maxDate: Date = new Date();
  minDate: Date = new Date(1900, 0, 1);

  onConfirm: EventEmitter<any> = new EventEmitter();

}
