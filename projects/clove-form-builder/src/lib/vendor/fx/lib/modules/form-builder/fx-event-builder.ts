import {CommonModule} from "@angular/common";
import {Component, Input} from "@angular/core";
import {FxData, FxEvent} from "../../classes";
import {FormsModule} from "@angular/forms";
import {FxEventService, FxRegistryService} from "../../services";
import {FxLogicSelector} from "./fx-logic-selector";
import {SelectComponent, TextareaComponent, ToggleComponent} from "../../../../isl-common";

@Component({
  standalone: true,
  selector: "fx-event-builder",
  imports: [CommonModule, FormsModule, FxLogicSelector, ToggleComponent, TextareaComponent, SelectComponent],
  template: `
    <div class="h-[calc(100%-1rem)] overflow-auto bg-white">
      <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded">
          <thead class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              Event
            </th>
            <th scope="col" class="px-6 py-3">
              Type
            </th>
            <th scope="col" class="px-6 py-3">
              Script/Logic
            </th>
          </tr>
          </thead>
          <tbody>
            <tr *ngFor="let event of events" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
              <td class="px-6 py-1">
                <form-toggle (valueChange)="onSelect(event, $event)" [ngModel]="getEvent(event) !== undefined" [label]="event.name"></form-toggle>
              </td>
              <ng-container *ngTemplateOutlet="eventTypeSelector; context: { event: getEvent(event) }"></ng-container>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <ng-template #eventTypeSelector let-event="event">
      <ng-container *ngIf="event">
        <td class="px-6 py-1">
          <form-select class="mt-0" [source]="eventTypes"
                       placeholder="Choose Event Type" icon="fa fa-list"
                       option-icon="$icon"
                       option-value="$name" option-title="$name" option-description="$description" [(ngModel)]="event.type" ></form-select>
        </td>
        <td class="px-6 py-1">
          <div *ngIf="event.type === 'SCRIPT'">
            <form-textarea class="mt-0" placeholder="Enter any Javascript code here. Code will execute only when event fire" [rows]="3" [(ngModel)]="event.script"></form-textarea>
          </div>
          <div *ngIf="event.type === 'LOGIC'">
            <fx-logic-selector [logics]="event.logics" ></fx-logic-selector>
          </div>
        </td>
      </ng-container>
    </ng-template>
  `
})
export class FxEventBuilder{

  protected eventTypes: any[] = [
    { name: 'SCRIPT', icon: 'fa-code', description: 'Execute custom JavaScript code when the event is triggered.' },
    { name: 'LOGIC', icon: 'fa-cogs', description: 'Run predefined logic created through the logic builder when the event occurs.' }
  ];



  @Input({ required: true }) fxData!: FxData;

  protected events: { name: string }[] = [];

  constructor(private fxRegistryService: FxRegistryService,
              private fxEventService: FxEventService) {
    for( let key of Object.values(this.fxEventService.getSupportedEvents())){
      this.events.push({name: key+''});
    }
  }

  onSelect(event: { name: string }, isChecked: boolean){
    if(!this.fxData.events){
      this.fxData.events = [];
    }
    if(isChecked){
      this.fxData.events.push({
        type: 'LOGIC',
        trigger: { on: event.name },
        script: "",
        logics: []
      })
    }else{
      let item = this.fxData.events.find(e=> e.trigger.on === event.name);
      if(item) this.fxData.events.splice(this.fxData.events.indexOf(item), 1);
    }
  }

  protected getEvent(e: { name: string }): FxEvent | undefined{
    if(this.fxData && this.fxData.events)
      return  this.fxData.events?.find(event=> e.name === event.trigger.on);
    return undefined;
  }

}
