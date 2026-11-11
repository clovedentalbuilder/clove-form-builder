import {
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal, ModalInterface, ModalOptions } from 'flowbite';
import { FormsModule } from '@angular/forms';
import { FxApi, FxApiParameter, FxApiSetting } from '../../../classes';
import { FxOperandSelectorComponent } from '../../../components/fx-operand-selector.component';
import { ApiServiceRegistry } from '../../../../../isl-core';
import { SelectComponent } from '../../../../../isl-common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'fx-api-connector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FxOperandSelectorComponent,
    SelectComponent,
  ],
  template: `
    <div
      #apiModal
      class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div class="relative w-full max-w-7xl max-h-full" *ngIf="isInit">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div
            class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              API Connector
            </h3>
          </div>
          <!-- Modal body -->
          <div class="h-[600px]">
            <div class="flex h-full">
              <div class="flex flex-col border-r overflow-auto min-w-80">
                <div class="p-4">
                  <form-select
                    label="Select API Service"
                    placeholder="Chick here to select service"
                    [source]="apiServiceRegistry.getServices()"
                    option-title="$service"
                    option-description="$url"
                    option-value="$service"
                    (onSelect)="onApiSelect($event)"
                    [(ngModel)]="selectedApiService"
                    option-icon="fa fa-code"
                  ></form-select>
                </div>

                <div class="flex-grow overflow-auto">
                  <div *ngIf="apiList" class="p-4">
                    <div *ngFor="let api of apiList | keyvalue">
                      <div
                        class="card !p-2 mb-1 text-blue-500 font-semibold cursor-pointer hover:bg-gray-200"
                        title="Click to attach"
                        (click)="use(api.key, api.value)"
                      >
                        {{ api.key }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="overflow-auto p-6 flex-grow">
                <div *ngIf="selectedApi">
                  <h3 class="font-semibold">API Configuration</h3>
                  <hr class="my-3" />
                  <button class="btn btn-secondary btn-outline">
                    {{ selectedApi.uri }}
                  </button>
                  <p class="text-primary text-xs font-semibold">
                    {{ apiServiceRegistry.getServiceUrl(selectedApi.service) }}
                  </p>

                  <ng-container *ngIf="selectedApi.parameters">
                    <table
                      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-6"
                    >
                      <thead
                        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                      >
                        <tr>
                          <th scope="col" class="px-2 py-3">Segment Name</th>
                          <th class="px-2 py-3">Type</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          *ngFor="let parameter of selectedApi.parameters"
                        >
                          <th
                            scope="row"
                            class="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            <div
                              class="text-blue-600 font-bold cursor-pointer hover:underline"
                            >
                              {{ parameter.name }}
                            </div>
                          </th>
                          <td>
                            {{ parameter.in }}
                          </td>
                          <td>
                            <!--<input type="text" class="form-control" [(ngModel)]="parameter.value" />-->
                            <fx-operand-selector
                              [operand]="parameter.value"
                            ></fx-operand-selector>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </ng-container>
                </div>
              </div>
            </div>
          </div>
          <!-- Modal footer -->
          <div
            class="overflow-auto p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600 text-right"
          >
            <button
              (click)="hide(); changeApi()"
              type="button"
              class="btn-primary"
              [disabled]="!selectedApiService"
            >
              Attach API
            </button>
            <button (click)="hide()" type="button" class="btn btn-soft me-3">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FxApiConnectorComponent implements OnChanges {
  protected isInit: boolean = false;
  protected apiServiceRegistry: ApiServiceRegistry = inject(ApiServiceRegistry);
  private http: HttpClient = inject(HttpClient);

  @ViewChild('apiModal', { static: true })
  $modalElement!: ElementRef;

  private modal!: ModalInterface;

  public modalOptions: ModalOptions = {
    placement: 'top-center',
    backdrop: 'dynamic',
    backdropClasses:
      'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
    closable: false,
  };

  @Input({ alias: 'fx-api-setting', required: true })
  public fxSetting!: FxApiSetting;

  public apiList: any;
  public selectedApiService: string = '';
  public selectedApi: FxApi;

  ngOnChanges() {
    if (this.fxSetting.api) {
      this.selectedApiService = this.fxSetting.api.service;
      this.onApiSelect({
        option: this.apiServiceRegistry.getService(this.fxSetting.api.service),
      });
      this.selectedApi = this.fxSetting.api;
    }
  }

  show() {
    this.modal = new Modal(this.$modalElement.nativeElement, this.modalOptions);
    this.modal.show();
    this.isInit = true;
  }
  hide() {
    this.modal.hide();
  }

  changeApi() {
    this.fxSetting.api = this.selectedApi;
  }

  use(path: any, api: any) {
    if (api.get) {
      let parameters: FxApiParameter[] = [];
      if (api.get.parameters) {
        for (let parameter of api.get.parameters) {
          parameters.push({
            in: parameter.in,
            value: {
              type: 'TEXT',
              value: '',
              fxDataId: null,
              key: null,
            },
            name: parameter.name,
            required: parameter.required,
          });
        }
      }

      parameters.push(
        {
          in: 'query',
          name: 'page',
          required: false,
          value: {
            type: 'TEXT',
            value: '1',
            fxDataId: null,
            key: null,
          },
        },
        {
          in: 'query',
          name: 'size',
          required: false,
          value: {
            type: 'TEXT',
            value: '20',
            fxDataId: null,
            key: null,
          },
        },
        {
          in: 'query',
          name: 'sortBy',
          required: false,
          value: {
            type: 'TEXT',
            value: '',
            fxDataId: null,
            key: null,
          },
        },
        {
          in: 'query',
          name: 'sortType',
          required: false,
          value: {
            type: 'TEXT',
            value: '',
            fxDataId: null,
            key: null,
          },
        }
      );

      this.selectedApi = {
        service: this.selectedApiService,
        parameters: parameters,
        mapper: {
          contentRoot: 'content',
          sortable: false,
          pageable: false,
        },
        method: 'GET',
        uri: path,
      };
    }
  }

  onApiSelect($event: any) {
    let apiService = $event.option;
    const definitionUrl: string =
      apiService.url +
      (apiService.swagger_url ? apiService.swagger_url : '/v3/api-docs');
    this.http.get<any>(definitionUrl).subscribe((value) => {
      this.apiList = value.paths;
    });
  }
}
