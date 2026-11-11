import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  asOptionSetting,
  asSelectSetting,
  FxIconSetting,
  FxOptionSetting,
  FxSetting,
  FxStringSetting,
  FxValidation,
} from '../../../classes';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FxValidationProcessorComponent } from '../../form-processor/fx-validation-processor.component';
import { FxValidatorService } from '../../../services';
import { FxComponent } from '../../form-builder';
import { SelectComponent } from '../../../../../isl-common';
import { FxBaseComponent } from '../../../core';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FxValidationProcessorComponent,
    FxComponent,
    SelectComponent,
  ],
  selector: 'fx-select-list',
  template: `
    <fx-component [fxData]="fxData" *ngIf="formControl">
      <ng-container
        *ngIf="asOptionSetting(settingObj('items')) as selectSetting"
      >
        <form-select
          [source]="selectSetting.options"
          [label]="setting('label')"
          [icon]="setting('icon')"
          [placeholder]="setting('placeholder')"
          [formControl]="formControl"
          class="mt-8"
          option-value="$value"
          option-title="$option"
        ></form-select>
      </ng-container>

      <fx-validation-processor
        *ngIf="fxData.validations"
        [control]="formControl"
        [element]="fxData"
      ></fx-validation-processor>
    </fx-component>
  `,
})
export class FxSelectListComponent extends FxBaseComponent {
  formControl!: FormControl;

  constructor(private cdr: ChangeDetectorRef) {
    super(cdr);
    this.onInit.subscribe((fxData) => {
      this.fxData.events = null;
      this.formControl = new FormControl<any>(fxData.name);
      super._register(this.formControl);
    });
  }

  protected settings(): FxSetting[] {
    return [
      new FxIconSetting({
        key: 'icon',
        $title: 'Field Icon',
        value: '',
      }),
      new FxStringSetting({
        key: 'label',
        $title: 'Label Text',
        value: 'Label Text',
      }),
      new FxStringSetting({
        key: 'placeholder',
        $title: 'Placeholder Text',
        value: 'Select Option',
      }),
      new FxOptionSetting(
        {
          key: 'items',
          value: '',
          $title: 'Options',
          $description: 'Accept JSON format',
        },
        [
          { option: 'Option 1', value: 'value 1' },
          { option: 'Option 2', value: 'value 2' },
        ]
      ),
    ];
  }

  protected validations(): FxValidation[] {
    return [FxValidatorService.required];
  }

  protected readonly asSelectSetting = asSelectSetting;
  protected readonly asOptionSetting = asOptionSetting;
}
