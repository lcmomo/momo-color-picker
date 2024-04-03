
 import {
   ChangeDetectionStrategy,
   ChangeDetectorRef,
   Component,
   EventEmitter,
   forwardRef,
   Input,
   OnChanges,
   OnDestroy,
   OnInit,
   Output,
   SimpleChanges,
   TemplateRef,
   ViewEncapsulation
 } from '@angular/core';
 import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
 import { Subject } from 'rxjs';
 import { takeUntil } from 'rxjs/operators';
 
 import { BooleanInput, NzSafeAny, NzSizeLDSType } from 'ng-zorro-antd/core/types';
 import { InputBoolean, isNonEmptyString, isTemplateRef } from 'ng-zorro-antd/core/util';
 
 import { defaultColor, generateColor } from './utils/util';
 import { NzColor, NzColorPickerFormatType, NzColorPickerTriggerType } from './types';
import { Color } from './interfaces/color';
import { ColorGenInput } from './interfaces/type';
 
 @Component({
   selector: 'geometry-color-picker',
   exportAs: 'GeometryColorPicker',
   changeDetection: ChangeDetectionStrategy.OnPush,
   templateUrl: './color-picker.component.html',
   styleUrls: ['./color-picker.component.less'],
   host: {
     class: 'ant-color-picker-inline',
     '[class.ant-color-picker-disabled]': `nzDisabled`
   },
   encapsulation: ViewEncapsulation.Emulated,
   providers: [
     {
       provide: NG_VALUE_ACCESSOR,
       useExisting: forwardRef(() => NzColorPickerComponent),
       multi: true
     }
   ]
 })
 export class NzColorPickerComponent implements OnInit, OnChanges, ControlValueAccessor, OnDestroy {
   static ngAcceptInputType_nzShowText: BooleanInput;
   static ngAcceptInputType_nzOpen: BooleanInput;
   static ngAcceptInputType_nzAllowClear: BooleanInput;
   static ngAcceptInputType_nzDisabled: BooleanInput;
   static ngAcceptInputType_nzDisabledAlpha: BooleanInput;
   static ngAcceptInputType_zDisabledFormat: BooleanInput;
   @Input() nzFormat: NzColorPickerFormatType | null = null;
   @Input() nzValue: string | NzColor = '';
   @Input() nzSize: NzSizeLDSType = 'default';
   @Input() nzDefaultValue: string | NzColor = '';
   @Input() nzTrigger: NzColorPickerTriggerType = 'click';
   @Input() nzTitle: TemplateRef<void> | string = '';
   @Input() nzFlipFlop: TemplateRef<void> | null = null;
   @Input() @InputBoolean() nzShowText: boolean = false;
   @Input() @InputBoolean() nzOpen: boolean = false;
   @Input() @InputBoolean() nzAllowClear: boolean = false;
   @Input() @InputBoolean() nzDisabled: boolean = false;
   @Input() @InputBoolean() nzDisabledAlpha: boolean = false;
   @Input() @InputBoolean() nzDisabledFormat: boolean = false;
   @Output() readonly nzOnChange = new EventEmitter<{ color: NzColor; format: string }>();
   @Output() readonly nzOnFormatChange = new EventEmitter<NzColorPickerFormatType>();
   @Output() readonly nzOnClear = new EventEmitter<boolean>();
   @Output() readonly nzOnOpenChange = new EventEmitter<boolean>();
 
   protected readonly isTemplateRef = isTemplateRef;
   protected readonly isNonEmptyString = isNonEmptyString;
   private destroy$ = new Subject<void>();
   private isNzDisableFirstChange: boolean = true;
   blockColor: string = '#1677ff';
   clearColor: boolean = false;
   showText: string = defaultColor.toHexString();
 
   constructor(
     private formBuilder: FormBuilder,
     private cdr: ChangeDetectorRef
   ) {}
 
   formControl = this.formBuilder.control('');
 
   onChange: (value: string) => void = () => {};
 
   writeValue(value: string): void {
     this.nzValue = value;
     this.getBlockColor();
     this.formControl.patchValue(value);
   }
 
   registerOnChange(fn: NzSafeAny): void {
     this.onChange = fn;
   }
 
   registerOnTouched(): void {}
 
   setDisabledState(isDisabled: boolean): void {
     this.nzDisabled = (this.isNzDisableFirstChange && this.nzDisabled) || isDisabled;
     this.isNzDisableFirstChange = false;
     this.cdr.markForCheck();
   }
 
   ngOnInit(): void {
     this.getBlockColor();
     this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: ColorGenInput<Color>) => {
       if (!!value) {
         let color: string = value as string;
         if (this.nzFormat === 'hex') {
           color =
             generateColor(value).getAlpha() < 1
               ? generateColor(value).toHex8String()
               : generateColor(value).toHexString();
         } else if (this.nzFormat === 'hsb') {
           color = generateColor(value).toHsbString();
         } else if (this.nzFormat === 'rgb') {
           color = generateColor(value).toRgbString();
         }
         this.showText = color as string;
         this.onChange(color);
         this.cdr.markForCheck();
       }
     });
   }
 
   ngOnChanges(changes: SimpleChanges): void {
     const { nzValue, nzDefaultValue } = changes;
     if (nzValue || nzDefaultValue) {
       this.getBlockColor();
     }
   }
 
   clearColorHandle(): void {
     this.clearColor = true;
     this.nzOnClear.emit(true);
     this.cdr.markForCheck();
   }
 
   getBlockColor(): void {
     if (!!this.nzValue) {
       this.blockColor = generateColor(this.nzValue).toRgbString();
     } else if (!!this.nzDefaultValue) {
       this.blockColor = generateColor(this.nzDefaultValue).toRgbString();
     } else {
       this.blockColor = defaultColor.toHexString();
     }
   }
 
   colorChange(value: any): void {
     this.blockColor = value.color.getAlpha() < 1 ? value.color.toHex8String() : value.color.toHexString();
     this.clearColor = false;
     this.cdr.markForCheck();
   }
 
   formatChange(value: { color: string; format: NzColorPickerFormatType }): void {
     this.nzValue = value.color;
     this.clearColor = false;
     this.getBlockColor();
     this.nzOnChange.emit({ color: generateColor(value.color), format: value.format });
     this.formControl.patchValue(value.color);
     this.cdr.markForCheck();
   }
 
   ngOnDestroy(): void {
     this.destroy$.next();
     this.destroy$.complete();
   }
 
   get isNzTitleNonEmptyString(): boolean {
     return isNonEmptyString(this.nzTitle);
   }
 
   get isNzTitleTemplateRef(): boolean {
     return isTemplateRef(this.nzTitle);
   }
 }