import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import {DropdownComponent, DropdownModule} from "../dropdown";
import {InfiniteScrollDirective} from "ngx-infinite-scroll";
import {NgScrollbarExt, ScrollViewport} from "ngx-scrollbar";
import { JsonResolverPipe, JsonUtils } from '../../../../isl-core';


@Component({
  selector: 'form-select',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, InfiniteScrollDirective, NgScrollbarExt, ScrollViewport, JsonResolverPipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `

    <div class="form-control-wrapper"
         [class]="_class"
         [class.with-icon]="icon"
         [class.with-floating-label]="floating == 'on'"
         [class.is-floating]="isFloating"
         [class.with-error-field]="!control.untouched && control.invalid">
      <div class="relative">
        <ng-container *ngIf="selectedOption; else noOption">
      <span
        title="Clear"
        class="absolute mt-3 px-3 right-0 font-semibold text-secondary text-xs dark:text-gray-300 cursor-pointer" (click)="clear()">
        <i class="fa fa-eraser font-bold me-1"></i>
      </span>
        </ng-container>
        <ng-template #noOption>
          <i class="absolute mt-3 px-3 text-gray-400 dark:text-gray-500 icon fa fa-caret-down right-0" (click)="dropdown!.show()"></i>
        </ng-template>
        <span class="input-label dark:text-gray-300">{{ label }}
          <span *ngIf="control.errors && control.errors!['required']" class="text-red-500">*</span>
    </span>
        <i class="input-icon" [ngClass]="icon!"></i>
        <input
          #inputField
          type="text"
          [value]="selectedOption ? JsonUtils.resolveJsonPath(selectedOption, $title!) : ''"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          (keyup)="onKeyUp($event)"
          (keydown)="onKeyDown($event)"
          (click)="dropdown!.show()"
          readonly
          autocomplete="new-password"
          class="form-control text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 pe-8"
          [placeholder]="floating == 'on' ? isFloating ? placeholder : '' : placeholder"/>
        <dropdown [triggerElement]="inputField">
          <ng-scrollbar [visibility]="'hover'" [appearance]="'compact'" externalViewport>
            <div class="flex flex-col border rounded-lg min-w-96 dark:border-gray-700">
              <div class="!max-h-96 !w-full" infiniteScroll [scrollWindow]="false" #scrollViewPort scrollViewport>
                <div class="flex flex-col w-full shadow-xl border rounded-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                  <div *ngFor="let option of options!; let i = index"
                       [ngClass]="{'focused': isFocused(i)}"
                       class="hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex p-2 px-4 space-x-4 border-b dark:border-gray-700"
                       (click)="selectOption(option, $event)">
                    <div *ngIf="$icon"><i class="fa text-primary" [ngClass]="JsonUtils.resolveJsonPath(option, $icon)"></i></div>
                    <div>
                      <div class="font-semibold text-sm text-gray-700 dark:text-gray-100" [innerHTML]="option | jsonResolver : $title!"></div>
                      <div class="text-gray-500 text-xs dark:text-gray-400" *ngIf="$description" [innerHTML]="JsonUtils.resolveJsonPath(option, $description)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ng-scrollbar>
        </dropdown>
        <div class="text-red-700 text-xs font-semibold dark:text-red-500" *ngIf="!control.untouched && control.invalid">
          <div *ngIf="control.errors!['required'] && required">{{ required }}</div>
        </div>
      </div>
    </div>


  `,
  styles: [
    `
      .relative.error label {
        color: red;
      }

      .label {
        position: absolute;
        left: 0.75rem;
        top: 0.60rem;
        border-radius: 10px;
        transition: 0.2s ease all;
        pointer-events: none;
      }

      .floating {
        @apply -top-4 left-0 text-xs px-0 dark:text-gray-900 dark:bg-gray-800;
      }

      .relative.error .form-control {
        @apply ring-0;
      }

      .relative.error .form-control {
        border-color: red;
      }

      .focused {
        @apply dark:bg-gray-800 bg-gray-200;
      }

    `,
  ],
})
export class SelectComponent implements ControlValueAccessor, Validator, OnInit, OnChanges {

