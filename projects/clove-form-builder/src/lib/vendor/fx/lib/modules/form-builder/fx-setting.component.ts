import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  asApiSetting,
  asIconSetting,
  asOptionSetting,
  asSelectSetting,
  FxData,
  FxMode,
  FxScope,
  FxSettingType
} from '../../classes';
import { FormsModule } from '@angular/forms';
import { FxEventBuilder } from './fx-event-builder';
import { FxJsonEditor } from './fx-json-editor';
import { FxValidationBuilder } from './fx-validation-builder';

import { FxApiConnectorComponent } from './api-builder';
import { FxIconSelector } from './fx-icon-selector';
import {
  ButtonComponent,
  InputComponent,
  ModalComponent,
  ModalModule,
  SelectComponent,
  TabComponent,
  TabItemComponent, ToggleComponent
} from '../../../../isl-common';

@Component({
  selector: 'fx-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, FxEventBuilder,
    FxJsonEditor, FxValidationBuilder, FxApiConnectorComponent, FxIconSelector, ModalModule, InputComponent, SelectComponent,
    TabComponent, TabItemComponent, ButtonComponent, ToggleComponent],
  template: `

    <modal size="max-w-6xl" placement="top-center" [closable]="false" #modalComponent>
      <modal-header>Component Settings <span class="text-gray-500 ml-3" *ngIf="fxData">#{{ fxData.name }}</span>
      </modal-header>
      <modal-body>

        <tab *ngIf="isVisible">
          <tab-item label="Properties" icon="fa fa-sliders" [active]="true">
            <!--<fx-properties [fxData]="fxData"></fx-properties>-->

            <div class="p-4 bg-gray-50">
              <ng-container *ngIf="fxData">
                <div class="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label>ID</label>
                  </div>
                  <div class="text-xs">
                    {{ fxData.id }}
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label>Name</label>
                  </div>
                  <div>
                    @if (fxData.$fxForm?.$scope == FxScope.BUILDER) {
                      <input type="text" class="form-control" [(ngModel)]="fxData.name" />
                    } @else {
                      {{ fxData.name }}
                    }
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-3 mb-3" *ngIf="fxData.selector !== 'fx-form-field'">
                  <div>
                    <label>Value</label>
                  </div>
                  <div>
                    <form-input placeholder="Enter any value here..." class="mt-0"
                                [(ngModel)]="fxData.value"></form-input>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-3 my-3" *ngIf="fxData.$fxForm?.$scope == FxScope.BUILDER" >
                  <div>
                    <label>Lock Element</label>
                    <p class="text-mute">Element can only modify/delete in builder not if enabled </p>
                  </div>
                  <div>
                    <form-toggle [(ngModel)]="fxData['isLocked']" ></form-toggle>
                  </div>
                </div>

              </ng-container>

              <div class="grid grid-cols-3 gap-4 mb-3" *ngFor="let setting of fxData?.settings!">
                @if (fxData.$fxForm?.$scope >= setting.scope) {
                  <div>
                    <label>{{ setting.$title }}</label>
                    <div class="text-xs italic text-gray-600" *ngIf="setting.$description"><i
                      class="fa fa-info-circle"></i> {{ setting.$description }}
                    </div>
                  </div>
                  <div>
                    <ng-container [ngSwitch]="setting.type">

                      <div *ngSwitchDefault>
                        <form-input class="mt-0" [(ngModel)]="setting.value"></form-input>
                      </div>

                      <div *ngSwitchCase="'JSON'">
                        <fx-json-editor [json]="setting.value"></fx-json-editor>
                      </div>

                      <div *ngSwitchCase="'ARRAY'">
                        <fx-json-editor [json]="setting.value"></fx-json-editor>
                      </div>

                      <div *ngSwitchCase="'NUMBER'">
                        <form-input [(ngModel)]="setting.value" class="mt-0" accept="number"></form-input>
                      </div>

                      <div *ngSwitchCase="FxSettingType.SELECT">
                        <ng-container *ngIf="asSelectSetting(setting) as selectSetting">
                          <form-select class="mt-0" [(ngModel)]="setting.value" [source]="selectSetting.options"
                                       option-title="$option" option-value="$value"
                                       placeholder="No Value Selected"></form-select>
                        </ng-container>
                      </div>

                      <div *ngSwitchCase="FxSettingType.OPTION">
                        <ng-container *ngIf="asOptionSetting(setting) as optionSetting">
                          <fx-json-editor [json]="optionSetting.options"></fx-json-editor>
                        </ng-container>
                      </div>

                      <div *ngSwitchCase="FxSettingType.API">
                        <ng-container *ngIf="asApiSetting(setting) as apiSetting">
                          <div class="flex justify-between mt-3">
                            <ng-container *ngIf="!apiSetting.api?.service">
                              <span class="text-gray-500 text-sm">No api attached</span>
                              <button class="btn btn-primary p-1 px-3"
                                      (click)="apiConnector.show()"><i
                                class="fa fa-code"></i> Attach API
                              </button>
                            </ng-container>

                            <ng-container *ngIf="apiSetting.api?.service">
                              <span class="text-primary font-semibold text-sm">
                                {{ apiSetting.api.uri }}
                              </span>
                              <button class="btn btn-primary p-1 px-3"
                                      (click)="apiConnector.show()"><i
                                class="fa fa-pen"></i> Change
                              </button>
                            </ng-container>

                          </div>
                          <fx-api-connector #apiConnector
                                            [fx-api-setting]="apiSetting"></fx-api-connector>
                        </ng-container>
                      </div>

                      <div *ngSwitchCase="FxSettingType.ICON">
                        <ng-container *ngIf="asIconSetting(setting) as iconSetting">
                          <fx-icon-selector
                            [fxIconSetting]="iconSetting"></fx-icon-selector>
                        </ng-container>
                      </div>

                    </ng-container>
                  </div>

                  <!--<div *ngIf="fxData.$fxForm.$scope == FxScope.BUILDER">
                    <form-select [source]="scopes"
                                 placeholder="Change Scope"
                                 class="mt-0"
                                 option-title="$name"
                                 option-description="$description"
                                 option-value="$value"
                                 (onSelect)="onScopeSelect(fxData, $event)"
                                 option-icon="$icon" [(ngModel)]="setting.scope">
                    </form-select>
                  </div>-->
                }
              </div>

            </div>

          </tab-item>

          <tab-item label="Validations" icon="fa fa-key" *ngIf="fxData?.validations">
            <fx-validation-builder [validations]="fxData.validations"></fx-validation-builder>
          </tab-item>

          <tab-item label="Events" icon="fa fa-hand" *ngIf="fxData?.events">
            <fx-event-builder [fxData]="fxData"></fx-event-builder>
          </tab-item>

          <tab-item label="Styles" icon="fa fa-sliders" *ngIf="fxData?.styles">
            Coming Soon...
          </tab-item>

        </tab>

      </modal-body>
      <modal-footer class="text-right">
        <form-button type="done" (click)="done()"></form-button>
      </modal-footer>
    </modal>


  `,
  styles: [],
})
export class FxSettingComponent{

