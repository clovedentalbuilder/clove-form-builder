import { Component, computed, inject, Input, OnInit } from '@angular/core';
import {NavigationService} from "../services";
import { NavLink } from '../classes';

@Component({
    standalone: false,
  selector: 'nav-bread-crumb',
  template: `

    <ng-container *ngIf="breadCrumb">
      <div class="flex items-center space-x-2">
        <ng-container *ngFor="let crumb of breadCrumb ; let last = last">
          <nav-link [navLink]="crumb" ></nav-link>
          <span *ngIf="last" class="breadcrumb-item"></span>
          <span *ngIf="!last" class="fa-thin fa-slash-forward text-lg"></span>
        </ng-container>
      </div>
    </ng-container>
  `
})
export class NavigationBreadCrumbComponent implements OnInit{
  @Input({ required: true, alias: 'name' }) name: string = '';
  protected navigationService: NavigationService = inject(NavigationService);
  protected breadCrumb: NavLink[];

  ngOnInit() {
    this.navigationService.breadCrumbs.subscribe(value => {
      this.breadCrumb = value.get(this.name);
    })
  }

}

