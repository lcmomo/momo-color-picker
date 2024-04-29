import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'color-picker';
  color ="#666";
  tooltipConfig = {
    title: 'fff',
  }
  changeColor(color: any) {
    console.log("color: ", this.color)
  }

  inputValue = '';
}
