import { ChangeDetectorRef, EventEmitter } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FxRegistryService } from '../services';
import { FxUtils } from '../utils';
import { FxData, FxForm, FxMode, FxSetting, FxStringSetting, FxValidation } from '../classes';

export abstract class FxBaseComponent {

  protected onAddElement: EventEmitter<FxData> = new EventEmitter<FxData>();
  protected onInit: EventEmitter<FxData> = new EventEmitter<FxData>();

  protected abstract settings(): FxSetting[];
  protected abstract validations(): FxValidation[];

  protected fxData: FxData = {
    id: "unknown",
    name:"unknown",
    selector: "unknown",
    type: 'COMPONENT',
    elements: []
  };

  protected fxRegistry!: FxRegistryService;

  protected constructor(private _cdr: ChangeDetectorRef | null) {}

  public init(fxData: FxData, fxRegistryService: FxRegistryService): void{

    this.fxRegistry = fxRegistryService;

    //Merge settings and validations before assign to this
    fxData.settings = FxUtils.deepMergeArrays(fxData.settings, this.settings());
    fxData.settings.push(new FxStringSetting({key: '_class', $title: 'Prent Wrapper Class', value: '', $description: 'This is class name for parent wrapper of this component.'}));
    let validations = FxUtils.deepMergeArrays(fxData.validations, this.validations());
    if(validations && validations.length > 0) fxData.validations = validations;

    this.fxData = fxData;

    //Fire onInit Event
    this.onInit.next(fxData);
  }

  protected setting(key: string): any{
    if(this.fxData.settings) {
      const setting = this.fxData.settings.find((s) => s.key === key);
      if (setting) {
        return setting.value;
      }
    }
    return null;
  }

  protected settingObj(key: string): FxSetting | null{
    if(this.fxData.settings) {
      const setting = this.fxData.settings.find((s) => s.key === key);
      if (setting) {
        return setting;
      }
    }
    return null;
  }

  protected addElement(e: any){
    if(e.data.type =='COMPONENT'){
      let cmp: FxForm = FxUtils.copyForm(e.data);
      let fxData: FxData = {
        id: '',
        name: 'form',
        selector: 'fx-form-field',
        settings: [],
        value: cmp,
      }
      let data = FxUtils.getElement(fxData, true);
      this.fxData?.elements.push(data);
      FxUtils.scrollToElement(data);
    } else{
      let fxData = FxUtils.getElement(e.data.fxData, true);
      this.fxData.elements?.push(fxData);
    }
    this.onAddElement.emit(this.fxData);
  }

  protected _register(formItem: FormControl | FormGroup | FormArray){
    formItem.addValidators(this.validators());
    formItem.patchValue(this.fxData.value);
    this.fxRegistry.register(this.fxData);
    this.fxData.$formGroup?.addControl(this.fxData.name, formItem);
  }

  private validators(): any[]{
    let validators: any[] = [];
    if(this.fxData.validations)
      for(let validation of this.fxData.validations!){
        if(validation.enable){
          let validator = this.fxRegistry.getValidator(validation);
          if(validator) validators.push(validator);
        }
      }
    return validators;
  }

  public detectChanges(){
    this._cdr?.detectChanges();
  }

  public val(): any{
    return this.fxData.$formGroup?.get(this.fxData.name)?.value;
  }

  public refresh(){
    this.fxData.$fxForm?.$this?.patchValue();
    this._cdr?.detectChanges();
  }

  public getContextBaseId(){
    return `context-${this.fxData!.$fxForm!.$context}$-#${this.fxData.id}`;
  }

  public isEditable(): boolean{
    return this.fxData.$fxForm?.$mode == FxMode.EDIT;
  }

}
