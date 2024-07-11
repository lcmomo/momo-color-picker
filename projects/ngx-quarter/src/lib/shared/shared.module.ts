import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';

import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule} from 'ng-zorro-antd/tag'

@NgModule({
    exports: [
        NzTagModule,
        NzButtonModule,
        NzPopoverModule,
        NzSelectModule,
        NzInputModule,
        NzInputNumberModule,
        NzToolTipModule,
        NzIconModule,
        NzFormModule,
        NzNoAnimationModule,
        NzTimePickerModule,
        BidiModule,
        OverlayModule,
    ]
})
export class SharedModule {

}

