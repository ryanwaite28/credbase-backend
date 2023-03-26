import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs';
import { UserService } from '../../services/user.service';
import { CanActivateReturn } from '../_guard';

@Injectable({
  providedIn: 'root'
})
export class UserLoggedinGuard implements CanActivate {

  constructor(
    private userService: UserService,
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
    return this.userService.checkUserSession().pipe(
      map((you) => {
        if (!you) {
          this.router.navigate(['/user-login']);
        }
        return !!you;
      })
    );
  }
  
}
