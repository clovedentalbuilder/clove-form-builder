import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import { FxIconSetting, FxMode, FxSetting, FxStringSetting, FxValidation } from '../../../classes';
import {FxValidationProcessorComponent} from "../../form-processor/fx-validation-processor.component";
import {FxEventProcessorDirective} from "../../form-processor/fx-event-processor-directive";
import {FxValidatorService} from "../../../services";
import {FxComponent} from "../../form-builder";
import { FxBaseComponent } from '../../../core';

@Component({
  selector: 'fx-text-field',
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
        <label *ngIf="setting('label')" class="text-xs">{{ setting('label') }}
          <span class="fa fa-info-circle" *ngIf="setting('helpText')" [title]="setting('helpText')"></span>
        </label>
        <div class="relative">
          <i class="absolute p-3 text-gray-400" [ngClass]="setting('icon')" *ngIf="setting('icon')"></i>
          <input type="text" class="form-control" [ngClass]="setting('icon')? 'ps-10' : ''"
                 [formControl]="formControl" [placeholder]="setting('placeholder')" [fx-event-handler]="fxData.events" />
        </div>
        <fx-validation-processor *ngIf="fxData.validations" [control]="formControl" [element]="fxData"></fx-validation-processor>
      }
    </fx-component>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FxTextFieldComponent extends FxBaseComponent{

  protected settings(): FxSetting[] {
    return [
      new FxIconSetting({
        key:"icon",
        $title: "Field Icon",
        value: ""
      }),
      new FxStringSetting({
        key:"label",
        $title: "Label Text",
        value: "Default Label"
      }),
      new FxStringSetting({
        key:"placeholder",
        $title: "Placeholder Text",
        value: "Default Placeholder"
      }),
      new FxStringSetting({
        key:"helpText",
        $title: "Help Text",
        value: ""
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
