import { Injectable } from '@angular/core';
import { IAuthority } from '@lib/fullstack-shared';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorityStoreService {
  private authority?: IAuthority | null;
  private changes: BehaviorSubject<IAuthority | null>;

  constructor() {
    this.changes = new BehaviorSubject<IAuthority | null>(<any> undefined);
  }

  getChangesObs(): Observable<IAuthority | null> {
    return this.changes.asObservable();
  }

  setState(newState: IAuthority | null) {
    this.authority = newState ? <IAuthority> { ...newState } : null;
    const newEvent = this.authority ? { ...this.authority } : null;
    this.changes.next(<IAuthority | null> newEvent);
  }

  mergeState(newChanges: Partial<IAuthority>) {
    const newState = this.authority ? { ...this.authority } : {};
    Object.assign(newState, { ...newChanges });
    this.authority = <IAuthority> newState;
    this.changes.next({ ...this.authority });
  }
}
