import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FxAction } from '../../../classes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FxActionService, FxRegistryService } from '../../../services';
import { Dropdown } from 'flowbite';
import { FxUtils } from '../../../utils';

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'fx-logic-action-builder',
  standalone: true,
  template: `
    <div *ngIf="actions">
      <ng-container *ngFor="let action of actions; let i = index">
        <div class="shadow rounded">
          <div
            (click)="toggleAccordion(me, next)"
            #me
            class="flex items-center cursor-pointer justify-between w-full p-2 px-4 font-medium text-left text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            data-accordion-target="#accordion-open-body-1"
            aria-expanded="true"
            aria-controls="accordion-open-body-1"
          >
            <div>
              <div class="text-primary">
                <!--<i class="fa fa-hand-o-right text-green-800"></i> -->
                {{ action.$title }}
              </div>
              <p class="text-xs">
                <i class="fa fa-info-circle"></i> {{ action.$description }}
              </p>
            </div>
            <div>
              <label
                class="text-blue-600 underline cursor-pointer inline mr-3"
                (click)="removeAction(action)"
              >
                <i class="fa fa-trash"></i> Remove</label
              >
              <i class="fa fa-angle-down text-green-800"></i>
            </div>
          </div>
          <div
            class="bg-gray-50 p-1 border-l border-r hidden action-data"
            #next
          >
            <div
              class="border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900"
            >
              <div>
                <table
                  class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
                >
                  <thead
                    class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
                  >
                    <tr>
                      <th scope="col" class="px-6 py-3">Property</th>
                      <th scope="col" class="px-6 py-3">Type</th>
                      <th scope="col" class="px-6 py-3">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      *ngFor="let setting of action?.properties!"
                    >
                      <th
                        scope="row"
                        class="px-6 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {{ setting.$title }}
                      </th>
                      <td class="px-6 py-1">
                        {{ setting.type }}
                      </td>
                      <td class="px-6 py-1">
                        <ng-container *ngIf="setting.type == 'VALUE'">
                          <textarea
                            class="form-control form-textarea"
                            rows="1"
                            [(ngModel)]="setting.value"
                          ></textarea>
                        </ng-container>
                        <ng-container *ngIf="setting.type == 'FIELD'">
                          <select
                            class="form-control p-1"
                            [(ngModel)]="setting.value"
                            #me
                          >
                            <option
                              [value]="field.id"
                              *ngFor="
                                let field of fxRegistryService.getDataFields()
                              "
                            >
                              #{{ field.name }}-{{ field.id.split('-')[1] }}
                            </option>
                          </select>
                        </ng-container>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </ng-container>

      <ng-container *ngIf="actions.length == 0">
        <p class="text-gray-700 italic text-sm">
          <i class="fa fa-warning"></i> No Action(s) attached to this logic.
        </p>
      </ng-container>
    </div>

    <div class="mt-3">
      <label
        id="add-action-btn"
        #triggerElement
        (click)="dropdown?.show()"
        class="text-blue-600 underline cursor-pointer inline"
      >
        <i class="fa fa-plus"></i> Add Action</label
      >
    </div>

    <div
      #targetElement
      class="z-10 hidden bg-white rounded-lg shadow w-[350px] dark:bg-gray-700"
    >
      <div class="p-3">
        <label for="input-group-search" class="sr-only">Search</label>
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="input-group-search"
            class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Actions"
          />
        </div>
      </div>
      <ul
        class="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownSearchButton"
      >
        <li *ngFor="let action of fxActionService.fxActions">
          <div
            class="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
            (click)="selectAction(action)"
          >
            <div class="py-2">
              <label
                class="w-full text-sm font-medium text-primary rounded dark:text-gray-300"
              >
                {{ action.$title }}
              </label>
              <p class="text-xs">
                <i class="fa fa-info-circle"></i> {{ action.$description }}
              </p>
            </div>
          </div>
        </li>
      </ul>
      <span
        class="flex items-center p-3 text-sm font-medium text-red-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-red-500 hover:underline"
      ></span>
    </div>
  `,
})
export class FxLogicActionBuilder implements AfterViewInit {
  @Input()
  actions?: FxAction[];

  @ViewChild('triggerElement')
  private triggerElement?: ElementRef;

  @ViewChild('targetElement')
  private targetElement?: ElementRef;

  protected dropdown?: Dropdown;

  constructor(
    public fxActionService: FxActionService,
    private renderer: Renderer2,
    public fxRegistryService: FxRegistryService
  ) {}

  ngAfterViewInit() {
    this.dropdown = new Dropdown(
      this.targetElement?.nativeElement,
      this.triggerElement?.nativeElement,
      {
        placement: 'left-start',
        triggerType: 'none',
        delay: 300,
      }
    );

    setTimeout(() => {
      if (this.actions)
        for (let action of this.actions) {
          let matchAction = this.fxActionService.fxActions.filter(
            (value) => value.key == action.key
          )[0];
          FxUtils.deepMergeObjects(action, matchAction, 'key', true);
        }
    }, 10);
  }

  toggleAccordion(me: HTMLDivElement, next: HTMLDivElement) {
    const isHidden = next.classList.contains('hidden'); // Assuming you are using Tailwind CSS or your custom hidden class
    if (isHidden) {
      // Show the current accordion panel
      this.renderer.removeClass(next, 'hidden');
    } else {
      // Hide the current accordion panel
      this.renderer.addClass(next, 'hidden');
    }
  }

  selectAction(action: FxAction) {
    this.actions?.push(JSON.parse(JSON.stringify(action)));
    this.dropdown?.hide();
  }

  removeAction(action: FxAction) {
    this.actions?.splice(this.actions?.indexOf(action), 1);
  }
}
