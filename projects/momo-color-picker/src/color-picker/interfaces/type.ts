import { NzColorPickerFormatType } from '../types';
import type { Color } from './color';

export interface HSB {
  h: number | string;
  s: number | string;
  b: number | string;
}

export interface RGB {
  r: number | string;
  g: number | string;
  b: number | string;
}

export interface HSBA extends HSB {
  a: number;
}

export interface RGBA extends RGB {
  a: number;
}

export type ColorGenInput<T = Color> = string | number | RGB | RGBA | HSB | HSBA | T;

export type HsbaColorType = 'hue' | 'alpha';

export interface TransformOffset {
  x: number;
  y: number;
}

export interface BaseColorPickerProps {
  color?: Color;
  prefixCls?: string;
  disabled?: boolean;
  onChange?: (color: Color, type?: HsbaColorType) => void;
  onChangeComplete?: (type?: HsbaColorType) => void;
}

export type ColorValue = ColorGenInput | undefined;

export interface ColorPickerProps extends BaseColorPickerProps {
  value?: ColorGenInput;
  defaultValue?: ColorGenInput;
  className?: string;
  // style?: CSSProperties;
  style?: string;
  /** Get panel element  */
  panelRender?: (panel: Element) => Element;
  /** Disabled alpha selection */
  disabledAlpha?: boolean;
}

export interface ColorFormatForm {
  isFormat: NzColorPickerFormatType,
  hex?: string,
  hsbH?: number,
  hsbS?: number,
  hsbB?: number,
  rgbR?: number,
  rgbG?: number,
  rgbB?: number,
  roundA?: number
}