import {Directive, HostListener, Input} from "@angular/core";
import {FxEvent} from "../../classes";
import {FxLogicExecutor, FxModalService} from "../../services";

@Directive({
  standalone: true,
  selector: '[fx-event-handler]'
})
export class FxEventProcessorDirective{

  @Input('fx-event-handler')
  events: FxEvent[] | undefined;

  constructor(private fxLogicExecutor: FxLogicExecutor,
              private modalService: FxModalService) {}

  @HostListener("click") click() {
    this.triggerEvent("click");
  }
  @HostListener("change") change() {
    this.triggerEvent("change");
  }
  @HostListener("blur") blur() {
    this.triggerEvent("blur");
  }
  @HostListener("dblclick") dblclick() {
    this.triggerEvent("dblclick");
  }
  @HostListener("hover") hover() {
    this.triggerEvent("hover");
  }
  @HostListener("keydown") keydown() {
    this.triggerEvent("keydown");
  }
  @HostListener("keypress") keypress() {
    this.triggerEvent("keypress");
  }
  @HostListener("keyup") keyup() {
    this.triggerEvent("keyup");
  }
  @HostListener("mouseenter") mouseenter() {
    this.triggerEvent("mouseenter");
  }
  @HostListener("mouseleave") mouseleave() {
    this.triggerEvent("mouseleave");
  }
  @HostListener("input") input() {
    this.triggerEvent("input");
  }

  private triggerEvent(_event: string){
    if(this.events) {
      for (let event of this.events!) {
        if (event.trigger.on === _event) {
          if (event.type === 'SCRIPT' && event.script) {
            try {
              //eval(event.script);
              const executeScript = new Function('event', event.script);
              executeScript(event);
            } catch (e) {
              this.modalService.alert({
                title: "Error",
                message: `
                   <p class="text-red-600">Op's! Something went wrong. Unable to execute event due to following reason</p>
                   <div class="mt-4">${e}</div>
                `,
                style: "alert-danger"
              }).then(r => {

              })
            }
          } else {

            if (event.logics)
              this.fxLogicExecutor.executeAll(event.logics);
          }
        }
      }
    }

  }
}
