import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MomoColorPickerModule } from 'momo-color-picker';
import { AppComponent } from './app.component';
import {  NgxQuarterModule } from '../../../ngx-quarter/src/public-api'; 
import { NgxDatePickerMobileModule } from '../../../ngx-date-picker-mobile/src/lib/ngx-date-picker-mobile.module';
import { DatePickerMobileDemoComponent } from './components/date-picker-mobile-demo/date-picker-mobile-demo.component';
import { NgZorroAntdModule} from './shared/shared-antd.module'
import {NgZorroAntdMobileModule} from 'ng-zorro-antd-mobile'

@NgModule({
  declarations: [
    AppComponent,
    DatePickerMobileDemoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MomoColorPickerModule,
    NgxDatePickerMobileModule,
    NgxQuarterModule,
    NgZorroAntdModule,
    NgZorroAntdMobileModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
