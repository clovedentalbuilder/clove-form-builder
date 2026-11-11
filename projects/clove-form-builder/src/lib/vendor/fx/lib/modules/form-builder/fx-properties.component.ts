import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FxDropdownComponent } from '../../components';
import { FxIconSelector } from './fx-icon-selector';
import {
  asIconSetting,
  asSelectSetting,
  FxData,
  FxSettingType,
} from '../../classes';
import { FxSettingsService } from '../../services';

@Component({
  selector: 'fx-properties',
  standalone: true,
  imports: [CommonModule, FormsModule, FxDropdownComponent, FxIconSelector],
  template: `
    <div
      class="text-gray-900 dark:text-gray-200 flex flex-col space-y-2"
      *ngIf="fxData"
    >
      <div>ID: {{ fxData.id }}</div>

      <div class="flex items-center">
        <span class="me-2 font-semibold">Name: </span>
        <input
          (change)="updateComponent()"
          type="text"
          class="form-control p-1 text-xs px-2"
          [(ngModel)]="fxData.name"
        />
      </div>

      <div class="flex items-center">
        <span class="me-2 font-semibold">Value: </span>
        <input
          (change)="updateComponent(true)"
          type="text"
          class="form-control p-1 text-xs px-2"
          [(ngModel)]="fxData.value"
        />
      </div>

      <div>
        <hr class="my-2 border-gray-800 -mx-2" />
      </div>

      <div class="flex items-center" *ngFor="let setting of fxData?.settings!">
        <div class="flex-grow">
          <ng-container [ngSwitch]="setting.type">
            <div *ngSwitchCase="FxSettingType.STRING">
              <span class="me-2 font-semibold">{{ setting.$title }}</span>
              <textarea
                (change)="updateComponent()"
                class="form-control p-1 text-xs px-2"
                rows="2"
                [(ngModel)]="setting.value"
              ></textarea>
            </div>

            <div *ngSwitchCase="FxSettingType.NUMBER">
              <span class="me-2 font-semibold">{{ setting.$title }}</span>
              <input
                type="number"
                (change)="updateComponent()"
                class="form-control p-1 text-xs px-2"
                rows="2"
                [(ngModel)]="setting.value"
              />
            </div>

            <div *ngSwitchCase="FxSettingType.SELECT">
              <span class="me-2 font-semibold">{{ setting.$title }}</span>
              <ng-container *ngIf="asSelectSetting(setting) as selectSetting">
                <fx-dropdown
                  [data]="selectSetting.options"
                  [selected]="setting.value"
                  [titleKey]="'option'"
                  [valueKey]="'value'"
                  [descriptionKey]="'description'"
                  placeholder="--nothing selected--"
                  (valueChange)="
                    setting.value = $event.value; updateComponent(true)
                  "
                ></fx-dropdown>
              </ng-container>
            </div>

            <div *ngSwitchCase="FxSettingType.ICON">
              <ng-container *ngIf="asIconSetting(setting) as iconSetting">
                <fx-icon-selector
                  [fxIconSetting]="iconSetting"
                ></fx-icon-selector>
              </ng-container>
            </div>
          </ng-container>
        </div>
      </div>

      <a
        class="font-semibold underline cursor-pointer text-primary float-right"
        (click)="fxSettingService.openSetting(fxData)"
      >
        <i class="fa fa-wrench"></i> Settings</a
      >
    </div>
  `,
  styles: [],
})
export class FxPropertiesComponent {
  protected fxSettingService: FxSettingsService = inject(FxSettingsService);

  @Input({ required: true }) public fxData!: FxData | undefined;

  updateComponent(updateParent: boolean = false) {
    this.fxData!.$this?.detectChanges();
    if (updateParent) this.fxData!.$parent?.load();
  }

  protected readonly asSelectSetting = asSelectSetting;
  protected readonly asIconSetting = asIconSetting;
  protected readonly FxSettingType = FxSettingType;
}
