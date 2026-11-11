import {Action} from "./action";
import {Injectable} from "@angular/core";
import {FxActionProperty} from "../fx-action";
import {FxRegistryService} from "../../../services";
import {FxData} from "../../fx-data";


@Injectable({
  providedIn: "root"
})
export class FxInvalidateFieldAction extends Action{

  constructor(private fxRegistryService: FxRegistryService) {
    super();
  }

  execute(): void {
    let field = this.getProperty("field");
    let message = this.getProperty("message")?.value.toString();
    if(field){
      let fxData: FxData | undefined = this.fxRegistryService.getFxData(field.value.toString())
      if(fxData){
        let formControl: any = fxData.$formGroup?.get(fxData.name);
        formControl.setErrors({
          logic: {
            message: message
          }
        });
        formControl.markAsTouched();
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
      $description: "Choose field that you want to invalidate",
      type: 'FIELD',
        value: ''
      },{
        key: "message",
      $title: "Message",
      $description: "Enter your error message which you want show below the field.",
      type: 'VALUE',
        value: ''
      }];
  }

}
