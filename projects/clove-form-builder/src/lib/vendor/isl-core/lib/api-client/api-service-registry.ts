import {Injectable} from '@angular/core';

export type ApiService = {
  service: string;
  url: string;
  name?: string,
  description?: string,
  swagger_url?: string
}

@Injectable({
  providedIn: 'root',
})
export class ApiServiceRegistry {
  private registry: Map<string, ApiService> = new Map<string, ApiService>();

  constructor() {}

  public registerService(api: ApiService) {
    this.registry.set(api.service, api);
  }

  public getServiceUrl(service: string): string {
    let serviceUrl: string | undefined = '';
    if (this.registry.has(service)) {
      serviceUrl = this.registry.get(service)?.url
    }

    if(serviceUrl != undefined) return serviceUrl;
    throw new Error("No service registry found with :: " + service);

  }

  public getService(name: string): ApiService{
    return this.registry.get(name);
  }

  public getServices(): ApiService[] {
    return Array.from(this.registry.values());
  }


  public initializeServices(services: ApiService[]) {
    for (const api of services) {
      if(!this.registry.has(api.service))
        this.registerService(api);
    }
  }
}
