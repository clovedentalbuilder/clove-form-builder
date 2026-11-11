import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FxMode, FxSetting, FxValidation } from '../../../classes';
import { FxComponent } from '../../form-builder';
import { FxBaseComponent } from '../../../core';
import { FxFormComponent } from '../../form-processor/fx-form.component';

@Component({
  selector: 'fx-form-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FxComponent,
    FxFormComponent,
    forwardRef(() => FxFormComponent)
  ],
  template: `
    <fx-component [fxData]="fxData" *ngIf="formControl">
      <div [id]="fxData.id">
        <fx-form [fxForm]="fxData.value" [formGroup]="formControl"></fx-form>
      </div>
    </fx-component>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FxFormFieldComponent extends FxBaseComponent{

  protected settings(): FxSetting[] {
    return [];
  }

  protected override validations(): FxValidation[] {
    return [];
  }

  formControl: FormGroup = new FormGroup({});

  constructor(private cdr: ChangeDetectorRef) {
    super(cdr);
    this.onInit.subscribe((fxData)=>{
      super._register(this.formControl);
    })
  }

  protected readonly FxMode = FxMode;
}
