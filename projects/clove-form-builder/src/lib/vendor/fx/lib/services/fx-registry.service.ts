import {Injectable} from "@angular/core";
import {FxData, FxValidation} from "../classes";
import {FxValidatorService} from "./fx-validator.service";
import {ValidatorFn} from "@angular/forms";

@Injectable({ providedIn: 'root' })
export class FxRegistryService {

  private Fx_Data_Elements: Map<string, FxData> = new Map<string, FxData>();

  constructor(private fxValidatorService: FxValidatorService) {}

  public getDataFields(): FxData[]{
    let elements: FxData[] = [];
    for(let fxData of this.Fx_Data_Elements.values()){
      elements.push(fxData);
    }
    return elements;
  }

  public getValidator(fxValidation: FxValidation): ValidatorFn | undefined{
    return this.fxValidatorService.get(fxValidation);
  }

  public register(fxData: FxData){
    if(fxData.id)
      this.Fx_Data_Elements.set(fxData.id, fxData);
  }

  public getFxData(id: string | null): FxData | undefined{
    if(id != null)
      return this.Fx_Data_Elements.get(id);
    else return undefined;
  }

}
