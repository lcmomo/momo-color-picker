# GeominfoColorPicker

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.11.

**基于ng-zorro-antd@17 nz-color-picker 组件实现，适配版本小于17的angular项目**

## installation

```bash
#use npm
npm install @geominfo/color-picker

#use yarn
yarn add @geominfo/color-picker
```

## usage example

```js
import { GeometryColorPickerModule } from '@geominfo/color-picker'

@NgModule({
  declarations: [
  // ...
  ],
  imports: [
    GeometryColorPickerModule
  ],
  providers: [],
  bootstrap: [
    // ...
  ]
})
export class AppModule { }

```

```html
<geometry-color-picker nzShowText [nzDisabledFormat]="true" [(ngModel)]="color" (ngModelChange)="changeColor($event)"></geometry-color-picker>
```

属性及事件方法与nz-color-picker组件一致


