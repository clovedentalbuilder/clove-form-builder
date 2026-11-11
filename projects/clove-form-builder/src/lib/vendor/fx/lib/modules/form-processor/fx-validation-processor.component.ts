import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { FxData } from '../../classes';

@Component({
  selector: 'fx-validation-processor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="control">
      <div *ngFor="let validation of element?.validations!">
        <div class="text-red-700 text-sm"
             *ngIf="validation.enable && control.hasError(validation.key) && (control.touched || control.dirty)">
          {{ validation.message }}
        </div>
      </div>
      <div *ngIf="control.hasError('logic')" class="text-red-700 text-sm" >
        {{ control.getError('logic')['message'] }}
      </div>
    </ng-container>
  `,
  styles: [],
})
export class FxValidationProcessorComponent{
  @Input() control!: FormControl | FormGroup;
  @Input() element!: FxData;
}

