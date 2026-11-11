import { inject, Injectable } from '@angular/core';
import { FxApi, FxApiData, FxApiParameter, FxData, FxOperand } from '../classes';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApiClient } from '../../../isl-core';
import { FxRegistryService } from './fx-registry.service';


@Injectable({
  providedIn: "root"
})
export class FxApiService{

  private fxRegistryService: FxRegistryService = inject(FxRegistryService);
  private apiClient: ApiClient<any> = new ApiClient<any>({ service: '', url: '' });

  private resolveOperand(operand: FxOperand, api:FxApi): any{
      let fxOperand: FxOperand = operand;
      if(fxOperand.type == 'TEXT'){
        return fxOperand.value;
      }else{
        const fxData : FxData | undefined = this.fxRegistryService.getFxData(fxOperand.fxDataId);
        if(fxData){
          if(fxOperand.key === 'value' && fxData){
            if(!this.monitoringParameters.has(fxData.$this!.getContextBaseId())){
              this.monitoringParameters.set(fxData.$this!.getContextBaseId(), api);
              this.monitorParams(fxData);
            }
            return fxData.$this?.val();
          }else{
            let data : any = fxData;
            if(fxOperand.key){
              return data[fxOperand.key];
            }
          }
        }

      }
  }

  public init(api: FxApi): Observable<FxApiData>{
    api.$state = new Subject<any>();
    return api.$state.asObservable();
  }

  public loadData(api: FxApi){
    if(api){
      if(!api.$state)
        throw Error("API Not initialize");

      this.load(api).then(value => {
        api.$state.next(value);
      });
    }
  }

  private monitoringParameters: Map<String, FxApi> = new Map<String, FxApi>();

  private monitorParams(fxData: FxData){
    fxData.$formGroup!.get(fxData.name)!.valueChanges.subscribe(value => {
      this.loadData(this.monitoringParameters.get(fxData.$this!.getContextBaseId()));
    })
  }

  async load(api: FxApi, params?: FxApiParameter[]): Promise<FxApiData> {
    this.init(api);
    if(!api.service) return new Promise<FxApiData>((resolve, reject) => {
      resolve({ content: [], error: null, pagingInfo: null });
    });

    let resolveParams: { param: string; value: string; type?: 'PATH' | 'QUERY' }[] = [];

    if(params){
      for(let param of params) {
        let type: | 'PATH' | 'QUERY' = param.in == 'path' ? 'PATH' : 'QUERY';
        resolveParams.push({ param: param.name, value: this.resolveOperand(param.value, api), type: type });
      }
    }

    if(api.parameters){
      for(let param of api.parameters) {
        let type: | 'PATH' | 'QUERY' = param.in == 'path' ? 'PATH' : 'QUERY';
        resolveParams.push({ param: param.name, value: this.resolveOperand(param.value, api), type: type });
      }
    }

    //Check All PathVariable are resolve
    for(let param of resolveParams){
      if(param.type == 'PATH' && !param.value)
        return new Promise<FxApiData>((resolve, reject) => {
          resolve({ content: [], error: null, pagingInfo: null })
        });
    }

    return new Promise<FxApiData>((resolve, reject) => {
        this.apiClient.construct({ service: api.service, url: api.uri });
        this.apiClient.init(resolveParams);
        this.apiClient.load().then(value => {
          let data = { content: value, error: null, pagingInfo: this.apiClient.pagingInfo };
          api.$state!.next(data);
          resolve(data);
        }).catch(reason => {
          reject(reason);
        })
    })

  }

}
