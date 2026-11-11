import {AfterViewInit, Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FxNonDataFieldComponent, FxSetting} from "../../../classes";
import {FxComponent} from "../../form-builder";
import { ContentEditableDirective } from '../../../directives/content-editable.directive';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FxComponent, ContentEditableDirective, FormsModule],
  selector: 'fx-paragraph',
  template: `
    <fx-component [fxData]="fxData">
      @if (isEditable()) {
        <p contenteditable ContentEditable [(ngModel)]="fxData.value" ></p>
      } @else {
        <p>{{ fxData.value }}</p>
      }

    </fx-component>
  `
})
export class FxParagraphComponent extends FxNonDataFieldComponent implements AfterViewInit{

  constructor() {
    super();
  }

  protected settings(): FxSetting[] {
    return [];
  }

  ngAfterViewInit() {
  }


}
