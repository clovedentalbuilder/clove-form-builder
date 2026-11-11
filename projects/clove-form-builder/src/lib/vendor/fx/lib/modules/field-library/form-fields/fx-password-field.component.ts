import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FxIconSetting, FxSetting, FxStringSetting, FxValidation } from '../../../classes';
import { FxValidationProcessorComponent } from '../../form-processor/fx-validation-processor.component';
import { FxEventProcessorDirective } from '../../form-processor/fx-event-processor-directive';
import { FxValidatorService } from '../../../services';
import { FxComponent } from '../../form-builder';
import { FxBaseComponent } from '../../../core';

@Component({
  selector: 'fx-password-field',
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
      <label *ngIf="setting('label')" class="text-xs">{{ setting('label') }}</label>
      <div class="relative">
        <i class="absolute p-3 text-gray-400" [ngClass]="setting('icon')" *ngIf="setting('icon')"></i>
        <input type="password"
               class="form-control"
               [formControl]="formControl"
               [placeholder]="setting('placeholder')"
               [ngClass]="setting('icon')? 'ps-10' : ''"
               [fx-event-handler]="fxData.events"
        />
      </div>

      <fx-validation-processor *ngIf="fxData.validations"
                               [control]="formControl"
                               [element]="fxData"></fx-validation-processor>
    </fx-component>
  `,
  styles: []
})
export class FxPasswordFieldComponent extends FxBaseComponent{

  protected settings(): FxSetting[] {
    return [
      new FxIconSetting({
        key:"icon",
        $title: "Field Icon",
        value: ""
      }),
      new FxStringSetting( {key:"label", $title: "Label Text", value: "Default Label"}),
      new FxStringSetting({key:"placeholder", $title: "Placeholder Text", value: "Default Placeholder"}),
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

}
