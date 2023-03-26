import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs';
import { AuthorityService } from '../../services/authority.service';
import { CanActivateReturn } from '../_guard';

@Injectable({
  providedIn: 'root'
})
export class AuthorityLoggedinGuard implements CanActivate {

  constructor(
    private authorityService: AuthorityService,
    private router: Router,
  ) {}
  
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): CanActivateReturn {
    return this.canActivate(route, state);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): CanActivateReturn {
    return this.authorityService.checkAuthoritySession().pipe(
      map((you) => {
        if (!you) {
          this.router.navigate(['/authority-login']);
        }
        return !!you;
      })
    );
  }
  
}
