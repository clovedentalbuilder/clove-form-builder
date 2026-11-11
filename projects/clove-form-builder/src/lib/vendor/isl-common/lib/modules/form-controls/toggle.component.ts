import {Component, EventEmitter, forwardRef, Input, Output, ViewChild} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";


@Component({
  standalone: true,
  selector: 'form-toggle',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true,
    },
  ],
  template: `
    <label class="inline-flex items-center cursor-pointer me-4" [ngClass]="_class">
      <input type="checkbox" (change)="onValueChange(toggleButton.checked)" [disabled]="disabled" #toggleButton [(ngModel)]="value" class="sr-only peer">

      <span class="me-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            [class.!text-gray-300]="disabled"
            *ngIf="labelPlacement == 'start'">{{ label }}</span>

      <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>

      <span class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            [class.!text-gray-300]="disabled"
            *ngIf="labelPlacement == 'end'">{{ label }}</span>

    </label>
  `
})
export class ToggleComponent implements ControlValueAccessor{

  @Input({ alias: 'label' }) label: string;
  @Input({ alias: 'label-placement' }) labelPlacement: 'start' | 'end' = 'end';
  @Input({ alias: 'toggle-style'}) toggleStyle: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'default' = 'default';
  @Input({ alias: 'toggle-size'}) toggleSize: 'xs' | 'sm' | 'lg' | 'xl'  = 'sm';
  @Input({ alias: 'toggle-disabled' }) disabled: boolean = false;
  @Input({ alias: 'class' }) _class: string;

  @Output("valueChange")
  public onValueChangeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild("toggleButton")
  toggleButton: HTMLInputElement;

  protected value: any;

  private onChange: (value: any) => void;
  private onTouched: () => void;

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onValueChange(checked: boolean) {
    this.onChange(checked);
    this.onValueChangeEvent.emit(checked);
  }

}
