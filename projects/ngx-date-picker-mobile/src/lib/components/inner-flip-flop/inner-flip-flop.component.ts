import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'inner-flip-flop',
  template: ` <div class="extra-box" tableIndex="0" (click)="handleClick($event)">
  <ng-container *ngIf="isRange">
    <div class="search-item-box" [class.checked]="value"
      [style]="value ? {borderColor: customSeriesColor, color: customSeriesColor} : ''">
      <span *ngIf="!value">{{placeHolder}}</span>
      <span *ngIf="value">{{value | date:'yyyy'}}</span>
      <span nz-icon nzType="caret-down" nzTheme="outline"></span>
    </div>
  </ng-container>
  <ng-container *ngIf="!isRange">
    <div class="search-item-box" [class.checked]="startValue || endValue"
      [style]="startValue || endValue ? {borderColor: customSeriesColor, color:customSeriesColor} : ''">
      <span *ngIf="!startValue && !endValue">{{placeHolder}}</span>
      <span *ngIf="startValue || endValue">
        {{startValue ? (startValue | date:'yyyy') : '开始时间'}}-{{ endValue ?
        (endValue | date:'yyyy') : '结束时间'}}
      </span>
      <span nz-icon nzType="caret-down" nzTheme="outline"></span>
    </div>
  </ng-container>
</div>`,
  styles: []
})
export class InnerFlipFlopComponent implements OnInit {
  
  @Input() isRange: boolean = false;
  @Input() value: Date = new Date();
  @Input() startValue: Date = new Date();
  @Input() endValue: Date = new Date();
  @Input() placeHolder: string = '';

  @Output() click: EventEmitter<any> = new EventEmitter<any>();
  

  customSeriesColor: string = 'rgb(19, 180, 188)'; 
  nzOpen: boolean = false
  constructor() { }

  ngOnInit(): void {
  }
  handleClick($event?: MouseEvent) {
    this.click.emit($event);
  }

}
