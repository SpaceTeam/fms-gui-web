import {NameValuePair} from '../model/name-value-pair/name-value-pair.model';
import {NameValuePairType} from '../model/name-value-pair/name-value-pair.type';
import {Logger} from '../logger/logger';

/**
 * This is a static class, providing additional functionality for the traversing of NameValuePairs
 */
export namespace NameValuePairUtils {

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
    const arr: string[] = path.split('/');

    // 2) Find the next element, e.g. 'Flags'
    const next = arr.shift();

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
      // throw new NoSuchEntryException(`There is no ${next} in ${tree}`);
      return null;
    }

    // 5) If the tree still has more than one element, then we have duplicate entries
    if (tree.length > 1) {
      Logger.error(`Duplicate entry ${path}`);
      // throw new DuplicateEntryException(`Duplicate entry ${path}`);
      return null;
    }

    // 6) Check, if we're in the last level -> there should be no element in the path anymore
    // Else we have to find the next level and pass it as a parameter
    if (arr.length === 0) {
      return tree[0].value;
    } else {
      // Concatenate the remaining string and traverse the new tree with it
      return getValueFromTree(arr.join('/'), <Array<NameValuePair>>tree[0].value);
    }
  }

  /**
   * Checks whether you can cast the given union type to an Array<NameValuePair> and returns the cast object
   * @param value the union to check
   */
  export function castToArray(value: NameValuePairType): Array<NameValuePair> {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      Logger.error(`Cannot cast ${value} to Array<NameValuePair>`);
      // throw TypeError(`Cannot cast ${value} to Array<NameValuePair>`);
      return null;
    } else {
      return value;
    }
  }

  /**
   * Checks whether the given array exists and is not empty
   * @param array the array to be checked
   * @return true, if the array contains data; otherwise false
   */
  export function hasData<T>(array: Array<T>): boolean {
    return array !== null && array !== undefined && array.length > 0;
  }

  /**
   * Checks whether the first element is different from the other
   * @param current the current object
   * @param previous the previous object
   * @return true, if they are different; false, if they are the same
   */
  export function isDifferent(current: NameValuePairType, previous: NameValuePairType) {
    // First check for their type equality
    if (typeof current !== typeof previous) {
      return true;
    }
    // Then check for their equality
    return current !== previous;
  }

  /**
   * Checks whether the given object is empty
   * @param obj the object to be checked
   * @return true, if the object is empty or does not exist; false otherwise
   */
  function isEmpty<T>(obj: string | Array<T>): boolean {
    if (typeof obj === 'string') {
      obj = obj.trim();
    }
    return obj === null || obj === undefined || obj.length === 0;
  }
}
