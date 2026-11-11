import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FxMode, FxNonDataFieldComponent, FxSetting, FxStringSetting } from '../../../classes';
import { DndModule } from 'ngx-drag-drop';
import { FxComponentResolver } from '../../form-processor/fx-component-resolver.component';

@Component({
  selector: 'fx-layout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    forwardRef(() => FxComponentResolver),
    FxComponentResolver,
    DndModule

  ],
  template: `
    <div class="grid grid-cols-{{setting('columns')}} gap-3"
         [dndDropzone]="['COMPONENT', 'LAYOUT']"
         [dndDragoverClass]="'droppable'" (dndDrop)="addElement($event)">
      <div *ngFor="let element of fxData.elements!">
        <fx-component-resolver [element]="element"
                               [_formGroup]="fxData.$formGroup"
                               [parent]="fxData"
                               [fxForm]="fxData.$fxForm"></fx-component-resolver>
      </div>
      @if ( fxData.$fxForm?.$mode == FxMode.EDIT ){
        <div *ngFor="let item of getArray(setting('columns') - fxData.elements!.length)" class="p-5 border !border-yellow-300"></div>
      }

    </div>
  `,
  styles: [`
    .droppable{
      border: 2px red dashed;
    }
  `],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FxLayoutComponent extends FxNonDataFieldComponent{

  protected settings(): FxSetting[] {
    return [
      new FxStringSetting({ key: "columns", value: 1, $title: "Columns", $description: "Add value in between 1-4 only. This change they layout of the encapsulated grid." })
    ];
  }

  getArray(count: number): number[] {
    return Array.from({ length: count });
  }

  constructor() {
    super();
  }

  protected readonly FxMode = FxMode;
}

