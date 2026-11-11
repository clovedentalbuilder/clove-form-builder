import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FxComponentResolver, FxFormComponent } from '../../form-processor';
import { FxMode, FxSetting, FxValidation } from '../../../classes';
import { DndModule } from 'ngx-drag-drop';
import { FormArray, FormGroup } from '@angular/forms';
import { FxModalService } from '../../../services';
import { FxBaseComponent } from '../../../core';
import { FxUtils } from '../../../utils';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DndModule,
    FxFormComponent,
  ],
  selector: 'fx-add-more-layout',
  template: `
    <ng-container
      *ngIf="
        fxData && fxData.elements && fxData.$fxForm && fxData.$fxForm.$mode
      "
    >
      <ng-container *ngFor="let form of fxData.elements; let i = index">
        <span
          class="fa fa-times float-right cursor-pointer mr-3 mt-3 text-red-700"
          (click)="delete(i)"
          *ngIf="
            fxData.$fxForm?.$mode === FxMode.VIEW && fxData.elements.length > 1
          "
        ></span>
        <fx-form
          [fxForm]="form"
          [formGroup]="getFG(i)"
          [mode]="fxData.$fxForm.$mode"
        ></fx-form>
      </ng-container>
    </ng-container>
    <button
      class="btn btn-primary btn-outline"
      (click)="addMore()"
      [disabled]="fxData.$fxForm?.$mode !== FxMode.VIEW"
    >
      <i class="fa fa-plus"></i> Add More
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
  styles: [
    `
      .droppable {
        border: 2px red dashed;
      }
    `,
  ],
})
export class FxAddMoreLayoutComponent extends FxBaseComponent {
  formArray: FormArray = new FormArray<any>([]);
  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: FxModalService
  ) {
    super(cdr);
    this.onInit.subscribe((fxData) => {
      if (fxData.elements?.length == 0) {
        fxData.elements.push({
          id: FxUtils.generateUUID(),
          name: 'inner-form',
          elements: [
            {
              id: FxUtils.generateUUID(),
              name: 'layout',
              elements: [],
              type: 'LAYOUT',
              selector: 'fx-card-layout',
            },
          ],
          logics: [],
          type: 'FORM',
          after: [],
          before: [],
        });
      }

      if (fxData.elements) {
        for (let fg of fxData.elements) {
          let formGroup = new FormGroup([]);
          this.formArray.push(formGroup);
          this._register(this.formArray);
        }
      }
    });
  }

  addMore() {
    if (this.fxData.elements) {
      let formGroup: FormGroup = new FormGroup<any>([]);
      this.formArray.push(formGroup);
      this.fxData.elements.push(FxUtils.copyForm(this.fxData.elements[0]));
      this.fxData.$parent?.render();
    }
  }

  getFG(index: number): FormGroup {
    return this.formArray.at(index) as FormGroup;
  }

  protected settings(): FxSetting[] {
    return [];
  }

  protected validations(): FxValidation[] {
    return [];
  }

  delete(i: number) {
    if (this.fxData.elements && this.fxData.elements?.length > 1) {
      this.formArray.removeAt(i);
      this.fxData.elements?.splice(i, 1);
    }
  }

  protected readonly FxMode = FxMode;
}
