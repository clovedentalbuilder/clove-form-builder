import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {CommonModule} from "@angular/common";

@Component({
    standalone: true,
    imports: [ CommonModule ],
    selector: 'form-button',
    template: `
      <span class="hidden btn-secondary btn-secondary-outline"></span>
      <button type="button" [ngClass]="style" [disabled]="disabled" [class.btn-block]="blockButton"  (click)="onClick()" >
        @if (isLoading){
          <i class="fa-duotone fa-solid fa-spinner-third fa-spin me-2"></i>
        } @else {
          <span *ngIf="icon && iconPlacement == 'start'" [ngClass]="icon" class="fa me-2" ></span>
        }

        {{ label }}
        <span *ngIf="icon && iconPlacement == 'end'" [ngClass]="icon" class="fa ms-2" ></span>
      </button>
    `,
})
export class ButtonComponent implements OnInit, OnChanges{

  @Input({ alias: 'type', required: true }) type: 'submit' | 'save' | 'cancel' | 'custom' | 'reset' | 'ok' | 'previous' | 'next' | 'done' | 'close' = 'custom';
  @Input({ alias: 'label'}) label!: string;
  @Input({ alias: 'icon'}) icon!: string;
  @Input({ alias: 'icon-placement'}) iconPlacement: 'start' | 'end' = 'start';
  @Input({ alias: 'btn-style' }) style: 'btn-primary' | 'btn-primary-outline' | 'btn-secondary' | 'btn-secondary-outline' | 'btn-danger' | 'btn-danger-outline' | 'btn-success' | 'btn-warning' | 'btn-info' | 'btn-default' | 'btn-default-outline' = 'btn-default-outline';
  @Input({ alias: 'btn-block' }) blockButton: boolean = false;
  @Input({ alias: 'disabled' }) disabled : boolean = false;
  @Input({ alias: 'size' }) size!: 'btn-sm' | 'btn-lg' | 'btn-xl'

  @Input({ alias: 'clickFn' }) clickFn!: ()=> Promise<any>;
  @Input({ alias: 'clickFnDelay' }) delay: number = 500;

  protected isLoading: boolean = false;

  ngOnInit() {
    this.initializeButton();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initializeButton();
  }

  async onClick(){
    if(this.clickFn!){
      this.isLoading = true;
      this.disabled = true;
       setTimeout(()=>{
        try{
          this.clickFn();
          this.isLoading = false;
          this.disabled = false;
        }catch (error){
          this.isLoading = false;
          this.disabled = false;
        }
      }, this.delay)
    }
  }

  private initializeButton(){
    if(!this.label) this.label = this.type.toUpperCase();
    switch (this.type){
      case "cancel":
        this.style = 'btn-danger-outline'
        this.icon = 'fa-times'; break;
      case "ok":
        this.style = 'btn-success'; break;
      case "reset":
        this.icon = 'fa-refresh'; break;
      case "save":
        this.style= 'btn-primary-outline'
        this.icon = 'fa-save'; break;
      case "submit":
        this.style = 'btn-primary';
        this.icon = 'fa-arrow-right'; break;
      case "done":
        this.style = 'btn-secondary';
        this.icon = 'fa-check';
        break;
      case "next":
        this.iconPlacement = 'end';
        this.style = 'btn-secondary-outline';
        this.icon = 'fa-angle-right'; break;
      case "close":
        this.iconPlacement = 'end';
        this.style = 'btn-default-outline';
        this.icon = 'fa-times'; break;
      case "previous":
        this.style = 'btn-secondary-outline';
        this.icon = 'fa-angle-left'; break;
    }

    if(this.size) this.style += ' '+ this.size;

  }
}
