import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Employee, Incentive, RequestDto } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';

@Component({
  selector: 'app-salary',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent {
  @Input() employee: Employee;
  salaryStructureGross: any;
  salaryStructureNet: number;
  salaryStructure: any;
  incentives: Incentive[] = [];

  constructor(private apiService: ApiService) {}
  ngOnInit() {
    this.getSalaryStructure();
  }

  getSalaryStructure() {
    !this.salaryStructure
      ? this.apiService
          .getByDate(Api.EmployeeSalaryStructure, new RequestDto(this.employee.EmployeeId, null, null))
          .subscribe((data) => ((this.salaryStructure = data[0]), this.getIncentive()))
      : '';

    this.getIncentive();
  }

  calculateSalary() {
    if (this.salaryStructure) {
      this.salaryStructureGross =
        this.salaryStructure.Basic +
        this.salaryStructure.TDS +
        this.salaryStructure.Conveyance +
        this.salaryStructure.DA +
        this.salaryStructure.HRA +
        this.salaryStructure.SpecialAllowance +
        this.salaryStructure.MedicalAllowance;
      this.salaryStructureNet = this.salaryStructureGross - this.salaryStructure.TDS;
    } else {
      this.salaryStructureGross = 0;
      this.salaryStructureNet = 0;
    }
  }

  getIncentive() {
    !this.incentives
      ? this.apiService
          .getByDate(Api.Incentive, new RequestDto(this.employee.EmployeeId, null, null))
          .subscribe((data) => ((this.incentives = data), this.getIncentive()))
      : console.log(this.incentives);
  }
}
