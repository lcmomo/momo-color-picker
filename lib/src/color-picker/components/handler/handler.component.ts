import { Component, Input } from '@angular/core';

type HandlerSize = 'default' | 'small';

@Component({
  selector: 'base-color-handler',
  templateUrl: './handler.component.html'
})
export class BaseHandlerComponent {
  @Input() color: string | null = null;
  @Input() size: HandlerSize = 'default';
}