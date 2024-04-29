
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { AbstractPanelHeader } from './abstract-panel-header';
import { PanelSelector } from './interface';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'quarter-header', // eslint-disable-line @angular-eslint/component-selector
  exportAs: 'quarterHeader',
  templateUrl: './abstract-panel-header.html'
})
export class QuarterHeaderComponent extends AbstractPanelHeader {
  get startYear(): number {
    return parseInt(`${this.value.getYear() / 10}`, 10) * 10;
  }

  get endYear(): number {
    return this.startYear + 9;
  }

  get currentYear() {
    return this.value.getYear();
  }
  override superPrevious(): void {
    this.changeValue(this.value.addYears(-1));
  }

  override superNext(): void {
    this.changeValue(this.value.addYears(+1));
  }

  getSelectors(): PanelSelector[] {
    return [
      {
        className: `${this.prefixCls}-quarter-btn`,
        title: '',
        onClick: () => this.changeMode('year'),
        label: `${this.currentYear}年`
      }
    ];
  }
}
