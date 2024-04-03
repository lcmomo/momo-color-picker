import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { NzPopoverModule } from "ng-zorro-antd/popover";
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NzColorPickerModule } from '@geominfo/color-picker';
import { GeometryColorPickerModule,NzColorPickerComponent, NzColorFormatComponent,NzColorBlockComponent } from '../../../lib/src/index';
import { AppComponent } from './app.component';
// import { NzColorPickerComponent } from '../../../lib/src/color-picker/color-picker.component';
// import { NgAntdColorPickerComponent } from '../../../lib/src/color-picker/color-picker/ng-antd-color-picker.component';
// import { BaseGradientComponent, BaseHandlerComponent, BasePaletteComponent, BasePickerComponent, BaseSliderComponent } from '../../../lib/src/color-picker/components';
// import { NzColorFormatComponent } from '../../../lib/src/color-picker/color-format/color-format.component';
// import { NzColorBlockComponent } from '../../../lib/src/color-picker/color-block/color-block.component';
// import { ZORRO_MODULES } from '../../../lib/src/color-picker/nz-antd.module';
// import { NgAntdColorBlockComponent } from '../../../lib/src/color-picker/color-block/ng-antd-color-block/ng-antd-color-block.component';

// const COMPONENTS = [
//   BaseGradientComponent,
//   BaseHandlerComponent,
//   BasePaletteComponent,
//   BasePickerComponent,
//   BaseSliderComponent
// ]

@NgModule({
  declarations: [
    // ...COMPONENTS,
    // NgAntdColorBlockComponent,
    // NgAntdColorPickerComponent,
    // NzColorPickerComponent,
    // NzColorFormatComponent,
    // NzColorBlockComponent,

    AppComponent
  ],
  imports: [
    // ...ZORRO_MODULES,
    BrowserModule,
    // NzPopoverModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    GeometryColorPickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
