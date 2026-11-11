import {AfterViewInit, Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import { FxMode, FxNonDataFieldComponent, FxSelectSetting, FxSetting } from '../../../classes';
import {FxComponent} from "../../form-builder";
import { FormsModule } from '@angular/forms';
import { ContentEditableDirective } from '../../../directives/content-editable.directive';

@Component({
  standalone: true,
  imports: [CommonModule, FxComponent, FormsModule, ContentEditableDirective],
  selector: 'fx-heading',
  template: `
    <fx-component [fxData]="fxData">
      @if (isEditable()) {
        <div class="font-bold"
             [ngClass]="setting('style')"
             ContentEditable
             [(ngModel)]="fxData.value"
             contenteditable >
        </div>
      } @else {
        <div class="font-bold" [ngClass]="setting('style')">{{  fxData.value }}</div>
      }
    </fx-component>
  `
})
export class FxHeadingComponent extends FxNonDataFieldComponent implements AfterViewInit{

  constructor() {
    super();
  }

  protected settings(): FxSetting[] {
    return [
      new FxSelectSetting({key: 'style', value: 'text-2xl', $title: 'Heading Style'},
        [
          { option: 'Heading 2XL',value: 'text-2xl' },
          { option: 'Heading XL',value: 'text-xl' },
          { option: 'Heading Large',value: 'text-lg' },
          { option: 'Heading Small',value: 'text-sm' },
          { option: 'Heading XS',value: 'text-xs' }
        ]
      )
    ];
  }

  ngAfterViewInit() {}

}
