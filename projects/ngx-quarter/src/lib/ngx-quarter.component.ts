import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Host, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Output, QueryList, Renderer2, SimpleChanges, TemplateRef, ViewChild, ViewChildren, forwardRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { ESCAPE } from '@angular/cdk/keycodes';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  ConnectionPositionPair,
  HorizontalConnectionPos,
  VerticalConnectionPos
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { InputBoolean, toBoolean, valueFunctionProp } from 'ng-zorro-antd/core/util';
import {
  BooleanInput,
  FunctionProp,
  NgClassInterface,
  NzSafeAny,
  OnChangeType,
  OnTouchedType
} from 'ng-zorro-antd/core/types';
import { NzConfigKey, NzConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { slideMotion } from 'ng-zorro-antd/core/animation';
import { NzResizeObserver } from 'ng-zorro-antd/cdk/resize-observer';
import { DEFAULT_DATE_PICKER_POSITIONS, DATE_PICKER_POSITION_MAP } from './overlay/position';
import { QuarterPickerService } from './services/quarter-picker.service';
import { CompatibleDate, DisabledTimeFn, NzDateMode, PresetRanges, RangePartType, SupportTimeOptions } from './type/standard-types';
import { Subject, distinctUntilChanged, takeUntil, withLatestFrom, of as observableOf, map } from 'rxjs';
import { DateHelperService, NzDatePickerI18nInterface, NzDatePickerLangI18nInterface, NzI18nService } from 'ng-zorro-antd/i18n';
import { CandyDate, CompatibleValue, cloneDate, wrongSortOrder } from 'ng-zorro-antd/core/time';
import { NzFormNoStatusService, NzFormStatusService } from './services';
import { PREFIX_CLASS, getStatusClassNames } from './utils/util';
import { DateRangePopupComponent } from './components/date-range-popup/date-range-popup.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const POPUP_STYLE_PATCH = { position: 'relative' };
const NZ_CONFIG_MODULE_NAME = 'quarterPicker';
export type NzDatePickerSizeType = 'large' | 'default' | 'small';
export type NzPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
@Component({
  selector: 'lib-ngx-quarter',
  templateUrl: './ngx-quarter.component.html',
  styles: [
  ],
  host: {
    '[class.ngx-picker]': `true`,
    '[class.ngx-picker-range]': `isRange`,
    '[class.ngx-picker-large]': `nzSize === 'large'`,
    '[class.ngx-picker-small]': `nzSize === 'small'`,
    '[class.ngx-picker-disabled]': `nzDisabled`,
    '[class.ngx-picker-rtl]': `dir === 'rtl'`,
    '[class.ngx-picker-borderless]': `nzBorderless`,
    '[class.ngx-picker-inline]': `nzInline`,
    '(click)': 'onClickInputBox($event)'
  },
  animations: [slideMotion],
  providers: [
    QuarterPickerService,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => NgxQuarterComponent)
    }
  ],
})
export class NgxQuarterComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit, ControlValueAccessor {
  readonly _nzModuleName: string = NZ_CONFIG_MODULE_NAME;
  static ngAcceptInputType_nzAllowClear: BooleanInput;
  static ngAcceptInputType_nzAutoFocus: BooleanInput;
  static ngAcceptInputType_nzDisabled: BooleanInput;
  static ngAcceptInputType_nzBorderless: BooleanInput;
  static ngAcceptInputType_nzInputReadOnly: BooleanInput;
  static ngAcceptInputType_nzInline: BooleanInput;
  static ngAcceptInputType_nzOpen: BooleanInput;
  static ngAcceptInputType_nzShowToday: BooleanInput;
  static ngAcceptInputType_nzShowNow: BooleanInput;
  static ngAcceptInputType_nzMode: NzDateMode | NzDateMode[] | string | string[] | null | undefined;
  static ngAcceptInputType_nzShowTime: BooleanInput | SupportTimeOptions | null | undefined;

  isRange: boolean = false; // Indicate whether the value is a range value
  extraFooter?: TemplateRef<NzSafeAny> | string;
  dir: Direction = 'ltr';

  // status
  statusCls: NgClassInterface = {};
  status: string = '';
  hasFeedback: boolean = false;

