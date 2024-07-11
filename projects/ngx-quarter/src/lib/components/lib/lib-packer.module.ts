

/**
 * A collection module of standard output for all lib components
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';

import { NzI18nModule } from 'ng-zorro-antd/i18n';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';

import { DecadeHeaderComponent } from './decade-header.component';
import { DecadeTableComponent } from './decade-table.component';
import { YearHeaderComponent } from './year-header.component';
import { YearTableComponent } from './year-table.component';
import { QuarterHeaderComponent } from './quarter-header.component';
import { QuarterTableComponent } from './quarter-table.component';
import { DateHeaderComponent } from './date-header.component';
import { MonthTableComponent } from './month-table.component';
import { DateTableComponent } from './date-table.component';
import { MonthHeaderComponent } from './month-header.component';

@NgModule({
  imports: [CommonModule, FormsModule, NzI18nModule, NzTimePickerModule, NzOutletModule],
  exports: [
    DecadeHeaderComponent,
    DecadeTableComponent,
    YearHeaderComponent,
    YearTableComponent,
    QuarterHeaderComponent,
    QuarterTableComponent,
    DateHeaderComponent,
    DateTableComponent,
    MonthHeaderComponent,
    MonthTableComponent
  ],
  declarations: [
    DecadeHeaderComponent,
    DecadeTableComponent,
    YearHeaderComponent,
    YearTableComponent,
    QuarterHeaderComponent,
    QuarterTableComponent,
    DateHeaderComponent,
    MonthTableComponent,
    MonthHeaderComponent,
    DateTableComponent
  ]
})
export class LibPackerModule {}
