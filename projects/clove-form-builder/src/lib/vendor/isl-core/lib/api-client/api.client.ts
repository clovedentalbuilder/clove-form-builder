import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { inject } from '@angular/core';
import { ApiService, ApiServiceRegistry } from './api-service-registry';

export class ApiClient<T> {
  private http: HttpClient = inject(HttpClient);
  private apiServiceRegistry: ApiServiceRegistry = inject(ApiServiceRegistry);

  private _mode: 'EDIT' | 'CREATE' = 'CREATE';
  private dataId?: string;

  public data: T[] = [];
  public error: any = null;
  public isLoading: boolean = false;
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public data$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  public pagingInfo: {
    totalElements: number;
    totalPages: number;
    pageOffset: number;
    currentPage: number;
    size: number;
  } | null = null;

  private _initialApiUrl: string;
  private _apiUrl: string;
  private pageOffset: number;
  private params: Array<{
    param: string;
    value: string;
    type?: 'PATH' | 'QUERY' | 'HEADER';
  }> = [];
  public page: number = 1;
  public size: number = 10;
  public sortBy: string = '';
  public sortType: 'asc' | 'desc' = 'desc';
  public searchKeyword: string = '';
  public searchFilter: any = {};

  constructor(
    api: ApiService,
    configuration?: {
      loadOnCreate?: boolean;
      page?: number;
      size?: number;
      sortBy?: string;
      sortType?: 'asc' | 'desc';
      searchKeyword?: string;
      searchFilter?: string;
      pageOffset?: number;
      params?: Array<{
        param: string;
        value: string;
        type?: 'PATH' | 'QUERY' | 'HEADER';
      }>;
    }
  ) {
    this.construct(api);
    this._initialApiUrl = this._apiUrl;
    // Set default values for configuration
    const defaultConfig = {
      loadOnCreate: false,
      page: 1,
      size: 10,
      sortBy: '',
      sortType: 'desc' as 'asc' | 'desc',
      searchKeyword: '',
      searchFilter: {},
      pageOffset: 0,
    };

    // Merge provided configuration with defaults
    const mergedConfig = { ...defaultConfig, ...configuration };

    // Assign merged configuration values
    this.page = mergedConfig.page;
    this.size = mergedConfig.size;
    this.sortBy = mergedConfig.sortBy;
    this.sortType = mergedConfig.sortType;
    this.searchKeyword = mergedConfig.searchKeyword;
    this.searchFilter = mergedConfig.searchFilter;
    this.pageOffset = mergedConfig.pageOffset;
    this.params = mergedConfig.params ?? [];

    // Load data on create if specified
    if (mergedConfig.loadOnCreate) {
      this.load(this.page);
    }
  }

  get apiUrl(): string {
    return this._apiUrl;
  }

  get mode(): 'EDIT' | 'CREATE' {
    return this._mode;
  }

  public construct(api: ApiService) {
    this._apiUrl = `${this.apiServiceRegistry.getServiceUrl(api.service)}${
      api.url
    }`;
    this._initialApiUrl = this._apiUrl;
  }

  public init(
    params: Array<{
      param: string;
      value: string;
      type?: 'PATH' | 'QUERY' | 'HEADER';
    }>,
    dataId?: string,
    mode?: 'EDIT' | 'CREATE'
  ): ApiClient<T> {
    if (params) {
      this.params = params;
      this._apiUrl = this.updateApiUrlWithPathParams(
        this._initialApiUrl,
        params
      );
    }
    if (dataId) this.dataId = dataId;
    if (mode) this._mode = mode;
    return this;
  }

  private updateApiUrlWithPathParams(
    url: string,
    params: Array<{
      param: string;
      value: string;
      type?: 'PATH' | 'QUERY' | 'HEADER';
    }>
  ): string {
    for (const param of params) {
      if (param.type?.toUpperCase() !== 'QUERY') {
        url = url.replace(`{${param.param}}`, param.value);
      }
    }
    return url;
  }

