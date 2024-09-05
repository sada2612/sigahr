import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Employee } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss'],
  imports: [CommonModule, SharedModule]
})
export default class EmployeeProfileComponent {
  employees: Employee[]=[];
  constructor(private apiService: ApiService) {
    this.getEmployees();
  }
  getEmployees() {
    this.apiService.getAll(Api.Employee).subscribe((data) => {
      this.employees = data;
    });
  }
}
