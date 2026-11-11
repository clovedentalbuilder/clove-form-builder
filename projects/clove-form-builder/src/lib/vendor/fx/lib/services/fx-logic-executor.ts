import { FxAction, FxCondition, FxData, FxLogic, FxOperand } from '../classes';
import { Injectable, Injector } from '@angular/core';
import { FxRegistryService } from './fx-registry.service';
import { FxLogicService } from './fx-logic.service';
import { FxActionService } from './fx-action.service';


@Injectable({ providedIn: 'root' })
export class FxLogicExecutor{

  constructor(private injector: Injector,
              private fxLogicService: FxLogicService,
              private fxActionService: FxActionService,
              private fxRegistryService: FxRegistryService) {
  }

  public execute(logicId: string){
    let logic  = this.fxLogicService.Fx_Logics.get(logicId);
    if(logic) this._execute(logic);
  }

  public executeAll(logics: { id: string }[]){
    for(let logic of logics){
      this.execute(logic.id);
    }
  }

  private _executeAll(fxLogics: FxLogic[]){
    for(let fxLogic of fxLogics){
      this._execute(fxLogic);
    }
  }

  private _execute(fxLogic: FxLogic){
    for(let statement of fxLogic.statements){
      if(this.evaluateConditions(statement.if.conditions)){
        this.performActions(statement.if.actions)
      }else if(statement.else){
        if(statement.else.conditions.length > 0){
          if(this.evaluateConditions(statement.else.conditions)) this.performActions(statement.else.actions)
        }else{
          this.performActions(statement.else.actions)
        }
      }
    }
  }

  private evaluateConditions(conditions: FxCondition[]): boolean{
    for(let condition of conditions){
      if(!this.evaluateCondition(condition))
        return false;
    }
    return true;
  }

  private evaluateCondition(condition: FxCondition): boolean{
    let lhs = this.resolveOperand(condition.lhs) + '';
    let rhs = this.resolveOperand(condition.rhs) + '';
    switch (condition.operator){
      case "EQ":
        return lhs == rhs;
      case "GTE":
        return lhs >= rhs;
      case "GT":
        return lhs > rhs;
      case "LT":
        return lhs < rhs;
      case "LTE":
        return lhs <= rhs;
      case "NOT":
        return lhs != rhs;
      default:
          return false;
    }
  }

  private resolveOperand(operand: any): any{
      if(this.instanceOfFxOperand(operand)){
        let fxOperand: FxOperand = operand;
        const fxData : FxData | undefined = this.fxRegistryService.getFxData(fxOperand.fxDataId);
        if(fxOperand.key === 'value' && fxData){
           return fxData.$this?.val();
        }else{
          let data : any = fxData;
          return fxOperand.key ? data[fxOperand.key] : null;
        }
      }else{
        return operand;
      }
  }

  private instanceOfFxOperand(object: any): boolean {
    return object.constructor === Object;
  }

  public performActions(actions: FxAction[]){
    for(let action of actions){
       let theAction = this.fxActionService.get(action.key);
       if(theAction){
          let _action = this.injector.get(theAction);
          _action.init(action);
          _action.execute();
       }
    }
  }

}
