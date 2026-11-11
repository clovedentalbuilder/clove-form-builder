import { Component, ContentChildren, Input, QueryList, TemplateRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { PanelComponent } from './panel.component';
import { PageHeaderComponent } from './page-header.component';
import { PageFooterComponent } from './page-footer.component';
import { PageModalComponent } from './page-modal.component';

@Component({
    standalone: false,
  selector: 'page-body',
  template: `
    <ng-template #pageBodyTemplate>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class PageBodyComponent {
  @Input('class') _class: string = 'p-4';
  @ViewChild('pageBodyTemplate') pageBodyTemplate?: TemplateRef<any>;
}

@Component({
    standalone: false,
  selector: 'page',
  template: `
    <div class="flex flex-col overflow-auto h-full bg-white dark:bg-gray-900 dark:text-white border dark:border-gray-800 relative page" [ngClass]="_class!">
      <ng-container *ngTemplateOutlet="pageModalTemplate"></ng-container>

      <div class="border-b p-4 flex justify-between items-center border-gray-200 dark:border-gray-700">
        <div>
          <h3 class="heading !m-0">
            <span *ngIf="icon" [ngClass]="icon" class="me-2 text-primary"></span> {{ title }}
          </h3>
        </div>

        <div>
          <ng-content select="action-bar"></ng-content>
        </div>
      </div>

      <div class="p-4 border-b dark:border-gray-700" *ngIf="navigationName">
        <nav-bread-crumb [name]="navigationName" *ngIf="navigationName"></nav-bread-crumb>
      </div>

      <div class="flex h-full overflow-auto relative bg-white dark:bg-gray-900">
        <!-- Left Panel -->
        <ng-container *ngTemplateOutlet="panelBarTemplate; context: { $implicit: 'left' }"></ng-container>
        <ng-container *ngTemplateOutlet="panelTemplate; context: { $implicit: 'left' }"></ng-container>

        <!-- Main content -->
        <div class="flex flex-col h-full overflow-auto flex-grow" (click)="hideFloatingPanel()">
          <div *ngIf="pageHeader.length > 0">
            <ng-content select="page-header"></ng-content>
          </div>

          <ng-container *ngFor="let body of pageBody">
            <div class="flex-grow h-full overflow-auto text-gray-900 dark:text-gray-100" [ngClass]="body._class">
              <ng-container *ngTemplateOutlet="body.pageBodyTemplate!"></ng-container>
            </div>
          </ng-container>

          <div *ngIf="pageFooter.length > 0">
            <ng-content select="page-footer"></ng-content>
          </div>
        </div>

        <!-- Right panels -->
        <ng-container *ngTemplateOutlet="panelTemplate; context: { $implicit: 'right' }"></ng-container>
        <ng-container *ngTemplateOutlet="panelBarTemplate; context: { $implicit: 'right' }"></ng-container>
      </div>
    </div>

    <ng-template #panelBarTemplate let-placement>
      <ng-container *ngIf="hasPanels(placement)">
        <div class="w-20 border-x border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <ng-container *ngFor="let panel of panels">
            <ng-container *ngIf="panel.placement === placement">
              <div class="p-3 border-b border-gray-200 dark:border-b-gray-700 text-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                   (click)="loadPanel(panel)"
                   [ngClass]="panel.active ? 'bg-gray-100 dark:bg-gray-700 group active' : ''">
                <span [ngClass]="panel.icon!" class="text-gray-900 dark:text-gray-100 group-active:text-primary"></span><br>
                <span class="text-xs font-semibold text-gray-900 dark:text-gray-100 ">{{ panel.label }}</span>
              </div>
            </ng-container>
          </ng-container>
        </div>
      </ng-container>
    </ng-template>

    <ng-template #panelTemplate let-placement>
      <ng-container *ngFor="let panel of panels">
        <ng-container *ngIf="panel.active && panel.placement === placement">
          <div class="h-full w-1 relative" *ngIf="panel.floating">
            <div
              [class.left-0]="placement == 'left'"
              [class.right-0]="placement == 'right'"
              class="absolute h-full min-w-96 z-10">
              <ng-container *ngTemplateOutlet="panel.panelTemplate!"></ng-container>
            </div>
          </div>
          <div class="h-full min-w-96 max-w-2xl bg-white dark:bg-gray-800" *ngIf="!panel.floating">
            <ng-container *ngTemplateOutlet="panel.panelTemplate!"></ng-container>
          </div>
        </ng-container>
      </ng-container>
    </ng-template>

    <ng-template #pageModalTemplate>
      <ng-container *ngFor="let modal of modals">
        <ng-container *ngIf="modal.state == 'shown'">
          <ng-container *ngTemplateOutlet="modal.modalTemplate!"></ng-container>
        </ng-container>
      </ng-container>
    </ng-template>
  `
})
export class PageComponent implements AfterViewInit {
  @Input({ required: true, alias: 'label' }) title?: string;
  @Input({ required: false, alias: 'icon' }) icon?: string;
  @Input({ required: false, alias: 'class' }) _class?: string;
  @Input({required: false, alias: 'navigation-name'}) navigationName: string = '';

  @ContentChildren(PageHeaderComponent) pageHeader: QueryList<PageHeaderComponent> = new QueryList();
  @ContentChildren(PageFooterComponent) pageFooter: QueryList<PageFooterComponent> = new QueryList();
  @ContentChildren(PageBodyComponent) pageBody: QueryList<PageBodyComponent> = new QueryList();
  @ContentChildren(PanelComponent) panels: QueryList<PanelComponent> = new QueryList();
  @ContentChildren(PageModalComponent) modals: QueryList<PageModalComponent> = new QueryList();

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // Manually detect changes after the view has been initialized to avoid ExpressionChangedAfterItHasBeenCheckedError
    this.cdr.detectChanges();
  }

  loadPanel(panel: PanelComponent) {
    if (panel.active) {
      panel.toggle();
    } else {
      this.panels.forEach(item => item.active = false);
      panel.toggle();
    }
  }

  hideFloatingPanel() {
    this.panels.forEach(item => {
      if (item.floating) {
        item.active = false;
      }
    });
  }

  hasPanels(placement: string): boolean {
    return this.panels.some(panel => panel.placement === placement);
  }
}
