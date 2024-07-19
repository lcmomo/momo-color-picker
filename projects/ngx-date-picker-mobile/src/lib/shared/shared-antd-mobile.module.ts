import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { IconModule, NgZorroAntdMobileModule } from "ng-zorro-antd-mobile";

@NgModule({
  exports: [NgZorroAntdMobileModule],
  schemas: [NO_ERRORS_SCHEMA]
 
})

export class SharedAntdMobileModule { }