import { TemplateRef } from "@angular/core";

export type DisabledDateFn = (d: Date) => boolean;

export type DisabledTimePartial = 'start' | 'end';

export type DateMode = 'decade' | 'year' | 'month' | 'week' | 'date' | 'time' | 'quarter';

export type RangePartType = 'left' | 'right';

export type CompatibleDate = Date | Date[];
export type DisabledTimeFn = (current: Date | Date[], partial?: DisabledTimePartial) => DisabledTimeConfig | undefined;

export interface DisabledTimeConfig {
  nzDisabledHours(): number[];
  nzDisabledMinutes(hour: number): number[];
  nzDisabledSeconds(hour: number, minute: number): number[];
}

export interface SupportTimeOptions {
  nzFormat?: string;
  nzHourStep?: number;
  nzMinuteStep?: number;
  nzSecondStep?: number;
  nzDisabledHours?(): number[];
  nzDisabledMinutes?(hour: number): number[];
  nzDisabledSeconds?(hour: number, minute: number): number[];
  nzHideDisabledOptions?: boolean;
  nzDefaultOpenValue?: Date;
  nzAddOn?: TemplateRef<void>;
  nzUse12Hours?: boolean;
}

export interface PresetRanges {
  [key: string]: Date[] | (() => Date[]);
}

export interface TimePickerModel {
  label: string;
  value: any;
  children: Array<TimePickerModel>
}