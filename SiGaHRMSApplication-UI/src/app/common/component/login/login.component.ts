import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/common/service/alert/alert.service';
import { AuthService } from '../../service/authitication/auth.service';
import { CommonService } from '../../service/common/common.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  constructor(
    private Auth: AuthService,
  ) {}

  User: any = {
    Email: '',
    Password: ''
  };

  async login() {
    await this.Auth.login(this.User.Email, this.User.Password);
  }

  forgotPassword(){
    
  }
}
