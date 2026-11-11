import { FxData, FxForm, FxScope } from '../classes';

export class FxUtils{

  public static generateUUID(): string {
    const hexDigits = '0123456789abcdefghijklmnopqurtuvwxyz-';
    let uuid = '';
    for (let i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        uuid += '-';
      } else if (i === 14) {
        uuid += '4'; // UUID version 4
      } else if (i === 19) {
        uuid += hexDigits.charAt(Math.random() * 16);
      } else {
        uuid += hexDigits.charAt(Math.random() * 16);
      }
    }
    return uuid;
  }

  public static getElement(fxData: FxData, addIdInNamePrefix: boolean = false): FxData{
    let obj = { };
    let data = {...obj, ...fxData };
    if(!data.id) data['id'] = FxUtils.generateUUID();

    if(addIdInNamePrefix)
      data['name'] = data['name'] +'-'+ data.id.split('-')[0];

    return data;
  }

  public static copyForm(fxForm: FxForm): FxForm{
    let obj = { };
    let data = {...obj, ...fxForm };
    let idMap: Map<string, string> = new Map<string, string>();
    if(data.elements)
      this.collectIds(data.elements, idMap);
    let _copyForm = this.stringifyForm(data);
    for(let idKey of idMap.keys()){
      const regex = new RegExp(idKey, 'g');
      let value = idMap.get(idKey);
      if(value)
        _copyForm = _copyForm.replace(regex, value);
    }
    return JSON.parse(_copyForm);
  }

  private static collectIds(elements:  FxData[], idMap: Map<String, String>){
      for(let element of elements) {
        idMap.set(element.id!, this.generateUUID());
        if (element.elements) {
          this.collectIds(element.elements, idMap);
        }
      }
  }

  public static cloneObject(object: any){
    return JSON.parse(JSON.stringify(object, this.replacer));
  }

  public static emptyObject(obj: any){
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (Array.isArray(obj[key])) {
          obj[key] = [];
        } else if (typeof obj[key] === 'object') {
          this.emptyObject(obj[key]);
        } else {
          obj[key] = '';
        }
      }
    }
  }

  public static stringifyForm(fxForm: FxForm): string{
    return JSON.stringify(fxForm, FxUtils.replacer);
  }

  public static convertToJSON(fxForm: FxForm): FxForm{
    return JSON.parse(this.stringifyForm(fxForm));
  }

  public static stringifyFxData(fxData: FxData | FxData[]): string{
    return JSON.stringify(fxData, FxUtils.replacer);
  }

  private static replacer(key: string, value: any): any{
    if(key.startsWith("$")) return undefined;

    if(key === 'validations' && Array.isArray(value))
      return value.filter((validation) => validation.enable === true);

    return value;
  }

  static deepMergeArrays(target: any[] | undefined, source: any[] | undefined, matchBy: string = 'key', modifyCurrentObject: boolean = false): any[] {

    const merged: any[] = modifyCurrentObject ? target? target: [] : target ? [...target] : [];

    if(source === undefined) return target ? target : [];

    for (const sourceItem of source) {
      const matchingItem = merged.find(targetItem => targetItem[matchBy] === sourceItem[matchBy]);

      if (matchingItem) {
        merged[merged.indexOf(matchingItem)] = this.deepMergeObjects(matchingItem, sourceItem, matchBy, modifyCurrentObject);
      } else {
        merged.push(sourceItem);
      }
    }

    return merged;
  }

   static deepMergeObjects(target: any, source: any, matchBy: string = 'key', modifyCurrentObject: boolean = false): any {
    const merged: any = modifyCurrentObject ? target : { ...target };
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const targetValue = target[key];
        const sourceValue = source[key];
        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
          merged[key] = this.deepMergeArrays(targetValue, sourceValue, matchBy, modifyCurrentObject);
        }else if (typeof targetValue === 'object' && typeof sourceValue === 'object') {
          merged[key] = this.deepMergeObjects(targetValue, sourceValue);
        }  else {
          if(!targetValue)
            merged[key] = sourceValue;
        }
      }
    }
    return merged;
  }

  static createNewForm(): FxForm{
    return {
      id: FxUtils.generateUUID(),
        name: 'New Form',
      description: 'New Form',
      type: 'COMPONENT',
      $scope: FxScope.DEFAULT,
      elements: [],
      logics: [],
      after: [],
      before: [],
      $context: FxUtils.generateUUID()
    }
  }

  static scrollToElement(element: any){
    let id = element.id;
    setTimeout(()=>{
      document.getElementById(id)?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'center'
      });
    },100)
  }

}
