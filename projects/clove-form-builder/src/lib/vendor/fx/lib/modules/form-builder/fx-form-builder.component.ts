import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DndModule } from 'ngx-drag-drop';
import { FxSettingComponent } from './fx-setting.component';
import { FxFormPreviewComponent } from './fx-form-preview.component';
import { FxFormComponent } from '../form-processor';
import { FxData, FxForm, FxMode, FxScope } from '../../classes';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { FxSettingsService } from '../../services';
import { FxUtils } from '../../utils';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FxSettingComponent,
    FxFormPreviewComponent,
    FxFormComponent,
    FormsModule,
    NgxJsonViewerModule,
    DndModule
  ],
  selector: ' fx-form-builder',
  styles: [`
  .drag-active{
    /*@apply bg-gray-200 dark:bg-gray-600;*/
  }
  `],
  template: `
    <div class="h-full flex dark:border-gray-700" [ngClass]="class">
      <div class="flex-1 flex flex-col h-full">
        <div class="flex-1 flex flex-col h-full relative">
          <div class="absolute right-4 mt-2 text-xs font-semibold text-yellow-400" *ngIf="scope == FxScope.BUILDER">Builder Mode<i class="fa fa-circle text-[8px] text-blue-500 ms-1"></i></div>
          <div class="absolute right-4 mt-2 text-xs font-semibold text-red-600" *ngIf="scope == FxScope.DESIGNER">Designer Mode<i class="fa fa-circle text-[8px] text-blue-500 ms-1"></i></div>
          <div class="p-4 pt-6 overflow-y-auto flex-grow" #formBuilderDiv (click)="fxForm.$currentSelectedFxData = null" *ngIf="fxForm"
               [dndDropzone]="['LAYOUT']"
               [dndDragoverClass]="'drag-active'"
               (dndDrop)="onDrop($event)">
            <fx-form [fxForm]="fxForm" [mode]="FxMode.EDIT" ></fx-form>
          </div>
          <div class=" overflow-y-auto flex-grow-0 min-h-72" *ngIf="isDebugEnable">
            <div class="overflow-auto shadow-inner bg-gray-100">
              <ngx-json-viewer [json]="getParsedForm(fxForm)" [expanded]="true"></ngx-json-viewer>
            </div>
          </div>
        </div>
      </div>
    </div>



    <fx-settings (onSettingChange)="renderForm()" #fxSettingComponent></fx-settings>
    <fx-form-preview [fxForm]="fxForm" ></fx-form-preview>
  `
})
export class FxFormBuilderComponent  implements AfterViewInit{

  @Input({ required: true }) fxForm!: FxForm;

  @Input({ required: false }) scope: FxScope = FxScope.DEFAULT

  @ViewChild(FxFormPreviewComponent, {static: true})
  private fxFormPreviewComponent!: FxFormPreviewComponent;

  @ViewChild('formBuilderDiv') htmlDivElement: ElementRef;

  isDebugEnable: boolean = false;

  @Input("class")
  public class!: string;

  @ViewChild("fxSettingComponent", {static: true})
  private fxSettingComponent!: FxSettingComponent;

  constructor(private fxSettingService: FxSettingsService) {}

  ngAfterViewInit(): void {
    this.fxSettingService.init(this.fxSettingComponent);
    this.fxForm.$scope = this.scope;
    setTimeout(()=>{
      initFlowbite();
    }, 10)
  }

  onDrop(e:any){
    if(e.data.type =='COMPONENT'){
      let cmp: FxForm = FxUtils.copyForm(e.data);
      let fxData: FxData = {
        id: '',
        name: 'form',
        selector: 'fx-form-field',
        settings: [],
        value: cmp,
      }
      let data = FxUtils.getElement(fxData, true);
      this.fxForm?.elements.push(data);
      FxUtils.scrollToElement(data);
    }else{
      let d = FxUtils.getElement(e.data.fxData, true);
      this.fxForm?.elements.push(d);
      FxUtils.scrollToElement(d);
    }
  }



  preview(){
    this.fxFormPreviewComponent.fxForm = undefined;
    setTimeout(()=>{
      if(this.fxForm) {
        this.fxFormPreviewComponent.fxForm = JSON.parse(FxUtils.stringifyForm(this.fxForm));
        this.fxFormPreviewComponent.show();
      }
    },500);
  }

  getParsedForm(fxForm: FxForm) : any{
    return JSON.parse(FxUtils.stringifyForm(fxForm))
  }

  protected readonly FxMode = FxMode;
  protected readonly FxScope = FxScope;


  renderForm() {
    let fxData = this.fxForm;
    //this.fxForm = undefined;
    //TODO: NEED TO CHECK ABOVE LINE
    setTimeout(()=>{
      this.fxForm = fxData;
    }, 10)
  }
}