  public panelMode: NzDateMode | NzDateMode[] = 'date';
  private destroyed$: Subject<void> = new Subject();
  private isCustomPlaceHolder: boolean = false;
  private isCustomFormat: boolean = false;
  private showTime: SupportTimeOptions | boolean = false;

  // --- Common API
  @Input() @InputBoolean() nzAllowClear: boolean = true;
  @Input() @InputBoolean() nzAutoFocus: boolean = false;
  @Input() @InputBoolean() nzDisabled: boolean = false;
  @Input() @InputBoolean() nzBorderless: boolean = false;
  @Input() @InputBoolean() nzInputReadOnly: boolean = false;
  @Input() @InputBoolean() nzInline: boolean = false;
  @Input() @InputBoolean() nzOpen?: boolean;
  @Input() nzDisabledDate?: (d: Date) => boolean;
  @Input() nzLocale!: NzDatePickerI18nInterface;
  @Input() nzPlaceHolder: string | string[] = '';
  @Input() nzPopupStyle: object = POPUP_STYLE_PATCH;
  @Input() nzDropdownClassName?: string;
  @Input() nzSize: NzDatePickerSizeType = 'default';
  @Input() nzStatus: string = '';
  @Input() nzFormat!: string;
  @Input() nzDateRender?: TemplateRef<NzSafeAny> | string | FunctionProp<TemplateRef<Date> | string>;
  @Input() nzDisabledTime?: DisabledTimeFn;
  @Input() nzRenderExtraFooter?: TemplateRef<NzSafeAny> | string | FunctionProp<TemplateRef<NzSafeAny> | string>;
  @Input() @InputBoolean() nzShowToday: boolean = true;
  @Input() nzMode: NzDateMode = 'year';
  @Input() @InputBoolean() nzShowNow: boolean = true;
  @Input() nzRanges?: PresetRanges;
  @Input() nzDefaultPickerValue: CompatibleDate | null = null;
  @Input() @WithConfig() nzSeparator?: string = undefined;
  @Input() @WithConfig() nzSuffixIcon: string | TemplateRef<NzSafeAny> = 'calendar';
  @Input() @WithConfig() nzBackdrop = false;
  @Input() nzId: string | null = null;
  @Input() nzPlacement: NzPlacement = 'bottomLeft';

  // TODO(@wenqi73) The PanelMode need named for each pickers and export
  @Output() readonly nzOnPanelChange = new EventEmitter<NzDateMode | NzDateMode[] | string | string[]>();
  @Output() readonly nzOnCalendarChange = new EventEmitter<Array<Date | null>>();
  @Output() readonly nzOnOk = new EventEmitter<CompatibleDate | null>();
  @Output() readonly nzOnOpenChange = new EventEmitter<boolean>();

  @Input() get nzShowTime(): SupportTimeOptions | boolean {
    return this.showTime;
  }

  set nzShowTime(value: SupportTimeOptions | boolean) {
    this.showTime = typeof value === 'object' ? value : toBoolean(value);
  }

  // ------------------------------------------------------------------------
  // Input API Start
  // ------------------------------------------------------------------------
  @ViewChild(CdkConnectedOverlay, { static: false }) cdkConnectedOverlay?: CdkConnectedOverlay;
  @ViewChild(DateRangePopupComponent, { static: false }) panel!: DateRangePopupComponent;
  @ViewChild('separatorElement', { static: false }) separatorElement?: ElementRef;
  @ViewChild('pickerInput', { static: false }) pickerInput?: ElementRef<HTMLInputElement>;
  @ViewChildren('rangePickerInput') rangePickerInputs?: QueryList<ElementRef<HTMLInputElement>>;

  origin: CdkOverlayOrigin;
  document: Document;
  inputSize: number = 12;
  inputWidth?: number;
  prefixCls = PREFIX_CLASS;
  inputValue!: NzSafeAny;
  activeBarStyle: object = {};
  overlayOpen: boolean = false; // Available when "nzOpen" = undefined
  overlayPositions: ConnectionPositionPair[] = [...DEFAULT_DATE_PICKER_POSITIONS];
  currentPositionX: HorizontalConnectionPos = 'start';
  currentPositionY: VerticalConnectionPos = 'bottom';

