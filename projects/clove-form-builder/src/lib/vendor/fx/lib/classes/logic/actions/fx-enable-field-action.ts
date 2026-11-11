import { Action } from './action';
import { Injectable } from '@angular/core';
import { FxActionProperty } from '../fx-action';
import { FxRegistryService } from '../../../services';
import { FxData } from '../../fx-data';


@Injectable({
  providedIn: "root"
})
export class FxEnableFieldAction extends Action{

  constructor(private fxRegistryService: FxRegistryService) {
    super();
  }

  execute(): void {
    let field = this.getProperty("field");
    if(field){
      let fxData: FxData | undefined = this.fxRegistryService.getFxData(field.value.toString())
      if(fxData){
        let formControl: any = fxData.$formGroup?.get(fxData.name);
        formControl.markAsTouched();
        formControl.enable();
        fxData.$this?.detectChanges();
      }
    }else{
      console.error("Unable to execute FxInvalidateFieldAction because it is not configured properly");
    }
  }

  public properties(): FxActionProperty[] {
    return [{
        key: "field",
      $title: "Field",
      $description: "Choose field that you want to enable",
      type: 'FIELD',
        value: ''
      }];
  }

}
