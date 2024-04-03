import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

import { InputBoolean } from 'ng-zorro-antd/core/util';

import { generateColor } from '../utils/util';
import { NzColorPickerFormatType } from '../types';
import { ColorFormatForm } from '../interfaces/type';

@Component({
  selector: 'nz-color-format',
  exportAs: 'NzColorFormat',
  changeDetection: ChangeDetectionStrategy.OnPush,

  // imports: [ReactiveFormsModule, NzSelectModule, NzInputDirective, NzInputGroupComponent, NzInputNumberComponent],
  templateUrl: './color-format.component.html'
})
export class NzColorFormatComponent implements OnChanges, OnInit, OnDestroy {
  @Input() format: NzColorPickerFormatType | null = null;
  @Input() colorValue: string = '';
  @Input() clearColor: boolean = false;
  @Input() @InputBoolean() nzDisabledAlpha: boolean = false;
  @Input() @InputBoolean() nzDisabledFormat: boolean = false;

  @Output() readonly formatChange = new EventEmitter<{ color: string; format: NzColorPickerFormatType }>();
  @Output() readonly nzOnFormatChange = new EventEmitter<NzColorPickerFormatType>();

  private destroy$ = new Subject<void>();

  validatorFn(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const REGEXP = /^[0-9a-fA-F]{6}$/;
      if (!control.value) {
        return { error: true };
      } else if (!REGEXP.test(control.value)) {
        return { error: true };
      }
      return null;
    };
  }

  validateForm: FormGroup;

  formatterPercent = (value: number): string => `${value} %`;
  parserPercent = (value: string): string => value.replace(' %', '');

  constructor(private formBuilder: FormBuilder) {
    this.validateForm = this.formBuilder.group({
      isFormat: this.formBuilder.control('hex'),
      hex: this.formBuilder.control('1677FF', this.validatorFn()),
      hsbH: 215,
      hsbS: 91,
      hsbB: 100,
      rgbR: 22,
      rgbG: 119,
      rgbB: 255,
      roundA: 100
    });
  }

  ngOnInit(): void {
    this.validateForm.valueChanges
      .pipe(
        filter(() => this.validateForm.valid),
        debounceTime(200),
        takeUntil(this.destroy$)
      )
      .subscribe((value: ColorFormatForm) => {
        let color = '';
        switch (value.isFormat) {
          case 'hsb':
            color = generateColor({
              h: Number(value.hsbH),
              s: Number(value.hsbS) / 100,
              b: Number(value.hsbB) / 100,
              a: Number(value.roundA) / 100
            }).toHsbString();
            break;
          case 'rgb':
            color = generateColor({
              r: Number(value.rgbR),
              g: Number(value.rgbG),
              b: Number(value.rgbB),
              a: Number(value.roundA) / 100
            }).toRgbString();
            break;
          default:
            const hex = generateColor(value.hex as NzColorPickerFormatType);
            const hexColor = generateColor({
              r: hex.r,
              g: hex.g,
              b: hex.b,
              a: Number(value.roundA) / 100
            });
            color = hexColor.getAlpha() < 1 ? hexColor.toHex8String() : hexColor.toHexString();
            break;
        }
        this.formatChange.emit({ color, format: value.isFormat || this.format || 'hex' });
      });

    this.validateForm
      .get('isFormat')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: NzColorPickerFormatType) => {
        this.nzOnFormatChange.emit(value as NzColorPickerFormatType);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { colorValue, format, clearColor } = changes;
    if (colorValue) {
      const colorValue = {
        hex: generateColor(this.colorValue).toHex(),
        hsbH: Math.round(generateColor(this.colorValue).toHsb().h),
        hsbS: Math.round(generateColor(this.colorValue).toHsb().s * 100),
        hsbB: Math.round(generateColor(this.colorValue).toHsb().b * 100),
        rgbR: Math.round(generateColor(this.colorValue).r),
        rgbG: Math.round(generateColor(this.colorValue).g),
        rgbB: Math.round(generateColor(this.colorValue).b),
        roundA: Math.round(generateColor(this.colorValue).roundA * 100)
      };
      this.validateForm.patchValue(colorValue);
    }

    if (format && this.format) {
      this.validateForm.get('isFormat')?.patchValue(this.format);
    }

    if (clearColor && this.clearColor) {
      this.validateForm.get('roundA')?.patchValue(0);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}