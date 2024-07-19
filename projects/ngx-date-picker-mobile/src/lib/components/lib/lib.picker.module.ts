import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { DateHeaderComponent } from "./date-header.component";

import { CommonModule } from "@angular/common";
import { NzI18nModule } from "../../i18n/nz-i18n.module";
import { DateBodyComponent } from "./date-body.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdMobileModule  } from "ng-zorro-antd-mobile";
import { QuarterHeaderComponent } from "./quarter-header.component";
import { QuarterBodyComponent } from "./quarter-body.component";


@NgModule({
  declarations: [
    DateHeaderComponent,
    DateBodyComponent,
    QuarterHeaderComponent,
    QuarterBodyComponent
  ],
  exports: [
    DateHeaderComponent,
    DateBodyComponent,
    QuarterHeaderComponent,
    QuarterBodyComponent
  ],
  imports: [
    CommonModule,
    NzI18nModule,
    NgZorroAntdMobileModule,
    FormsModule,
    ReactiveFormsModule,
  ]
 
})

export class LibPickerModule {}
