import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NavigationBreadCrumbComponent, NavigationTreeComponent} from "./components";
import {RouterModule} from "@angular/router";
import {NavLinkComponent} from "./components/nav-link.component";
import {NavigationMenuComponent} from "./components";
import {DropdownModule} from "../dropdown";

@NgModule({
  declarations: [
    NavigationTreeComponent,
    NavigationBreadCrumbComponent,
    NavLinkComponent,
    NavigationMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DropdownModule
  ],
  exports: [
    NavigationTreeComponent,
    NavigationBreadCrumbComponent,
    NavigationMenuComponent
  ]
})
export class NavigationModule{

}
