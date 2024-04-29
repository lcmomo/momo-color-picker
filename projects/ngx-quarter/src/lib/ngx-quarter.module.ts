import { NgModule } from '@angular/core';
import { NzFormItemFeedbackIconComponent } from './components/form-item-feedback-icon/form-item-feedback-icon.component';
import { DateRangePopupComponent } from './components/date-range-popup/date-range-popup.component';
import { NgxQuarterComponent } from './ngx-quarter.component';
import { ZORRO_MODULES, CDK_MODULES } from './shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzStringTemplateOutletDirective } from './directives/string_template_outlet.directive';
import { InnerPopupComponent } from './components/inner-popup/inner-popup.component';
import { LibPackerModule } from './components/lib/lib-packer.module';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import zh from '@angular/common/locales/zh';
import { en_US, NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
@NgModule({
  declarations: [
    NzStringTemplateOutletDirective,
    NzFormItemFeedbackIconComponent,
    InnerPopupComponent,
    DateRangePopupComponent,
    NgxQuarterComponent,
    
  ],
  providers   : [{
    provide: NZ_I18N,
    useFactory: (localId: string) => {
      switch (localId) {
        case 'en':
          return en_US;
        /** 与 angular.json i18n/locales 配置一致 **/
        case 'zh':
          return zh_CN;
        default:
          return en_US;
      }
    },
    deps: [LOCALE_ID]
  }],
  imports: [
    CommonModule,FormsModule, ReactiveFormsModule,
    LibPackerModule,
    ...ZORRO_MODULES,
    ...CDK_MODULES
  ],
  exports: [
    NgxQuarterComponent
  ]
})
export class NgxQuarterModule { }
