import {FxData} from "./fx-data";
import {FxLogic} from "./logic";
import {FxIconSetting} from "./fx-settings";
import { FxFormComponent } from '../modules/form-processor';

export interface FxForm{
  id: string,
  name: string,
  description?: string,
  icon?: FxIconSetting,
  type : 'COMPONENT' | 'FORM',
  elements: FxData[],
  logics: FxLogic[],
  before: FxLogic[],
  after: FxLogic[],
  views?: [],
  /**
   * Non serialize field
   * */
  $viewMode?: FxMode,
  $mode?: FxMode,
  $scope?: FxScope,
  $context: string,
  $this?: FxFormComponent
  $currentSelectedFxData?: FxData

}

export enum FxMode{
  VIEW = "VIEW",
  EDIT = "EDIT",
}

export enum FxScope{
  BUILDER = 100,
  DESIGNER = 50,
  DEFAULT = 1
}

