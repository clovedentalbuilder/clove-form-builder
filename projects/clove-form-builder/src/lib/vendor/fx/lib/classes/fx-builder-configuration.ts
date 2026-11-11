import {FxApi} from "./fx-api";

export interface FxBuilderConfiguration{
  settings?: boolean,
  properties?: boolean,
  logics?: boolean,
  layouts?: boolean,
  typography?: boolean,
  formField?: boolean,
  customControls?: boolean,
  external?: {
    api: FxApi
  }
}
