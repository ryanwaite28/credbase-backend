import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { IAuthority } from '@lib/fullstack-shared';
import { map, Observable } from 'rxjs';
import { AuthorityService } from '../../services/authority.service';
import { AuthorityStoreService } from '../../stores/authority-store.service';
import { getRouteParamKey } from '../../_misc/chamber';
import { CanActivateReturn } from '../_guard';

@Injectable({
  providedIn: 'root'
})
export class AuthorityAuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authorityService: AuthorityService,
    private router: Router,
    private authorityStore: AuthorityStoreService,
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
    return this.authorityService.checkAuthoritySession().pipe(
      map((you: IAuthority | null) => {
        const canActivate = this.handleCanActivate(you, route);
        if (!canActivate) {
          this.router.navigate(['/user-login']);
        }
        return canActivate;
      })
    );
  }

  handleCanActivate(you: IAuthority | null, route: ActivatedRouteSnapshot) {
    const checkAuth = this.checkAuth(you, route);
    if (checkAuth) {
      return true;
    }
    else {
      return false;
    }
  }

  checkAuth(you: IAuthority | null, route: ActivatedRouteSnapshot): boolean {
    if (!you) { return false; }
    const id = getRouteParamKey(route.data.authParamsProp, route, true);
    const userId = parseInt(id, 10);
    const youAreUser = userId === you.id;
    return youAreUser;
  }
}
