import {Component, Input} from '@angular/core';

@Component({
    standalone: false,
  selector: 'page-header',
  template: `
    <div class="p-4 border-b border-gray-200 dark:border-gray-700" [ngClass]="_class!">
      <ng-content></ng-content>
    </div>
  `,
  styles: ``
})
export class PageHeaderComponent {
  @Input("class") _class?: string;
}
