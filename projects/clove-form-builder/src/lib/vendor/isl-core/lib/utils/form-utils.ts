import {FormArray, FormGroup} from "@angular/forms";

export class FormUtils{


  public static validateAllFormFields(formGroup: FormGroup | FormArray){
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup || control instanceof FormArray) {
        // Recursive call for nested FormGroup or FormArray
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }


}
