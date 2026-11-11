import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FxData, FxMode, FxScope } from '../../classes';
import { DndModule } from 'ngx-drag-drop';
import { FxSettingsService } from '../../services';
import { FxUtils } from '../../utils';

@Component({
  standalone: true,
  imports: [CommonModule, DndModule],
  selector: "fx-component",
  template: `
    <div class='fx-element' *ngIf="fxData" [ngClass]="setting('_class')" >

      @if (fxData.$fxForm?.$mode == FxMode.VIEW){
        <div class="p-3">
          <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
        </div>
      } @else {

        @if (isSelected() || hasAnyChildSelected(fxData)){
          <div class="p-3 border-2 border-yellow-400 rounded-xl relative fx-overlay"
               [class.pointer-events-none]="fxData['isLocked'] && fxData.$fxForm?.$scope !== FxScope.BUILDER"
               (click)="selectElement($event)">
            <ng-container *ngTemplateOutlet="fxActionTemplate"></ng-container>
            <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
          </div>
        } @else {
          <div (click)="selectElement($event)" class="hover:bg-gray-50 cursor-pointer p-3" title="Click to edit element">
            <div class="pointer-events-none">
              <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
            </div>
          </div>
        }
      }

      <ng-template #contentTemplate>
        <ng-content></ng-content>
      </ng-template>

      <ng-template #fxActionTemplate>
        <div class="fx-actions flex justify-between">

          <div class="bg-gray-700 text-gray-300 px-2 rounded-t ml-2 text-xs flex justify-center items-center">
            <div>#{{ fxData.name }}-<span class="text-xs italic">{{ fxData.id.split('-')[0] }}</span></div>
          </div>

          <div class="flex justify-around items-end mr-2">
            <div class="cursor-pointer bg-secondary text-white w-8 mr-1 text-center rounded-t" title="Settings"
                 (click)="moveUp()">
              <i class="fa fa-arrow-up text-xs"></i>
            </div>
            <div class="cursor-pointer bg-secondary text-white w-8 mr-1 text-center rounded-t" title="Settings"
                 (click)="moveDown()">
              <i class="fa fa-arrow-down text-xs"></i>
            </div>

            @if (!(fxData['isLocked'] && fxData.$fxForm?.$scope !== FxScope.BUILDER)) {
              <div class="cursor-pointer bg-secondary text-white w-8 mr-1 text-center rounded-t" title="Settings"
                   (click)="fxSettingService.openSetting(fxData)">
                <i class="fa fa-cog text-xs"></i>
              </div>
              <div class="cursor-pointer bg-secondary text-white w-8  mr-1 text-center rounded-t"
                   [dndDraggable]="getDataForDrag()"
                   [dndType]="'LAYOUT'"
                   title="Drag & Drop">
                <i class="fa fa-arrows-alt  text-xs"></i>
              </div>
              <div (click)="deleteElement(fxData)"
                   class="cursor-pointer bg-red-600 text-white w-8 mr-1 text-center rounded-t" title="Remove">
                <i class="fa fa-times  text-xs"></i>
              </div>
            }

          </div>

        </div>
      </ng-template>
    </div>

  `,
  styles: [`
    .fx-element {
      position: relative;
    }

    .fx-element .fx-overlay {
      position: relative;
    }

    .fx-element .fx-overlay .fx-actions{
      position: absolute;
      margin-top: -38px;
      height: 25px;
      border-top-right-radius: 10px;
      width: 95%;
      border-top-left-radius: 10px;
    }

  `]
})
export class FxComponent implements OnInit{

  protected fxSettingService: FxSettingsService = inject(FxSettingsService);

  @Input({ required: true }) fxData!: FxData ;


  ngOnInit() {
    if(this.fxData)
      this.fxData.$fxComponent = this;
  }

  deleteElement(element: FxData) {

    let parent = element.$parent?.parent;
    if(parent && parent.elements) {
      if (confirm("Are you sure you want to delete element:: " + element.name)) {
        parent.elements.splice(parent.elements.indexOf(element), 1);
      }
    }
  }

  getDataForDrag(){
    let data = FxUtils.cloneObject(this.fxData);
    data.id = undefined;
    data.name = 'copy';
    return { fxData: data };
  }

  onElementSelect(fxData: FxData | undefined){
    this.fxData.$fxForm.$currentSelectedFxData = this.fxData;
  }

  protected readonly FxMode = FxMode;

  moveUp() {
    const elements = this.fxData.$parent?.parent?.elements;
    if (elements) {
      const currentIndex = elements.findIndex(e => e.id == this.fxData.id);
      if (currentIndex > 0) {
        const temp = elements[currentIndex - 1];
        elements[currentIndex - 1] = elements[currentIndex];
        elements[currentIndex] = temp;
      }
    }
    FxUtils.scrollToElement(this.fxData);
  }


  moveDown() {
    const elements = this.fxData.$parent?.parent?.elements;
    if (elements) {
      const currentIndex = elements.findIndex(e => e.id == this.fxData.id);
      if (currentIndex < elements.length - 1) {
        const temp = elements[currentIndex + 1];
        elements[currentIndex + 1] = elements[currentIndex];
        elements[currentIndex] = temp;
      }
    }
    FxUtils.scrollToElement(this.fxData);
  }

  selectElement(event: Event) {
    event.stopImmediatePropagation();
    this.fxData.$fxForm.$currentSelectedFxData = this.fxData;
  }

  isSelected(){
    return this.fxData.$fxForm?.$currentSelectedFxData?.id == this.fxData.id;
  }

  hasAnyChildSelected(fxData: FxData): boolean {
    const currentSelectedId = fxData.$fxForm?.$currentSelectedFxData?.id;

    if (!currentSelectedId || !fxData.elements) {
      return false;
    }

    const checkChild = (elements: any[]): boolean => {
      return elements.some((element: FxData) =>
        element.id === currentSelectedId || (element.elements && checkChild(element.elements))
      );
    };

    return checkChild(fxData.elements);
  }

  protected setting(key: string): any{
    if(this.fxData.settings) {
      const setting = this.fxData.settings.find((s) => s.key === key);
      if (setting) {
        return setting.value;
      }
    }
    return null;
  }

  protected readonly FxScope = FxScope;
}
