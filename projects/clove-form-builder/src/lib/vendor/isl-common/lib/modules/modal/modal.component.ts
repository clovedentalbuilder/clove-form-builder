import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {Modal, ModalInterface, ModalOptions} from "flowbite";


@Component({
    standalone: false,
  selector: 'modal-header',
  template: `
    <header [ngClass]="$class" class="p-4 border-b rounded-t dark:border-gray-600">
      <ng-content></ng-content>
    </header>
  `
})
export class ModalHeaderComponent{
  @Input("class")
  $class!: string;
}

@Component({
    standalone: false,
  selector: 'modal-body',
  template: `
      <ng-content></ng-content>
  `
})
export class ModalBodyComponent{
}

@Component({
    standalone: false,
  selector: 'modal-footer',
  template: `
    <footer  [ngClass]="$class" class="p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
      <ng-content></ng-content>
    </footer>
  `
})
export class ModalFooterComponent{
  @Input({alias: "class"})
  public $class = '';
}

@Component({
    standalone: false,
  selector: 'modal',
  template: `

    <div #modal tabindex="-1" class="fixed top-0 left-0 right-0 !z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full" style="background: rgba(0,0,0,0.5)">
      <div class="relative w-full {{ size }} max-h-full text-gray-700 dark:text-gray-200 flex flex-col" [ngClass]="overflow">

        <div class="relative bg-white rounded-lg shadow dark:bg-gray-800 h-full flex-grow flex flex-col" [ngClass]="overflow">
          <ng-container>
            <ng-container *ngIf="closable">
              <!--<i class="fa fa-times absolute right-4 top-4 cursor-pointer text-gray-300 hover:text-gray-600" (click)="hide()"></i>-->
              <div class="absolute right-3 top-3 z-10">
                <button class="btn-danger-outline" (click)="hide()"><i class="fa fa-times"></i></button>
              </div>
            </ng-container>
            <ng-content select="modal-header"></ng-content>
          </ng-container>

          <div class="space-y-6 flex-grow dark:bg-gray-900" [ngClass]="overflow" >
            <ng-content select="modal-body"></ng-content>
          </div>

          <ng-container>
            <ng-content select="modal-footer"></ng-content>
          </ng-container>

        </div>

      </div>
    </div>


  `
})
export class ModalComponent{

  @Input("header") header: string = '';
  @Input("closable") closable: boolean = true;
  @Input("overflow") overflow: 'overflow-auto' | 'overflow-hidden' = 'overflow-auto';
  @Input("size") size: 'max-w-6xl' | 'max-w-4xl' | 'max-w-3xl' | 'max-w-2xl' | 'max-w-xl' | 'max-w-lg'  | 'max-w-sm' | 'max-w-xs' | 'min-w-xs'
  | 'h-full max-w-6xl' | 'h-full max-w-4xl' | 'h-full max-w-3xl' | 'h-full max-w-2xl' | 'h-full max-w-xl' | 'h-full max-w-lg'  | 'h-full max-w-sm' | 'h-full max-w-xs' | 'h-full min-w-xs'
    | 'h-full' = 'max-w-4xl';

  @Input("placement") placement: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'  = 'center';
  @ViewChild("modal", {static: true})
  $modalElement!: ElementRef;

  private modal!: ModalInterface;

  show(){
    const targetElement = this.$modalElement?.nativeElement;
    document.body.appendChild(targetElement);
    this.modal = new Modal(this.$modalElement.nativeElement, {
      placement: this.placement,
      backdrop: this.closable ? 'dynamic' : 'static',
      backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
      closable: this.closable,
      onHide:()=>{
        document.body.removeChild(targetElement);
      }
    });
    this.modal.show();
  }

  hide(){
    this.modal.hide();
  }


}
