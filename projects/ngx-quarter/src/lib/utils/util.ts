
import { CandyDate } from 'ng-zorro-antd/core/time';

import { DisabledDateFn, DisabledTimeConfig, DisabledTimeFn } from '../type/standard-types';

export const PREFIX_CLASS = 'ngx-picker';

const defaultDisabledTime: DisabledTimeConfig = {
  nzDisabledHours(): number[] {
    return [];
  },
  nzDisabledMinutes(): number[] {
    return [];
  },
  nzDisabledSeconds(): number[] {
    return [];
  }
};

export function getTimeConfig(value: CandyDate, disabledTime?: DisabledTimeFn): DisabledTimeConfig {
  let disabledTimeConfig = disabledTime ? disabledTime(value && value.nativeDate) : ({} as DisabledTimeConfig);
  disabledTimeConfig = {
    ...defaultDisabledTime,
    ...disabledTimeConfig
  };
  return disabledTimeConfig;
}

export function isTimeValidByConfig(value: CandyDate, disabledTimeConfig: DisabledTimeConfig): boolean {
  let invalidTime = false;
  if (value) {
    const hour = value.getHours();
    const minutes = value.getMinutes();
    const seconds = value.getSeconds();
    const disabledHours = disabledTimeConfig.nzDisabledHours();
    if (disabledHours.indexOf(hour) === -1) {
      const disabledMinutes = disabledTimeConfig.nzDisabledMinutes(hour);
      if (disabledMinutes.indexOf(minutes) === -1) {
        const disabledSeconds = disabledTimeConfig.nzDisabledSeconds(hour, minutes);
        invalidTime = disabledSeconds.indexOf(seconds) !== -1;
      } else {
        invalidTime = true;
      }
    } else {
      invalidTime = true;
    }
  }
  return !invalidTime;
}

export function isTimeValid(value: CandyDate, disabledTime: DisabledTimeFn): boolean {
  const disabledTimeConfig = getTimeConfig(value, disabledTime);
  return isTimeValidByConfig(value, disabledTimeConfig);
}

export function isAllowedDate(value: CandyDate, disabledDate?: DisabledDateFn, disabledTime?: DisabledTimeFn): boolean {
  if (!value) {
    return false;
  }
  if (disabledDate) {
    if (disabledDate(value.nativeDate)) {
      return false;
    }
  }
  if (disabledTime) {
    if (!isTimeValid(value, disabledTime)) {
      return false;
    }
  }
  return true;
}

import { NgClassInterface } from 'ng-zorro-antd/core/types';

export function getStatusClassNames(
  prefixCls: string,
  status?: string,
  hasFeedback?: boolean
): NgClassInterface {
  return {
    [`${prefixCls}-status-success`]: status === 'success',
    [`${prefixCls}-status-warning`]: status === 'warning',
    [`${prefixCls}-status-error`]: status === 'error',
    [`${prefixCls}-status-validating`]: status === 'validating',
    [`${prefixCls}-has-feedback`]: hasFeedback
  };
}
