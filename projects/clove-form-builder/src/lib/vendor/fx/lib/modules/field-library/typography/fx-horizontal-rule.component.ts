import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FxNonDataFieldComponent, FxSetting } from '../../../classes';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'fx-hr',
  template: ` <hr /> `,
})
export class FxHorizontalRuleComponent extends FxNonDataFieldComponent {
  constructor() {
    super();
  }
  protected settings(): FxSetting[] {
    return [];
  }
}
