import {FxAction} from "./fx-action";
import {FxCondition} from "./fx-condition";

export interface FxLogic {
  id: string,
  name: string,
  description?: string,
  statements: FxLogicStatement[]
}

export interface FxLogicStatement{
  if: {
    separator: 'AND' | 'OR',
    conditions: FxCondition[],
    actions: FxAction[]
  },
  else?: {
    separator: 'AND' | 'OR',
    conditions: FxCondition[],
    actions: FxAction[]
  }
}


