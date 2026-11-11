import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FxAction, FxData } from '../../../classes';
import { Modal, ModalInterface, ModalOptions } from 'flowbite';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'fx-logic-action-properties',
  template: `
    <div
      #modal
      tabindex="-1"
      class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div class="relative w-full max-w-4xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div
            class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Action Settings
              <span class="text-gray-500 ml-3" *ngIf="fxAction"
                >#{{ fxAction.$title }}</span
              >
            </h3>
            <button
              type="button"
              (click)="hide()"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-6 space-y-6">
            <ng-container *ngIf="fxAction">
              <div
                class="grid grid-cols-3 gap-3 mb-3"
                *ngFor="let setting of fxAction?.properties!"
              >
                <div>
                  <label>{{ setting.$title }}</label>
                  <div
                    class="text-xs italic text-gray-600"
                    *ngIf="setting.$description"
                  >
                    <i class="fa fa-info-circle"></i> {{ setting.$description }}
                  </div>
                </div>
                <div>{{ setting.type }}</div>
                <div>
                  <textarea
                    class="form-control form-textarea"
                    rows="1"
                    [(ngModel)]="setting.value"
                  ></textarea>
                </div>
              </div>
            </ng-container>
          </div>
          <!-- Modal footer -->
          <div
            class="overflow-auto p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
          >
            <button
              (click)="done()"
              type="button"
              class="btn-primary float-end"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FxLogicActionProperties {
  @ViewChild('modal', { static: true })
  $modalElement!: ElementRef;

  protected fxAction!: FxAction;

  @Output()
  public onSettingChange: EventEmitter<FxData> = new EventEmitter<FxData>();

  private modal!: ModalInterface;

  public modalOptions: ModalOptions = {
    placement: 'top-center',
    backdrop: 'dynamic',
    backdropClasses:
      'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
    closable: false,
  };

  load(fxAction: FxAction) {
    this.modal = new Modal(this.$modalElement.nativeElement, this.modalOptions);
    this.fxAction = fxAction;
    this.modal.show();
  }
  protected hide() {
    this.modal.hide();
  }
  done() {
    this.hide();
  }
}
