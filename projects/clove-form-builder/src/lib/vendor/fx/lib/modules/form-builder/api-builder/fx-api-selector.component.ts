import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FxApiService} from "../../../services";
import {FxApi} from "../../../classes";
import { ApiServiceRegistry } from '../../../../../isl-core';


@Component({
  standalone: true,
  selector: 'fx-api-selector',
  imports: [CommonModule],
  template: `


      <h3>Select API</h3>
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded shadow">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
              <th scope="col" class="px-2 py-3">
                  URL/Name
              </th>
          </tr>
          </thead>
          <tbody>
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" *ngFor="let api of fxApis">
              <th scope="row" class="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div class="text-blue-600 font-bold cursor-pointer hover:underline"
                       (click)="onApiSelect.emit(api)">{{ api.uri }}
                  </div>
                  <div class="text-xs mt-1">
                      <b class="me-2">{{ api.method }}</b> <span>{{ apiServiceRegistry.getServiceUrl(api.service) }}</span>
                  </div>
              </th>
          </tr>
          </tbody>
      </table>

  `
})
export class FxApiSelectorComponent{

  protected apiServiceRegistry: ApiServiceRegistry = inject(ApiServiceRegistry)

  @Output("onApiSelect")
  onApiSelect: EventEmitter<FxApi> = new EventEmitter<FxApi>();

  fxApis: FxApi[] = [];

}
