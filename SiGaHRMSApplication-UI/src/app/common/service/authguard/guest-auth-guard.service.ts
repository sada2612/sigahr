import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { AuthService } from '../authitication/auth.service';
import { userRoles } from '../../constantss/const';

@Injectable({
  providedIn: 'root'
})
export class GuestAuthGuardService implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const jwtToken = localStorage.getItem('jwt');

    if (jwtToken) {
      const role = this.authService.loginRole();
      if (userRoles.includes(role)) {
        return true;
      } else {
        this.authService.logout();
        this.router.navigate(['/login']); 
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
