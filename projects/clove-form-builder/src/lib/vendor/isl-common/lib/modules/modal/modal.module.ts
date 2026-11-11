import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent} from "./modal.component";

@NgModule({
  declarations: [
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent
  ],
  exports: [
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ModalModule {}
