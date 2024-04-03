import { NgModule } from "@angular/core";

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
// import { NgAntdColorPickerModule } from "./color-picker/color-picker.module";
import { ZORRO_MODULES } from './nz-antd.module';
import { BaseGradientComponent, BaseHandlerComponent, BasePaletteComponent, BasePickerComponent, BaseSliderComponent } from './components';

import { NzColorPickerComponent } from './color-picker.component';

import { NgAntdColorPickerComponent } from "./color-picker/ng-antd-color-picker.component";
import { NzColorFormatComponent } from '../color-picker/color-format/color-format.component';
import { NzColorBlockComponent } from '../color-picker/color-block/color-block.component';
import { NgAntdColorBlockComponent } from '../color-picker/color-block/ng-antd-color-block/ng-antd-color-block.component';
const COMPONENTS = [
  BaseGradientComponent,
  BaseHandlerComponent,
  BasePaletteComponent,
  BasePickerComponent,
  BaseSliderComponent
]

@NgModule({
  declarations: [
    ...COMPONENTS,
    NgAntdColorPickerComponent,
    NzColorBlockComponent,
    NzColorFormatComponent,
    NzColorPickerComponent,
    NgAntdColorBlockComponent
   
   
  ],
  imports: [ CommonModule,FormsModule, ReactiveFormsModule,  ...ZORRO_MODULES],
  exports:[NzColorPickerComponent, ...ZORRO_MODULES]
})
export class GeometryColorPickerModule{}