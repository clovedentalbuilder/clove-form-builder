import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'tz'
})
export class TimezoneAbbrPipe implements PipeTransform {
  transform(value: Date | string | number): string {
    if (!value) return '';

    const date = new Date(value);
    const formatted = date.toLocaleDateString('en-US', { timeZoneName: 'short' });

    // Extract abbreviation (e.g., "IST", "PDT")
    return formatted.split(', ')[1] || formatted;
  }
}
