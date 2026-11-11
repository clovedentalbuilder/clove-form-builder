import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {
  asOptionSetting,
  FxOptionSetting,
  FxSelectSetting,
  FxSetting,
  FxValidation
} from "../../../classes";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FxValidationProcessorComponent} from "../../form-processor/fx-validation-processor.component";
import {FxValidatorService} from "../../../services";
import {FxComponent} from "../../form-builder";
import { FxBaseComponent } from '../../../core';
import { FxEventProcessorDirective } from '../../form-processor/fx-event-processor-directive';


@Component({
  standalone: true,
  selector: 'fx-radio',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FxValidationProcessorComponent, FxComponent, FxEventProcessorDirective],
  template: `
    <fx-component [fxData]="fxData" *ngIf="formControl">
      <div class="grid" [ngClass]="setting('display') === 'h' ? 'grid-cols-4' : ''">
        <ng-container *ngIf="settingObj('items') && asOptionSetting(settingObj('items')) as optionsSetting">
          <label *ngFor="let item of optionsSetting.options">
            <input type="radio" class="form-radio mr-3" [value]="item.value" [fx-event-handler]="fxData.events" [formControl]="formControl" />
            <span class="mt-1">{{ item.option }}</span>
          </label>
        </ng-container>
      </div>
      <fx-validation-processor *ngIf="fxData.validations"
                               [control]="formControl"
                               [element]="fxData"></fx-validation-processor>
    </fx-component>
  `
})
export class FxRadioComponent extends FxBaseComponent{

  formControl?: FormControl;

  constructor(private cdr: ChangeDetectorRef) {
    super(cdr);
    this.onInit.subscribe((fxData)=>{
      this.formControl = new FormControl<any>(fxData.value);
      this._register(this.formControl);
    })
  }

  protected settings(): FxSetting[] {
    return [

      new FxSelectSetting({key: 'display', $title: 'Display Style', $description: 'Choose display style `HORIZONTAL` of `VERTICAL`', value: 'v'},
        [{option: 'Horizontal', value: 'h'}, {option: 'Vertical', value: 'v'}]),

      new FxOptionSetting({key: 'items', $title: 'Items', $description: 'Items', value: ''},
        [{option: 'item 1', value: 'item'}])];

  }

  protected validations(): FxValidation[] {
    return [FxValidatorService.required];
  }

  protected readonly asOptionSetting = asOptionSetting;
}
