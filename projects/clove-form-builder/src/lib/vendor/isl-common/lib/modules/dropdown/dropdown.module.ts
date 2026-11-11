import {NgModule} from "@angular/core";
import {DropdownComponent, DropdownTriggerComponent} from "./dropdown.component";
import {DropdownLinkComponent} from "./dropdown-link.component";
import {DropdownSearchComponent} from "./dropdown-search.component";
import {CommonModule} from "@angular/common";


@NgModule({
  declarations: [
    DropdownComponent,
    DropdownTriggerComponent,
    DropdownLinkComponent,
    DropdownSearchComponent
  ],
    exports: [
        DropdownComponent,
        DropdownTriggerComponent,
        DropdownLinkComponent
    ],
  imports: [
    CommonModule
  ]
})
export class DropdownModule{

}
