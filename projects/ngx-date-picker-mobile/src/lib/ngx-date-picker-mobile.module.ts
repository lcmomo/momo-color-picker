import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import {
  OverlayModule 
} from '@angular/cdk/overlay';
import { NgxDatePickerMobileComponent } from './ngx-date-picker-mobile.component';
import { InnerFlipFlopComponent } from './components/inner-flip-flop/inner-flip-flop.component';
import { DatePopupComponent } from './components/date-popup/date-popup.component';
import { NgxDatePickerDirective } from './directives/app-date-picker.directives';
import { LibPickerModule } from './components/lib/lib.picker.module';
import zh from '@angular/common/locales/zh';

registerLocaleData(zh);
@NgModule({
  declarations: [
    DatePopupComponent,
    InnerFlipFlopComponent,
    NgxDatePickerMobileComponent,
    NgxDatePickerDirective,
    
  ],
  providers: [
      { provide: LOCALE_ID, useValue: 'zh-CN' },
    ],
  imports: [
    CommonModule,
    OverlayModule,
    LibPickerModule,
    
  ],
  exports: [
    NgxDatePickerMobileComponent,
    NgxDatePickerDirective,
    
  ]
})
export class NgxDatePickerMobileModule { }
