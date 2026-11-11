import {
  Component,
  inject,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FxData, FxForm } from '../../classes';
import { DndModule } from 'ngx-drag-drop';
import { FxSettingsService } from '../../services';
import { FxUtils } from '../../utils';

@Component({
  standalone: true,
  imports: [CommonModule, DndModule],
  selector: 'fx-component-structure',
  template: `
    <ng-container *ngIf="fxForm">
      <!--<label class="text-gray-200">Component Structure- <span class="cursor-pointer" title="Copy to Clipboard" (click)="copyToClipBoard()"> <i class="fa fa-copy"></i> Copy</span></label>-->
      <ng-container
        *ngTemplateOutlet="elementList; context: { elements: fxForm.elements }"
      ></ng-container>
      <ng-template #elementList let-elements="elements">
        <ul *ngFor="let element of elements; let i = index" class="ml-3">
          <li
            [dndDropzone]="['INTERNAL']"
            (dndDrop)="onDrop(elements, i, $event)"
          >
            <div class="flex justify-between group">
              <div
                (click)="fxSettingService.openSetting(element)"
                [title]="element.id"
                (mouseenter)="highlightElement(element, true)"
                (mouseleave)="highlightElement(element, false)"
                class="cursor-pointer text-gray-400 hover:underline"
              >
                #{{ element.name }}-<span class="text-xs italic">{{
                  element.id.split('-')[1]
                }}</span>
              </div>
              <div class="hidden group-hover:block">
                <i
                  class="fa fa-trash cursor-pointer mr-3 text-red-700"
                  (click)="deleteElement(element, elements)"
                  title="Delete Element"
                ></i>
              </div>
            </div>
            <ng-container *ngIf="element.elements?.length > 0">
              <ng-container
                *ngTemplateOutlet="
                  elementList;
                  context: { elements: element.elements }
                "
              ></ng-container>
            </ng-container>
          </li>
        </ul>
      </ng-template>
    </ng-container>
    <ng-container #dynamicComponentContainer></ng-container>
  `,
})
export class FxComponentStructure {
  protected fxSettingService: FxSettingsService = inject(FxSettingsService);

  @Input() public fxForm!: FxForm;

  @ViewChild('dynamicComponentContainer', {
    read: ViewContainerRef,
    static: false,
  })
  dynamicComponentContainer?: ViewContainerRef;

  constructor() {}

  highlightElement(element: FxData, highlight: boolean) {
    if (element.id) {
      let ele = document.getElementById(element.id);
      if (highlight) {
        ele?.classList.add('border-2');
        ele?.classList.add('border-dashed');
        ele?.classList.add('border-yellow-300');
        //ele?.scrollIntoView({behavior: 'smooth'});
      } else {
        ele?.classList.remove('border-2');
        ele?.classList.remove('border-dashed');
        ele?.classList.remove('border-yellow-300');
      }
    }
  }

  deleteElement(element: FxData, elements: FxData[]) {
    if (confirm('Are you sure you want to delete element:: ' + element.name)) {
      elements.splice(elements.indexOf(element), 1);
    }
  }

  onDrop(elements: FxData[], i: number, event: any) {
    let element: FxData = JSON.parse(event.data);
    if (elements[i].type == 'LAYOUT') {
      elements[i].elements?.push(element);
    } else {
      elements.splice(i + 1, 0, JSON.parse(event.data));
    }
    elements[i].$parent?.render();
    elements[i].$this?.detectChanges();
  }

  onDropSuccess(elements: any[], element: any) {
    elements.splice(elements.indexOf(element), 1);
  }

  protected readonly FxUtils = FxUtils;
}

