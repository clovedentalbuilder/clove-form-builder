import {Injectable, Type} from "@angular/core";
import {
  FxAddMoreLayoutComponent,
  FxCardLayoutComponent,
  FxCheckboxComponent,
  FxCheckboxGroupComponent, FxHeadingComponent, FxHorizontalRuleComponent,
  FxLayoutComponent,
  FxPanelLayoutComponent, FxParagraphComponent,
  FxPasswordFieldComponent, FxRadioComponent, FxRichTextComponent,
  FxRichTextEditorComponent,
  FxSelectListComponent,
  FxSmartCheckboxGroupComponent,
  FxSmartSelectListComponent,
  FxTextareaComponent,
  FxTextFieldComponent,
  LibraryItemDetails
} from "../modules/field-library";
import {FxStringSetting} from "../classes";
import { FxBaseComponent } from '../core';
import { FxFormFieldComponent } from '../modules/field-library/form-fields/fx-form-feild.component';


@Injectable({
  providedIn: "root"
})
export class FxComponentRegistryService{

  private _layouts: LibraryItemDetails[] = [
    {
      title: "Div",
      icon: 'fa-list',
      fxData: {
        id: null,
        name: "layout",
        type: 'LAYOUT',
        value: "",
        selector: "fx-layout",
        elements: []
      },
    },
    {
      title: "1X2 Layout", icon: 'fa-list', fxData: {
        id: null,
        name: "layout",
        value: "",
        type: 'LAYOUT',
        selector: "fx-layout",
        elements: [],
        settings:[
          new FxStringSetting({ key: "columns", value: 2})
        ]
      },
    },
    {
      title: "1X3 Layout", icon: 'fa-list', fxData: {
        id: null,
        name: "layout",
        value: "",
        type: 'LAYOUT',
        selector: "fx-layout",
        elements: [],
        settings:[
          new FxStringSetting({ key: "columns", value: 3})
        ]
      },
    },
    {
      title: "1X4 Layout", icon: 'fa-list', fxData: {
        id: null,
        name: "layout",
        value: "",
        type: 'LAYOUT',
        selector: "fx-layout",
        elements: [],
        settings:[
          new FxStringSetting({ key: "columns", value: 4})
        ]
      },
    },
    {
      title: "Card Layout", icon: 'fa-address-card', fxData: {
        id: null,
        name: "card",
        value: "",
        type: 'LAYOUT',
        selector: "fx-card-layout",
        elements: [],
        settings: []
      },
    },
    {
      title: "Panel Layout", icon: 'fa-columns', fxData: {
        id: null,
        name: "panel",
        value: "",
        type: 'LAYOUT',
        selector: "fx-panel-layout",
        elements: [],
        settings: []
      },
    },
    {
      title: "Multi Layout", icon: 'fa-plus', fxData: {
        id: null,
        name: "am-layout",
        value: [],
        type: 'LAYOUT',
        selector: "fx-add-more-layout",
        elements: [],
        settings: [],
      },
    }
  ]
  private _typography: LibraryItemDetails[] = [
    {
      title: "Heading", icon: 'fa-header', fxData: {
        id: null,
        name: "heading",
        value: "Heading",
        selector: "fx-heading",
        elements: []
      },
    },{
      title: "Paragraph", icon: 'fa-paragraph', fxData: {
        id: null,
        name: "paragraph",
        value: "Paragraph",
        selector: "fx-paragraph",
        elements: []
      },
    }, {
      title: "Text Editor", icon: 'fa-code', fxData: {
        id: null,
        name: "editor",
        value: "Click here to edit",
        selector: "fx-rich-text-editor",
        elements: []
      },
    },
    {
      title: "Horizontal Rule", icon: 'fa-minus', fxData: {
        id: null,
        name: "hr",
        value: "",
        selector: "fx-hr"
      },
    }
  ]
  private _formControls: LibraryItemDetails[] = [
    {
      title: "TextBox", icon: 'fa-edit', fxData: {
        id: null,
        name: "text",
        value: "",
        selector: "fx-text-field",
        elements: [],
        events:[]
      }
    },
    {
      title: "Password", icon: 'fa-key', fxData: {
        id: null,
        name: "password",
        value: "",
        selector: "fx-password-field",
        elements: [],
        events:[]
      }
    },
    {
      title: "TextArea", icon: 'fa-text-width', fxData: {
        id: null,
        name: "textarea",
        value: "",
        selector: "fx-textarea",
        elements: [],
        events:[]
      }
    },
    {
      title: "Select List", icon: 'fa-ballot-check', fxData: {
        id: null,
        name: "select",
        value: "",
        selector: "fx-select-list",
        elements: [],
        events:[]
      }
    },
    {
      title: "CheckBox", icon: 'fa-check', fxData: {
        id: null,
        name: "checkbox",
        value: "",
        selector: "fx-checkbox",
        elements: [],
        events:[]
      }
    },
    {
      title: "CheckBox Group", icon: 'fa-check-square', fxData: {
        id: null,
        name: "checkbox-group",
        value: "",
        selector: "fx-checkbox-group",
        elements: [],
        events:[]
      }
    }, {
      title: "Radio Group", icon: 'fa-circle-dashed', fxData: {
        id: null,
        name: "radio",
        value: "",
        selector: "fx-radio",
        elements: [],
        events:[]
      }
    },
    {
      title: "Rich Text", icon: 'fa-pencil', fxData: {
        id: null,
        name: "rich-text",
        value: "",
        selector: "fx-rich-text",
        elements: [],
        events:[]
      }
    },
    {
      title: "Smart List", icon: 'fa-list-ul text-red-500', fxData: {
        id: null,
        name: "smart-list",
        value: "",
        selector: "fx-smart-select-list",
        elements: [],
        events:[]
      }
    },
    {
      title: "Smart CheckBox", icon: 'fa-check-square text-red-500', fxData: {
        id: null,
        name: "sm-checkbox-group",
        value: "",
        selector: "fx-smart-checkbox-group",
        elements: [],
        events:[]
      }
    }
  ]
  private _customComponent: LibraryItemDetails[] = [];

