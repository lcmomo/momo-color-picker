
import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

import { CandyDate, cloneDate, CompatibleValue, NormalizedMode, normalizeRangeValue } from 'ng-zorro-antd/core/time';

import { CompatibleDate, NzDateMode, RangePartType } from '../type/standard-types';

@Injectable()
export class QuarterPickerService implements OnDestroy {
  initialValue!: CompatibleValue;
  value!: CompatibleValue;
  activeDate?: CompatibleValue;
  activeInput: RangePartType = 'left';
  arrowLeft: number = 0;
  isRange = false;

  valueChange$ = new ReplaySubject<CompatibleValue>(1);
  emitValue$ = new Subject<void>();
  inputPartChange$ = new Subject<RangePartType>();

  initValue(reset: boolean = false): void {
    if (reset) {
      this.initialValue = this.isRange ? [] : null;
    }

    this.setValue(this.initialValue);
  }

  hasValue(value: CompatibleValue = this.value): boolean {
    if (Array.isArray(value)) {
      return !!value[0] || !!value[1];
    } else {
      return !!value;
    }
  }

  makeValue(value?: CompatibleDate): CompatibleValue {
    if (this.isRange) {
      return value ? (value as Date[]).map(val => new CandyDate(val)) : [];
    } else {
      return value ? new CandyDate(value as Date) : null;
    }
  }

  setActiveDate(value: CompatibleValue, hasTimePicker: boolean = false, mode: NormalizedMode = 'month'): void {
    const parentPanels: { [key in NzDateMode]?: NormalizedMode } = {
      date: 'month',
      month: 'year',
      year: 'decade'
    };
    if (this.isRange) {
      this.activeDate = normalizeRangeValue(value as CandyDate[], hasTimePicker, parentPanels[mode], this.activeInput);
    } else {
      this.activeDate = cloneDate(value);
    }
  }

  setValue(value: CompatibleValue): void {
    this.value = value;
    this.valueChange$.next(this.value);
  }

  getActiveIndex(part: RangePartType = this.activeInput): number {
    return { left: 0, right: 1 }[part];
  }

  ngOnDestroy(): void {
    this.valueChange$.complete();
    this.emitValue$.complete();
    this.inputPartChange$.complete();
  }
}