  @Input() label?: string;
  @Input() icon?: string;
  @Input() placeholder: string = '';
  @Input() required?: string;
  @Input() floating: 'on' | 'off' = 'off';
  @Input({ alias: 'class' }) _class?: string;

  @Input({alias: "option-title", required: true}) $title?: string;
  @Input({alias: "option-value"}) $value?: string;
  @Input({alias: "option-description"}) $description?: string;
  @Input({alias: "option-icon"}) $icon?: string;

  @Input({required: true, alias: "source"}) options?: any[];

  @ViewChild('inputField', {static: true})
  protected inputField?: ElementRef;

  @ViewChild(DropdownComponent, {static: true})
  protected dropdown?: DropdownComponent;

  @Output("onSelect") onSelect: EventEmitter<{ value: any, option: any }> = new EventEmitter<{ value: any, option: any }>();

  private onChange?: (value: string) => void;
  private onTouched?: () => void;
  protected control: AbstractControl = new FormControl();


  isFloating: boolean = false;
  focusedIndex: number = -1;
  protected value: any;
  protected selectedOption: any;

  ngOnInit() {
    if (!this.$value) this.$value = this.$title;
  }

  ngOnChanges(changes: SimpleChanges) {
      if(this.$value){
        let option = this.options?.find(value1 => JsonUtils.resolveJsonPath(value1, this.$value!) == this.value);
        if(option){
          this.selectedOption = option;
        }else{
          this.value = null;
          this.selectedOption = null;
          this.control.setValue('');
        }
      }
  }

  writeValue(value: any): void {
    this.value = value;
    if (this.$value)
      this.selectedOption = this.options?.find(value1 => JsonUtils.resolveJsonPath(value1, this.$value!) == this.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.inputField) {
      this.inputField.nativeElement.disabled = isDisabled;
    }
  }

  onInput(event: any): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.isFloating = !!inputValue;
  }

  onBlur(): void {
    this.isFloating = !!this.value;
    setTimeout(() => {
      if (this.onTouched) {
        this.onTouched();
      }
    }, 300)
  }

  onFocus(): void {
    this.isFloating = true;
  }

  onKeyUp($event: KeyboardEvent) {

  }

  registerOnValidatorChange(fn: () => void): void {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    this.control = control;
    this.addValidators();
    return null;
  }

  private addValidators() {
    if (this.required !== undefined) {
      this.control.addValidators(Validators.required);
    }
  }

  selectOption(option: any, e?: Event) {
    this.value = JsonUtils.resolveJsonPath(option, this.$value!);
    this.selectedOption = option;
    this.isFloating = true;
    this.onSelect.emit({ value: this.value, option: option });
    this.onChange!(this.value);
    this.focusedIndex = -1;
    this.dropdown?.hide();
  }

  onFocusOut() {
    setTimeout(() => {
      this.dropdown?.hide();
    }, 200)
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      this.dropdown?.show();
      this.focusedIndex = (this.focusedIndex + 1) % this.options!.length;
    } else if (event.key === 'ArrowUp') {
      this.dropdown!.show();
      this.focusedIndex = (this.focusedIndex - 1 + this.options!.length) % this.options!.length;
    } else if (event.key === 'Enter') {
      if (this.focusedIndex >= 0) {
        this.selectOption(this.options![this.focusedIndex]);
        this.dropdown!.hide();
      } else {
        this.dropdown!.toggle();
      }
    }

    setTimeout(() => {
      let element = document.getElementsByClassName("focused");
      if (element.length > 0) {
        element[0].scrollIntoView({
          behavior: "instant",
          block: "center",
          inline: "nearest"
        });
      }
    }, 100)

  }

  isFocused(index: number): boolean {
    return this.focusedIndex === index;
  }

  clear() {
    this.selectedOption = undefined;
    this.onChange!('');
  }

  protected readonly JsonUtils = JsonUtils;
}
