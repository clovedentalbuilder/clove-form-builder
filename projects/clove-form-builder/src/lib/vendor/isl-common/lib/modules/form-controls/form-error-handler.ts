import {Component, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AbstractControl, FormsModule} from "@angular/forms";


@Component({
  standalone: true,
  selector: 'form-error-handler',
  imports: [ CommonModule, FormsModule ],
  template: `

    <ng-container *ngIf="formControl && !formControl.untouched && formControl.invalid">
      <span class="text-red-600 text-sm">

      <ng-container *ngIf="genericError">
        {{ genericError }}
      </ng-container>

      <ng-container *ngIf="!genericError">
        <ng-container *ngFor="let error of errors | keyvalue">
          <ng-container *ngIf="formControl.getError(error.key)">
            {{ error.value }}
          </ng-container>
        </ng-container>

      </ng-container>
      </span>
    </ng-container>

  `
})
export class FormErrorHandler{

  @Input('errors')
  public errors: {} = {};

  @Input("generic")
  public genericError: string = "";

  @Input({ alias: 'control', required: true })
  public formControl?: AbstractControl;

}
