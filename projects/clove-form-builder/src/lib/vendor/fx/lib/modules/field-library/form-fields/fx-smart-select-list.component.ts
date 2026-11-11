import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FxApi,
  FxApiData,
  FxApiSetting,
  FxIconSetting,
  FxMode,
  FxSetting,
  FxStringSetting,
  FxValidation
} from '../../../classes';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FxValidationProcessorComponent } from '../../form-processor/fx-validation-processor.component';
import { FxApiService, FxValidatorService } from '../../../services';
import { FxComponent } from '../../form-builder';
import { FxBaseComponent } from '../../../core';
import { SelectComponent } from '../../../../../isl-common';


@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FxValidationProcessorComponent, FxComponent, SelectComponent],
  selector: 'fx-smart-select-list',
  template: `
    <fx-component [fxData]="fxData">

      @if (fxData.$fxForm?.$viewMode == FxMode.VIEW) {
        <div>
          <label *ngIf="setting('label')" class="text-sm font-semibold text-gray-500 uppercase">{{ setting('label') }}
            :</label>
          <p *ngIf="formControl.value" class="text-lg font-medium text-gray-800">{{ formControl.value }}</p>
          <p *ngIf="!formControl.value" class="text-sm font-medium text-gray-500">N/A</p>
        </div>
      } @else {
        <form-select [source]="(fxApi?.$state | async)?.content"
                     [label]="setting('label')"
                     [option-title]="setting(displayKey)"
                     [option-value]="setting(valueKey)"
                     [placeholder]="setting('placeholder')"
                     [option-description]="setting(descriptionKey)"
                     [formControl]="formControl"></form-select>
        <fx-validation-processor *ngIf="fxData.validations"
                                 [control]="formControl"
                                 [element]="fxData"></fx-validation-processor>
      }
    </fx-component>
  `
})
export class FxSmartSelectListComponent extends FxBaseComponent implements AfterViewInit{

  private fxApiService: FxApiService = inject(FxApiService);
  protected fxApi: FxApi | null = null;


  displayKey: string = 'display-key';
  valueKey: string = 'value-key';
  descriptionKey: string = 'description-key';

  @ViewChild("triggerElement") triggerElement?: ElementRef;
  @ViewChild("targetElement") targetElement?: ElementRef;

  protected formControl!: FormControl;

  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
    this.onInit.subscribe((fxData)=>{
      this.fxData.events = null;
      this.formControl = new FormControl<any>(fxData.name);
      super._register(this.formControl);
    })
  }

  ngAfterViewInit() {
    this.fxApi = (this.settingObj('api') as FxApiSetting).api;
    if(this.fxApi) {
      this.fxApiService.init(this.fxApi);
      this.fxApiService.load(this.fxApi);
    }
  }

  protected settings(): FxSetting[] {
    return [
      new FxIconSetting({
        key:"icon",
        $title: "Field Icon",
        value: ""
      }),
      new FxStringSetting({key: 'label', $title: 'Label Text', value: "Label Text"}),
      new FxStringSetting({key: 'placeholder', $title: 'Placeholder Text', value: "Select Item"}),
      new FxApiSetting({ key: 'api', value: '', $title: 'Attache API', $description: 'Attach your api' }, null ),
      new FxStringSetting({key: this.displayKey, $title: 'Display Key', $description: 'Use "$" as prefix to resolve data from incoming json ', value: "name"}),
      new FxStringSetting({key: this.descriptionKey, $title: 'Description Key', $description: 'Use "$" as prefix to resolve data from incoming json ', value: "description"}),
      new FxStringSetting({key: this.valueKey, $title: 'Value Key', $description: 'Use "$" as prefix to resolve data from incoming json ', value: ""}),
    ];
  }

  protected validations(): FxValidation[] {
    return [
      FxValidatorService.required
    ];
  }

  protected readonly FxMode = FxMode;
}
