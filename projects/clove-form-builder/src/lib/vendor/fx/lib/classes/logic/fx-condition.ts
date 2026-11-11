import {FxOperand} from "./fx-operand";

export interface FxCondition{
  lhs: string | number | boolean | FxOperand,
  rhs: string | number | boolean | FxOperand,
  operator: 'EQ' | 'LT' | 'GT' | 'LTE' | 'GTE' | 'NOT'
}

