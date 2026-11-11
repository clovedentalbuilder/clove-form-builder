import {Component, ElementRef, forwardRef, Input, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  AbstractControl,
  ControlValueAccessor, FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'form-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="form-control-wrapper"
         *ngIf="control"
         [class.with-icon]="icon"
         [class.with-floating-label]="floating == 'on'"
         [class.is-floating]="isFloating"
         [class.with-error-field]="!control.untouched && control.invalid">

      <div class="relative">
        <span class="input-label">{{ label }} <span *ngIf="control.errors && control.errors!['required']" class="text-red-500">*</span></span>
        <i class="input-icon" [ngClass]="icon" ></i>
          <input
            #inputField
            [type]="type"
            [value]="value"
            (input)="onInput($event)"
            (blur)="onBlur()"
            (focus)="onFocus()"
            [class]="_class"
            [maxLength]="maxLength? maxLength : 10000000"
            class="form-control text-sm"
            [placeholder]=" floating == 'on' ? isFloating ? placeholder : '' : placeholder" />

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
              <div *ngIf="control.errors!['pattern'] && regexError" >{{ regexError }}</div>
            </div>
          } @else {
            <span class="flex-wrap italic" *ngIf="helpText"> {{ helpText }}</span>
          }
        </div>
        <div *ngIf="maxLength" class="font-bold px-2">{{inputField.value.length}}/{{ maxLength }}</div>
      </div>

    </div>
  `
})
export class InputComponent implements ControlValueAccessor, Validator {

  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() placeholder: string = '';
  @Input({ alias: 'help-text' }) helpText: string = '';
  @Input({ alias: 'class' }) _class: string = '';


  @Input({ alias: 'type' }) type: 'text' | 'password' = 'text';

  @Input() required!: string;

  @Input() minLength!: number;
  @Input() minLengthError: string = '';

  @Input() maxLength!: number;
  @Input() maxLengthError: string = '';

  @Input() regex!: string;
  @Input() regexError: string = '';

  @Input() floating: 'on' | 'off' = 'off';
  protected isFloating: boolean = false;

  @Input({ alias: 'allow-space' }) allowSpace: 'yes' | 'no' = 'yes';
  @Input({ alias: 'accept' }) accept: 'all' | 'alphabet' |  'number' | 'decimal' = 'all';

  @Input() genericError!: string;
  @Input() errors: {} = {};

  @ViewChild('inputField', { static: false }) protected inputField!: ElementRef;

  private onChange!: (value: string) => void;
  private onTouched!: () => void;
  protected control!: AbstractControl;

  protected value: string = '';

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
    this.checkValidInput();
    this.value = this.inputField.nativeElement.value;
    if (this.onChange) {
      this.onChange(this.value);
    }
  }

  private checkValidInput(){
    let value = this.inputField.nativeElement.value;

    switch (this.accept) {
      case 'alphabet':
        if (this.allowSpace === 'yes') {
          value = value.replace(/[^a-zA-Z\s]/g, ''); // Allow alphabet and spaces
        } else {
          value = value.replace(/[^a-zA-Z]/g, ''); // Allow only alphabet, no spaces
        }
        break;
      case 'number':
        value = value.replace(/[^0-9]/g, ''); // Allow only numbers
        break;
      case 'decimal':
        value = value.replace(/[^0-9.]/g, ''); // Allow numbers and decimal
        // Ensure only one decimal point is present
        const parts = value.split('.');
        if (parts.length > 2) {
          value = parts[0] + '.' + parts.slice(1).join('');
        }
        break;
      case 'all':
      default:
        // Allow all characters
        if (this.allowSpace === 'no') {
          value = value.replace(/\s/g, ''); // Remove all spaces if allowSpace is 'no'
        }
        break;
    }

    this.inputField.nativeElement.value = value;
  }

  onBlur(): void {
    if (this.onTouched) {
      this.onTouched();
    }
    this.isFloating = !!this.control.value;
  }

  onFocus(): void {
    this.isFloating = true;
  }

  registerOnValidatorChange(fn: () => void): void {}

  validate(control: AbstractControl): ValidationErrors | null {
    if(!this.control){
      this.control = control;
      this.addValidators();
    }
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

  public focus(){
    this.inputField.nativeElement.focus();
  }

}
