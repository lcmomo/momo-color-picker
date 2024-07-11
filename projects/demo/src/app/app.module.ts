import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MomoColorPickerModule } from 'momo-color-picker';
import { AppComponent } from './app.component';
import {  NgxQuarterModule } from '../../../ngx-quarter/src/public-api'; 


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MomoColorPickerModule,
    NgxQuarterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
