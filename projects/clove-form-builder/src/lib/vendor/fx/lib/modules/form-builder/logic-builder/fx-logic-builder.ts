import {Component, Input, ViewChild} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FxLogicDesigner} from "./fx-logic-desinger";
import {FxForm, FxLogic} from "../../../classes";
import {FxLogicService} from "../../../services";
import { FxUtils } from '../../../utils';

@Component({
  standalone: true,
  imports: [CommonModule, FxLogicDesigner],
  selector: "fx-logic-builder",
  template: `
    <ng-container *ngIf="fxForm">
      <div *ngFor="let logic of fxForm.logics" class="text-gray-800 py-3 border-b hover:bg-gray-300 cursor-pointer group" >
        <i class="fa fa-trash text-white float-right cursor-pointer hidden" title="Delete Logic" (click)="deleteLogic(logic)"></i>
        <div class="flex text-sm">
          <div class="pr-2 pt-1">
            <i class="fa fa-magic"></i>
          </div>
          <div>
            <div class="hover:underline cursor-pointer" title="Edit/View Logic" (click)="edit(logic)">{{ logic.name }}</div>
            <p class="text-xs">{{ logic.description }}</p>
          </div>
        </div>
      </div>

      <div *ngIf="fxForm.logics.length == 0">
        <p class="italic text-gray-400">No Logics </p>
      </div>

      <div class="my-3">
        <a (click)="createNew()" class="font-semibold underline text-primary cursor-pointer"><i class="fa fa-plus"></i> Add New</a>
      </div>

    </ng-container>
    <fx-logic-designer (onSubmit)="onSave($event)"></fx-logic-designer>
  `
})
export class FxLogicBuilder{

  private mode: 'CREATE' | 'EDIT' = 'CREATE';

  @Input()
  public fxForm!: FxForm;

  @ViewChild(FxLogicDesigner)
  fxLogicDesigner?: FxLogicDesigner;

  constructor(private fxLogicService: FxLogicService) {
  }

  createNew() {
    this.mode = 'CREATE';
    let fxLogic: FxLogic = {
      id: FxUtils.generateUUID(),
      name: "",
      statements: []
    }
    this.fxLogicDesigner?.load(fxLogic);
  }

  private currentLogic?: FxLogic;
  edit(logic: FxLogic){
    this.mode = "EDIT";
    this.currentLogic = logic;
    this.fxLogicDesigner?.load(JSON.parse(JSON.stringify(logic)));
  }

  onSave(fxLogic: FxLogic){
    if(this.mode == "EDIT" && this.currentLogic){
      this.fxForm.logics[this.fxForm.logics.indexOf(this.currentLogic)]={...this.currentLogic, ...fxLogic};
    }else{
      this.fxForm.logics?.push(fxLogic);
    }
    this.registerLogic();
  }

  private registerLogic(){
    for (let logic of this.fxForm.logics) {
      this.fxLogicService.registerLogic(logic);
    }
  }

  deleteLogic(logic: FxLogic) {
    if(confirm("Are your sure you want to delete logic? :: "+ logic.name))
      this.fxForm.logics.splice(this.fxForm.logics.indexOf(logic),1);
  }
}



