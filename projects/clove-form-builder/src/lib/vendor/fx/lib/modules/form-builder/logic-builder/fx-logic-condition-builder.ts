import {AfterViewInit, Component, ElementRef, Input, ViewChild} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FxCondition} from "../../../classes";
import {FxRegistryService} from "../../../services";
import {Dropdown} from "flowbite";
import {FxData} from "../../../classes";
import {FxOperand} from "../../../classes";
import {FormsModule} from "@angular/forms";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: "fx-condition-builder",
  template: `

    <div *ngFor="let condition of conditions">
      <div class="flex items-center mb-3">
        <div contenteditable="true"
             class="p-1 pr-5 min-w-[150px] border rounded italic font-normal text-green-800 text-sm"
             (input)="editOperator(lhs, condition, 'lhs')" #lhs>
          <ng-container
            *ngTemplateOutlet="operandDisplayTemplate; context: { operand: condition.lhs }"></ng-container>
        </div>
        <div class="mx-3">
          <select class="form-control p-1" [(ngModel)]="condition.operator">
            <option value="EQ">Equals</option>
            <option value="LT">Less Then</option>
            <option value="GT">Greater Then</option>
            <option value="LTE">Less Then or Equals</option>
            <option value="GET">Greater Then or Equals</option>
            <option value="NOT">Not Equals</option>
          </select>
        </div>
        <div contenteditable="true"
             class="p-1 pr-5 min-w-[150px] border rounded italic font-normal text-green-800 text-sm"
             (input)="editOperator(rhs, condition, 'rhs')" #rhs>
          <ng-container
            *ngTemplateOutlet="operandDisplayTemplate; context: { operand: condition.rhs }"></ng-container>
        </div>

        <div>
          <label class="text-blue-600 underline cursor-pointer inline ml-3"
                 (click)="removeCondition(condition)"> <i class="fa fa-trash"></i> Remove</label>
        </div>

      </div>
    </div>
    <div class="mb-3">
      <label class="text-blue-600 underline cursor-pointer inline" (click)="addNew()"> <i class="fa fa-plus"></i>
        Add Condition</label>
    </div>


    <div #targetElement class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        <li *ngFor="let element of fxRegistryService.getDataFields()" (click)="onSelect(element)">
          <span
            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">#{{ element.name }}
            -{{ element.id.split('-')[1] }}</span>
        </li>
      </ul>
    </div>

    <ng-template #operandDisplayTemplate let-operand="operand">
      <span *ngIf="operand.constructor === Object;">
        <span *ngFor="let element of fxRegistryService.getDataFields()">
          <span *ngIf="element.id === operand.fxDataId">
                      <span class="text-gray-400 italic font-semibold text-sm"
                            contenteditable="false">#{{ element.name }}-{{ element.id.split('-')[1] }}</span>
          </span>
        </span>
      </span>
      <span *ngIf="operand.constructor != Object">
        {{ operand }}
      </span>
    </ng-template>

  `,
  styles: []
})
export class FxLogicConditionBuilder implements AfterViewInit{

  @Input()
  conditions: FxCondition[] = [];

  @ViewChild("targetElement")
  targetElement?: ElementRef;
  dropdown?: Dropdown;

  private currentCondition: FxCondition = {operator: 'EQ', lhs: '', rhs: ''};
  private currentOperand: string = 'lhs';
  private currentDiv?: HTMLDivElement;

  constructor(public fxRegistryService: FxRegistryService) {
  }

  ngAfterViewInit() {

  }

  private resolveOperands(){}



  addNew() {
    this.conditions.push({
      lhs: "",
      rhs: "",
      operator: 'EQ'
    })
  }

  editOperator(me: HTMLDivElement, condition: FxCondition, key: string) {
    this.currentCondition = condition;
    this.currentOperand = key;
    this.currentDiv = me;
    if (me.innerText.startsWith("#")) {
      this.dropdown = new Dropdown(this.targetElement?.nativeElement, me, {
        placement: 'bottom-start',
        triggerType: 'none',
        delay: 300
      });
      this.dropdown.show();
    } else {
      this.dropdown?.hide();
      if (this.currentOperand == 'lhs') this.currentCondition.lhs = me.innerText;
      if (this.currentOperand == 'rhs') this.currentCondition.rhs = me.innerText;
    }
  }

  onSelect(element: FxData) {
    let fxOperand: FxOperand = {
      fxDataId: element.id,
      key: 'value'
    }
    if (this.currentOperand == 'lhs') this.currentCondition.lhs = fxOperand;
    if (this.currentOperand == 'rhs') this.currentCondition.rhs = fxOperand;
    if (this.currentDiv)
      this.currentDiv.innerHTML = '<span class="text-gray-400 italic font-semibold text-sm" contenteditable="false">#' + element.name +'-'+element.id.split('-')[1] + '</span>'
    this.dropdown?.hide();
  }

  removeCondition(condition: FxCondition) {
    this.conditions.splice(this.conditions.indexOf(condition), 1);
  }

  public readonly Object = Object;
}
