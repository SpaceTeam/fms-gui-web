import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'replaceUnderscore' })
export class ReplaceUnderscorePipe implements PipeTransform {
  transform(string: string) {
    return string.replace(new RegExp('_', 'g'), ' ');
  }
}
