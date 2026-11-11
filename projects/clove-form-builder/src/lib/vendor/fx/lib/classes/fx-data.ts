import {FxSetting} from "./fx-settings";
import {FxValidation} from "./fx-validation";
import {FxEvent} from "./event";
import {FormGroup} from "@angular/forms";
import {FxForm} from "./fx-form";
import { FxBaseComponent } from '../core';
import { FxComponentResolver } from '../modules/form-processor';
import { FxComponent } from '../modules/form-builder';
import { EventEmitter } from '@angular/core';

export interface FxData {
  id: string | null;
  selector: string;
  name: string;
  type?: 'LAYOUT' | 'COMPONENT' | 'FIELD';
  value?: any;
  styles?: [];
  events?: FxEvent[];
  elements?: any[];
  forms?: FxForm[];
  validations?: FxValidation[];
  settings?: FxSetting[];
  info?: any

  /**
   * Non serializable properties
   * */
  $initialized?: boolean;
  $settingChangeEvent?: EventEmitter<FxSetting[]>;
  $fxForm?: FxForm;
  $formGroup?: FormGroup;
  $this?: FxBaseComponent;
  $parent?: FxComponentResolver;
  $fxComponent?: FxComponent;



}
