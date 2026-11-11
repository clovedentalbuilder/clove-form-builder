import {ChangeDetectionStrategy, Component, forwardRef} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FxComponentResolver} from "../../form-processor/fx-component-resolver.component";
import {FxMode, FxNonDataFieldComponent, FxSetting, FxStringSetting} from "../../../classes";
import {DndModule} from "ngx-drag-drop";


@Component({
  standalone: true,
  imports: [CommonModule, DndModule,
    forwardRef(() => FxComponentResolver),
    FxComponentResolver],
  selector: 'fx-card-layout',
  template: `
    <div class="text-lg font-bold mb-2" *ngIf="setting('heading')">{{ setting('heading') }}</div>
    <div class="card w-full p-3 mb-3">
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
          <div *ngFor="let item of getArray(setting('columns') - fxData.elements!.length)" class="p-5 border border-gray-200"></div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
  styles: [`
    .droppable{
      border: 2px red dashed;
    }
  `]
})
export class FxCardLayoutComponent extends FxNonDataFieldComponent{
  protected settings(): FxSetting[] {
    return [
      new FxStringSetting({ key: "heading", value: '', $title: "Card Heading" }),
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
