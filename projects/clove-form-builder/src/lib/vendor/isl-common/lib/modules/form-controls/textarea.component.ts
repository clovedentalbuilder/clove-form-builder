import {Component, ElementRef, forwardRef, Input, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'form-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextareaComponent),
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
        <span class="input-label">{{ label }} <span *ngIf="control.errors && control.errors!['required']" class="text-red-500">*</span></span>
        <i class="input-icon" [ngClass]="icon" ></i>
      <textarea
        #inputField
        type="text"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (focus)="onFocus()"
        (keyup)="onKeyUp($event)"
        [rows]="rows"
        [maxLength]="maxLength? maxLength : 10000000"
        class="form-control text-sm"
        [placeholder]=" floating == 'on' ? isFloating ? placeholder : '' : placeholder" ></textarea>
      </div>

      <div class="flex justify-between text-xs text-gray-500 space-x-4">
        <div>
          @if(!control.untouched && control.invalid){
            <div class="text-red-700 text-xs font-semibold">
              @if (genericError){
                <div>{{ genericError }}</div>
              }
              @if (errors) {
                <ng-container *ngFor="let error of errors | keyvalue">
                  <ng-container *ngIf="control.getError(error.key)">
                    <div>{{ error.value }}</div>
                  </ng-container>
                </ng-container>
              }
              <div *ngIf="control.errors!['required'] && required" >{{ required }}</div>
              <div *ngIf="control.errors!['minlength'] && minLengthError" >{{ minLengthError }}</div>
              <div *ngIf="control.errors!['maxlength'] && maxLengthError" >{{ maxLengthError }}</div>
            </div>
          } @else {
            <span class="flex-wrap italic" *ngIf="helpText"> {{ helpText }}</span>
          }

        </div>
        <div *ngIf="maxLength" class="font-bold px-2">{{inputField.value.length}}/{{ maxLength }}</div>
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

    `,
  ],
})
export class TextareaComponent implements ControlValueAccessor, Validator {

  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() placeholder: string = '';
  @Input() rows: number = 2;
  @Input({ alias: 'help-text' }) helpText: string = '';
  @Input() required: string = '';
  @Input() floating: 'on' | 'off' = 'off';
  @Input({ alias: 'class' }) _class: string = '';

  @Input() minLength!: number;
  @Input() minLengthError: string = '';

  @Input() maxLength!: number;
  @Input() maxLengthError: string = '';

  @Input() regex!: string;
  @Input() regexError: string = '';

  @Input() numberOnly: string = '';
  @Input() alphaOnly: string = '';
  @Input() allowedChars: string = '';


  @Input() genericError: string = '';
  @Input() errors: {} = {};

  @ViewChild('inputField', { static: true }) protected inputField!: ElementRef;

  private onChange!: (value: string) => void;
  private onTouched!: () => void;
  protected control!: AbstractControl;

  value: string = '';
  isFloating: boolean = false;

  isRequired(): boolean {
    return this.control?.hasValidator(Validators.required) ?? false;
  }

  writeValue(value: any): void {
    this.value = value || '';
    this.isFloating = !!this.value;
    if (this.inputField) {
      this.inputField.nativeElement.value = this.value;
    }
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
    this.value = inputValue;
    this.isFloating = !!inputValue;
    if (this.onChange) {
      this.onChange(inputValue);
    }
  }

  onBlur(): void {
    if (this.onTouched) {
      this.onTouched();
    }
    this.isFloating = !!this.value;
  }

  onFocus(): void {
    this.isFloating = true;
  }

  onKeyUp($event: KeyboardEvent){
    if(this.alphaOnly){

    }

    if(this.numberOnly){

    }

  }

  registerOnValidatorChange(fn: () => void): void {}

  validate(control: AbstractControl): ValidationErrors | null {
    this.control = control;
    this.addValidators();
    return null;
  }

  private addValidators(){
    if( this.minLength ){
      this.control.addValidators(Validators.minLength(this.minLength));
      if(!this.minLengthError)  this.minLengthError = "Field required minimum "+ this.minLength + " characters";
    }
    if( this.maxLength ){
      this.control.addValidators(Validators.maxLength(this.maxLength))
      if(!this.maxLengthError)  this.maxLengthError = "Field should not contains more that "+ this.maxLength + " characters";
    }
    if( this.regex ){
      this.control.addValidators(Validators.pattern(this.regex))
      if(!this.regexError)  this.regexError = "Input data should match REGX: "+ this.regex + " pattern";
    }
    if(this.required !== undefined){
      if(this.required == '') this.required = 'Please fill out this field.'
      this.control.addValidators(Validators.required);
    }
  }

}
