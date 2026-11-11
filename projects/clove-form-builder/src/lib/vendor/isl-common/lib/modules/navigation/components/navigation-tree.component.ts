import { Component, inject, Input, OnInit } from '@angular/core';
import { NavigationService } from "../services";
import { NavLink, NavMenu } from '../classes';

@Component({
    standalone: false,
  selector: 'nav-tree',
  template: `
    <ng-container *ngIf="navigation as navMenu">
      <ul class="space-y-2">
        <ng-template #renderNode let-node let-level="level">
          <!-- Divider -->
          <li *ngIf="node.divider" class="my-4">
            <div class="flex items-center mt-6">
              <span class="me-2 text-xs text-gray-500 dark:text-gray-400 font-semibold ms-4">{{ node.name }}</span>
              <hr class="flex-grow border-t border-gray-200 dark:border-gray-700">
            </div>
          </li>

          <!-- Main Node -->
          <!-- Main Component Template Update -->
          <li *ngIf="!node.divider && node.state !== 'hidden'" class=" transition-all duration-200 relative"
              (mouseover)="node.hovered = true"
              (mouseleave)="node.hovered = false">
            <div class="flex items-center space-x-2 p-1 rounded-lg"
                 [ngStyle]="{ 'padding-left': ((level + 1) * 16) + 'px' }">

              <!-- Icon or Toggle Button -->
              <ng-container *ngIf="hasAnyActiveChild(node)">
                <button (click)="toggleNode(node)" class="mr-2 text-gray-500">
                  <i class="fa-solid" [ngClass]="node.state == 'active' ? 'fa-caret-down' : 'fa-caret-right'"></i>
                </button>
              </ng-container>

              <!-- Node Link -->
              <ng-container *ngIf="node.path; else toggleNodeTemplate">
                <nav-link [navLink]="node"></nav-link>
              </ng-container>

              <ng-template #toggleNodeTemplate>
                <nav-link [navLink]="node" (onClick)="toggleNode(node)" class="cursor-pointer"></nav-link>
              </ng-template>
            </div>

            <!-- Recursive Children with Adjusted Padding and No Border -->
            <ul *ngIf="node.children && node.state == 'active'" class=" mt-2 space-y-2 pl-2">
              <ng-template ngFor let-child [ngForOf]="node.children">
                <ng-container *ngTemplateOutlet="renderNode; context: { $implicit: child, level: level + 1 }"></ng-container>
              </ng-template>
            </ul>
          </li>
        </ng-template>

        <!-- Render Root Nodes -->
        <ng-container *ngFor="let node of navMenu.navLinks">
          <ng-container *ngTemplateOutlet="renderNode; context: { $implicit: node, level: 0 }"></ng-container>
        </ng-container>
      </ul>
    </ng-container>
  `
})
export class NavigationTreeComponent implements OnInit{

  protected navigationService: NavigationService = inject(NavigationService);

  @Input({ required: true, alias: 'name' }) name?: string;

  protected navigation: NavMenu ;

  toggleNode(navLink: NavLink) {
    navLink.state = (navLink.state === 'inactive' || !navLink.state) ? 'active' : 'inactive';
  }

  hasAnyActiveChild(navLink: NavLink): boolean{
    let hasActiveChild: boolean = false;

    if(navLink.children && navLink.children.length > 0){
      for(const link of navLink.children!){
        hasActiveChild = link.state == 'active'
      }
    }

    return hasActiveChild;
  }

  ngOnInit() {
    this.navigationService.navigations.subscribe(value => {
      this.navigation = value.get(this.name);
    })
  }

}
