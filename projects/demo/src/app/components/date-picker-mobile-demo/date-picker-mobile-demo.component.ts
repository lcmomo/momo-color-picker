import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DateMode } from 'projects/ngx-date-picker-mobile/src/lib/type';


@Component({
  selector: 'app-date-picker-mobile-demo',
  templateUrl: './date-picker-mobile-demo.component.html',
  styleUrls: ['./date-picker-mobile-demo.component.less']
})
export class DatePickerMobileDemoComponent implements OnInit, AfterViewInit {
  
  dateConfig = {
    sectionChoose: '区间',
    label: 'date',
    value: new Date(),
    startValue: new Date('2024-07-01 00:00:00'),
    endValue: new Date('2024-07-16 00:00:00'),
    customSeriesColor: '#4980FF',
    isInline: false,
    isRange: true,
    showTime: false
  
  }
  nzOpen: boolean = false;
  mode: DateMode = 'week';
  parentContainer: HTMLElement | undefined | null = document.querySelector('body') as HTMLElement;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.parentContainer =  document.querySelector('body') as HTMLElement;
    this.cdr.detectChanges();
  }
  handleClick($event: MouseEvent) {
    this.nzOpen = !this.nzOpen
  }

  onConfirm($event: any) {
    console.log('confirm: ', $event)
  }

}
