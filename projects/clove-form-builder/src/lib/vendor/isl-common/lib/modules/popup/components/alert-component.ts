import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent, ModalModule } from '../../modal';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ModalModule
  ],
  template: `
    <span class="bg-success"></span>
    <span class="bg-danger"></span>
    <span class="bg-warning"></span>
    <span class="bg-primary"></span>

    <!--<div #modal tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full" style="background: rgba(0,0,0,0.5)">
      <div class="relative w-full max-w-2xl max-h-full">
        &lt;!&ndash; Modal content &ndash;&gt;
        <div class="relative bg-white rounded-lg dark:bg-gray-700 drop-shadow-2xl p-0 mt-12 overflow-hidden">
          &lt;!&ndash; Modal header &ndash;&gt;
          <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600 alert-header" [ngClass]="'bg-'+style">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ data.title }}
            </h3>
            <button type="button" (click)="hide()" class="text-white p-2">
             <i class="fa fa-times"></i>
            </button>
          </div>
          &lt;!&ndash; Modal body &ndash;&gt;
          <div class="p-4">
            <div class="text-base leading-relaxed text-gray-500 dark:text-gray-400" [innerHTML]="data.message" ></div>
          </div>
          &lt;!&ndash; Modal footer &ndash;&gt;
          <div class="overflow-auto p-4 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button (click)="hide()" type="button" class="float-end" [ngClass]="'btn-'+style" >OK</button>
          </div>
        </div>
      </div>
    </div>-->

    <modal #modal>
      <modal-header [class]="'bg-'+style">
        <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600 alert-header">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ data.title }}
          </h3>
          <button type="button" (click)="hide()" class="text-white p-2">
            <i class="fa fa-times"></i>
          </button>
        </div>
      </modal-header>
      <modal-body>
        <div class="p-4">
          <div class="text-base leading-relaxed text-gray-500 dark:text-gray-400" [innerHTML]="data.message" ></div>
        </div>
      </modal-body>
      <modal-footer>
        <div class="overflow-auto p-4 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button (click)="hide()" type="button" class="float-end" [ngClass]="'btn-'+style" >OK</button>
        </div>
      </modal-footer>
    </modal>


  `,
  styles: [`
    .bg-primary h3, .bg-danger h3, .bg-success h3{
      @apply text-white;
    }

    .bg-default .fa-times{
      color: black !important;
    }

  `]
})
export class AlertComponent{

  @ViewChild(ModalComponent) protected modal: ModalComponent;

  @Input("data")
  public data: { title: string, message: string } = { title: "Alert", message: '' };

  @Input("style")
  public style: 'danger' | 'info' | 'primary' | 'warning' | 'success' | 'default' = 'primary';

  show() {
    this.modal.show()
  }

  hide(){this.modal.hide()};

}
