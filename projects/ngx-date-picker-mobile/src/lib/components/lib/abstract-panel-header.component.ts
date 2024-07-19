import { Component, Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PanelSelector } from './interface';
import { CandyDate } from '../../utils/candy-date';
import { NzCalendarI18nInterface } from '../../i18n';
import { DateMode } from '../../type';

@Directive()
export abstract class AbstractPanelHeader implements OnInit, OnChanges {
  @Input() mode: DateMode = 'date';
  @Input() showClean: boolean = false;
  @Input() showClose: boolean = false;
  @Input() title: string = '';
  @Input() value!: CandyDate;
  @Input() locale!: NzCalendarI18nInterface;
  @Input() showWeek: boolean = false;

  @Output() valueChange = new EventEmitter<CandyDate>();
  @Output() close = new EventEmitter();
  @Output() clean = new EventEmitter();
  prefixCls: string = 'ngx-mobile-picker-panel';
  selectors: PanelSelector[] = [];

  get showYearTitle(): boolean {
    return this.mode === 'week' || this.showWeek;
  }

  abstract getSelectors(): PanelSelector[];
  constructor() { }

  onClose() {
    this.close.emit();
  }
  onClean() {
    this.clean.emit();
  }
  ngOnInit(): void {
    if (!this.value) {
      this.value = new CandyDate(); // Show today by default
    }
    this.selectors = this.getSelectors();
  }
  private render(): void {
    if (this.value) {
      this.selectors = this.getSelectors();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] || changes['locale']) {
      this.render();
    }
  }

  superPrevious(): void {
    this.changeValue(this.value.addYears(-1));
  }
  superNext(): void {
    this.changeValue(this.value.addYears(1));
  }


  changeValue(value: CandyDate): void {
    if (this.value !== value) {
      this.value = value;
      this.valueChange.emit(this.value);
      this.render();
    }
  }


}
