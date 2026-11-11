import {Injectable} from '@angular/core';

@Injectable({
  providedIn: "root"
})
export class StorageService {

  constructor() {

  }

  public add(key: string, value: string){
      localStorage.setItem(key, value);
  }

  public addObject(key: string, value: any){
    localStorage.setItem(key, JSON.stringify(value));
  }


  public get(key: string): string | null {
    return localStorage.getItem(key);
  }

  public getObject(key: string): any | null{
    let data: string | null = localStorage.getItem(key);
    if(data != null){
      return JSON.parse(data);
    }
    return null;
  }

  public clear(){
    localStorage.clear();
  }

  public delete(key: string){
    localStorage.removeItem(key);
  }


}
