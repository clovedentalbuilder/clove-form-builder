import {AfterViewInit, ChangeDetectorRef, Component, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { KeysPipe, ToArrayPipe } from '../../../../isl-core';
import { FxUtils } from '../../utils';

@Component({
  standalone: true,
  selector: "fx-json-editor",
  imports: [CommonModule, FormsModule, ToArrayPipe, KeysPipe],
  template: `

    <ng-container *ngIf="isArray">
      <div *ngFor="let data of json | toArray; let i = index">
        <div class="flex">
          <div class="flex mb-2 align-baseline" *ngFor="let key of data | keys">
            <div class="capitalize text-xs text-gray-600 italic p-1">{{ key }}:</div>
            <div class="mx-2">
                <input type="text" class="form-control p-1" [(ngModel)]="data[key]"  />
            </div>
          </div>
          <label (click)="delete(i)" class="text-red-600 underline cursor-pointer inline"> <i class="fa fa-trash"></i></label>
        </div>
      </div>
      <label (click)="addNewItem()" class="text-blue-600 underline cursor-pointer inline"> <i class="fa fa-plus"></i> Add </label>
    </ng-container>

    <ng-container *ngIf="isObject">
      <div class="flex mb-2 align-baseline" *ngFor="let key of json | keys">
        <div class="capitalize text-xs text-gray-600 italic p-1">{{ key }}:</div>
        <div class="mx-2">
          <input type="text" class="form-control p-1" [(ngModel)]="json[key]"  />
        </div>
      </div>
    </ng-container>

  `
})
export class FxJsonEditor implements AfterViewInit{

  @Input()
  public json: any;

  protected isArray: boolean = false;
  protected isObject: boolean =false;

  private objectStructure: any;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    setTimeout(()=>{
      if(Array.isArray(this.json)){
        this.isArray = true;
        this.objectStructure = FxUtils.cloneObject(this.json[0]);
        FxUtils.emptyObject(this.objectStructure);
      }else if( typeof this.json === 'object' ){
        this.isObject = true;
      }
      this.cdr.detectChanges();
    }, 10)
  }

  addNewItem() {
    if(this.isArray){
      this.json.push(FxUtils.cloneObject(this.objectStructure));
    }
  }

  delete(index: any) {
    this.json.splice(index, 1);
  }
}
