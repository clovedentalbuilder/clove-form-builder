import {Component, Input} from '@angular/core';

@Component({
    standalone: false,
  selector: 'page-footer',
  template: `
    <div class="p-4 border-t border-gray-200 dark:border-gray-700" [ngClass]="_class!">
      <ng-content></ng-content>
    </div>
  `,
  styles: ``
})
export class PageFooterComponent {
  @Input("class") _class?: string;
}
