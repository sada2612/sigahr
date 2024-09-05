import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../authitication/auth.service';
import { UserRole } from '../../enum/enum';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const jwtToken = localStorage.getItem('jwt');
    
    if (jwtToken) {
      
      const role = this.authService.loginRole();

      if (role === UserRole.HR || role === UserRole.SUPER_ADMIN) {
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
