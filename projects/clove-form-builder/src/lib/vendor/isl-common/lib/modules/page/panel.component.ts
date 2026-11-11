import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';

@Component({
    standalone: false,
  selector: 'panel',
  template: `
    <ng-template #panelTemplate>
      <div class="h-full bg-white dark:bg-gray-800 flex flex-col overflow-auto border dark:border-gray-800">
        <div class="p-2 bg-gray-100 dark:bg-gray-900 flex justify-between">
          <div class="font-semibold text-sm dark:text-gray-100">
            <i [ngClass]="icon!" class="me-2"></i> {{ label }}
          </div>
          <div class="text-right">
            <ng-content select="action-bar"></ng-content>
            <i class="fa fa-times cursor-pointer dark:text-gray-300" (click)="active =!active"></i>
          </div>
        </div>
        <div class="flex-grow overflow-auto p-2 dark:text-gray-300 dark:bg-gray-800">
          <ng-content></ng-content>
        </div>
      </div>
    </ng-template>

  `,
  styles: ``
})
export class PanelComponent {

  @Input({ required: true }) label?: string;
  @Input({ required: true }) icon?: string;

  @Input({ required: false }) active?: boolean;
  @Input({ required: false }) placement: 'left' | 'right' = 'right';
  @Input({ required: false }) floating = true;

  @Output()
  public onLoad: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild("panelTemplate") panelTemplate?: TemplateRef<never>;

  public toggle(){
    this.active = !this.active;
    if(this.active){
      this.onLoad.emit(true);
    }
  }

}
