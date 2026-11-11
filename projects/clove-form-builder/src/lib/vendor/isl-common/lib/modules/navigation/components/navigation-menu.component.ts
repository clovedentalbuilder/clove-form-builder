import { Component, inject, Input, OnInit } from '@angular/core';
import { NavigationService } from "../services";
import { NavMenu } from '../classes';

@Component({
    standalone: false,
  selector: 'nav-menu',
  template: `
    <ng-container *ngIf="navigation as navMenu">
      <nav class="flex">
        <div *ngFor="let nav of navMenu.navLinks">
          <ng-container *ngIf="nav.children && nav.children.length > 0; else singleLink">
            <ng-template #dropdownLink>
              <dropdown #navMenu>
                <dropdown-trigger>
                  <div
                    class="flex space-x-2 items-center p-3 cursor-pointer border-b-2 border-b-transparent hover:border-primary hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <i [ngClass]="nav.icon!" class="text-primary"></i>
                    <span class="text-gray-900 dark:text-gray-200">{{ nav.name }}</span>
                    <i class="fa fa-caret-down ms-2 text-gray-400 "></i>
                  </div>
                </dropdown-trigger>
                <div class="shadow-2xl border rounded-lg dark:border-gray-700 dark:bg-gray-800">
                  <ng-container *ngFor="let child of nav.children">
                    <div
                      class="p-3 border-b min-w-72 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-700"
                    >
                      <div
                        class="flex space-x-2 items-center justify-start text-sm"
                        [routerLink]="child.routerLink!"
                        (click)="navMenu.hide()"
                      >
                        <span [ngClass]="child.icon!" class="text-primary w-5"></span>
                        <span
                          class="font-semibold dark:text-gray-200"
                          [ngClass]="child.path ? 'hover:underline' : 'text-gray-600 dark:text-gray-400'"
                        >
                      {{ child.name }}
                    </span>
                      </div>
                    </div>
                  </ng-container>
                </div>
              </dropdown>
            </ng-template>
            <ng-container *ngTemplateOutlet="dropdownLink"></ng-container>
          </ng-container>
          <ng-template #singleLink>
            <div
              class="flex space-x-2 items-center p-3 cursor-pointer border-b-2 border-b-transparent hover:border-primary hover:bg-gray-100 dark:hover:bg-gray-700"
              [routerLink]="nav.path!"
            >
              <i [ngClass]="nav.icon!" class="text-primary"></i>
              <span class="text-gray-900 dark:text-gray-200">{{ nav.name }}</span>
            </div>
          </ng-template>
        </div>
      </nav>
    </ng-container>

  `
})
export class NavigationMenuComponent implements OnInit{
  @Input({ required: true, alias: 'name' }) name?: string;

  protected navigationService: NavigationService = inject(NavigationService);
  protected navigation: NavMenu;
  ngOnInit() {
    this.navigationService.navigations.subscribe(value => {
      this.navigation = value.get(this.name);
    })
  }


}
