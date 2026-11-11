import {FxValidation} from "./fx-validation";
import { FxBaseComponent } from '../core';

export abstract class FxNonDataFieldComponent extends FxBaseComponent{

  protected override validations(): FxValidation[] {
    return [];
  }

  protected constructor() {
    super(null);
  }

}