  get realOpenState(): boolean {
    // The value that really decide the open state of overlay
    return this.isOpenHandledByUser() ? !!this.nzOpen : this.overlayOpen;
  }

  ngAfterViewInit(): void {
    if (this.nzAutoFocus) {
      this.focus();
    }

    if (this.isRange && this.platform.isBrowser) {
      this.nzResizeObserver
        .observe(this.elementRef)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          this.updateInputWidthAndArrowLeft();
        });
    }

    this.quarterPickerService.inputPartChange$.pipe(takeUntil(this.destroyed$)).subscribe((partType: any) => {
      if (partType) {
        this.quarterPickerService.activeInput = partType;
      }
      this.focus();
      this.updateInputWidthAndArrowLeft();
    });
  }

  updateInputWidthAndArrowLeft(): void {
    this.inputWidth = this.rangePickerInputs?.first?.nativeElement.offsetWidth || 0;

    const baseStyle = { position: 'absolute', width: `${this.inputWidth}px` };
    this.quarterPickerService.arrowLeft =
      this.quarterPickerService.activeInput === 'left'
        ? 0
        : this.inputWidth + this.separatorElement?.nativeElement.offsetWidth || 0;

    if (this.dir === 'rtl') {
      this.activeBarStyle = { ...baseStyle, right: `${this.quarterPickerService.arrowLeft}px` };
    } else {
      this.activeBarStyle = { ...baseStyle, left: `${this.quarterPickerService.arrowLeft}px` };
    }

    this.cdr.markForCheck();
  }

  getInput(partType?: RangePartType): HTMLInputElement | undefined {
    if (this.nzInline) {
      return undefined;
    }
    return this.isRange
      ? partType === 'left'
        ? this.rangePickerInputs?.first.nativeElement
        : this.rangePickerInputs?.last.nativeElement
      : this.pickerInput!.nativeElement;
  }

  focus(): void {
    const activeInputElement = this.getInput(this.quarterPickerService.activeInput);
    if (this.document.activeElement !== activeInputElement) {
      activeInputElement?.focus();
    }
  }

  onFocus(event: FocusEvent, partType?: RangePartType): void {
    event.preventDefault();
    if (partType) {
      this.quarterPickerService.inputPartChange$.next(partType);
    }
    this.renderClass(true);
  }

  // blur event has not the relatedTarget in IE11, use focusout instead.
  onFocusout(event: FocusEvent): void {
    event.preventDefault();
    if (!this.elementRef.nativeElement.contains(event.relatedTarget)) {
      this.checkAndClose();
    }
    this.renderClass(false);
  }

  // Show overlay content
  open(): void {
    if (this.nzInline) {
      return;
    }
    if (!this.realOpenState && !this.nzDisabled) {
      this.updateInputWidthAndArrowLeft();
      this.overlayOpen = true;
      this.nzOnOpenChange.emit(true);
      this.focus();
      this.cdr.markForCheck();
    }
  }

  close(): void {
    if (this.nzInline) {
      return;
    }
    if (this.realOpenState) {
      this.overlayOpen = false;
      this.nzOnOpenChange.emit(false);
    }
  }

  showClear(): boolean {
    return !this.nzDisabled && !this.isEmptyValue(this.quarterPickerService.value) && this.nzAllowClear;
  }

  checkAndClose(): void {
    if (!this.realOpenState) {
      return;
    }

    if (this.panel.isAllowed(this.quarterPickerService.value!, true)) {
      if (Array.isArray(this.quarterPickerService.value) && wrongSortOrder(this.quarterPickerService.value)) {
        const index = this.quarterPickerService.getActiveIndex();
        const value = this.quarterPickerService.value[index];
        this.panel.changeValueFromSelect(value!, true);
        return;
      }
      this.updateInputValue();
      this.quarterPickerService.emitValue$.next();
    } else {
      this.quarterPickerService.setValue(this.quarterPickerService.initialValue!);
      this.close();
    }
  }

  onClickInputBox(event: MouseEvent): void {
    event.stopPropagation();
    this.focus();
    if (!this.isOpenHandledByUser()) {
      this.open();
    }
  }

  onOverlayKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ESCAPE) {
      this.quarterPickerService.initValue();
    }
  }

  // NOTE: A issue here, the first time position change, the animation will not be triggered.
  // Because the overlay's "positionChange" event is emitted after the content's full shown up.
  // All other components like "nz-dropdown" which depends on overlay also has the same issue.
  // See: https://github.com/NG-ZORRO/ng-zorro-antd/issues/1429
  onPositionChange(position: ConnectedOverlayPositionChange): void {
    this.currentPositionX = position.connectionPair.originX;
    this.currentPositionY = position.connectionPair.originY;
    this.cdr.detectChanges(); // Take side-effects to position styles
  }

  onClickClear(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.quarterPickerService.initValue(true);
    this.quarterPickerService.emitValue$.next();
  }

  updateInputValue(): void {
    const newValue = this.quarterPickerService.value;
    if (this.isRange) {
      this.inputValue = newValue ? (newValue as CandyDate[]).map(v => this.formatValue(v)) : ['', ''];
    } else {
      this.inputValue = this.formatValue(newValue as CandyDate);
    }
    this.cdr.markForCheck();
  }

  formatValue(value: CandyDate): string {
    return this.dateHelper.format(value && (value as CandyDate).nativeDate, this.nzFormat);
  }

  onInputChange(value: string, isEnter: boolean = false): void {
    /**
     * in IE11 focus/blur will trigger ngModelChange if placeholder changes,
     * so we forbidden IE11 to open panel through input change
     */
    if (
      !this.platform.TRIDENT &&
      this.document.activeElement === this.getInput(this.quarterPickerService.activeInput) &&
      !this.realOpenState
    ) {
      this.open();
      return;
    }

    const date = this.checkValidDate(value);
    // Can only change date when it's open
    if (date && this.realOpenState) {
      this.panel.changeValueFromSelect(date, isEnter);
    }
  }

  onKeyupEnter(event: Event): void {
    this.onInputChange((event.target as HTMLInputElement).value, true);
  }

  private checkValidDate(value: string): CandyDate | null {
    const date = new CandyDate(this.dateHelper.parseDate(value, this.nzFormat));

    if (!date.isValid() || value !== this.dateHelper.format(date.nativeDate, this.nzFormat)) {
      return null;
    }

    return date;
  }

  getPlaceholder(partType?: RangePartType): string {
    return this.isRange
      ? this.nzPlaceHolder[this.quarterPickerService.getActiveIndex(partType!)]
      : (this.nzPlaceHolder as string);
  }

  isEmptyValue(value: CompatibleValue): boolean {
    if (value === null) {
      return true;
    } else if (this.isRange) {
      return !value || !Array.isArray(value) || value.every(val => !val);
    } else {
      return !value;
    }
  }

  // Whether open state is permanently controlled by user himself
  isOpenHandledByUser(): boolean {
    return this.nzOpen !== undefined;
  }

  // ------------------------------------------------------------------------
  // Input API End
  // ------------------------------------------------------------------------

  constructor(
    public nzConfigService: NzConfigService,
    public quarterPickerService: QuarterPickerService,
    protected i18n: NzI18nService,
    protected cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private dateHelper: DateHelperService,
    private nzResizeObserver: NzResizeObserver,
    private platform: Platform,
    @Inject(DOCUMENT) doc: NzSafeAny,
    @Optional() private directionality: Directionality,
    @Host() @Optional() public noAnimation?: NzNoAnimationDirective,
    @Optional() private nzFormStatusService?: NzFormStatusService,
    @Optional() private nzFormNoStatusService?: NzFormNoStatusService
  ) {
    this.document = doc;
    this.origin = new CdkOverlayOrigin(this.elementRef);
  }

  ngOnInit(): void {
    this.nzFormStatusService?.formStatusChanges
      .pipe(
        distinctUntilChanged((pre, cur) => {
          return pre.status === cur.status && pre.hasFeedback === cur.hasFeedback;
        }),
        withLatestFrom(this.nzFormNoStatusService ? this.nzFormNoStatusService.noFormStatus : observableOf(false)),
        map(([{ status, hasFeedback }, noStatus]) => ({ status: noStatus ? '' : status, hasFeedback })),
        takeUntil(this.destroyed$)
      )
      .subscribe(({ status, hasFeedback }) => {
        this.setStatusStyles(status, hasFeedback);
      });

    // Subscribe the every locale change if the nzLocale is not handled by user
    if (!this.nzLocale) {
      this.i18n.localeChange.pipe(takeUntil(this.destroyed$)).subscribe(() => this.setLocale());
    }

    // Default value
    this.quarterPickerService.isRange = this.isRange;
    this.quarterPickerService.initValue(true);
    this.quarterPickerService.emitValue$.pipe(takeUntil(this.destroyed$)).subscribe(_ => {
      const value = this.quarterPickerService.value;
      this.quarterPickerService.initialValue = cloneDate(value);
      if (this.isRange) {
        const vAsRange = value as CandyDate[];
        if (vAsRange.length) {
          this.onChangeFn([vAsRange[0]?.nativeDate ?? null, vAsRange[1]?.nativeDate ?? null]);
        } else {
          this.onChangeFn([]);
        }
      } else {
        if (value) {
          this.onChangeFn((value as CandyDate).nativeDate);
        } else {
          this.onChangeFn(null);
        }
      }
      this.onTouchedFn();
      // When value emitted, overlay will be closed
      this.close();
    });

    this.directionality.change?.pipe(takeUntil(this.destroyed$)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });
    this.dir = this.directionality.value;
    this.inputValue = this.isRange ? ['', ''] : '';
    this.setModeAndFormat();

    this.quarterPickerService.valueChange$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.updateInputValue();
    });
  }

 
 
 
 
  ngOnChanges(changes: SimpleChanges): void {
    const { nzStatus, nzPlacement } = changes;
    if (changes['nzPopupStyle']) {
      // Always assign the popup style patch
      this.nzPopupStyle = this.nzPopupStyle ? { ...this.nzPopupStyle, ...POPUP_STYLE_PATCH } : POPUP_STYLE_PATCH;
    }

    // Mark as customized placeholder by user once nzPlaceHolder assigned at the first time
    if (changes['nzPlaceHolder']?.currentValue) {
      this.isCustomPlaceHolder = true;
    }

    if (changes['nzFormat']?.currentValue) {
      this.isCustomFormat = true;
    }

    if (changes['nzLocale']) {
      // The nzLocale is currently handled by user
      this.setDefaultPlaceHolder();
    }

    if (changes['nzRenderExtraFooter']) {
      this.extraFooter = valueFunctionProp(this.nzRenderExtraFooter!);
    }

    if (changes['nzMode']) {
      this.setDefaultPlaceHolder();
      this.setModeAndFormat();
    }

    if (nzStatus) {
      this.setStatusStyles(this.nzStatus, this.hasFeedback);
    }

    if (nzPlacement) {
      this.setPlacement(this.nzPlacement);
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  setModeAndFormat(): void {
    const inputFormats: { [key in NzDateMode]?: string } = {
      year: 'yyyy',
      month: 'yyyy-MM',
      week: this.i18n.getDateLocale() ? 'RRRR-II' : 'yyyy-ww', // Format for week
      date: this.nzShowTime ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'
    };

    if (!this.nzMode) {
      this.nzMode = 'date';
    }

    this.panelMode = this.isRange ? [this.nzMode, this.nzMode] : this.nzMode;

    // Default format when it's empty
    if (!this.isCustomFormat) {
      this.nzFormat = inputFormats[this.nzMode as NzDateMode]!;
    }

    this.inputSize = Math.max(10, this.nzFormat.length) + 2;
    this.updateInputValue();
  }

  /**
   * Triggered when overlayOpen changes (different with realOpenState)
   *
   * @param open The overlayOpen in picker component
   */
  onOpenChange(open: boolean): void {
    this.nzOnOpenChange.emit(open);
  }

  // ------------------------------------------------------------------------
  // | Control value accessor implements
  // ------------------------------------------------------------------------

  // NOTE: onChangeFn/onTouchedFn will not be assigned if user not use as ngModel
  onChangeFn: OnChangeType = () => void 0;
  onTouchedFn: OnTouchedType = () => void 0;

  writeValue(value: CompatibleDate): void {
    this.setValue(value);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.nzDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  // ------------------------------------------------------------------------
  // | Internal methods
  // ------------------------------------------------------------------------

  // Reload locale from i18n with side effects
  private setLocale(): void {
    this.nzLocale = this.i18n.getLocaleData('DatePicker', {});
    this.setDefaultPlaceHolder();
    this.cdr.markForCheck();
  }

  private setDefaultPlaceHolder(): void {
    if (!this.isCustomPlaceHolder && this.nzLocale) {
      const defaultPlaceholder: { [key in NzDateMode]?: string } = {
        year: this.getPropertyOfLocale('yearPlaceholder'),
        month: this.getPropertyOfLocale('monthPlaceholder'),
        week: this.getPropertyOfLocale('weekPlaceholder'),
        date: this.getPropertyOfLocale('placeholder')
      };

      const defaultRangePlaceholder: { [key in NzDateMode]?: string[] } = {
        year: this.getPropertyOfLocale('rangeYearPlaceholder'),
        month: this.getPropertyOfLocale('rangeMonthPlaceholder'),
        week: this.getPropertyOfLocale('rangeWeekPlaceholder'),
        date: this.getPropertyOfLocale('rangePlaceholder')
      };

      this.nzPlaceHolder = this.isRange
        ? defaultRangePlaceholder[this.nzMode as NzDateMode]!
        : defaultPlaceholder[this.nzMode as NzDateMode]!;
    }
  }

  private getPropertyOfLocale<T extends keyof NzDatePickerLangI18nInterface>(
    type: T
  ): NzDatePickerLangI18nInterface[T] {
    return this.nzLocale.lang[type] || this.i18n.getLocaleData(`DatePicker.lang.${type}`);
  }

  // Safe way of setting value with default
  private setValue(value: CompatibleDate): void {
    const newValue: CompatibleValue = this.quarterPickerService.makeValue(value);
    this.quarterPickerService.setValue(newValue);
    this.quarterPickerService.initialValue = newValue;
  }

  renderClass(value: boolean): void {
    // TODO: avoid autoFocus cause change after checked error
    if (value) {
      this.renderer.addClass(this.elementRef.nativeElement, 'ant-picker-focused');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'ant-picker-focused');
    }
  }

  onPanelModeChange(panelMode: NzDateMode | NzDateMode[]): void {
    this.nzOnPanelChange.emit(panelMode);
  }

  // Emit nzOnCalendarChange when select date by nz-range-picker
  onCalendarChange(value: CompatibleValue): void {
    if (this.isRange && Array.isArray(value)) {
      const rangeValue = value.filter(x => x instanceof CandyDate).map(x => x!.nativeDate);
      this.nzOnCalendarChange.emit(rangeValue);
    }
  }

  onResultOk(): void {
    if (this.isRange) {
      const value = this.quarterPickerService.value as CandyDate[];
      if (value.length) {
        this.nzOnOk.emit([value[0]?.nativeDate || null, value[1]?.nativeDate || null]);
      } else {
        this.nzOnOk.emit([]);
      }
    } else {
      if (this.quarterPickerService.value) {
        this.nzOnOk.emit((this.quarterPickerService.value as CandyDate).nativeDate);
      } else {
        this.nzOnOk.emit(null);
      }
    }
  }

  // status
  private setStatusStyles(status: string, hasFeedback: boolean): void {
    // set inner status
    this.status = status;
    this.hasFeedback = hasFeedback;
    this.cdr.markForCheck();
    // render status if nzStatus is set
    this.statusCls = getStatusClassNames(this.prefixCls, status, hasFeedback);
    Object.keys(this.statusCls).forEach(status => {
      if (this.statusCls[status]) {
        this.renderer.addClass(this.elementRef.nativeElement, status);
      } else {
        this.renderer.removeClass(this.elementRef.nativeElement, status);
      }
    });
  }

  private setPlacement(placement: NzPlacement): void {
    const position: ConnectionPositionPair = DATE_PICKER_POSITION_MAP[placement];
    this.overlayPositions = [position, ...DEFAULT_DATE_PICKER_POSITIONS];
    this.currentPositionX = position.originX;
    this.currentPositionY = position.originY;
  }
}
