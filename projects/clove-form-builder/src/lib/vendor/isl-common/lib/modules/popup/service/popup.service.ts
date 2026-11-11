import {ComponentRef, Injectable, ViewContainerRef} from "@angular/core";
/**
 * Upstream @instantsys-labs/common imports ToastrService from ngx-toastr here.
 * ToastrService is only ever used as a TYPE (a field type and an init()
 * parameter type) - it is never constructed or injected - so TypeScript elides
 * the import at emit time and the generated JavaScript is identical either way.
 * Declaring the shape locally keeps ngx-toastr out of this package's
 * dependency graph without changing a single runtime call: notifySuccess /
 * notifyError / notifyWarning / notifyInfo still forward exactly the same
 * (message, title, { timeOut }) arguments to whatever toaster the host app
 * passes to init(). Any real ngx-toastr ToastrService still satisfies it.
 */
export interface ToastrService {
  success(message?: string, title?: string, override?: any): any;
  error(message?: string, title?: string, override?: any): any;
  warning(message?: string, title?: string, override?: any): any;
  info(message?: string, title?: string, override?: any): any;
}
import { AlertComponent } from '../components/alert-component';
import { ConfirmComponent } from '../components/confirm-component';
import { ErrorAlertComponent } from '../components/error-alert-component';


@Injectable({
  providedIn: 'root'
})
export class PopupService{

  private static _viewRef: ViewContainerRef;
  public static instance: PopupService;
  private static _toasterService: ToastrService;

  public init(viewRef: ViewContainerRef, toasterService: ToastrService ){
    console.log("Popup Service Initialized");
    PopupService._viewRef = viewRef;
    PopupService.instance = this;
    PopupService._toasterService = toasterService;
  }

  private get viewRef(): ViewContainerRef {
    if(!PopupService._viewRef){
      throw new Error("Please initialize popup service before it's use");
    }
    return PopupService._viewRef;
  }

  public alertSuccess(message: string, title: string = "Success"): Promise<boolean> {
    return this._alert({
      message: message,
      title: title,
      style: 'success'
    })
  }

  public alertWarning(message: string, title: string = "Warning"): Promise<boolean> {
    return this._alert({
      message: message,
      title: title,
      style: 'warning'
    })
  }

  public alertPrimary(message: string, title: string = "Alert"): Promise<boolean> {
    return this._alert({
      message: message,
      title: title,
      style: 'primary'
    })
  }

  public alertDanger(message: string, title: string = "Error"): Promise<boolean> {
    return this._alert({
      message: message,
      title: title,
      style: 'danger'
    })
  }

  public alert(message: string, title: string = 'Alert'){
    return this._alert({
      message: message,
      title: title,
      style: 'default'
    })
  }

  private _alert(data: {
    title?: string,
    style?: 'danger' | 'info' | 'primary' | 'warning' | 'success' | 'default'
    message: string,
  }): Promise<boolean> {
    this.viewRef.get(0)?.destroy();
    this.viewRef.clear();
    let componentRef: ComponentRef<AlertComponent> = this.viewRef.createComponent(AlertComponent);
    let modal = componentRef.instance;
    return  new Promise<boolean>((resolve) => {
      setTimeout(()=>{
        if (data.title) modal.data.title = data.title;
        if (data.style) modal.style = data.style;
        modal.data.message = data.message;
        modal.show();
      },100)
    });
  }

  public confirm(data: {
    title?: string,
    message: string,
  }): Promise<boolean> {
    this.viewRef.get(0)?.destroy();
    this.viewRef.clear();
    let componentRef: ComponentRef<ConfirmComponent> = this.viewRef.createComponent(ConfirmComponent);
    let modal = componentRef.instance;
    return  new Promise<boolean>((resolve) => {
      setTimeout(()=>{
        if (data.title) modal.data.title = data.title;
        modal.data.message = data.message;
        modal.modalOptions = {
          placement: 'center',
          backdrop: 'static',
          closable: false
        };
        modal.show(resolve);
      },100)
    });
  }


  public handleError(errorResponse: any) {
    this.viewRef.get(0)?.destroy();
    this.viewRef.clear();
    let componentRef: ComponentRef<ErrorAlertComponent> = this.viewRef.createComponent(ErrorAlertComponent);
    let modal = componentRef.instance;
    return new Promise<boolean>((resolve) => {
      setTimeout(()=>{
        if (modal.data.title) modal.data.title = "Error";
        if (errorResponse.error) {
          errorResponse = errorResponse.error;
        }

        if (errorResponse.errors) {
          modal.fieldErrors = errorResponse.errors;
        } else {
          modal.data.message = errorResponse.message;
        }
        modal.show();
      },100)

    });
  }


  public notifySuccess(message: string, title: string = 'Notification', duration: number = 5000){
    PopupService._toasterService.success(message, title, { timeOut: duration });
  }
  public notifyError(message: string, title: string = 'Notification', duration: number = 5000){
    PopupService._toasterService.error(message, title, { timeOut: duration });
  }
  public notifyWarning(message: string, title: string = 'Notification', duration: number = 5000){
    PopupService._toasterService.warning(message, title, { timeOut: duration });
  }
  public notifyInfo(message: string, title: string = 'Notification', duration: number = 5000){
    PopupService._toasterService.info(message, title, { timeOut: duration });
  }




}
