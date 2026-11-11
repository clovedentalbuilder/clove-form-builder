import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeComponent } from './tree.component';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    TreeComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    TreeComponent
  ]
})
export class TreeModule { }
