import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FxLogic, FxLogicStatement } from '../../../classes';
import { Modal, ModalInterface, ModalOptions } from 'flowbite';
import { FxLogicConditionBuilder } from './fx-logic-condition-builder';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FxLogicActionBuilder } from './fx-logic-action-builder';
import { InputComponent, TextareaComponent } from '../../../../../isl-common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FxLogicConditionBuilder,
    ReactiveFormsModule,
    FormsModule,
    FxLogicActionBuilder,
    TextareaComponent,
    InputComponent,
  ],
  selector: 'fx-logic-designer',
  template: `
    <div
      #modal
      id="large-modal"
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
              Logic Designer
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
          <div class="p-6 space-y-6 min-h-[500px]">
            <ng-container *ngIf="logic">
              <div class="grid grid-cols-3 gap-3">
                <div>
                  <!--<label>Logic</label>
                  <input type="text" placeholder="Enter your logic title" class="form-control" [(ngModel)]="logic.name" />-->
                  <form-input
                    placeholder="Enter Logic Title"
                    [(ngModel)]="logic.name"
                    label="Logic Title"
                  ></form-input>
                </div>
                <div>
                  <!--<textarea rows="1" placeholder="Enter Description" class="form-control" [(ngModel)]="logic.description"></textarea>-->
                  <form-textarea
                    [rows]="1"
                    placeholder="Enter Descriptionat about the logic"
                    [(ngModel)]="logic.description"
                  ></form-textarea>
                </div>
              </div>

              <div *ngFor="let statement of logic.statements; let i = index">
                <div class="flex justify-between">
                  <label class="text-gray-600 inline">
                    <i class="fa fa-magic"></i> Statement [{{ i + 1 }}]</label
                  >
                  <label
                    class="text-blue-600 underline cursor-pointer inline"
                    (click)="removeStatement(statement)"
                  >
                    <i class="fa fa-trash"></i> Remove Statement</label
                  >
                </div>
                <div class="text-gray-500">
                  <div class="p-3 pl-5 border rounded shadow">
                    <div *ngIf="statement.if">
                      <label> <i class="fa fa-hand-o-right"></i> WHEN</label>
                      <div class="p-3 pl-5 border rounded shadow">
                        <label>Conditions</label>
                        <fx-condition-builder
                          [conditions]="statement.if.conditions"
                        ></fx-condition-builder>
                        <div>
                          <hr />
                          <label class="mt-5"
                            >THEN DO <i class="fa fa-magic"></i
                          ></label>
                          <div>
                            <fx-logic-action-builder
                              [actions]="statement.if.actions"
                            ></fx-logic-action-builder>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div *ngIf="statement.else" class="mt-3 ml-5">
                      <label
                        class="text-blue-600 underline cursor-pointer inline float-right"
                        (click)="removeElse(statement)"
                      >
                        <i class="fa fa-trash"></i> Remove</label
                      >
                      <label>
                        <i class="fa fa-hand-o-right"></i> OTHERWISE</label
                      >
                      <div class="p-3 pl-5 border rounded shadow">
                        <label>Conditions</label>
                        <fx-condition-builder
                          [conditions]="statement.else.conditions"
                        ></fx-condition-builder>
                        <div>
                          <hr />
                          <label class="mt-5"
                            >THEN DO <i class="fa fa-magic"></i
                          ></label>
                          <div>
                            <fx-logic-action-builder
                              [actions]="statement.else.actions"
                            ></fx-logic-action-builder>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div *ngIf="!statement.else" class="mt-4">
                      <label
                        class="text-blue-600 underline cursor-pointer inline"
                        (click)="addElseBlock(statement)"
                      >
                        <i class="fa fa-hand-o-right"></i> OTHERWISE</label
                      >
                    </div>
                  </div>
                </div>
              </div>
              <button
                class="btn btn-primary btn-outline p-1 m-0"
                (click)="addNewStatement()"
              >
                <i class="fa fa-plus"></i> Add New Statement
              </button>
            </ng-container>
          </div>

          <!-- Modal footer -->
          <div
            class="overflow-auto p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600 text-right"
          >
            <button
              (click)="hide()"
              type="button"
              class="btn-primary float-end"
            >
              Cancel
            </button>
            <button
              (click)="submit()"
              type="button"
              class="btn-primary float-end"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FxLogicDesigner {
  protected logic!: FxLogic;

  @ViewChild('modal') $modalElement!: ElementRef;
  private modal!: ModalInterface;
  public modalOptions: ModalOptions = {
    placement: 'top-center',
    backdrop: 'dynamic',
    backdropClasses:
      'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
    closable: false,
  };

  @Output()
  public onSubmit: EventEmitter<FxLogic> = new EventEmitter<FxLogic>();

  public load(fxLogic: FxLogic) {
    this.logic = fxLogic;
    this.show();
  }

  private show() {
    this.modal = new Modal(this.$modalElement.nativeElement, this.modalOptions);
    this.modal.show();
  }
  protected hide() {
    this.modal.hide();
  }

  protected addNewStatement() {
    this.logic.statements.push({
      if: {
        separator: 'AND',
        conditions: [],
        actions: [],
      },
    });
  }

  protected addElseBlock(statement: FxLogicStatement) {
    if (!statement.else)
      statement.else = {
        separator: 'AND',
        conditions: [],
        actions: [],
      };
  }

  removeStatement(statement: FxLogicStatement) {
    this.logic.statements.splice(this.logic.statements.indexOf(statement), 1);
  }

  removeElse(statement: FxLogicStatement) {
    statement.else = undefined;
  }

  submit() {
    this.onSubmit.emit(this.logic);
    this.hide();
  }
}
