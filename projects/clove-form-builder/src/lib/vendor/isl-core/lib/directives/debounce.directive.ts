import {Directive, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {fromEvent} from "rxjs";
import {debounceTime, distinctUntilChanged, map} from "rxjs/operators";

@Directive({
  standalone: true,
  selector: '[debounce]'
})
export class DebounceDirective implements OnInit{

  @Input({ alias: 'debounce', required: true }) debounceTime: number = 500;

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  private previousValue?: string = ""; // Keep track of the previous value

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    fromEvent(this.el.nativeElement, 'input').pipe(
      map((event: any) => event.target.value),
      debounceTime(this.debounceTime),
      distinctUntilChanged() // Emit only if the value has changed
    ).subscribe(value => {
      // Emit only if the value is different from the previous value
      if (value !== this.previousValue) {
        this.previousValue = value;
        this.valueChange.emit(value);
      }
    });
  }

}
