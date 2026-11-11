import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {
  FxApi,
  FxApiSetting,
  FxSelectSetting,
  FxSetting,
  FxStringSetting,
  FxValidation
} from "../../../classes";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FxValidationProcessorComponent} from "../../form-processor/fx-validation-processor.component";
import {FxApiService, FxValidatorService} from "../../../services";
import {FxComponent} from "../../form-builder";
import { FxBaseComponent } from '../../../core';
import { FxEventProcessorDirective } from '../../form-processor/fx-event-processor-directive';
import { FxUtils } from '../../../utils';


@Component({
  standalone: true,
  selector: 'fx-smart-checkbox-group',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FxValidationProcessorComponent, FxComponent, FxEventProcessorDirective],
  template: `
    <fx-component [fxData]="fxData" *ngIf="formGroup">
      <div [formGroup]="formGroup">
        <div class="grid" [ngClass]="setting('display') === 'h' ? 'grid-cols-4' : ''">
            <label class="flex" *ngFor="let item of items">
                <input type="checkbox" class="form-checkbox mr-3 mt-2"
                       [fx-event-handler]="fxData.events"
                       [formControlName]="item[this.setting('value-key')]" />
                <span class="mt-1">{{ item[this.setting('display-key')] }}</span>
            </label>

          <span *ngIf="items.length == 0" class="text-gray-400 italic text-sm">
            No items found
          </span>

        </div>
      </div>
      <fx-validation-processor *ngIf="fxData.validations"
                               [control]="formGroup"
                               [element]="fxData"></fx-validation-processor>
    </fx-component>
  `
})
export class FxSmartCheckboxGroupComponent extends FxBaseComponent implements AfterViewInit{

  items: any[] = [];
  formGroup?: FormGroup;

  constructor(cdr: ChangeDetectorRef, private apiService: FxApiService) {
    super(cdr);
    this.onInit.subscribe((fxData)=>{
      this.formGroup = new FormGroup<any>({});
      this._register(this.formGroup);

      this.fxData.$settingChangeEvent.subscribe((setting)=>{
        this.loadApi(this.settingObj('api') as FxApiSetting);
      })

    })
  }

  ngAfterViewInit() {
    this.loadApi(this.settingObj('api') as FxApiSetting);
  }

  private loadApi(apiSetting: FxApiSetting){
    let sli : FxApi | null = apiSetting.api;
    if(sli){
      this.items = [];
      this.apiService.load(sli).then(res => {
        for(let item of res.content){
          let formControl: FormControl = new FormControl<any>(false);
          this.formGroup?.addControl(item[this.setting('value-key')], formControl);
          this.items.push(item);
        }
        this.refresh();
      })
    }
  }

  protected settings(): FxSetting[] {
    return [
      new FxSelectSetting({key: 'display', $title: 'Display Style', $description: 'Choose display style `HORIZONTAL` or `VERTICAL`', value: 'v'},
        [{ option: 'Horizontal', value: 'h'}, { option: 'Vertical', value: 'v' } ] ),
      new FxApiSetting({ key: 'api', value: '', $title: 'Attache API', $description: 'Attach your api' }, null ),
      new FxStringSetting({key: 'display-key', $title: 'Display Key', value: "name"}),
      new FxStringSetting({key: 'value-key', $title: 'Value Key', value: ""})
      ]
  }

  protected validations(): FxValidation[] {
    return [FxValidatorService.selectOne];
  }

}
