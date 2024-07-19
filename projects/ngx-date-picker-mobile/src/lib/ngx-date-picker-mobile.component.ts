import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  ConnectionPositionPair,
  HorizontalConnectionPos,
  VerticalConnectionPos
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ESCAPE } from '@angular/cdk/keycodes';
import { DEFAULT_DATE_PICKER_POSITIONS } from './overlay/position';
import { DatePickerBase } from './components/date-picker-base';
import { NzI18nService } from './i18n';
@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngx-date-picker-mobile',
  templateUrl: './ngx-date-picker-mobile.component.html',
  styles: [
  ],
  host: {
    '(click)': 'onClickInputBox($event)',
    '[class.ngx-date-picker]': `true`,
  }
})
export class NgxDatePickerMobileComponent extends DatePickerBase implements OnInit {
  
  @ViewChild(CdkConnectedOverlay, { static: false }) cdkConnectedOverlay?: CdkConnectedOverlay;
  
 
  origin: CdkOverlayOrigin;
  overlayOpen: boolean = false;
  overlayPositions: ConnectionPositionPair[] = [...DEFAULT_DATE_PICKER_POSITIONS];
  currentPositionX: HorizontalConnectionPos = 'start';
  currentPositionY: VerticalConnectionPos = 'bottom';
  get realOpenState(): boolean {
    // The value that really decide the open state of overlay
    return this.isOpenHandledByUser() ? !!this.nzOpen : this.overlayOpen;
  }

  isOpenHandledByUser(): boolean {
    return this.nzOpen !== undefined;
  }
  constructor( private renderer: Renderer2,
    private elementRef: ElementRef,
    private platform: Platform,
    protected i18n: NzI18nService,
    protected cdr: ChangeDetectorRef,
  ) {
    super();
      this.origin = new CdkOverlayOrigin(this.elementRef);
    }

  ngOnInit(): void {
  }
  open(): void {
    if (this.isInline) {
      return;
    }
    if (!this.realOpenState && !this.isDisabled) {
      // this.updateInputWidthAndArrowLeft();
      this.overlayOpen = true;
      // this.nzOnOpenChange.emit(true);
      // this.focus();
      this.cdr.markForCheck();
    }
  }

  close(): void {
    if (this.isInline) {
      return;
    }
    if (this.realOpenState) {
      this.overlayOpen = false;
      // this.nzOnOpenChange.emit(false);
    }
  }

  // updateInputWidthAndArrowLeft(): void {
  //   this.inputWidth = this.rangePickerInputs?.first?.nativeElement.offsetWidth || 0;

  //   const baseStyle = { position: 'absolute', width: `${this.inputWidth}px` };
  //   this.quarterPickerService.arrowLeft =
  //     this.quarterPickerService.activeInput === 'left'
  //       ? 0
  //       : this.inputWidth + this.separatorElement?.nativeElement.offsetWidth || 0;

  //   if (this.dir === 'rtl') {
  //     this.activeBarStyle = { ...baseStyle, right: `${this.quarterPickerService.arrowLeft}px` };
  //   } else {
  //     this.activeBarStyle = { ...baseStyle, left: `${this.quarterPickerService.arrowLeft}px` };
  //   }

  //   this.cdr.markForCheck();
  // }
  onPositionChange(position: ConnectedOverlayPositionChange): void {
    this.currentPositionX = position.connectionPair.originX;
    this.currentPositionY = position.connectionPair.originY;
    this.cdr.detectChanges(); // Take side-effects to position styles
  }
  onOverlayKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ESCAPE) {
     console.log('down')
    }
  }

  onClickInputBox(event: MouseEvent) {
    console.log("cliek")
    event.stopPropagation();
    if (!this.isOpenHandledByUser()) {
      this.open();
    }
    
  }
  onFocusout(event: FocusEvent): void {
    console.log("out: ")
    event.preventDefault();
    if (!this.elementRef.nativeElement.contains(event.relatedTarget)) {
      this.close();
    }
  }

  setLocale(): void {
    this.locale = this.i18n.getLocaleData('DatePicker', {});
    this.cdr.markForCheck();
  }



}
