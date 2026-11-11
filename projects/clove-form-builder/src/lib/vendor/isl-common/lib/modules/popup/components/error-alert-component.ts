import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent, ModalModule } from '../../modal/';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ModalModule
  ],
  template: `
    <modal>
      <modal-header class="bg-danger-300">
        <h3 class="heading heading-danger !mb-0">{{ data.title }}</h3>
      </modal-header>
      <modal-body>
        <div class="p-6">
          <p class="text-base leading-relaxed text-red-700 dark:text-gray-400" *ngIf="data.message">
            <i class="fa fa-triangle-exclamation me-3 "></i> {{ data.message }}
          </p>
          <div *ngIf="stacktrace" class="my-3">
            <div class="alert alert-warning">
              <h6>Stack Trace</h6>
              <pre>{{ stacktrace }}</pre>
            </div>
          </div>
          <div *ngIf="fieldErrors.length > 0" class="alert alert-warning">
            <div>
              <h6>Please fix following errors</h6><br>
              <ul>
                <li *ngFor="let fieldError of fieldErrors">
                  <b>{{ fieldError.fieldName }} : {{ fieldError.message }}</b>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </modal-body>
      <modal-footer class="text-right">
        <button (click)="hide()" type="button" class="btn-danger-outline">OK</button>
      </modal-footer>
    </modal>


  `,
  styles: []
})
export class ErrorAlertComponent{

  @ViewChild(ModalComponent) modal: ModalComponent;

  @Input("data")
  public data: { title: string, message: string } = { title: "Alert", message: '' };

  @Input('stacktrace')
  public stacktrace: string | null = null;

  @Input("fieldErrors")
  public fieldErrors: any[] = [];


  show() {
    this.modal.show()
  }

  hide(){
    this.modal.hide()
  };
}
