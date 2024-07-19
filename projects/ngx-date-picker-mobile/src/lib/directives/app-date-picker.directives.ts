import { ChangeDetectorRef, Directive, ElementRef, HostListener, Injector, Input, OnChanges } from '@angular/core';
import { DatePickerBase } from '../components/date-picker-base';
import {Overlay, OverlayConfig, OverlayRef} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import { DatePopupComponent } from '../components/date-popup/date-popup.component';
import { DatePickerOptions } from './date-picker-options.provider';
import { NzI18nService } from '../i18n';
import { NgxDatePickerMobileService } from '../ngx-date-picker-mobile.service';
@Directive({
  selector: '[appDatePicker]'
})
export class NgxDatePickerDirective extends DatePickerBase implements OnChanges {
  @Input() parentContainer: HTMLElement | null | undefined  = document.querySelector('body');
  constructor(
    private overlay: Overlay,
    private cdr: ChangeDetectorRef,
    protected i18n: NzI18nService,
    private injector: Injector,
    private datePickerService: NgxDatePickerMobileService
  ) {
    super();
  }
  
  @HostListener("click")
  clickHostElement(){
    const config = new OverlayConfig();
    const positionStrategy = this.overlay.position().flexibleConnectedTo(this.parentContainer as HTMLElement).withPositions([{
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: 0,
      offsetY: 0
    }]);
    positionStrategy.withLockedPosition(true);
    config.positionStrategy = positionStrategy;
    config.backdropClass = ['cdk-overlay-dark-backdrop','mobile-select-picker'];
    config.panelClass = 'mobile-overlay';
    config.width = '365px';
    config.hasBackdrop = true;
    const overlayRef = this.overlay.create(config);
    overlayRef.backdropClick().subscribe(() => {
      overlayRef.dispose();
    });

    const datePickerOptions = new DatePickerOptions();
    datePickerOptions.startValue = this.startValue ? new Date(this.startValue) : null;
    datePickerOptions.endValue = this.endValue ? new Date(this.endValue) : null;
    datePickerOptions.isRange = this.isRange;
    datePickerOptions.onConfirm = this.onConfirm;
    datePickerOptions.value = this.value ? new Date(this.value) : null;
    datePickerOptions.showTime = this.showTime;
    datePickerOptions.mode = this.mode;
    // 生成注入器
    const injector = Injector.create({
      providers: [
        {provide: OverlayRef,useValue: overlayRef},
        {provide: DatePickerOptions, useValue: datePickerOptions}
      ],
      parent: this.injector
    });
    const partial = new ComponentPortal(DatePopupComponent, null, injector);
    overlayRef.attach(partial);
  }

  ngOnChanges() {
    
  }
  ngOnInit() {
  }

}