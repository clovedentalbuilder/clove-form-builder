import {Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'tab-item',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `

    <ng-template #tabLinkTemplate>
      @if (routerLink){
        <a class="cursor-pointer p-4 border-b-2 border-b-transparent hover:border-primary font-semibold text-sm flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700"
           [class.active]="active" routerLinkActive="r-active" [routerLink]="routerLink">
          <i class="fa me-2 text-secondary" [ngClass]="icon"></i>
          <span>{{ label }}</span>
        </a>
      } @else {
        <a class="cursor-pointer p-4 border-b-2 border-b-transparent hover:border-primary font-semibold text-sm flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700"
           [class.active]="active" routerLinkActive="r-active">
          <i class="fa me-2 text-secondary" [ngClass]="icon"></i>
          <span>{{ label }}</span>
        </a>
      }

    </ng-template>

    <ng-template #tabItemTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
  styles: [`
    .active, .r-active{
      @apply border-b-primary text-primary;
    }
  `],
  standalone: true
})
export class TabItemComponent{
  @Input({ alias: 'label', required: true }) label: string = ''; // Label for the tab
  @Input({ alias: 'icon' }) icon: string = ''; // Optional icon for the tab

  @Input() active: boolean = false;

  @Input() routerLink!: string;

  @ViewChild('tabItemTemplate', { static: true }) tabItemTemplate!: TemplateRef<any>;
  @ViewChild('tabLinkTemplate', { static: true }) tabLinkTemplate!: TemplateRef<any>;

  constructor(private router: Router) {}

  load(state: boolean) {
    this.active = state;
  }

}
