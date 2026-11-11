import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import { FxSetting, FxSelectSetting, FxValidation, FxOptionSetting, FxMode, asOptionSetting } from '../../../classes';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FxValidationProcessorComponent} from "../../form-processor/fx-validation-processor.component";
import {FxValidatorService} from "../../../services";
import {FxComponent} from "../../form-builder";
import {FxEventProcessorDirective} from "../../form-processor/fx-event-processor-directive";
import { FxBaseComponent } from '../../../core';


@Component({
  standalone: true,
  selector: 'fx-checkbox-group',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FxValidationProcessorComponent, FxComponent, FxEventProcessorDirective],
  template: `
    <fx-component [fxData]="fxData" *ngIf="formGroup">
      @if (fxData.$fxForm?.$mode == FxMode.VIEW){
        <div [formGroup]="formGroup">
          <div class="grid" [ngClass]="setting('display') === 'h' ? 'grid-cols-4' : ''">
            <label *ngFor="let item of items">
              <input type="checkbox" class="form-checkbox mr-3" [formControlName]="item.value" [fx-event-handler]="fxData.events" />
              <span class="mt-1">{{ item.option }}</span>
            </label>
          </div>
        </div>
        <fx-validation-processor *ngIf="fxData.validations"
                                 [control]="formGroup"
                                 [element]="fxData"></fx-validation-processor>
      } @else {
        <div *ngIf="asOptionSetting(settingObj('items')) as optionItems">
          <div class="grid" [ngClass]="setting('display') === 'h' ? 'grid-cols-4' : ''">
            <label *ngFor="let item of optionItems.options">
              <input type="checkbox" class="form-checkbox mr-3" />
              <span class="mt-1">{{ item.option }}</span>
            </label>
          </div>
        </div>
      }
    </fx-component>
  `
})
export class FxCheckboxGroupComponent extends FxBaseComponent implements AfterViewInit{

  items: any[] = [];
  formGroup?: FormGroup;

  constructor(private cdr: ChangeDetectorRef) {
    super(cdr);
    this.onInit.subscribe((fxData)=>{
      this.formGroup = new FormGroup<any>({});
      this._register(this.formGroup);
    })
  }

  ngAfterViewInit() {
    for(let item of (this.settingObj('items') as FxOptionSetting).options){
      let formControl: FormControl = new FormControl<any>('');
      this.formGroup?.addControl(item.value, formControl);
      this.items.push(item);
      this.cdr.detectChanges();
    }
  }

  protected settings(): FxSetting[] {
    return [
      new FxSelectSetting(
        { key: 'display', value: 'v', $title: 'Display Style', $description: 'Choose display style `HORIZONTAL` of `VERTICAL`' },
        [{ option: 'Horizontal', value: 'h'}, { option: 'Vertical', value: 'v' } ] ),
      new FxOptionSetting(
        { key: 'items', value: '', $title: 'Items', $description: 'Items'},
        [{ option: 'checkbox1', value: 'checkbox1'}, { option: 'checkbox2', value: 'checkbox2' } ] )];
  }

  protected validations(): FxValidation[] {
    return [FxValidatorService.selectOne];
  }

  protected readonly FxMode = FxMode;
  protected readonly asOptionSetting = asOptionSetting;
}
