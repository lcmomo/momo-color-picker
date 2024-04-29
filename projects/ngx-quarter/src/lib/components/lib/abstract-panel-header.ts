/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CandyDate } from 'ng-zorro-antd/core/time';
import { NzCalendarI18nInterface } from 'ng-zorro-antd/i18n';
import { NzDateMode } from '../../type/standard-types';
import { PanelSelector } from './interface';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class AbstractPanelHeader implements OnInit, OnChanges {
  prefixCls: string = `ngx-picker-header`;
  selectors: PanelSelector[] = [];

  @Input() value!: CandyDate;
  @Input() locale!: NzCalendarI18nInterface;
  @Input() showSuperPreBtn: boolean = true;
  @Input() showSuperNextBtn: boolean = true;
  @Input() showPreBtn: boolean = true;
  @Input() showNextBtn: boolean = true;

  @Output() readonly panelModeChange = new EventEmitter<NzDateMode>();
  @Output() readonly valueChange = new EventEmitter<CandyDate>();

  abstract getSelectors(): PanelSelector[];

  superPreviousTitle(): string {
    // return this.locale.previousYear;
    return '上一年 (Control键加左方向键)';
  }

  previousTitle(): string {
    // return this.locale.previousMonth;
    return '上个月 (翻页上键)'
  }

  superNextTitle(): string {
    // return this.locale.nextYear;
    return '下一年 (Control键加右方向键)';
  }

  nextTitle(): string {
    // return this.locale.nextMonth;
    return '下个月 (翻页下键)'
  }

  superPrevious(): void {
    this.changeValue(this.value.addYears(-1));
  }

  superNext(): void {
    this.changeValue(this.value.addYears(1));
  }

  previous(): void {
    this.changeValue(this.value.addMonths(-1));
  }

  next(): void {
    this.changeValue(this.value.addMonths(1));
  }

  changeValue(value: CandyDate): void {
    if (this.value !== value) {
      this.value = value;
      this.valueChange.emit(this.value);
      this.render();
    }
  }

  changeMode(mode: NzDateMode): void {
    this.panelModeChange.emit(mode);
  }

  private render(): void {
    if (this.value) {
      this.selectors = this.getSelectors();
    }
  }

  ngOnInit(): void {
    if (!this.value) {
      this.value = new CandyDate(); // Show today by default
    }
    this.selectors = this.getSelectors();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] || changes['locale']) {
      this.render();
    }
  }
}
