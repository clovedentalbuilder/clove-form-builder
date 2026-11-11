import {Component, ElementRef, Input, ViewChild} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Modal, ModalInterface, ModalOptions} from "flowbite";

@Component({
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `

    <div #modal tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full" style="background: rgba(0,0,0,0.5)">
      <div class="relative w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-xl shadow dark:bg-gray-700 overflow-hidden">
          <!-- Modal header -->
          <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600 bg-primary">
            <h3 class="text-xl font-semibold text-gray-200 dark:text-white">
              {{ data.title }}
            </h3>
            <button type="button" (click)="hide()" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-6 space-y-6">
            <div class="text-base leading-relaxed text-gray-500 dark:text-gray-400" [innerHTML]="data.message" ></div>
          </div>
          <!-- Modal footer -->
          <div class="overflow-auto p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600 text-right">
            <button (click)="onYes()" type="button" class="btn-success me-2"> <i class="fa fa-check me-2"></i> Yes</button>
            <button (click)="onNo()" type="button" class="btn-danger-outline"><i class="fa fa-times me-2"></i> No</button>
          </div>
        </div>
      </div>
    </div>

  `,
  styles: []
})
export class ConfirmComponent{

  @ViewChild("modal")
  $modalElement!: ElementRef;

  private modal!: ModalInterface;

  @Input("data")
  public data: { title: string, message: string } = { title: "Confirm", message: '' };

  @Input()
  public modalOptions: ModalOptions = {
    placement: 'center',
    backdrop: 'dynamic',
    backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
    closable: true,
    onHide: () => {
    },
    onShow: () => {
    },
    onToggle: () => {
    }
  }

  private resolveFun: any;

  show(resolve: any) {
    this.modal = new Modal(this.$modalElement.nativeElement, this.modalOptions);
    this.modal.show();
    this.resolveFun = resolve;
  }

  protected hide(){this.modal.hide()};
  protected toggle(){this.modal.toggle()};

  onYes(){
    this.resolveFun(true);
    this.hide();
  }

  onNo(){
    this.resolveFun(false);
    this.hide();
  }

}
