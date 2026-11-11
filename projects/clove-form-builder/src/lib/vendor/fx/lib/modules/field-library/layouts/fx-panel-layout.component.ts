import {ChangeDetectionStrategy, Component, forwardRef, inject} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FxComponentResolver} from "../../form-processor/fx-component-resolver.component";
import {FxMode, FxNonDataFieldComponent, FxSelectSetting, FxSetting, FxStringSetting} from "../../../classes";
import {DndModule} from "ngx-drag-drop";
import {FxComponent} from "../../form-builder";
import {FxSettingsService} from '../../../services';


@Component({
  standalone: true,
  imports: [CommonModule, DndModule,
    forwardRef(() => FxComponentResolver), FxComponentResolver, FxComponent],
  selector: 'fx-panel-layout',
  template: `
    <fx-component [fxData]="fxData" #base></fx-component>
    <div class="card w-full !p-0 mb-3 overflow-hidden">
      <div class="p-3 flex justify-between" [ngClass]="setting('style')">
        {{ setting('heading') }}
      </div>
      <div class="p-3">
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
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
  styles: [`
    .droppable{
      border: 2px red dashed;
    }
  `]
})
export class FxPanelLayoutComponent extends FxNonDataFieldComponent{

  protected fxSettingService: FxSettingsService = inject(FxSettingsService);

  protected settings(): FxSetting[] {
    return [
      new FxStringSetting({ key: "heading", value: 'Panel Heading', $title: "Panel Heading"}),
      new FxSelectSetting({ key: "style", value: 'bg-default', $title: "Style"}, [
        { option: 'Default', value: 'bg-default' },
        { option: 'Primary', value: 'bg-primary text-white' },
        { option: 'Secondary', value: 'bg-secondary text-white' },
        { option: 'Danger', value: 'bg-danger text-white' },
        { option: 'Info', value: 'bg-info' }
      ]),
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
