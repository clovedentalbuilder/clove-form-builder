import {Action} from "./action";
import {Injectable} from "@angular/core";
import {FxActionProperty} from "../fx-action";
import {FxModalService} from "../../../services";


@Injectable({
  providedIn: "root"
})
export class FxAlertAction extends Action{

  constructor(private modalService: FxModalService) {
    super();
  }

  execute(): void {
    let messageProp = this.getProperty("message");
    if(messageProp) {
      this.modalService.alert({
        title: "Alert",
        message: messageProp.value.toString()
      }).then(r => {

      })
    }
  }

  public properties(): FxActionProperty[] {
    return [{
        key: "message",
        $title: "Alert Message",
        $description: "This message is use to display on alert box.",
        type: 'VALUE',
        value: "No message"
      }];
  }

}
