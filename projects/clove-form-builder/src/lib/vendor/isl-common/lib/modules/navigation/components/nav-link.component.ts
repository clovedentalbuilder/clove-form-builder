import { Component, EventEmitter, Input, Output } from '@angular/core';
import {NavLink} from "../classes";

@Component({
    standalone: false,
  selector: 'nav-link',
  template: `

    @if (navLink.state == 'hidden'){

      <div class="flex space-x-2 items-center justify-start text-sm ">
        <span [ngClass]="navLink.icon!" class="text-primary w-5"></span>
        <span class="font-semibold text-gray-500">{{ navLink.name }}</span>
      </div>

    } @else {
      @if (navLink.path){
        <div class="flex space-x-2 items-center justify-start text-sm cursor-pointer"
             [routerLink]="navLink.routerLink!"
             (click)="onClick.emit(navLink.routerLink)">
        <span [ngClass]="navLink.icon!"
              class="text-primary w-5"></span>
          <span class="font-semibold" [ngClass]="navLink.path ? 'hover:underline' : 'text-gray-500'">{{ navLink.name }}</span>
        </div>
      } @else {
        <div class="flex space-x-2 items-center justify-start text-sm"
             (click)="onClick.emit(navLink.routerLink)">
          <span [ngClass]="navLink.icon!" class="text-primary w-5"></span>
          <span class="font-semibold" [ngClass]="navLink.path ? 'hover:underline' : 'text-gray-500'">{{ navLink.name }}</span>
        </div>
      }
    }

  `
})
export class NavLinkComponent{
  @Input({ required: true }) navLink!: NavLink;

  @Output("onClick") onClick: EventEmitter<any> = new EventEmitter<any>();

}
