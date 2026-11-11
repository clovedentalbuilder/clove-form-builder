import {Injectable, Injector, Type} from "@angular/core";
import {Action, FxAction, FxAlertAction, FxInvalidateFieldAction} from "../classes";
import { FxDisableFieldAction } from '../classes/logic/actions/fx-disable-field-action';
import { FxEnableFieldAction } from '../classes/logic/actions/fx-enable-field-action';


@Injectable({ providedIn: 'root' })
export class FxActionService{

  public fxActions : FxAction[] = [];
  private Fx_Actions: Map<string, { title: string, description: string, action: Type<Action> } > = new Map();

  constructor(private injector: Injector) {
    this.initActions();
  }

  private initActions(): void{
    this.Fx_Actions.set("alert", {
      action: FxAlertAction,
      title: "Alert a Message",
      description: "Display alert message when execute."
    });

    this.Fx_Actions.set("invalidateField", {
      action: FxInvalidateFieldAction,
      title: "Invalidate Field",
      description: "Invalidate Filed"
    });

    this.Fx_Actions.set("disabledField", {
      action: FxDisableFieldAction,
      title: "Disable Field",
      description: "Action will disable desire field and also remove validations on that field."
    });

    this.Fx_Actions.set("enabledField", {
      action: FxEnableFieldAction,
      title: "Enable Field",
      description: "Action will enable desire field and also attach validations on that field."
    });

    this.populateActionList();
  }

  public registerAction(key: string, action: { title: string, description: string, action: Type<Action> }){
    this.Fx_Actions.set(key, action);
    this.populateActionList();
  }

  private populateActionList(){
    this.fxActions = [];
    for(let key of this.Fx_Actions.keys()){
      let action = this.Fx_Actions.get(key);
      if(action) {
        let actionObj = this.injector.get(action.action);
        this.fxActions.push({
          key: key,
          $title: action.title,
          $description: action.description,
          properties: actionObj.properties()
        })
      }
    }
  }

  public get(key: string): Type<Action> | undefined{
    return this.Fx_Actions.get(key)?.action;
  }


}
