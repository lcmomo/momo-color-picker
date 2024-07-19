import { DateMode, SupportTimeOptions } from "../../type";
import { CandyDate } from "../../utils/candy-date";
export type SelectDateType = [Date, Date] | [Date];


export interface CalendarStateType {
  showTimePicker: boolean;
  timePickerTitle: string;
  activeDate: CandyDate;
  inputValue: Array<CandyDate | undefined>;
  startValue: Date;
  endValue: Date;
  value: Date;
  disConfirmBtn: boolean;
  clientHight: number;
}

export interface CalendarHeaderPropsType {
  title?: string;
  showClear?: boolean;
  onCancel?: () => void;
  onClear?: () => void;
  closeIcon?: any;
  clearIcon?: any;
}

export interface CalendarPropsType {
  mode: DateMode;
  isRange: boolean;
  showTime: boolean;
  showClean: boolean;
  showClose: boolean;
  showWeek: boolean;
  timeOptions?: SupportTimeOptions | null;
  maxDate?: Date;
  minDate?: Date;
  enterDirection?: 'horizontal' | 'vertical';
  onCancel?: () => void;
  onClear?: () => void;
  onConfirm?: (startDateTime?: Date, endDateTime?: Date) => void;
  pickTime?: boolean;
  prefixCls?: string;
  renderShortcut?: (select: (startDate?: Date, endDate?: Date) => void) => any;
  renderHeader?: (prop: CalendarHeaderPropsType) => any;
  showShortcut?: boolean;
  style?: any;
  title?: string;
  type?: 'one' | 'range';
  visible?: boolean;
  defaultValue?: SelectDateType;

  defaultDate?: Date;
  infiniteOpt?: boolean;
  initalMonths?: number;
  
  onSelectHasDisableDate?: (date: Date[]) => void;
  onSelect?: (date: Date, state?: [Date | undefined, Date | undefined]) => SelectDateType | void;
  rowSize?: 'normal' | 'xl';

  defaultTimeValue?: Date;
  timePickerPrefixCls?: string;
  timePickerPickerPrefixCls?: string;
}
