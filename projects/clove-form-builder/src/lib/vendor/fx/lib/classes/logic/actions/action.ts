import {FxAction, FxActionProperty} from "../fx-action";
import { FxUtils } from '../../../utils';

export abstract class Action{

  protected fxAction!: FxAction;
  public abstract execute(): void;
  public abstract properties(): FxActionProperty[];

  public init(fxAction: FxAction): void{
    fxAction.properties = FxUtils.deepMergeArrays(this.properties(), fxAction.properties);
    this.fxAction = fxAction;
  }

  protected getProperty(key: string): FxActionProperty | undefined{
    return this.fxAction.properties.find(p=>p.key == key);
  }


}

