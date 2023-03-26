import { IUser } from "../apps/users/users.interface";
import { MapType } from "../interfaces/common.interface";
import { YOUTUBE_URL_STANDARD, YOUTUBE_URL_EMBED, YOUTUBE_URL_SHORT, YOUTUBE_URL_ID } from "../regex/common.regex";

export const mapify = <T> (list: T[], key: string | number): MapType<T> => {
  return list.reduce((map: MapType<T>, item: T) => {
    map[ item[key] ] = item;
    return map;
  }, {} as MapType<T>);
};

export const wait = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

export function uniqueValue() {
  return Math.random().toString(33).substring(2) + '-' + Date.now();
}

export function capitalize(str: string) {
  if (!str) {
    return '';
  } else if (str.length < 2) {
    return str.toUpperCase();
  }
  const Str = str.toLowerCase();
  const capitalized = Str.charAt(0).toUpperCase() + Str.slice(1);
  return capitalized;
}

export const getUserFullName = (user: IUser) => {
  if (user) {
    const { firstname, middlename, lastname } = user;
    const middle = middlename
      ? ` ${middlename} `
      : ` `;

    const displayName = `${firstname}${middle}${lastname}`;
    return displayName;
  } else {
    return '';
  }
};

export const get_last = <T> (list: T[]): T|undefined => {
  return list.length > 0 ? list[list.length - 1] : undefined;
};



/**
 * Check Primitive
 * ---
 *
 * Check if argument is a primitive by evaluating via `typeOf`.
 *
 * @param {*} obj
 * @returns {boolean}
 */

export const checkPrimitive = (obj: any) => {
  if (obj === undefined) {
    console.warn(`'obj' argument was undefined; returning true...`);
    return true;
  }
  const objType = typeof(obj);
  const isPrimitive = (
    obj === null ||
    objType === 'boolean' ||
    objType === 'number' ||
    objType === 'bigint' ||
    objType === 'string' ||
    objType === 'symbol'
  );
  return isPrimitive;
};

export type Primitive =
  string |
  number |
  boolean |
  bigint |
  undefined |
  null |
  symbol;

/**
 * Copy Object
 * ---
 *
 * Deep copy object via recursion call.
 * - for primitives, just return the given argument.
 * - for Dates, call new Date instance with argument and return it
 * - for arrays, create new array and push recursive call for each item
 * - for object, create new object and set each key to recursive call
 *
 * @param {*} obj 
 * @returns {object}
 */
export const copyObj = (obj: any) => {
  const isPrimitive = checkPrimitive(obj);
  if (isPrimitive) {
    return obj;
  }
  if (obj.constructor === Date) {
    return new Date(obj);
  }
  let copy: any;
  if (obj.constructor === Array) {
    copy = [];
    for (const item of obj) {
      const copyItem: any = copyObj(item);
      copy.push(copyItem);
    }
  } else if (obj.constructor === Object) {
    copy = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
      const copyItem = copyObj(obj[key]);
      copy[key] = copyItem;
    }
  }

  return copy;
};

/**
 * Copy Object
 * ---
 *
 * Deep copy object via recursion call.
 * - for primitives, just return the given argument.
 * - for Dates, call new Date instance with argument and return it
 * - for arrays, create new array and push recursive call for each item
 * - for object, create new object and set each key to recursive call
 *
 * @param {*} obj 
 * @returns {object}
 */
export function clone<T>  (obj: any): T  {
  const isPrimitive = checkPrimitive(obj);
  if (isPrimitive) {
    return obj;
  }
  if (obj.constructor === Date) {
    const newDate = new Date(obj);
    return newDate as unknown as T;
  }

  let copy: any;
  if (obj.constructor === Array) {
    copy = [];
    for (const item of <Array<any>> obj) {
      const copyItem = clone(item);
      copy.push(copyItem);
    }
  } else if (obj.constructor === Object) {
    copy = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
      const copyItem = clone(obj[key]);
      copy[key] = copyItem;
    }
  } else if (obj.constructor === Map) {
    copy = new Map();
    (<Map<any, any>> obj).forEach((value, key) => {
      const copyItem = clone(value);
      copy.set(key, copyItem);
    });
  }

  const typedCopy = copy as T;
  return typedCopy;
};


export function isYouTubeLink(value: string) {
  const isStandard = YOUTUBE_URL_STANDARD.test(value);
  const isEmbed = YOUTUBE_URL_EMBED.test(value);
  const isShortLink = YOUTUBE_URL_SHORT.test(value);
  const match = isStandard || isEmbed || isShortLink;
  return match;
};

export function getYouTubeIdFromLink(str: string) {
  const match = str.match(YOUTUBE_URL_ID);
  const id = match && match[0].replace('v=', '').replace('\/', '');
  return id;
}