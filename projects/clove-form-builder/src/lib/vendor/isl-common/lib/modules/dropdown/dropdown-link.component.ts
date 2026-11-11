import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Dropdown, DropdownInterface} from "flowbite";
import {DropdownOptions} from "flowbite/lib/esm/components/dropdown/types";


@Component({
    standalone: false,
  selector: 'dropdown-link',
  template: `
    <div class="relative" (click)="show()" #triggerElement>
      <label *ngIf="selected" class="cursor-pointer" [ngClass]="styleClass[style]">{{ selected }} <i class="fa fa-caret-down"></i></label>
      <label *ngIf="!selected" class="!text-slate-500 cursor-pointer" [ngClass]="styleClass[style]">{{ placeholder }} <i class="fa fa-caret-down"></i></label>
    </div>


    <!-- Dropdown menu -->
    <div class="z-[100] hidden bg-white rounded-lg shadow-lg w-[300px] dark:bg-gray-700" #targetElement>
      <ul class="h-48 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200 py-3">
        <li *ngFor="let d of data" class="cursor-pointer dark:hover:bg-slate-600 hover:bg-slate-50 px-4 py-1 mb-2"
            (click)="onSelect(d)">
          <div class="flex justify-between">
            <div>
              <strong>{{ titleKey ? d[titleKey] : d }}</strong><br>
              <span class="mr-1 text-slate-500 text-xs" *ngIf="descriptionKey">{{ d[descriptionKey] }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>

  `
})
export class DropdownLinkComponent implements AfterViewInit{

  @Input()
  placeholder: string = '';

  @Input()
  titleKey: string = '';

  @Input()
  descriptionKey: string = '';

  @Input("selected")
  selected: string = '';

  @Input()
  style: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';

  styleClass  = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: '',
    lg: '',
    xl: 'text-lg'
  }

  @Input()
  dropdownOptions: DropdownOptions = {
    placement: 'bottom-end',
    triggerType: 'none',
    delay: 300
  };

  @Input("data")
  data: any[] = [];

  @Output("valueChange")
  valueChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("triggerElement")
  triggerElement?: ElementRef;

  @ViewChild("targetElement")
  targetElement?: ElementRef;

  dropdown?: DropdownInterface;

  ngAfterViewInit(): void {
    this.dropdown = new Dropdown(this.targetElement?.nativeElement, this.triggerElement?.nativeElement, this.dropdownOptions);
  }

  onSelect($data: any){
    this.selected = $data[this.titleKey];
    this.valueChange.next($data);
    this.dropdown?.hide();
  }

  public show(){
    console.log(this.dropdown);
    this.dropdown?.show();
  }
}
