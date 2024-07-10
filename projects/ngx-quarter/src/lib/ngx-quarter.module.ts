import { NgModule, LOCALE_ID } from '@angular/core';
import { NzFormItemFeedbackIconComponent } from './components/form-item-feedback-icon/form-item-feedback-icon.component';
import { DateRangePopupComponent } from './components/date-range-popup/date-range-popup.component';
import { NgxQuarterComponent } from './ngx-quarter.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzStringTemplateOutletDirective } from './directives/string_template_outlet.directive';
import { InnerPopupComponent } from './components/inner-popup/inner-popup.component';
import { LibPackerModule } from './components/lib/lib-packer.module';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import zh from '@angular/common/locales/zh';
import { en_US, NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { CalendarFooterComponent } from './components/calendar-footer/calendar-footer.component';


// import { NzI18nModule } from './i18n';
registerLocaleData(zh);
@NgModule({
  declarations: [
    NzStringTemplateOutletDirective,
    CalendarFooterComponent,
    NzFormItemFeedbackIconComponent,
    InnerPopupComponent,
    DateRangePopupComponent,
    NgxQuarterComponent,
    
  ],
  providers : [  { provide: LOCALE_ID, useValue: 'zh-CN' }], // 设置默认语言为简体中文],
  imports: [
    CommonModule,FormsModule, ReactiveFormsModule,
    LibPackerModule,
    SharedModule
  ],
  exports: [
    NgxQuarterComponent
  ]
})
export class NgxQuarterModule { }
