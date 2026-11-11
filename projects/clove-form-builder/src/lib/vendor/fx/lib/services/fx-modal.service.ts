import {ComponentRef, Injectable, ViewContainerRef} from "@angular/core";
import {FxAlertComponent} from "../components";

@Injectable({
  providedIn: "root"
})
export class FxModalService {

  private static _viewRef: ViewContainerRef;
  public static instance: FxModalService;

  public init(viewRef: ViewContainerRef){
    FxModalService._viewRef = viewRef;
    FxModalService.instance = this;
  }

  private get viewRef(): ViewContainerRef {
    if(!FxModalService._viewRef){
      throw new Error("Please initialize popup service before it's use");
    }
    return FxModalService._viewRef;
  }


  public alert(data: {
    title?: string,
    style?: 'alert-danger' | 'alert-info' | 'alert-primary' | 'alert-warning' | 'alert-success'
    message: string,
  }): Promise<boolean> {
    this.viewRef.get(0)?.destroy();
    this.viewRef.clear();
    let componentRef: ComponentRef<FxAlertComponent> = this.viewRef.createComponent(FxAlertComponent);
    let modal = componentRef.instance;
    return  new Promise<boolean>((resolve) => {
      setTimeout(()=>{
        if (data.title) modal.data.title = data.title;
        if (data.style) modal.style = data.style;
        modal.data.message = data.message;
        modal.modalOptions = {
          placement: 'center',
          backdrop: 'static',
          closable: false,
          onHide: () => {
            resolve(true);
          }
        };
        modal.show();
      },100)
    });
  }


}
