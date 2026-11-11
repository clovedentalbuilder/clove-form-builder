import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal, ModalInterface, ModalOptions } from 'flowbite';
import { FormsModule } from '@angular/forms';
import { FxApi } from '../../../classes';
import { ApiServiceRegistry } from '../../../../../isl-core';

@Component({
  selector: 'fx-api-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `

      <div class="text-gray-100">

          <h3><span>API's</span></h3>

          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded shadow">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                  <th scope="col" class="px-2 py-3">
                      URL/Name
                  </th>
                  <th scope="col" class="px-2 py-3">
                      Action
                  </th>
              </tr>
              </thead>
              <tbody>
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" *ngFor="let api of apiList">
                  <th scope="row" class="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div class="text-blue-600 font-bold">{{ api.uri }}</div>
                      <div class="text-xs mt-1">
                          <b class="me-2">{{ api.method }}</b> <span>{{ fxApiService.getServiceUrl(api.service) }}</span>
                      </div>
                  </th>
                  <td class="px-2 py-4">
                      <i class="fa fa-pencil me-2"></i>
                      <i class="fa fa-trash"></i>
                  </td>
              </tr>
              </tbody>
          </table>

          <button class="btn btn-primary" (click)="addOrEditApi()"><i class="fa fa-plus"></i> Add New API</button>

      </div>


      <div #apiModal
           class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div class="relative w-full max-w-7xl max-h-full">
              <!-- Modal content -->
              <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <!-- Modal header -->
                  <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                          Add/Edit API
                      </h3>
                  </div>
                  <!-- Modal body -->
                  <div class="p-6 space-y-6">

                      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded shadow">
                          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                              <th scope="col" class="px-2 py-3">
                                  URL/Name
                              </th>
                              <th scope="col" class="px-2 py-3">
                                  Action
                              </th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                              *ngFor="let api of apiList">
                              <th scope="row"
                                  class="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                  <div class="text-blue-600 font-bold">{{ api.uri }}</div>
                                  <div class="text-xs mt-1">
                                      <b class="me-2">{{ api.method }}</b>
                                      <span>{{ fxApiService.getServiceUrl(api.service) }}</span>
                                  </div>
                              </th>
                              <td class="px-2 py-4">
                                  <i class="fa fa-pencil me-2"></i>
                                  <i class="fa fa-trash"></i>
                              </td>
                          </tr>
                          </tbody>
                      </table>


                  </div>
                  <!-- Modal footer -->
                  <div class="overflow-auto p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                      <button (click)="hide()" type="button" class="btn-primary float-end">Done</button>
                  </div>
              </div>
          </div>
      </div>



  `
})
export class FxApiBuilderComponent{

  @ViewChild("apiModal", {static: true})
  $modalElement!: ElementRef;

  private modal!: ModalInterface;

  public modalOptions: ModalOptions = {
    placement: 'top-center',
    backdrop: 'dynamic',
    backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
    closable: false
  }

  apiList: FxApi []  = []

  constructor(public fxApiService: ApiServiceRegistry) {}

  addOrEditApi(){
    this.modal = new Modal(this.$modalElement.nativeElement, this.modalOptions);
    this.modal.show();
  }
  hide(){this.modal.hide()};

}
