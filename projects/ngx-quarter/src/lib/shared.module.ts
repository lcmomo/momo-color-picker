import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';

import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
export const ZORRO_MODULES = [
   
    NzPopoverModule,
    NzSelectModule,
    NzInputModule, 
    NzInputNumberModule,
    NzToolTipModule,
    NzIconModule,
    NzFormModule,
    NzNoAnimationModule
];

export const CDK_MODULES = [
    BidiModule,
    OverlayModule,
]
