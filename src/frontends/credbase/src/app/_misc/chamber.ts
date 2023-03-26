import { ActivatedRouteSnapshot } from '@angular/router';
import { AUTHORITY_RECORDS, USER_RECORDS } from '@lib/fullstack-shared';

export function getRouteParamKey<T = any>(key: string, route: ActivatedRouteSnapshot, recursiveParent: boolean = false): T | null {
  const value = route.params[key];
  if (value) {
    return value;
  }

  if (recursiveParent && route.parent) {
    return getRouteParamKey(key, route.parent, recursiveParent);
  } else {
    return null;
  }
}



export function get_user_records_endpoint(
  user_id: number,
  path: USER_RECORDS | string,
  min_id?: number,
  get_all: boolean = false,
  is_public: boolean = true
) {
  const partial_prefix = is_public ? '/get-' : '/';
  const endpoint = get_all
    ? '/users/' + user_id + partial_prefix + path + '/all'
    : min_id
      ? '/users/' + user_id + partial_prefix + path + '/' + min_id
      : '/users/' + user_id + partial_prefix + path;
  return endpoint;
}

export function get_authority_records_endpoint(
  authority_id: number,
  path: AUTHORITY_RECORDS | string,
  min_id?: number,
  get_all: boolean = false,
  is_public: boolean = true
) {
  const partial_prefix = is_public ? '/get-' : '/';
  const endpoint = get_all
    ? '/authorities/' + authority_id + partial_prefix + path + '/all'
    : min_id
      ? '/authorities/' + authority_id + partial_prefix + path + '/' + min_id
      : '/authorities/' + authority_id + partial_prefix + path;
  return endpoint;
}



export function elementIsInViewPort(elm: HTMLElement, log: boolean = false) {
  const bounding = elm.getBoundingClientRect();
  let isVisible: boolean = false;

  if (bounding.top >= 0 && bounding.left >= 0 && bounding.right <= window.innerWidth && bounding.bottom <= window.innerHeight) {
    log && console.log('Element is in the viewport!', elm);
    isVisible = true;
  } else {
    log && console.log('Element is NOT in the viewport!', elm);
    isVisible = false;
  }

  return isVisible;
}