  protected isVisible: boolean = false;

  @Input() protected fxData!: FxData;

  @Output()
  public onSettingChange: EventEmitter<FxData>  = new EventEmitter<FxData>();

  @ViewChild("modalComponent", {static: false})
  protected modal!: ModalComponent;

  scopes: any[] = [
    { name: 'Default', description: 'Open for modification by anyone', icon: 'fa-users', value: FxScope.DEFAULT }, // Represents public access or multiple users
    { name: 'Designer', description: 'Editable in Designer and Builder modes', icon: 'fa-pencil-ruler', value: FxScope.DESIGNER }, // Represents design and customization tools
    { name: 'Builder', description: 'Restricted to Builder mode only', icon: 'fa-tools', value: FxScope.BUILDER } // Represents construction or build tools
  ];


  openSettings(fxData: FxData) {
    this.fxData = fxData;
    this.modal.show();
    this.isVisible = true;
  }

  hide(){
    this.modal.hide();
    this.isVisible = false;
  };

  done(){
    this.onSettingChange.emit(this.fxData);
    this.fxData.$settingChangeEvent.emit(this.fxData.settings);
    this.hide();
  }


  protected readonly FxSettingType = FxSettingType;
  protected readonly asSelectSetting = asSelectSetting;
  protected readonly asOptionSetting = asOptionSetting;
  protected readonly asApiSetting = asApiSetting;
  protected readonly asIconSetting = asIconSetting;
  protected readonly FxMode = FxMode;
  protected readonly FxScope = FxScope;

  onScopeSelect(fxData: FxData, $event: any) {

  }
}
