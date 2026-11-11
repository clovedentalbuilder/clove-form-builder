import { FxOperand } from './logic';
import { Subject } from 'rxjs';

export interface FxApi{
  uri: string,
  service: string,
  parameters: FxApiParameter[],
  mapper: FxApiContentMapper,
  method: 'GET'
  $state?: Subject<FxApiData>
}

export interface FxApiParameter {
  in: 'path' | 'query'
  name: string,
  required: boolean,
  value: FxOperand
}


export interface FxApiContentMapper{
  contentRoot: string
  pageable?: boolean,
  sortable?: boolean
}

export interface FxApiResource{
  $name: string,
  baseUrl: string
}

export interface FxApiData{
  content: any,
  pagingInfo: any,
  error: any
}
