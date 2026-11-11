import { Component } from '@angular/core';

@Component({
    standalone: false,
  selector: 'action-bar',
  template: `
    <ng-content></ng-content>
  `,
  styles: ``
})
export class ActionBarComponent {

}