  public async load(
    page: number = 1,
    queryParams?: { name: string; value: string }[]
  ): Promise<T[]> {
    this.page = page;
    const params = this.buildHttpParams(queryParams);
    const headers: HttpHeaders = this.buildHttpHeader();
    this.setLoadingState(true);

    try {
      const response = await lastValueFrom(
        this.http.get<{
          content?: T[];
          totalPages: number;
          number: number;
          totalElements: number;
        }>(this._apiUrl, { params, headers: headers })
      );
      this.processResponse(response);
      this.handleError(null);
      return this.data || [];
    } catch (error) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoadingState(false);
    }
  }

  private buildHttpParams(
    queryParams?: { name: string; value: string | boolean }[]
  ): HttpParams {
    let params = new HttpParams()
      .set('page', `${this.page - this.pageOffset}`)
      .set('size', `${this.size}`)
      .set('sortBy', this.sortBy)
      .set('sortType', this.sortType)
      .set('keyword', this.searchKeyword)
      .set('filter', btoa(JSON.stringify(this.searchFilter)));

    this.params.forEach((param) => {
      if (param.type?.toUpperCase() === 'QUERY') {
        params = params.set(param.param, param.value);
      }
    });

    queryParams?.forEach((param) => {
      params = params.set(param.name, param.value);
    });
    return params;
  }

  private processResponse(response: any) {
    if (response && response.content) {
      this.data = response.content;
      this.data$.next(this.data);
      this.pagingInfo = {
        totalPages: response.totalPages,
        currentPage: response.number,
        totalElements: response.totalElements,
        pageOffset: this.pageOffset,
        size: this.size,
      };
    } else if (response && response['_embedded']) {
      if (response.page) {
        this.pagingInfo = {
          totalPages: response.page.totalPages,
          currentPage: response.page.number,
          pageOffset: this.pageOffset,
          totalElements: response.page.totalElements,
          size: response.page.size,
        };
      }
      this.data = response['_embedded'].content;
      this.data$.next(this.data);
    } else {
      // Set data to an empty array if there's no content
      this.data = response;
      this.data$.next(this.data);
      this.pagingInfo = null;
    }
  }

  private extractPagingInfo(response: any): {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
  } {
    return {
      totalPages: response.totalPages || response.page.totalPages,
      currentPage: response.number || response.page.number,
      totalElements: response.totalElements || response.page.totalElements,
      size: this.size,
    };
  }

  private handleError(error: any) {
    this.error = error;
    if (error) this.data$.error(error);
  }

  private setLoadingState(isLoading: boolean) {
    this.isLoading = isLoading;
    this.isLoading$.next(isLoading);
  }

  public async findById(
    dataId?: any,
    queryParams?: { name: string; value: string | boolean }[]
  ): Promise<T> {
    dataId = dataId ?? this.dataId;
    const params = this.buildHttpParams(queryParams);
    return lastValueFrom(
      this.http.get<T>(`${this._apiUrl}/${dataId}`, {
        params,
        headers: this.buildHttpHeader(),
      })
    );
  }

  public async post(data: T): Promise<T> {
    this.setLoadingState(true);
    try {
      return await lastValueFrom(
        this.http.post<T>(this._apiUrl, data, {
          headers: this.buildHttpHeader(),
        })
      );
    } catch (error) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoadingState(false);
    }
  }

  public async put(dataId: any, data: T): Promise<T> {
    dataId = dataId ?? this.dataId;
    this.setLoadingState(true);
    try {
      return await lastValueFrom(
        this.http.put<T>(`${this._apiUrl}/${dataId}`, data, {
          headers: this.buildHttpHeader(),
        })
      );
    } catch (error) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoadingState(false);
    }
  }

  public async patch(dataId: any, data: T): Promise<T> {
    dataId = dataId ?? this.dataId;
    this.setLoadingState(true);
    try {
      return await lastValueFrom(
        this.http.patch<T>(`${this._apiUrl}/${dataId}`, data, {
          headers: this.buildHttpHeader(),
        })
      );
    } catch (error) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoadingState(false);
    }
  }

  public async save(payload: any, dataId?: any) {
    return this._mode === 'CREATE'
      ? this.post(payload)
      : this.put(dataId, payload);
  }

  public async delete(dataId: any): Promise<void> {
    this.setLoadingState(true);
    try {
      await lastValueFrom(
        this.http.delete<void>(`${this._apiUrl}/${dataId}`, {
          headers: this.buildHttpHeader(),
        })
      );
    } catch (error) {
      this.handleError(error);
      throw error;
    } finally {
      this.setLoadingState(false);
    }
  }

  public onSort(e: any) {
    this.sortBy = e.sorts[0].prop;
    this.sortType = e.sorts[0].dir;
    this.load();
  }

  private buildHttpHeader(): HttpHeaders {
    let headers = new HttpHeaders();
    for (let param of this.params) {
      if (param.type == 'HEADER') {
        headers = headers.append(param.param, param.value);
      }
    }
    return headers;
  }
}
