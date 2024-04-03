import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MomoColorPickerModule } from 'momo-color-picker';
// import { MomoColorPickerModule,NzColorPickerComponent, NzColorFormatComponent,NzColorBlockComponent } from '../../../lib/src/index';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // ...ZORRO_MODULES,
    BrowserModule,
    // NzPopoverModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MomoColorPickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
