import {Component, Input, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FxForm, FxIconSetting} from "../../classes";
import {FormsModule} from "@angular/forms";
import {FxLogicSelector} from "./fx-logic-selector";
import {FxIconSelector} from "./fx-icon-selector";


@Component({
  selector: 'fx-form-settings',
  imports: [CommonModule, FormsModule, FxLogicSelector, FxIconSelector],
  standalone: true,
  template: `
    <div *ngIf="fxForm" class="text-xs">
      <div class="mb-2">
        <span class="font-semibold mb-1">Component Name</span>
        <input type="text" class="form-control p-1 text-xs" [(ngModel)]="fxForm.name" placeholder="Name of Component" />
      </div>
      <div class="mb-2">
        <span class="font-semibold mb-1">Description</span>
        <textarea class="form-control p-1 text-xs" [(ngModel)]="fxForm.description" placeholder="Description" ></textarea>
      </div>

      <div class="mb-2">
        <span class="font-semibold mb-1">Icon</span>
        <div *ngIf="fxForm.icon">
          <fx-icon-selector [fxIconSetting]="fxForm.icon"></fx-icon-selector>
        </div>
      </div>

      <div class="mb-2 mt-5" *ngIf="fxForm.before">
        <span class="font-semibold mb-1">Add Logics on Submit</span><br>
        <fx-logic-selector [logics]="fxForm.before"  ></fx-logic-selector>
      </div>
    </div>
  `
})
export class FxFormSettingComponent implements OnInit{
  @Input({ required: true })
  fxForm?: FxForm;

  ngOnInit() {
    if(!this.fxForm?.icon){
      this.fxForm!.icon = new FxIconSetting({ key: 'icon', value: 'fa fa-cube' })
    }
  }

}
