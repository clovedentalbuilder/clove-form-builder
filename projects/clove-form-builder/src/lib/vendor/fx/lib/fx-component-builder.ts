import { Component, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageModule, PopupService } from '../../isl-common';
import { FxExternalFieldLibrary, FxFieldLibrary } from './modules/field-library';
import {
  FxComponentStructure,
  FxFormSettingComponent,
  FxLogicBuilder,
  FxPropertiesComponent
} from './modules/form-builder';
import { FxBuilderConfiguration, FxForm, FxMode, FxScope } from './classes';
import { FxFormBuilderComponent } from './modules/form-builder/fx-form-builder.component';


@Component({
  standalone: true,
  imports: [CommonModule, PageModule, FxFieldLibrary, FxFormBuilderComponent, FxComponentStructure, FxFormSettingComponent, FxPropertiesComponent, FxLogicBuilder, FxExternalFieldLibrary],
  selector: 'fx-component-builder',
  template: `

        <page [label]="label">

          <panel label="All Elements" icon="fa fa-cubes" placement="left" [floating]="false" [active]="true" *ngIf="configuration.layouts" >

            <h5 class="heading my-4">Layouts</h5>
            <fx-field-library [layouts]="true" ></fx-field-library>

            <h5 class="heading my-4">Typography</h5>
            <fx-field-library [typography]="true" ></fx-field-library>

            <h5 class="heading my-4">Form Controls</h5>
            <fx-field-library [form-controls]="true" ></fx-field-library>


          </panel>

          <panel label="Layouts" icon="fa fa-table-layout" placement="left" [floating]="false" *ngIf="configuration.layouts" >
            <fx-field-library [layouts]="true" ></fx-field-library>
          </panel>

          <panel label="Typography" icon="fa fa-heading" placement="left" [floating]="false" *ngIf="configuration.typography" >
            <fx-field-library  [typography]="true" ></fx-field-library>
          </panel>

          <panel label="Form Fields" icon="fa fa-code" placement="left" [floating]="false" *ngIf="configuration.formField" >
            <fx-field-library [form-controls]="true"></fx-field-library>
          </panel>

          <panel label="Custom Components" icon="fa fa-list" placement="left" [floating]="false" *ngIf="configuration.customControls" >
            <fx-field-library [custom-controls]="true"></fx-field-library>
          </panel>

          <panel label="Component Library" icon="fa fa-list" placement="left" [floating]="false" *ngIf="configuration.external" >
            <fx-external-field-library [api]="configuration.external.api" ></fx-external-field-library>
          </panel>

          <page-body class="p-6 pb-0 bg-gray-50 dark:bg-gray-700">
            <div class="h-screen overflow-auto bg-white dark:bg-gray-900 shadow rounded-xl rounded-b-[0rem]">
              <fx-form-builder [fxForm]="fxForm" [scope]="fxScope" #formBuilder></fx-form-builder>
            </div>
          </page-body>


          <panel label="Elements" icon="fa fa-list-tree" [floating]="false" >
            <fx-component-structure [fxForm]="fxForm"></fx-component-structure>
          </panel>

          <panel label="Settings" icon="fa fa-cog" [floating]="false" *ngIf="configuration.settings" >
            <fx-form-settings [fxForm]="fxForm"></fx-form-settings>
          </panel>

          <panel label="Properties" icon="fa fa-sliders" [floating]="false" *ngIf="configuration.properties" >
            <fx-properties [fxData]="fxForm.$currentSelectedFxData"></fx-properties>
          </panel>

          <panel label="Logics" icon="fa fa-head-side-brain" [floating]="false" *ngIf="configuration.logics" >
            <fx-logic-builder [fxForm]="fxForm" ></fx-logic-builder>
          </panel>

          <action-bar>
            <button class="btn btn-soft btn-outline" (click)="clear()"> <i class="fa fa-eraser me-2"></i> Clear</button>
            <button class="btn btn-soft btn-outline !me-0" (click)="formBuilder.preview()"> <i class="fa fa-eye-dropper me-2"></i> Preview</button>
          </action-bar>

        </page>

  `
})
export class FxComponentBuilder implements OnInit, OnChanges{

  private popupService: PopupService = inject(PopupService);

  @ViewChild(FxFormBuilderComponent)
  fxFormBuilder: FxFormBuilderComponent;

  @Input("label") label: string = '';

  @Input({ alias: 'fx-form', required: true })
  fxForm: FxForm;

  @Input({ alias: 'scope', required: false})
  fxScope: FxScope = FxScope.DEFAULT;

  @Input({ alias: 'configuration', required: false })
  configuration: FxBuilderConfiguration = { };

  private defaultConfiguration: FxBuilderConfiguration = {
    settings: false,
    properties: true,
    logics: false,
    layouts: true,
    typography: true,
    formField: true,
    customControls: false
  }

  ngOnInit() {
    this.configuration = { ...this.defaultConfiguration, ...this.configuration };
    this.fxForm.$mode = FxMode.EDIT;
    this.fxForm.$scope = this.fxScope;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.fxForm){
      this.fxForm.$mode = FxMode.EDIT;
      this.fxForm.$scope = this.fxScope;
    }
  }

  public getParsedForm(): FxForm{
    return this.fxFormBuilder.getParsedForm(this.fxFormBuilder.fxForm);
  }

  clear(){
    this.popupService.confirm({ title: "Confirm", message: 'Are you sure you want to clear from? This action can not undone?'})
      .then(isOk => {
        if(isOk){
          this.fxForm.elements = [];
        }
      })
  }

  protected readonly FxScope = FxScope;
}
