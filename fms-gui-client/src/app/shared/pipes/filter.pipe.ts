import { Pipe, PipeTransform } from '@angular/core';
import {NameValuePair} from '../model/name-value-pair/name-value-pair.model';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: string[] | NameValuePair[], searchText: string): string[] {
    if (!items || !searchText) {
      return [];
    }

    if (FilterPipe.isNameValuePairArray(items)) {
      items = (items as NameValuePair[]).map(value => value.name);
    }

    // We can be sure, that the items array now is a string array
    items = items as string[];

    return items.filter(item => item.toLocaleLowerCase().startsWith(searchText.toLocaleLowerCase()));
  }

  static isNameValuePairArray(items: any[]): boolean {
    return (items as NameValuePair[])[0].name !== undefined;
  }
}
