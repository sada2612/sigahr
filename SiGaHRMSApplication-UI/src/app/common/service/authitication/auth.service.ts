import { Injectable } from '@angular/core';
import { ApiService } from '../api/api-service.service';
import { Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { jwtDecode } from 'jwt-decode';
import { userRoles } from '../../constantss/const';
import { UserRole } from '../../enum/enum';
import { AuthResponse } from '../../datatypes/DataTypes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  role: any;
  constructor(
    private Apiservice: ApiService,
    private router: Router,
    private alertService: AlertService
  ) {}

  login(email: string, password: string) {
    this.Apiservice.login(email, password).subscribe((data) => {
      const { IsSuccess, Result, Message } = data;
      console.log(data);
      if (IsSuccess) {
        localStorage.setItem('jwt', Result);
        this.role = jwtDecode(Result)['role'];
        console.log(this.role);
        if (this.role == UserRole.HR|| this.role == UserRole.SUPER_ADMIN) {
          this.router.navigate(['admin/dashboard']);
        } else {
          this.router.navigate(['guest/dashboard']);
        }
      } else {
        this.alertService.Invalid('Oops...', Message + ' !', 'error').then(() => this.logout());
      }
    });
  }

  loginUser(): AuthResponse {
    return jwtDecode(localStorage.getItem('jwt'));
  }

  loginId(): number {
    return Number(jwtDecode(localStorage.getItem('jwt'))['employeeId']);
  }
  loginRole():string{
    return jwtDecode(localStorage.getItem('jwt'))['role'];
  }

  logout() {
    localStorage.clear();
    this.alertService
      .Toast()
      .fire({ icon: 'success', title: 'Signed in successfully' })
      .then((data) => {
        if (data.dismiss) {
          this.router.navigate(['/login']);
        }
      });
  }
}
