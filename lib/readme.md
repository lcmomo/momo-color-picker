# MomoColorPicker

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.11.

**基于ng-zorro-antd@17 nz-color-picker 组件实现，适配版本小于17的angular项目**

## installation

```bash
#use npm
npm install momo-color-picker

#use yarn
yarn add momo-color-picker
```

## usage example

```js
import { MomoColorPickerModule } from 'momo-color-picker'

@NgModule({
  declarations: [
  // ...
  ],
  imports: [
    MomoColorPickerModule
  ],
  providers: [],
  bootstrap: [
    // ...
  ]
})
export class AppModule { }

```

```html
<momo-color-picker nzShowText [nzDisabledFormat]="true" [(ngModel)]="color" (ngModelChange)="changeColor($event)"></momo-color-picker>
```

属性及事件方法与nz-color-picker组件一致


