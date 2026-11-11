import {Injectable} from "@angular/core";
import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {FxValidation} from "../classes";


@Injectable({ providedIn: 'root' })
export class FxValidatorService{

  public static required: FxValidation = {
    key: 'required',
    message: 'Please fill out the field',
    $description: 'This is mandatory field validation'
  }

  public static email: FxValidation = {
    key: 'email',
    message: 'Invalid email address',
    $description: 'Validation enforce user to put only email address into the field.'
  }

  public static alphaOnly: FxValidation = {
    key: 'alphaOnly',
    message: 'Only allowed alphabets',
    $description: 'Validation enforce user to put only alphabets',
    properties: [{ key: "include-space" , $title: "Include Space", type: 'BOOLEAN', value: false }]
  }

  public static numberOnly: FxValidation = {
    key: 'numberOnly',
    message: 'Only number allowed',
    $description: 'Validation enforce user to put only numbers',
    properties: [{ key: "include-space" , $title: "Include Space", type: 'BOOLEAN', value: false }]
  }

  public static pattern: FxValidation = {
    key: 'pattern',
    message: 'Invalid value',
    $description: 'This validation support regex pattern. Please add valid regex pattern in pattern data field.',
    properties: [{ key: 'pattern', $title: 'Pattern', type: 'STRING', value: '' }]
  }

  public static minLength: FxValidation = {
    key: 'minlength',
    message: 'Invalid value',
    $description: 'This validation enforce user to fill the value with min specified length.',
    properties: [{ key: 'minlength',  $title: 'Minimum Length', type: 'NUMBER', value: ''}]
  }

  public static maxLength: FxValidation = {
    key: 'maxlength',
    message: 'Invalid value',
    $description: 'This validation enforce user to fill the value with max specified length.',
    properties: [{ key: 'maxlength',  $title: 'Maximum Length', type: 'NUMBER', value: ''}]
  }

  public static selectOne: FxValidation = {
    key: 'select-one',
    message: 'Please select at least one item.',
    $description: 'This validation enforce user to select at least one checkbox from the group'
  }


  public get(fxValidation: FxValidation): ValidatorFn | undefined{
    switch (fxValidation.key){

      case FxValidatorService.pattern.key:
        return Validators.pattern(this.getValidationProperty(FxValidatorService.pattern.key, fxValidation));

      case FxValidatorService.minLength.key:
        return Validators.minLength(this.getValidationProperty(FxValidatorService.minLength.key, fxValidation));

      case FxValidatorService.maxLength.key:
        return Validators.maxLength(this.getValidationProperty(FxValidatorService.maxLength.key, fxValidation));

      case FxValidatorService.selectOne.key:
        return selectOne();

      case FxValidatorService.required.key:
        return Validators.required;

      case FxValidatorService.email.key:
        return Validators.email;

      case FxValidatorService.alphaOnly.key:
        return alphaOnlyValidator(this.getValidationProperty('include-space', fxValidation));

      case FxValidatorService.numberOnly.key:
        return numberOnlyValidator(this.getValidationProperty('include-space', fxValidation));

      default:
        return undefined;
    }
  }

  private getValidationProperty(key: string, fxValidation: FxValidation): any{
    if(fxValidation.properties){
      let fxValidationProp =  fxValidation.properties.filter(value => value.key == key);
      if(fxValidationProp.length > 0){
        return fxValidationProp[0].value;
      }
    }
    return undefined;
  }


}

export function selectOne(): ValidatorFn {
  return (group: AbstractControl): { [key: string]: boolean } | null => {
    if (group instanceof FormGroup) {
      const controls = group.controls;
      const hasValue = Object.values(controls).some(control => control.value !== null && control.value !== '' && control.value !== false);
      return hasValue ? null : { 'select-one': true };
    }
    return null;
  };
}

export function alphaOnlyValidator(includeSpace: boolean = false): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const pattern = includeSpace ? /^[a-zA-Z\s]+$/ : /^[a-zA-Z]+$/;
    if (!pattern.test(control.value)) {
      return { alphaOnly: true };
    }
    return null;
  };
}

export function numberOnlyValidator(includeSpace: boolean = false): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const pattern = includeSpace ? /^[0-9\s]+$/ : /^[0-9]+$/;
    if (!pattern.test(control.value)) {
      return { numberOnly: true };
    }
    return null;
  };
}
