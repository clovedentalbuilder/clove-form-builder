import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";

@Component({
    standalone: false,
  selector: 'page-modal',
  template: `
    <ng-template #modalTemplate>
      <div class="absolute top-0 left-0 h-full w-full bg-white dark:bg-gray-900 z-10 flex flex-col shadow-2xl">

        <div class="border-b bg-gray-50 dark:bg-gray-800 p-4 flex justify-between items-center border-gray-200 dark:border-gray-700">
          <div class="text-gray-900 dark:text-gray-100 font-semibold">
            <span *ngIf="icon" [ngClass]="icon" class="me-2 text-primary dark:text-blue-400"></span> {{ title }}
          </div>
          <div class="flex space-x-3">
            <ng-content select="action-bar"></ng-content>
            <button class="btn-danger-outline me-2" (click)="state='hidden'"><i class="fa fa-times me-2"></i>Close</button>
          </div>
        </div>

        <div class="flex-grow overflow-auto">
          <ng-content></ng-content>
        </div>

      </div>
    </ng-template>
  `
})
export class PageModalComponent{
  @Input({ required: true, alias: 'label' }) title?: string;
  @Input({ required: false, alias: 'icon' }) icon?: string;
  @Input("state") state: 'shown' | 'hidden' = 'hidden';

  @Output("onShow") onShow: EventEmitter<any> = new EventEmitter<any>();
  @Output("onHide") onHide: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("modalTemplate") modalTemplate?: TemplateRef<any>;

  show(){
    this.state = 'shown';
    this.onShow.emit(true);
  }

  hide(){
    this.state = 'hidden';
    this.onHide.emit(true);
  }

}
