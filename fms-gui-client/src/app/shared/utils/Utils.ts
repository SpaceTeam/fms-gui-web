import {NameValuePair} from '../model/name-value-pair/name-value-pair.model';
import {NameValuePairType} from '../model/name-value-pair/name-value-pair.type';
import {Logger} from '../logger/logger';

/**
 * This is a static class, providing additional functionality for the traversing of NameValuePairs
 */
export namespace Utils {

  /**
   * Returns the value to a given path in the given tree
   * @param path to a variable
   * @param tree for only processing a given tree
   */
  export function getValueFromTree(path: string, tree: Array<NameValuePair>): NameValuePairType {

    // Error case: Tree is non existent or empty
    if (isEmpty(tree) || isEmpty(path)) {
      return null;
    }

    // 1) Split the path
    let arr: string[] = path.split('/');

    // 2) Find the next element, e.g. 'Flags'
    let next = arr.shift();

    // 3) Get the tree with the given path
    // e.g. next = "Flags" should return the array with "Flags"
    tree = tree.filter(pair => {
      if (next.toLowerCase() === pair.name.toLowerCase()) {
        return pair;
      }
    });

    // 4) If the tree is empty, then there is no element with the given path
    if (tree.length === 0) {
      Logger.error(`There is no ${next} in ${tree}`);
      //throw new NoSuchEntryException(`There is no ${next} in ${tree}`);
      return null;
    }

    // 5) If the tree still has more than one element, then we have duplicate entries
    if (tree.length > 1) {
      Logger.error(`Duplicate entry ${path}`);
      //throw new DuplicateEntryException(`Duplicate entry ${path}`);
      return null;
    }

    // 6) Check, if we're in the last level -> there should be no element in the path anymore
    if (arr.length === 0) {
      return tree[0].value;
    }
    // 7) Else we have to find the next level and pass it as a parameter
    else {
      // Concatenate the remaining string and traverse the new tree with it
      return getValueFromTree(arr.join('/'), <Array<NameValuePair>>tree[0].value);
    }
  }

  export function castToArrayNameValuePair(value: NameValuePairType): Array<NameValuePair> {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      Logger.error(`Cannot cast ${value} to Array<NameValuePair>`);
      //throw TypeError(`Cannot cast ${value} to Array<NameValuePair>`);
      return null;
    } else {
      return value;
    }
  }

  /**
   * Checks whether the given array exists and is not empty
   * @param array the array to be checked
   * @return {boolean} true, if the array contains data; otherwise false
   */
  export function hasData<T>(array: Array<T>): boolean {
    return array !== null && array !== undefined && array.length > 0;
  }

  /**
   * Checks whether the given object is empty
   * @param obj the object to be checked
   * @return {boolean} true, if the object is empty or does not exist; false otherwise
   */
  function isEmpty<T>(obj: string | Array<T>): boolean {
    if (typeof obj === 'string') {
      obj = obj.trim();
    }
    return obj === null || obj === undefined || obj.length === 0;
  }
}
