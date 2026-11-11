import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'toArray',
  standalone: true,
})
export class ToArrayPipe implements PipeTransform{
  transform(value: string | string[] | undefined): any[] {

    if(value == undefined)
      return [];

    if (Array.isArray(value)) {
      return value;
    } else {
        return [value];
    }
  }

}
