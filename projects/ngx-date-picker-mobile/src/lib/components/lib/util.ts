
/**
 * Compatible translate the moment-like format pattern to angular's pattern
 * Why? For now, we need to support the existing language formats in AntD, and AntD uses the default temporal syntax.
 *
 * TODO: compare and complete all format patterns
 * Each format docs as below:
 *
 * @link https://momentjs.com/docs/#/displaying/format/
 * @link https://angular.io/api/common/DatePipe#description
 * @param format input format pattern
 */
export function transCompatFormat(format: string): string {
  return (
    format &&
    format
      .replace(/Y/g, 'y') // only support y, yy, yyy, yyyy
      .replace(/D/g, 'd')
  ); // d, dd represent of D, DD for momentjs, others are not support
}

export const FIRST_DAY_OF_WEEK = 0;
export const END_DAY_OF_WEEK = 6;
export const WEEK_COUNT_OF_YEAR = 52;
export const MONTH_COUNT_OF_YEAR = 12;