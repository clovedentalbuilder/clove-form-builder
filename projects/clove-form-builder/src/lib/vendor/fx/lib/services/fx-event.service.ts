import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FxEventService {

  constructor() { }

  public getSupportedEvents(): any{
    return {
      click: "click",
      dblclick: "dblclick",
      blur: "blur",
      mouseenter: "mouseenter",
      mouseleave: "mouseleave",
      input: "input",
      change: "change",
      keypress: "keypress",
      keyup: "keyup",
      keydown: "keydown",
      hover: "hover",
    }
  }

}
