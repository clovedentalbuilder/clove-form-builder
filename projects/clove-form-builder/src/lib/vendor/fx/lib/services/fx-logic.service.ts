import {Injectable} from "@angular/core";
import {FxLogic} from "../classes";


@Injectable({ providedIn: 'root' })
export class FxLogicService{

  public Fx_Logics: Map<string, FxLogic> = new Map<string, FxLogic>();

  public registerLogic(logic: FxLogic){
    this.Fx_Logics.set(logic.id, logic);
  }


}
