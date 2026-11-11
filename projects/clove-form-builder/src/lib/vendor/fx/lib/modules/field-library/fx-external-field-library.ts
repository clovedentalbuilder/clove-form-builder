import {Component, Input, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FxApi, FxApiParameter} from "../../classes";
import {FxApiService} from "../../services";
import {DndDraggableDirective} from "ngx-drag-drop";

@Component({
  standalone: true,
  selector: 'fx-external-field-library',
  imports: [ CommonModule, DndDraggableDirective ],
  template: `

    <div class="flex flex-col">
      <div class="pt-2">
        <div class="flex items-center max-w-sm mx-auto">
          <label for="simple-search" class="sr-only">Search</label>
          <div class="relative w-full">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <i class="fa fa-search text-gray-400"></i>
            </div>
            <input (change)="onChange(me.value)" #me type="text" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-xs" placeholder="Search by Name, Description" required />
          </div>
        </div>
      </div>

      <div class="flex-grow overflow-auto py-4 flex flex-col space-y-3">

        <div class="border-b flex justify-start space-x-2 border border-l-4 border-l-secondary rounded-lg p-3 cursor-grab" *ngFor="let component of components" [dndType]="'LAYOUT'" [dndDraggable]="component.fxData">
          @if( component.fxData.icon ){
            <i class="fa text-secondary mt-1" [ngClass]="component.fxData.icon.value"></i>
          }@else{
            <i class="fa text-secondary mt-1 fa-cube"></i>
          }

          <div>
            <div class="text-sm text-primary font-semibold">{{ component.name }}</div>
            <div class="text-xs text-gray-500">{{ component.description }}</div>
          </div>
        </div>

      </div>
    </div>

  `
})
export class FxExternalFieldLibrary implements OnInit{

  @Input({ alias: 'api', required: true })
  api!: FxApi;

  components: any[] = [];

  constructor(private apiService: FxApiService) {}

  ngOnInit() {
    this.loadComponents('');
  }

  onChange(keyword: string){
    this.loadComponents(keyword);
  }

  private loadComponents(keyword: string){
    let parameter : FxApiParameter = {
      in: "query",
      name: "keyword",
      required: true,
      value: {
        type: 'TEXT',
        key: 'keyword',
        value: keyword,
        fxDataId: null,
      }
    };
    this.apiService.load(this.api, [parameter]).then(value => {
      this.components = value.content;
    })
  }


}
