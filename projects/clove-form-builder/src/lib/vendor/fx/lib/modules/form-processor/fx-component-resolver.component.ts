import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FxComponentRegistryService, FxRegistryService } from '../../services';
import { FxData, FxForm, FxSetting } from '../../classes';
import { FxBaseComponent } from '../../core';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  selector: 'fx-component-resolver',
  template: `
    <div [id]="element?.id" class="mb-2">
      <ng-container #dynamicComponentContainer ></ng-container>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FxComponentResolver implements AfterViewInit{

  @Input()
  public parent?: FxData | FxForm;

  @Input()
  public element?: FxData;

  @Input()
  public _formGroup?: FormGroup | undefined;

  @Input()
  public fxForm?: FxForm | undefined;

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  dynamicComponentContainer?: ViewContainerRef;


  constructor(private cdr: ChangeDetectorRef,
              private fxRegistry: FxRegistryService,
              private fxComponentRegistry: FxComponentRegistryService) {
  }

  ngAfterViewInit(): void {
    this.load();
  }

  public load(){
    this.dynamicComponentContainer?.clear();
    if(this.dynamicComponentContainer && this.element) {
      this.initFxComponent(this.element);
      this.render();
    }
  }

  public render(){
    this.cdr.detectChanges();
  }

  private initFxComponent(fxData: FxData){
    if(fxData.$initialized) return;
    let componentType: Type<FxBaseComponent> | undefined = this.fxComponentRegistry.getComponent(fxData.selector);
      if(componentType && this.dynamicComponentContainer){
        let fxComponentRef: ComponentRef<FxBaseComponent> = this.dynamicComponentContainer.createComponent(componentType);
        fxData.$initialized = true;
        fxData.$parent = this;
        fxData.$this = fxComponentRef.instance;
        fxData.$formGroup = this._formGroup;
        fxData.$fxForm = this.fxForm;
        fxData.$settingChangeEvent = new EventEmitter<FxSetting[]>();
        fxComponentRef.instance.init(fxData, this.fxRegistry);
    }
  }

}
