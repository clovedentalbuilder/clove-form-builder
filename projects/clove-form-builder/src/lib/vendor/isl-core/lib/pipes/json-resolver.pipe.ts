import { Pipe, PipeTransform } from '@angular/core';
import { JsonUtils } from '../utils';

@Pipe({
  name: 'jsonResolver',
  standalone: true
})
export class JsonResolverPipe implements PipeTransform {
  transform(dataObject: any, pathTemplate: string | null): any {
    if(pathTemplate == null) return '';
    return JsonUtils.resolve(dataObject, pathTemplate);
  }

}
