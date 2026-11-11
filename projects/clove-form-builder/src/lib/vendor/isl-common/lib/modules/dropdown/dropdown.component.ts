import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild} from "@angular/core";
import {Dropdown, DropdownInterface} from "flowbite";


@Component({
    standalone: false,
  selector: 'dropdown',
  template: `

    <div class="relative" (click)="show()" #triggerElement>
        <ng-content select="dropdown-trigger"></ng-content>
    </div>
    <div class="z-[50] hidden bg-white rounded-lg shadow-lg dark:bg-gray-700" #targetElement>
      <ng-content></ng-content>
    </div>

  `
})
export class DropdownComponent implements AfterViewInit {

  @Input("triggerElement") inputTrigger?: HTMLElement;
  @ViewChild("triggerElement") triggerElement?: ElementRef;
  @ViewChild("targetElement") targetElement?: ElementRef;

  private dropdown: DropdownInterface | null = null;

  @Input("placement")
  public placement: "top" | "bottom" | "right" | "left" | "auto" | "auto-start" | "auto-end" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "right-start" | "right-end" | "left-start" | "left-end" = 'bottom-start';

  @Input("trigger")
  public trigger: 'click' | 'hover' | 'none' = 'none';

  @Input('delay')
  public delay: number = 300;

  @Input('closable')
  public closable: boolean = true;  // New input property to control outside click behavior

  @Output("onDropdownHide") onDropDownHide: EventEmitter<any> = new EventEmitter<any>();
  @Output("onDropdownShow") onDropdownShow: EventEmitter<any> = new EventEmitter<any>();

  private documentClickListener: (() => void) | null = null;  // Keep track of listener for cleanup

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    if(this.inputTrigger) this.triggerElement = new ElementRef<any>(this.inputTrigger);
  }

  public toggle() {
    if (!this.dropdown) {
      this.show();
    } else if (this.dropdown.isVisible()) {
      this.hide();
    }
  }

  public show() {
    const targetElement = this.targetElement?.nativeElement;
    document.body.appendChild(targetElement);

    this.dropdown = new Dropdown(targetElement, this.triggerElement?.nativeElement, {
      placement: this.placement,
      triggerType: this.trigger,
      delay: this.delay,
      onHide: () => {
        if (this.closable) {
          this.onDropDownHide.emit(true);
          try{
            document.body.removeChild(targetElement);
            this.cleanupListener();
          }catch (err){

          }
        }
      },
      onShow: () => {
        this.onDropdownShow.emit(true);
      }
    });

    this.dropdown._popperInstance.forceUpdate();
    this.dropdown._popperInstance.update().then(() => {
      this.dropdown?.show();
    });

    // Prevent closing behavior on outside clicks only once
    if (!this.closable && !this.documentClickListener) {
      this.preventPopperFromClosing();
    }
  }

  public hide() {
    if (this.dropdown) {
      this.dropdown.hide();
      this.cleanupListener();  // Remove the listener when dropdown is hidden
    }

    if(!this.closable){
      this.onDropDownHide.emit(true);
      document.body.removeChild(this.targetElement?.nativeElement);
    }

  }

  // Method to prevent the dropdown from closing when clicking outside
  private preventPopperFromClosing() {
    this.documentClickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;

      // If the click is outside the dropdown, and closable is set to false, prevent it from closing
      const isInsideTrigger = this.triggerElement?.nativeElement.contains(clickedElement);
      const isInsideTarget = this.targetElement?.nativeElement.contains(clickedElement);
      if (!isInsideTrigger && !isInsideTarget) {
        this.dropdown?.show();  // Re-show the dropdown
        event.stopPropagation();  // Prevent the event from bubbling to default handler
      }
    });
  }

  // Clean up the document click listener to avoid performance issues
  private cleanupListener() {
    if (this.documentClickListener) {
      this.documentClickListener();  // Removes the listener
      this.documentClickListener = null;  // Clear the reference
    }
  }
}

@Component({
    standalone: false,
  selector: 'dropdown-trigger',
  template: `
    <ng-content></ng-content>
  `
})
export class DropdownTriggerComponent{


}


