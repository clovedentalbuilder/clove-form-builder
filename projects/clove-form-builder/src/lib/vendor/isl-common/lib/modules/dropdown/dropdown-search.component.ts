import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Dropdown, DropdownInterface} from "flowbite";
import {DropdownOptions} from "flowbite/lib/esm/components/dropdown/types";


@Component({
    standalone: false,
  selector: 'dropdown-search',
  template: `
    <div class="relative" (click)="show()" #triggerElement>
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none cursor-pointer">
        <svg class="w-2.5 h-2.5 ml-2.5 text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg>
      </div>
      <input type="text" class="form-control" [ngClass]="styleClass[style]"
             (focus)="dropdown?.show()" readonly
             [value]="_selected"
             [placeholder]="placeholder"/>
    </div>


    <!-- Dropdown menu -->
    <div class="z-[100] hidden bg-white rounded-lg shadow-lg w-[300px] dark:bg-gray-700" #targetElement>
      <ul class="h-48 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200 py-3">
        <li *ngFor="let d of data" class="cursor-pointer dark:hover:bg-slate-600 hover:bg-slate-50 px-4 py-1 mb-2"
            (click)="onSelect(d)">
          <div class="flex justify-between">
            <div>
              <div><strong>{{ titleKey ? d[titleKey] : d }}</strong></div>
              <div class="mr-1 text-slate-500 text-xs" *ngIf="descriptionKey">{{ d[descriptionKey] }}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>

  `
})
export class DropdownSearchComponent implements AfterViewInit{

  @Input()
  placeholder: string = '';

  @Input()
  titleKey: string = '';

  @Input()
  valueKey: string = '';

  @Input()
  descriptionKey: string = '';

  @Input("selected")
  selected: any;

  _selected: string = '';

  @Input()
  style: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';

  styleClass  = {
    xs: 'p-0 text-sm',
    sm: 'p-1 text-sm',
    md: 'p-2',
    lg: 'p-3',
    xl: 'p-4 text-lg'
  }

  @Input()
  dropdownOptions: DropdownOptions = {
    placement: 'bottom-start',
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
    setTimeout(()=>{
      if(this.selected && this.titleKey){
        let selectedOption = this.data.filter(value =>  this.valueKey ? value[this.valueKey] == this.selected : value == this.selected );
        if(selectedOption.length > 0) this._selected = selectedOption[0][this.titleKey];
      }
    },10)
  }

  onSelect($data: any){
    this._selected = $data[this.titleKey];
    this.valueChange.next($data);
    this.dropdown?.hide();
  }

  public show(){
    this.dropdown = new Dropdown(this.targetElement?.nativeElement, this.triggerElement?.nativeElement, this.dropdownOptions);
    this.dropdown?.show();
  }
}
