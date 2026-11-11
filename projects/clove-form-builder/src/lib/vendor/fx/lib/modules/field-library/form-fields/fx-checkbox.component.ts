import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import { FxOptionSetting, FxSelectSetting, FxSetting, FxStringSetting, FxValidation } from '../../../classes';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FxValidationProcessorComponent} from "../../form-processor/fx-validation-processor.component";
import {FxValidatorService} from "../../../services";
import {FxComponent} from "../../form-builder";
import {FxEventProcessorDirective} from "../../form-processor/fx-event-processor-directive";
import { FxBaseComponent } from '../../../core';


@Component({
  standalone: true,
  selector: 'fx-checkbox',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FxValidationProcessorComponent, FxComponent, FxEventProcessorDirective],
  template: `
    <fx-component [fxData]="fxData" *ngIf="formControl">
      <div>
        <label>
          <input type="checkbox" class="form-checkbox mr-3"
                 [formControl]="formControl" [fx-event-handler]="fxData.events" />
          <span class="mt-1">{{ setting('label') }}</span>
        </label>
      </div>
      <fx-validation-processor *ngIf="fxData.validations"
                               [control]="formControl"
                               [element]="fxData"></fx-validation-processor>
    </fx-component>
  `
})
export class FxCheckboxComponent extends FxBaseComponent implements AfterViewInit{

  items: any[] = [];
  formControl?: FormControl;

  constructor(private cdr: ChangeDetectorRef) {
    super(cdr);
    this.onInit.subscribe((fxData)=>{
      this.formControl = new FormControl(fxData.value);
      this._register(this.formControl);
    })
  }

  ngAfterViewInit() {
    if(this.setting('state')=='disable'){
      this.formControl?.disable();
    }
  }

  protected settings(): FxSetting[] {
    return [
      new FxStringSetting({key: 'label', $title: 'Display Label', value: 'Default Label'}),
      new FxSelectSetting({key: 'state', $title: 'Enable/Disable', value: 'enable'}, [
        { option: 'Enable', value: 'enable', description: 'Enable Checkbox' },
        { option: 'Disable', value: 'disable', description: 'Disable Checkbox' }
      ])
    ];
  }

  protected validations(): FxValidation[] {
    return [FxValidatorService.required];
  }

}
