import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { EmployeeSalaryDto, RequestDto } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthService } from 'src/app/common/service/authitication/auth.service';
import { CommonService } from 'src/app/common/service/common/common.service';
import { SalaryslipComponent } from "../../../common/component/salaryslip/salaryslip.component";

@Component({
  selector: 'app-user-salary',
  standalone: true,
  templateUrl: './user-salary.component.html',
  styleUrls: ['./user-salary.component.scss'],
  imports: [CommonModule, SharedModule, SalaryslipComponent]
})
export default class UserSalaryComponent implements OnInit {
  @ViewChild('salarySlipModal') salarySlipModalRef!: ElementRef;
  actionLink = 'list';
  employeeSalary: any[] = [];
  employeeId: number;
  from: string;
  to: string;
  salarySlipModal: any;
  selectedSalary: any;

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {
    const dates = this.initializeDateRange();
    this.from = dates.from;
    this.to = dates.to;
  }

  ngOnInit() {
    this.employeeId = this.getEmployeeId();
    this.getEmployeesSalaryStructures();
  }

  initializeDateRange() {
    const currentYear = new Date().getFullYear();
    return {
      from: this.datePipe.transform(new Date(currentYear, 0, 1), 'yyyy-MM-dd'),
      to: this.datePipe.transform(new Date(currentYear, 11, 31), 'yyyy-MM-dd')
    };
  }
  ngAfterViewInit() {
    if ((window as any).bootstrap) {
      this.salarySlipModalRef.nativeElement && (this.salarySlipModal = new (window as any).bootstrap.Modal(this.salarySlipModalRef.nativeElement));
    }
  }
  openModal(salary?:EmployeeSalaryDto) {
    this.selectedSalary = salary ;
    this.salarySlipModal.show();
  }
  closeModal() {
    this.salarySlipModal.hide();
    this.selectedSalary = null;
  }
  getEmployeeId(): number {
     return this.authService.loginId();
  }

  exportToCsv() {
    this.commonService.exportToCsv(this.employeeSalary, 'SigaEmployeesList.csv');
  }

  getEmployeesSalaryStructures() {
    const requestDto = new RequestDto(this.employeeId, this.from, this.to);
    this.apiService.getByDate(Api.EmployeeSalary, requestDto).subscribe((data: any[]) => {
      this.employeeSalary = data;
      console.log(this.employeeSalary);
    });
  }

  deleteEmployee(empSalaryStructure: any) {
    empSalaryStructure.IsDeleted = true;
  }

  viewEmployeeDetails(Id: number) {
    this.employeeId = Id;
    this.actionLink = 'profile';
  }

  
}
