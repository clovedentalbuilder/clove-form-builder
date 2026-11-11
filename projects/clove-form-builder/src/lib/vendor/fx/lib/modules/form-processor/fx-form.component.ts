import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FxComponentResolver } from './fx-component-resolver.component';
import { FormArray, FormGroup } from '@angular/forms';
import { FxLogicExecutor, FxLogicService, FxModalService } from '../../services';
import { FxForm, FxMode } from '../../classes';
import { FxUtils } from '../../utils';

@Component({
  selector: 'fx-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    CommonModule,
    FxComponentResolver
  ],
  template: `
      <ng-container *ngFor="let component of fxForm.elements">
        <fx-component-resolver [_formGroup]="formGroup" [element]="component" [parent]="fxForm"  [fxForm]="fxForm"  ></fx-component-resolver>
      </ng-container>
  `,
  styles: []
})
export class FxFormComponent implements OnInit, AfterViewInit{

  private isInitialized: boolean = false;

  @Input({ required: false })
  formGroup: FormGroup = new FormGroup<any>({});

  @Input({ required: true })
  fxForm!: FxForm;

  @Input()
  value: any;

  @Input({ required: false })
  mode: FxMode = FxMode.VIEW;

  @Input({ required: false })
  viewMode: FxMode = FxMode.EDIT;

  @Output()
  public onSubmit: EventEmitter<FormGroup>  = new EventEmitter<FormGroup>();

  constructor(private modalService: FxModalService,
              private viewContainerRef: ViewContainerRef,
              private fxLogicService: FxLogicService,
              private changeDetectionRef: ChangeDetectorRef,
              private fxLogicExecutor: FxLogicExecutor) {
    this.modalService.init(viewContainerRef);
  }

  ngOnInit() {
    if(!this.isInitialized){
      this.isInitialized = !this.isInitialized;
      this.init();
    }
  }


  public init(){
    if(!this.fxForm.$mode)
      this.fxForm.$mode = this.mode;

    this.fxForm.$viewMode = this.viewMode;

    this.fxForm.$this = this;
    this.fxForm.$context = FxUtils.generateUUID()
    if(this.fxForm.logics) {
      for (let logic of this.fxForm.logics) {
        this.fxLogicService.registerLogic(logic);
      }
    }
  }


  ngAfterViewInit() {
    this.patchValue();
  }

  public patchValue(){
    if(this.value){
      setTimeout(()=>{
        this.formGroup.patchValue(this.value);
      },100)
    }
  }

  submit(): FormGroup{
    this.fxLogicExecutor.executeAll(this.fxForm.before);
    this.validateForm(this.formGroup);
    this.doChanges(this.fxForm.elements);
    this.onSubmit.emit(this.formGroup);
    if(this.formGroup.valid){
      this.fxLogicExecutor.executeAll(this.fxForm.after);
    }
    return this.formGroup;
  }

  public doChanges(components: any[]){
    this.changeDetectionRef.detectChanges();
    for(let component of components) {
      try {
        component.$this?.detectChanges();
      }catch (e){ }
      if (component.elements && component.elements?.length > 0) this.doChanges(component.elements);
    }
  }

  validateForm(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.validateForm(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

}
