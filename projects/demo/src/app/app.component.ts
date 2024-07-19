import { Component, TemplateRef, ViewChild } from '@angular/core';
import { format } from 'date-fns';
import { NzDatePickerSizeType } from 'projects/ngx-quarter/src/public-api';
import { differenceInCalendarDays, endOfMonth } from 'date-fns';

import { DisabledTimeFn, DisabledTimePartial } from 'ng-zorro-antd/date-picker';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  @ViewChild('tplRender', { static: false }) dateRenderTemplate: TemplateRef<{$implicit: Record<string, unknown>}> | null = null;
  title = 'color-picker';
  color ="#666";
  tooltipConfig = {
    title: 'fff',
  };
  formatMap: Record<string, string> = {
    date: 'yyyy-MM-dd',
    time: 'HH:mm:ss',
    week: 'yyyy-ww',
    quarter: 'yyyy-[Q]Q',
    month: 'yyyy/MM',
    year: 'yyyy',
    dateTime: 'yyyy-MM-dd HH:mm:ss',
    
  }

  language = 'zh_CN';

  today = new Date();
  range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  ranges = { Today: [new Date(), new Date()], 'This Month': [new Date(), endOfMonth(new Date())] };


  datePickerConfig =  {
    isInline:false,
    mode: 'date',
    showTime: true,
    isRange: false,
    format: this.formatMap['dateTime'],
    size: 'default' as NzDatePickerSizeType,
    disabled: false,
    ranges: this.ranges,
    dateRender: this.dateRenderTemplate as TemplateRef<any>,
    footerRender: (): string => 'extra footer',
    disabledDate: (current: Date): boolean => differenceInCalendarDays(current, this.today) > 0,

      disabledDateTime: () => ({
        nzDisabledHours: () => this.range(0, 24).splice(4, 20),
        nzDisabledMinutes: () => this.range(30, 60),
        nzDisabledSeconds: () => [55, 56]
      }),
    
      disabledRangeTime:  (_value: any, type?: DisabledTimePartial) => {
        if (type === 'start') {
          return {
            nzDisabledHours: () => this.range(0, 60).splice(4, 20),
            nzDisabledMinutes: () => this.range(30, 60),
            nzDisabledSeconds: () => [55, 56]
          };
        }
        return {
          nzDisabledHours: () => this.range(0, 60).splice(20, 4),
          nzDisabledMinutes: () => this.range(0, 31),
          nzDisabledSeconds: () => [55, 56]
        };
      }
  }
  formattedDate:string = '';
  inputValue = new Date();
 
  changeColor(color: any) {
    console.log("color: ", this.color)
  }
 
  onDateChange(date: any) {
    console.log("date: ", date)
    // this.formatDate(dateValue, this.formatMap[mode]);
  }

  formatDate(date: Date, formatStr: string) {
    this.formattedDate = format(date, formatStr);
  }

  changeLanguage() {
    if (this.language === 'zh_CN') {
      this.language = 'en_US';
    } else {
      this.language = 'zh_CN';
    }
  }
}
