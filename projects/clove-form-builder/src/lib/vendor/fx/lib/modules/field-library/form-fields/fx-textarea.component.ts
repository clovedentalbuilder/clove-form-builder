import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import { FxMode, FxSetting, FxStringSetting, FxValidation } from '../../../classes';
import {FxValidationProcessorComponent} from "../../form-processor/fx-validation-processor.component";
import {FxEventProcessorDirective} from "../../form-processor/fx-event-processor-directive";
import {FxValidatorService} from "../../../services";
import {FxComponent} from "../../form-builder";
import { FxBaseComponent } from '../../../core';

@Component({
  selector: 'fx-textarea',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FxValidationProcessorComponent,
    FormsModule,
    FxEventProcessorDirective,
    FxComponent
  ],
  template: `
    <fx-component [fxData]="fxData" *ngIf="formControl">
      @if (fxData.$fxForm?.$viewMode == FxMode.VIEW){
        <div>
          <label *ngIf="setting('label')" class="text-sm font-semibold text-gray-500 uppercase">{{ setting('label') }} :</label>
          <p *ngIf="formControl.value" class="text-lg font-medium text-gray-800">{{ formControl.value }}</p>
          <p *ngIf="!formControl.value" class="text-sm font-medium text-gray-500">N/A</p>
        </div>
      } @else {
        <label *ngIf="setting('label')" class="text-xs">{{ setting('label') }}</label>
        <textarea rows="3"
                  class="form-control"
                  [formControl]="formControl"
                  [placeholder]="setting('placeholder')"
                  [fx-event-handler]="fxData.events"></textarea>
        <fx-validation-processor *ngIf="fxData.validations"
                                 [control]="formControl"
                                 [element]="fxData"></fx-validation-processor>
      }
    </fx-component>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FxTextareaComponent extends FxBaseComponent{

  protected settings(): FxSetting[] {
    return [
      new FxStringSetting({
        key:"label",
        $title: "Label Text",
        value: "Default Label"
      }),
      new FxStringSetting({
        key:"placeholder",
        $title: "Placeholder Text",
        value: "Default Placeholder"
      })
    ];
  }

  protected override validations(): FxValidation[] {
    return [
      FxValidatorService.required,
      FxValidatorService.pattern,
      FxValidatorService.minLength,
      FxValidatorService.maxLength,
      FxValidatorService.alphaOnly,
      FxValidatorService.numberOnly
    ];
  }

  formControl!: FormControl;

  constructor(private cdr: ChangeDetectorRef) {
    super(cdr);
    this.onInit.subscribe((fxData)=>{
      this.formControl = new FormControl<any>(fxData.name);
      super._register(this.formControl);
    })
  }

  protected readonly FxMode = FxMode;
}
