/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { formatDate } from '@angular/common';
import { Inject, Injectable, Optional, InjectFlags, inject } from '@angular/core';

import { format as fnsFormat, getISOWeek as fnsGetISOWeek, getQuarter, parse as fnsParse } from 'date-fns';

import { WeekDayIndex, ɵNgTimeParser } from 'ng-zorro-antd/core/time';
import { zh_CN } from 'ng-zorro-antd/i18n';

// import { NZ_DATE_CONFIG, NzDateConfig, mergeDateConfig } from './date-config';



/**
 * Abstract DateHelperService(Token via Class)
 * Compatibility: compact for original usage by default which using DatePipe
 */
@Injectable({
  providedIn: 'root',
})
export class DateHelperService {
  protected config: Record<string, any> = {};

  constructor(
   
  ) {
  }

  getISOWeek(date: Date): number {
    return +this.format(date, 'w');
  }

  getFirstDayOfWeek(): WeekDayIndex {
    if (this.config['firstDayOfWeek'] === undefined) {
      const locale = 'zh-CN';
      return locale && ['zh-cn', 'zh-tw'].indexOf(locale.toLowerCase()) > -1 ? 1 : 0;
    }
    return this.config['firstDayOfWeek'];
  }

  format(date: Date | null, formatStr: string): string { 
    return date ? this.replaceQuarter(formatDate(date, formatStr, this.config['language']), date) : '';
   }

  parseDate(text: string): Date {
    return new Date(text);
  }

  parseTime(text: string, formatStr: string): Date {
    const parser = new ɵNgTimeParser(formatStr, 'zh_CN');
    return parser.toDate(text);
  }

  private replaceQuarter(dateStr: string, date: Date): string {
    const quarter = getQuarter(date).toString();
    const record: Record<string, string> = { Q: quarter, QQ: `0${quarter}`, QQQ: `Q${quarter}` };
    // Q Pattern format compatible with date-fns (quarter).
    return (
      dateStr
        // Match Q+ outside of brackets, then replace it with the specified quarterly format
        .replace(/Q+(?![^\[]*])/g, match => record[match] ?? quarter)
        // Match the Q+ surrounded by bracket, then remove bracket.
        .replace(/\[(Q+)]/g, '$1')
    );
  }
}
