import { Component, ContentChildren, QueryList, AfterContentInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabItemComponent } from './tab-item.component';
import {Router, RouterModule} from "@angular/router";

@Component({
  selector: 'tab',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `

    <ng-container *ngIf="tabs">
      <div class="border-b dark:border-b-gray-800 flex space-x-2">
        <ng-container *ngFor="let tab of tabs; let i = index">
          <div (click)="loadTab(i)">
            <ng-container *ngTemplateOutlet="tab.tabLinkTemplate"></ng-container>
          </div>
        </ng-container>
      </div>

      <div class="dark:bg-gray-800">
        <ng-container *ngFor="let tab of tabs">
          <ng-container *ngIf="tab.active" >
            <ng-container *ngTemplateOutlet="tab.tabItemTemplate"></ng-container>
          </ng-container>
        </ng-container>
      </div>
    </ng-container>

  `
})
export class TabComponent{
  @ContentChildren(TabItemComponent) tabs: QueryList<TabItemComponent> = new QueryList();
  protected activeTabIndex: number = 0;

  loadTab(index: number) {
    this.activeTabIndex = index;
    this.tabs.toArray().forEach((tab, i) => {
      tab.load(i === index);
    });
  }

}
