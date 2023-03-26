import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { IUser } from '@lib/fullstack-shared';
import { map, Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { UserStoreService } from '../../stores/user-store.service';
import { getRouteParamKey } from '../../_misc/chamber';
import { CanActivateReturn } from '../_guard';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private userService: UserService,
    private router: Router,
    private userStore: UserStoreService,
  ) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): CanActivateReturn {
    const canActivate = this.canActivate(route, state);
    return canActivate;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): CanActivateReturn {
    return this.userService.checkUserSession().pipe(
      map((you: IUser | null) => {
        const canActivate = this.handleCanActivate(you, route);
        if (!canActivate) {
          this.router.navigate(['/user-login']);
        }
        return canActivate;
      })
    );
  }

  handleCanActivate(you: IUser | null, route: ActivatedRouteSnapshot) {
    const checkAuth = this.checkAuth(you, route);
    if (checkAuth) {
      return true;
    }
    else {
      return false;
    }
  }

  checkAuth(you: IUser | null, route: ActivatedRouteSnapshot): boolean {
    if (!you) { return false; }
    const id = getRouteParamKey(route.data.authParamsProp, route, true);
    const userId = parseInt(id, 10);
    const youAreUser = userId === you.id;
    return youAreUser;
  }
}
