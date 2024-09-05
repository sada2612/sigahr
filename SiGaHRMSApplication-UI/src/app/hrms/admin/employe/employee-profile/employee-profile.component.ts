import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { AuthResponse, Employee, LeaveBalance } from 'src/app/common/datatypes/DataTypes';
import { Api, UserRole } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { SalaryComponent } from './salary/salary.component';
import { LeavesComponent } from './leaves/leaves.component';
import { AuthService } from 'src/app/common/service/authitication/auth.service';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, SharedModule, SalaryComponent, LeavesComponent],
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export default class EmployeeProfileComponent {
  activeSection: any = 'Profile';
  employeeId: number;
  employee: Employee=new Employee();
  leaveBalance: LeaveBalance;
  totalAssignLeaves: number = 0;
  totalAvailedLeaves: number = 0;
  totalAvailableLeaves: number = 0;
  user:AuthResponse;
  userRoles=UserRole
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService:AuthService
  ) {
    this.user = this.authService.loginUser();
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.employeeId = Number(params.get('id'));
    });
    this.getEmployee();
  }
  getEmployee() {
    this.apiService.get(Api.Employee, this.employeeId).subscribe((data) => {
      this.employee = data;
    });
  }
}
