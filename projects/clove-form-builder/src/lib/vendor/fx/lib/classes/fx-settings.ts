import {FxApi} from "./fx-api";
import {FxScope} from "./fx-form";

export enum FxSettingType{
  STRING,NUMBER,SELECT,JSON,OPTION,API, ICON, TOGGLE,HIDDEN
}
export interface FxSettingBase{
  key: string,
  value: any,
  scope?: FxScope,
  $title?: string;
  $description?: string;
}

export interface FxSetting extends FxSettingBase{
  type: FxSettingType;
}

export abstract class FxSettingAbstract implements FxSetting{
  type: FxSettingType;
  key: string;
  value: string;
  $title?: string;
  $description?: string;
  scope: FxScope;

  protected constructor(setting: FxSettingBase, type: FxSettingType) {
    this.key = setting.key;
    this.value = setting.value;
    this.$description = setting.$description;
    this.$title = setting.$title;
    this.type = type;
    if(setting.scope){
      this.scope = setting.scope
    }else{
      this.scope = FxScope.DEFAULT
    }
  }
}

export class FxStringSetting extends FxSettingAbstract{
  constructor(setting: FxSettingBase) {
    super(setting, FxSettingType.STRING);
  }
}

export class FxSelectSetting extends FxSettingAbstract{
  options: { option: string, value: any, description?: string } [] = [];
  constructor(
    setting: FxSettingBase, options: { option: string, value: any, description?: string } [] ){
    super(setting, FxSettingType.SELECT);
    this.options = options;
  }
}

export class FxOptionSetting extends FxSettingAbstract{
  options: { option: string, value: any, description?: string } [] = [];
  constructor(
    setting: FxSettingBase, options: { option: string, value: any, description?: string } [] ){
    super(setting, FxSettingType.OPTION);
    this.options = options;
  }
}

export class FxApiSetting extends FxSettingAbstract{
  api: FxApi | null;
  constructor(
    setting: FxSettingBase, api: FxApi | null ){
    super(setting, FxSettingType.API);
    this.api = api;
  }
}

export class FxIconSetting extends FxSettingAbstract{
  constructor(setting: FxSettingBase) {
    super(setting, FxSettingType.ICON);
  }
}

export class FxToggleSetting extends FxSettingAbstract{
  constructor(setting: FxSettingBase) {
    super(setting, FxSettingType.TOGGLE);
  }
}

export class FxJsonSetting extends FxSettingAbstract{
  constructor(setting: FxSettingBase) {
    super(setting, FxSettingType.JSON);
  }
}

export class FxHiddenSetting extends FxSettingAbstract{
  constructor(setting: FxSettingBase) {
    super(setting, FxSettingType.HIDDEN);
  }
}

function isSelectSetting(setting: FxSetting): setting is FxSelectSetting {
  return setting.type === FxSettingType.SELECT;
}

export function asSelectSetting(setting: FxSetting): FxSelectSetting | null {
  return isSelectSetting(setting) ? setting : null;
}


function isOptionSetting(setting: FxSetting | null): setting is FxOptionSetting {
  return setting!.type === FxSettingType.OPTION;
}

export function asOptionSetting(setting: FxSetting | null): FxOptionSetting | null {
  return isOptionSetting(setting) ? setting : null;
}

function isApiSetting(setting: FxSetting): setting is FxApiSetting {
  return setting.type === FxSettingType.API;
}

export function asApiSetting(setting: FxSetting): FxApiSetting | null {
  return isApiSetting(setting) ? setting : null;
}

function isIconSetting(setting: FxSetting): setting is FxIconSetting {
  return setting.type === FxSettingType.ICON;
}

export function asIconSetting(setting: FxSetting): FxIconSetting | null {
  return isIconSetting(setting) ? setting : null;
}

function isToggleSetting(setting: FxSetting): setting is FxToggleSetting {
  return setting.type === FxSettingType.TOGGLE;
}

export function asToggleSetting(setting: FxSetting): FxToggleSetting | null {
  return isIconSetting(setting) ? setting : null;
}

function isJsonSetting(setting: FxSetting): setting is FxJsonSetting {
  return setting.type === FxSettingType.JSON;
}

export function asJsonSetting(setting: FxSetting): FxJsonSetting | null {
  return isIconSetting(setting) ? setting : null;
}
