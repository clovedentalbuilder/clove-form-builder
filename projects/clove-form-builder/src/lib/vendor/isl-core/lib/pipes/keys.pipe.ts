import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  standalone: true,
  name: 'keys'
})
export class KeysPipe implements PipeTransform {
  transform(value: { [key: string]: any }): string[] {
    if (!value) return [];
    return Object.keys(value);
  }
}
