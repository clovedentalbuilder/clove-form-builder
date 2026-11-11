import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Dropdown} from "flowbite";
import {FxLogic} from "../../classes";
import {FxLogicService} from "../../services";

@Component({
  standalone: true,
  selector: "fx-logic-selector",
  imports: [CommonModule],
  template: `
    <button #triggerElement (click)="dropdown?.show()">
      <ng-container *ngIf="logics">
        <span (click)="loadLogic(dropdown)" class="font-bold underline text-blue-600">{{ logics.length }}
          Logics Added</span>
      </ng-container>
    </button>
    <div #targetElement
         class="z-10 hidden w-80 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">

      <div class="bg-gray-100 p-3 text-green-800 font-semibold">
        <i (click)="refreshList()" class="fa fa-refresh cursor-pointer pull-right" title="Refresh List"></i>
        Logics
      </div>

      <div *ngIf="_logics.length == 0 " class="text-sm italic text-gray-300 p-3">
        No logics found
      </div>

      <ul *ngIf="_logics.length > 0 " class="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownCheckboxButton">
        <li *ngFor="let logic of _logics">
          <div class="ml-2 text-sm">
            <div class="font-medium text-gray-900 dark:text-gray-300">
              <div><input name="helper-radio" type="checkbox" (click)="onCheck(logic, me.checked)"
                          [checked]="isChecked(logic)"
                          class="form-checkbox"
                          #me> {{ logic.name }}</div>
              <p id="helper-radio-text-4" class="text-xs font-normal text-gray-500 dark:text-gray-300"
                 *ngIf="logic.description">
                {{ logic.description }}
              </p>
            </div>
          </div>
        </li>
      </ul>
      <div class="p-1 text-right">
        <button (click)="dropdown?.hide()" class="btn-primary p-1">Done</button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FxLogicSelector implements AfterViewInit{

  public _logics: FxLogic[] = [];

  @Input()
  public logics?: { id: string }[];

  @ViewChild("triggerElement")
  triggerElement?: ElementRef;

  @ViewChild("targetElement")
  targetElement?: ElementRef;

  dropdown?: Dropdown;
  constructor(private fxLogicService: FxLogicService) {}

  ngAfterViewInit() {
    this.dropdown = new Dropdown(this.targetElement?.nativeElement, this.triggerElement?.nativeElement, {
      placement: 'left-start',
      triggerType: 'none',
      delay: 300
    });
    this.initLogics();
  }

  initLogics(){
    this._logics = [];
    this._logics.push(...this.fxLogicService.Fx_Logics.values());
  }

  isChecked(logic: FxLogic): boolean{
    return !!this.logics?.find(_logic => _logic.id == logic.id)
  }

  onCheck(logic: FxLogic, checked: boolean) {
    if(checked){
      this.logics?.push({ id: logic.id });
    }else{
      let _logic = this.logics?.find(_logic=> _logic.id == logic.id);
      if(_logic) this.logics?.splice(this.logics?.indexOf(_logic), 1);
    }
  }

  refreshList() {
    this.initLogics();
  }

  loadLogic(dropdown: Dropdown | undefined) {
    this.refreshList();
    this.dropdown?.show();
  }
}
