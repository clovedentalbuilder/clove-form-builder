import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FxValidation } from '../../classes';
import { FormsModule } from '@angular/forms';
import { InputComponent, ToggleComponent } from '../../../../isl-common';


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ToggleComponent, InputComponent],
  selector: 'fx-validation-builder',
  template: `
    <ng-container *ngIf="validations">
      <div class="relative overflow-x-auto">
        <table
          class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th scope="col" class="px-6 py-3">Validation</th>
              <th scope="col" class="px-6 py-3">Error Message</th>
              <th scope="col" class="px-6 py-3">Properties</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              *ngFor="let validation of validations"
            >
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <form-toggle
                  [(ngModel)]="validation.enable"
                  [label]="validation.key"
                ></form-toggle>
                <div
                  class="text-xs text-gray-400 font-light italic"
                  *ngIf="validation.$description"
                >
                  {{ validation.$description }}
                </div>
              </th>
              <td class="px-6 py-4">
                <form-input
                  [(ngModel)]="validation.message"
                  class="mt-0"
                  placeholder="Enter Your Validation Message Here.."
                ></form-input>
              </td>
              <td class="px-6 py-4">
                <div *ngIf="validation.properties">
                  <ng-container *ngFor="let property of validation.properties">
                    <ng-container *ngIf="property.type == 'STRING'">
                      <div class="flex justify-center ">
                        <label class="mr-3">{{ property.$title }}</label>
                        <input
                          type="text"
                          class="form-control"
                          [(ngModel)]="property.value"
                        />
                      </div>
                    </ng-container>

                    <ng-container *ngIf="property.type == 'NUMBER'">
                      <div class="flex justify-center">
                        <label class="mr-3">{{ property.$title }}</label>
                        <input
                          type="number"
                          class="form-control"
                          [(ngModel)]="property.value"
                        />
                      </div>
                    </ng-container>

                    <ng-container *ngIf="property.type == 'BOOLEAN'">
                      <div class="">
                        <label
                          ><input
                            type="checkbox"
                            class="form-checkbox"
                            [(ngModel)]="property.value"
                          />
                          {{ property.$title }}</label
                        >
                      </div>
                    </ng-container>
                  </ng-container>
                </div>

                <div *ngIf="!validation.properties">
                  <i class="text-gray-600 text-sm">N/A</i>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ng-container>
  `,
})
export class FxValidationBuilder {
  @Input()
  public validations?: FxValidation[];
}
