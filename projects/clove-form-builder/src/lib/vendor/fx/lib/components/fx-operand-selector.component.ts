import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {FxRegistryService} from "../services";
import {FxOperand} from "../classes";

@Component({
  selector: 'fx-operand-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="operand">
      <div *ngIf="operand.type == 'TEXT'">
        <input type="text" class="form-control italic text-gray-700" [(ngModel)]="operand.value" (keydown)="checkKey($event)">
      </div>

      <div class="form-control font-semibold flex justify-between italic text-blue-600" *ngIf="operand.type == 'FIELD'">
        <span>Field( <span class="text-secondary not-italic"> #{{ operand.fxDataId }}</span> )</span>
        <span class="text-blue-600 cursor-pointer not-italic" (click)="clearVariable()" >Clear</span>
      </div>

      <div *ngIf="enableSelection" class="absolute z-50 shadow min-w-[300px] mt-3 border rounded">
        <div class="absolute w-0 h-0 border-b-gray-100 border-b-[10px]"
             style="border-left: 10px solid transparent; border-right: 10px solid transparent;  top: -10px; left: 10%; transform: translateX(-50%);"></div>
        <div class="bg-gray-100 flex justify-between p-3 rounded-t">
          <div class="text-primary font-bold">
            Select Filed
          </div>
          <div>
            <i class="fa fa-times-circle text-gray-500 pull-right" (click)="this.enableSelection = false"></i>
          </div>
        </div>

        <div class="max-h-[350px] overflow-auto bg-white">
          <div *ngFor="let fxData of elementList" (click)="onSelect(fxData)" class="hover:bg-gray-100 cursor-pointer px-3 py-1">
            <i class="fa fa-inbox mr-3"></i> <span class="font-semibold">{{ fxData.name }}</span>-<span
            class="text-xs text-gray-500 italic">{{ fxData.id.split('-')[0] }}</span>
          </div>
        </div>

        <div class="border-t flex justify-between p-3 bg-gray-100 rounded-b">
          <div></div>
          <div>
            <button class="btn btn-primary p-1 px-3 mb-0" (click)="this.enableSelection = false"><i class="fa fa-times-circle"></i> Close</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FxOperandSelectorComponent implements OnInit{

  @Input("operand")
  operand?: FxOperand;

  elementList: { name: string, id: string, icon: string }[] = [];
  enableSelection: boolean = false;

  constructor(private fxRegistryService: FxRegistryService) {}

  ngOnInit() {}

  checkKey(e: any){
    this.enableSelection = e.key === '#';
    if(e.key == '#'){
      this.elementList = this.fxRegistryService.getDataFields().map(value => {return {name: value.name, id: value.id, icon: ''};});
    }
  }

  onSelect(variable :{ name: string, id: string, icon: string }){
    this.operand!.type = 'FIELD';
    this.operand!.fxDataId = variable.id;
    this.operand!.key='value';
    this.enableSelection = false;
  }

  clearVariable(){
    this.operand!.type = 'TEXT';
    this.operand!.fxDataId = null;
    this.operand!.key = null;
    this.operand!.value = '';
  }

}