  private componentRegistry: Map<string, Type<FxBaseComponent>> = new Map<string, Type<FxBaseComponent>>();

  constructor() {
    this.registerComponent('fx-text-field', FxTextFieldComponent);
    this.registerComponent('fx-password-field', FxPasswordFieldComponent);
    this.registerComponent('fx-textarea', FxTextareaComponent);
    this.registerComponent('fx-layout', FxLayoutComponent);
    this.registerComponent('fx-card-layout', FxCardLayoutComponent);
    this.registerComponent('fx-panel-layout', FxPanelLayoutComponent);
    this.registerComponent('fx-rich-text-editor', FxRichTextEditorComponent);
    this.registerComponent('fx-select-list', FxSelectListComponent);
    this.registerComponent('fx-smart-select-list', FxSmartSelectListComponent);
    this.registerComponent('fx-checkbox', FxCheckboxComponent);
    this.registerComponent('fx-checkbox-group', FxCheckboxGroupComponent);
    this.registerComponent('fx-smart-checkbox-group', FxSmartCheckboxGroupComponent);
    this.registerComponent('fx-radio', FxRadioComponent);
    this.registerComponent('fx-rich-text', FxRichTextComponent);
    this.registerComponent('fx-heading', FxHeadingComponent);
    this.registerComponent('fx-paragraph', FxParagraphComponent);
    this.registerComponent('fx-hr', FxHorizontalRuleComponent);
    this.registerComponent('fx-add-more-layout', FxAddMoreLayoutComponent);
    this.registerComponent('fx-form-field', FxFormFieldComponent);

  }

  public registerComponent(selector: string, type: Type<FxBaseComponent>, details?: { registeringAs: 'LAYOUT' | 'TYPOGRAPHY' | 'FORM_CONTROL' | 'CUSTOM', libraryItem: LibraryItemDetails }){

    if(this.componentRegistry.has(selector)) return;

    this.componentRegistry.set(selector, type);
    if(details) {
      switch (details.registeringAs) {
        case "FORM_CONTROL":
          this._formControls.push(details.libraryItem);
          break;
        case "LAYOUT":
          this._layouts.push(details.libraryItem);
          break;
        case "TYPOGRAPHY":
          this._typography.push(details.libraryItem);
          break;
        case "CUSTOM":
          this._customComponent.push(details.libraryItem);
      }
    }
  }

  public getComponent(selector: string): Type<FxBaseComponent> | undefined{
    return this.componentRegistry.get(selector);
  }


  get layouts(): LibraryItemDetails[] {
    return this._layouts;
  }

  get typography(): LibraryItemDetails[] {
    return this._typography;
  }

  get formControls(): LibraryItemDetails[] {
    return this._formControls;
  }


  get customComponent(): LibraryItemDetails[] {
    return this._customComponent;
  }
}
