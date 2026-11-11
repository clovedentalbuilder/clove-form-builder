import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Modal, ModalInterface, ModalOptions} from "flowbite";
import {FormGroup, FormsModule} from "@angular/forms";
import {FxFormComponent} from "../form-processor";
import {FxForm} from "../../classes";
import { ModalComponent, ModalModule } from '../../../../isl-common';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@Component({
  selector: 'fx-form-preview',
  standalone: true,
  imports: [CommonModule, FormsModule, FxFormComponent, ModalModule, NgxJsonViewerModule],
  template: `


    <modal [size]="'h-full'"  #previewModal>
      <modal-header>
        <h2 class="heading !mb-0">Form Preview</h2>
      </modal-header>
      <modal-body>

        <div class="p-6">
          <ng-container *ngIf="!output">
            <fx-form [fxForm]="fxForm"
                     [value]="formValue"
                     (onSubmit)="onFormSubmit($event)"
                     *ngIf="fxForm && fxForm.elements.length > 0" ></fx-form>
          </ng-container>

          <ng-container *ngIf="output">
            <h3 class="heading">After Submit</h3>
            <div class="text-lg">
              <ngx-json-viewer [json]="output"  ></ngx-json-viewer>
            </div>

          </ng-container>
        </div>

      </modal-body>
      <modal-footer>
        <div>
          <button (click)="form.submit()" type="button" class="btn btn-primary btn-outline"> <i class="fa fa-check me-2"></i> Submit (Dry Run)</button>
          <button (click)="output = undefined" [disabled]="!output" type="button" class="btn btn-soft btn-outline"> <i class="fa fa-arrow-turn-left me-2"></i> Reset</button>
          <button (click)="hide()" type="button" class="btn btn-error btn-outline"> <i class="fa fa-times me-2"></i> Close</button>
        </div>
      </modal-footer>
    </modal>


  `,
  styles: [],
})
export class FxFormPreviewComponent {

  @ViewChild("modal")
  $modalElement!: ElementRef;

  @Input()
  fxForm?: FxForm;

  @ViewChild(FxFormComponent)
  form!: FxFormComponent;

  @ViewChild(ModalComponent) modal: ModalComponent

  protected formValue: any;

  public modalOptions: ModalOptions = {
    placement: 'top-center',
    backdrop: 'static',
    backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
    closable: true
  }

  public output: any = undefined;

  show() {
    this.output = undefined;
    this.modal.show();
  }

  hide(){this.modal.hide()};

  onFormSubmit(form: FormGroup) {
    if(form.valid){
      this.output = form.value;
    }
  }
}
