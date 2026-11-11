import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[ContentEditable]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContentEditableDirective),
      multi: true
    }
  ]
})
export class ContentEditableDirective {

  @Input('ContentEditable') value: string = '';

  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef) {}

  @HostListener('input')
  onInput() {
    const newValue = this.el.nativeElement.innerText;
    this.onChange(newValue); // Update the form control value
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.el.nativeElement.innerText = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
