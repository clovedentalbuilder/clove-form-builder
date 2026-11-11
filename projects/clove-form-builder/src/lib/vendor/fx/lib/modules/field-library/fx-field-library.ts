import { Component, Input, ViewEncapsulation } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DndDraggableDirective } from 'ngx-drag-drop';
import { FxData } from '../../classes';
import { FxComponentRegistryService } from '../../services';

export interface LibraryItemDetails {
  title: string;
  icon: string;
  type?: 'FIELD' | 'COMPONENT' | 'EXTERNAL_COMPONENT',
  externalComponentSelfUrl?: ''
  fxData: FxData;
}

@Component({
  selector: 'fx-field-library',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, DndDraggableDirective],
  styles: [`
    .tile{
      /*@apply border border-l-4 p-2 flex justify-start items-center text-xs font-semibold rounded shadow dark:border-gray-700 space-x-2 bg-white dark:bg-gray-800*/
      /*dark:hover:bg-gray-700*/
      /*hover:bg-gray-100 cursor-grab;*/
    }
    .tile-primary {
      /*@apply border-l-primary;*/
    }

  `],
  template: `

    <div class="grid grid-cols-2 gap-3 mb-4" *ngIf="layouts">
        <div class="tile tile-primary" *ngFor="let item of fxComponentRegistry.layouts" [dndType]="'LAYOUT'" [dndDraggable]="item">
          <i *ngIf="item['icon']" class="fa text-primary" [ngClass]="item['icon']"></i>
          <span [title]="item | json" >{{ item['title'] }}</span>
        </div>
    </div>


    <div class="grid grid-cols-2 gap-3 mb-4" *ngIf="typography">
      <div class="tile tile-primary" *ngFor="let item of fxComponentRegistry.typography" [dndType]="'LAYOUT'" [dndDraggable]="item">
        <i *ngIf="item['icon']" class="fa-thin font-semibold {{item['icon']}} me-3 text-info "></i>
        <span [title]="item | json" >{{ item['title'] }}</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 mb-4" *ngIf="formControls">
      <div class="tile tile-primary" *ngFor="let item of fxComponentRegistry.formControls" [dndType]="'LAYOUT'" [dndDraggable]="item">
        <i *ngIf="item['icon']" class="fa-thin font-semibold {{item['icon']}} me-3 text-primary "></i>
        <span [title]="item | json" >{{ item['title'] }}</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 mb-4" *ngIf="customControls">
      <div class="tile tile-primary" *ngFor="let item of fxComponentRegistry.customComponent" [dndType]="'LAYOUT'" [dndDraggable]="item">
        <i *ngIf="item['icon']" class="fa-thin font-semibold {{item['icon']}} me-3 text-primary "></i>
        <span [title]="item | json" >{{ item['title'] }}</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 mb-4" *ngIf="components">
      <div class="tile tile-primary" *ngFor="let item of components" [dndType]="'LAYOUT'" [dndDraggable]="item.fxData">
        <i *ngIf="item['icon']" class="fa-thin font-semibold {{item['icon']}} me-3 text-primary "></i>
        <span [title]="item | json" >{{ item['title'] }}</span>
      </div>
    </div>


  `
})
export class FxFieldLibrary{

  @Input("layouts")
  layouts: boolean = false;

  @Input("typography")
  typography: boolean = false;

  @Input("form-controls")
  formControls: boolean = false;

  @Input("custom-controls")
  customControls: boolean = false;

  @Input("components")
  components: LibraryItemDetails[] = [];

  constructor(protected fxComponentRegistry: FxComponentRegistryService) {}

}
