import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PageBodyComponent, PageComponent} from './page.component';
import { PageHeaderComponent } from './page-header.component';
import { PageFooterComponent } from './page-footer.component';
import { PanelComponent } from './panel.component';
import { PanelHeaderComponent } from './panel-header.component';
import { PanelFooterComponent } from './panel-footer.component';
import { ActionBarComponent } from './action-bar.component';
import {TreeModule} from "../tree";
import {PageModalComponent} from "./page-modal.component";
import { NavigationModule } from '../navigation';

@NgModule({
  declarations: [

    PageComponent,
       PageHeaderComponent,
       PageFooterComponent,
       PanelComponent,
       PanelHeaderComponent,
       PanelFooterComponent,
       ActionBarComponent,
    PageBodyComponent,
    PageModalComponent,
  ],
  imports: [
    CommonModule,
    TreeModule,
    NavigationModule
  ],
  exports: [
    PageComponent,
    PageHeaderComponent,
    PageFooterComponent,
    PanelComponent,
    ActionBarComponent,
    PageBodyComponent,
    PageModalComponent,
  ]
})
export class PageModule {

}
