import {Injectable} from "@angular/core";
import {FxData} from "../classes";
import { FxSettingComponent } from '../modules/form-builder';


@Injectable({ providedIn: 'root' })
export class FxSettingsService{

  private settingComponent!: FxSettingComponent;

  init(settingComponent: FxSettingComponent){
    this.settingComponent = settingComponent;
  }

  openSetting(fxData: FxData){
    this.settingComponent.openSettings(fxData);
  }

}
