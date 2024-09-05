import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import {
  Employee,
  EmployeeSalaryDto,
  EmployeeSalaryStructure,
  FormField,
  Incentive,
  IncentivePurpose,
  LeaveRequest,
  RequestDto
} from 'src/app/common/datatypes/DataTypes';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { CommonService } from 'src/app/common/service/common/common.service';
import { Api, LeaveRequestStatus } from 'src/app/common/enum/enum';
import { forkJoin } from 'rxjs';
import { FormComponent } from '../../../common/component/form/form.component';
import { empSalaryFormFields, empSalaryStructureFormFields, incentiveTypeFormFields } from 'src/app/common/constantss/const';

@Component({
  selector: 'app-employee-salary',
  standalone: true,
  templateUrl: './employee-salary.component.html',
  styleUrls: ['./employee-salary.component.scss'],
  imports: [CommonModule, SharedModule, FormComponent]
})
export default class EmployeeSalaryComponent implements OnInit, AfterViewInit {
  @ViewChild('incentiveModal') incentiveModalRef!: ElementRef;
  @ViewChild('salaryModal') salaryModalRef!: ElementRef;
  @ViewChild('salaryStructureModel') salaryStructureModelRef!: ElementRef;

  selectedIncentive: Incentive = null;
  selectedEmployeeSalary: EmployeeSalaryDto = null;
  selectedEmployeeSalaryStructure: EmployeeSalaryStructure = null;

  empSalaryForm: FormField[] = empSalaryFormFields;
  empSalaryStructureForm: FormField[] = empSalaryStructureFormFields;
  incentiveForm: FormField[] = incentiveTypeFormFields;

  template: string = 'EmployeeSalary';
  actionLink: string = 'month';
  employeeSalary: EmployeeSalaryDto[] = [];
  employeeSalaryStructures: EmployeeSalaryStructure[] = [];
  incentives: Incentive[] = [];
  employees: Employee[] = [];
  from: string;
  to: string | null;
  updateId: any;

  incentivePurposes: IncentivePurpose[] = [];
  employeeOptions: any[];

  private incentiveModal: any;
  private salaryModal: any;
  private salaryStructureModel: any;
  leaves: LeaveRequest[];

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private datePipe: DatePipe
  ) {
    this.from = this.datePipe.transform(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd')!;
    this.to = this.actionLink === 'month' ? this.datePipe.transform(new Date(new Date().getFullYear(), 11, 31), 'yyyy-MM-dd') : null;
  }

  ngOnInit() {
    this.loadInitialData();
  }

  ngAfterViewInit() {
    if ((window as any).bootstrap) {
      this.initializeModals();
    }
  }

  private initializeModals() {
    this.incentiveModal = this.incentiveModalRef?.nativeElement
      ? new (window as any).bootstrap.Modal(this.incentiveModalRef.nativeElement)
      : null;
    this.salaryModal = this.salaryModalRef?.nativeElement ? new (window as any).bootstrap.Modal(this.salaryModalRef.nativeElement) : null;
    this.salaryStructureModel = this.salaryStructureModelRef?.nativeElement
      ? new (window as any).bootstrap.Modal(this.salaryStructureModelRef.nativeElement)
      : null;
  }

  private loadInitialData() {
    forkJoin({
      incentivePurposes: this.apiService.getAll(Api.IncentivePurpose),
      employeeSalaries: this.apiService.getByDate(Api.EmployeeSalary, new RequestDto(this.updateId, this.from, this.to)),
      salaryStructures: this.apiService.getByDate(Api.EmployeeSalaryStructure, new RequestDto(null, null, null)),
      incentives: this.apiService.getByDate(Api.Incentive, new RequestDto(null, this.from, this.to))
    }).subscribe({
      next: ({ incentivePurposes, employeeSalaries, salaryStructures, incentives }) => {
        this.incentivePurposes = incentivePurposes;
        this.employeeSalary = employeeSalaries.sort(
          (a, b) => new Date(b.SalaryForAMonth).getTime() - new Date(a.SalaryForAMonth).getTime()
        );
        this.employeeSalaryStructures = salaryStructures;
        this.incentives = incentives;
        this.employees = this.employeeSalaryStructures.map((data) => data.Employee);
        this.updateFormFields(); // Update options after data is loaded
      }
    });
  }

  private updateFormFields() {
    this.employeeOptions = this.employees.map((emp) => ({
      value: emp.EmployeeId,
      label: `${emp.FirstName} ${emp.LastName}`
    }));

    this.updateFieldOptions(this.incentiveForm);
    this.updateFieldOptions(this.empSalaryForm);
    this.updateFieldOptions(this.empSalaryStructureForm);
  }

  private updateFieldOptions(fields: FormField[]) {
    fields.forEach((field) => {
      if (field.type === 'select' && field.id === 'employeeId') {
        field.options = this.employeeOptions;
      }
      if (field.type === 'select' && field.id === 'incentivePurposeId') {
        field.options = this.incentivePurposes.map((purpose) => ({
          value: purpose.IncentivePurposeId,
          label: purpose.Purpose
        }));
      }
    });
  }

  openIncentiveModal(incentive?: Incentive) {
    this.selectedIncentive = incentive ? { ...incentive } : new Incentive();
    this.incentiveModal?.show();
  }

  openSalaryModal(salary?: EmployeeSalaryDto) {
    this.selectedEmployeeSalary = { ...salary };
    this.salaryModal?.show();
  }

  async getEmpSalary(id) {
    if (!this.leaves) {
      this.leaves = await this.getLeaves(id);
    }
    var salaryDate = this.datePipe.transform(
      new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
      'yyyy-MM-dd'
    );

    var structure = this.employeeSalaryStructures.find((x) => x.EmployeeId == id);
   var salary = new EmployeeSalaryDto();
   salary.EmployeeId = id;
   salary.SalaryForAMonth = salaryDate;
   salary.Basic = structure.Basic / 12;
   salary.TDS = structure.TDS / 12;
   salary.Conveyance = structure.Conveyance / 12;
   salary.DA = structure.DA / 12;
   salary.HRA = structure.HRA / 12;
   salary.SalaryForAMonth = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
   salary.MedicalAllowance = structure.MedicalAllowance / 12;
   salary.DaysInAMonth = this.getDaysInMonth(new Date(salaryDate).getFullYear(), new Date(salaryDate).getMonth() - 1);
   salary.PresentDays = salary.DaysInAMonth - this.currentSalaryLeaveCount();
   salary.Leaves = structure.Basic / 12;
   salary.LeaveDeduction = structure.Basic / 12;
    this.openSalaryModal(salary)
  }

  getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  async getLeaves(id) {
    return await this.apiService.getByDate(Api.LeaveRequest, new RequestDto(id, this.from, this.to)).toPromise();
  }

  currentSalaryLeaveCount() {
    const filteredLeaveRequests = this.leaves.filter(
      (x) =>
        x.EmployeeId == this.selectedEmployeeSalary.EmployeeId &&
        new Date(x.FromDate).getMonth() == new Date(this.selectedEmployeeSalary.SalaryForAMonth).getMonth() - 1 &&
        x.LeaveRequestStatus == LeaveRequestStatus.Approved
    );

    const filteredLeaveRequests1 = this.leaves.filter(
      (x) =>
        x.EmployeeId === this.selectedEmployeeSalary.EmployeeId &&
        new Date(x.ToDate).getMonth() === new Date(this.selectedEmployeeSalary.SalaryForAMonth).getMonth() - 1 &&
        new Date(x.FromDate).getMonth() === new Date(this.selectedEmployeeSalary.SalaryForAMonth).getMonth() - 2 &&
        x.LeaveRequestStatus === LeaveRequestStatus.Approved
    );

    const leaveDays = this.calculateLeaveDays(filteredLeaveRequests);
    const leaveDays1 = this.calculateLeaveDays1(filteredLeaveRequests1);
    return leaveDays + leaveDays1;
  }

  calculateLeaveDays(leaveRequests) {
    const leaveDays = leaveRequests.reduce((acc, leave) => {
      let endDate;
      if (leave.toDate.getMonth() !== leave.fromDate.getMonth()) {
        endDate = this.lastDateOfMonth(leave.fromDate);
      } else {
        endDate = leave.toDate;
      }
      const leaveDay = this.calculateWorkingDateDifferenceInDays(leave.fromDate, endDate);
      return acc + (leave.isHalfDay ? leaveDay / 2 : leaveDay);
    }, 0);

    return leaveDays;
  }

  calculateLeaveDays1(leaveRequests1) {
    const leaveDays1 = leaveRequests1.reduce((acc, leave) => {
      let start;
      if (leave.toDate.getMonth() !== leave.fromDate.getMonth()) {
        start = getFirstDateOfMonth(leave.toDate);
      } else {
        start = leave.toDate;
      }
      const leaveDay = this.calculateWorkingDateDifferenceInDays(start, leave.toDate);
      return acc + (leave.isHalfDay ? leaveDay / 2 : leaveDay);
    }, 0);

    return leaveDays1;
  }

  lastDateOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  firstDateOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  calculateWorkingDateDifferenceInDays(startDate, endDate) {
    if (startDate > endDate) {
      throw new Error('Start date cannot be later than end date.');
    }

    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const fullWeeks = Math.floor(totalDays / 7);
    const extraDays = totalDays % 7;

    let weekendDays = fullWeeks * 2;
    for (let i = 0; i < extraDays; i++) {
      const currentDay = new Date(startDate.getTime() + (fullWeeks * 7 + i) * (1000 * 60 * 60 * 24)).getDay();
      if (currentDay === 6 || currentDay === 0) {
        // 6 = Saturday, 0 = Sunday
        weekendDays++;
      }
    }

    return totalDays - weekendDays;
  }
  AddAllEmployeeSalaries() {
    this.apiService.generateSalaries().subscribe((res) => {
      if (res.IsValid) {
        this.getSalaries();
      }
    });
  }

  openSalaryStructureModal(salaryStructure?: EmployeeSalaryStructure) {
    this.selectedEmployeeSalaryStructure = salaryStructure ? { ...salaryStructure } : new EmployeeSalaryStructure();
    this.salaryStructureModel?.show();
  }

  closeModel() {
    this.incentiveModal?.hide();
    this.selectedIncentive = null;

    this.salaryModal?.hide();
    this.selectedEmployeeSalary = null;

    this.salaryStructureModel?.hide();
    this.selectedEmployeeSalaryStructure = null;
  }

  async onIncentiveSaved(incentive: Incentive) {
    if (incentive.IncentiveId) {
      await this.updateIncentive(incentive);
    } else {
      await this.addIncentive(incentive);
    }
  }

  async onSalarySaved(salary: EmployeeSalaryDto) {
    if (salary.EmployeeSalaryId) {
      await this.updateSalary(salary);
    } else {
      await this.addSalary(salary);
    }
  }

  async onSalaryStructureSaved(structure: EmployeeSalaryStructure) {
    if (structure.EmployeeSalaryStructureId) {
      await this.updateStructure(structure);
    } else {
      await this.addStructure(structure);
    }
  }

  private async addIncentive(incentive: Incentive) {
    this.apiService.post(Api.Incentive, incentive).subscribe(async (data) => {
      if (data.IsValid) {
        await this.getIncentive().then(() => this.closeModel());
      }
    });
  }

  private async updateIncentive(incentive: Incentive) {
    this.apiService.update(Api.Incentive, incentive).subscribe(async (data) => {
      if (data.IsValid) {
        await this.getIncentive().then(() => this.closeModel());
      }
    });
  }

  private async addSalary(salary: EmployeeSalaryDto) {
    this.apiService.post(Api.EmployeeSalary, salary).subscribe(async (data) => {
      if (data.IsValid) {
        await this.getSalaries().then(() => this.closeModel());
      }
    });
  }

  private async updateSalary(salary: EmployeeSalaryDto) {
    this.apiService.update(Api.EmployeeSalary, salary).subscribe(async (data) => {
      if (data.IsValid) {
        await this.getSalaries().then(() => this.closeModel());
      }
    });
  }

  private async addStructure(salaryStructure: EmployeeSalaryStructure) {
    this.apiService.post(Api.EmployeeSalaryStructure, salaryStructure).subscribe(async (data) => {
      if (data.IsValid) {
        await this.getPakages().then(() => this.closeModel());
      }
    });
  }

  private async updateStructure(salaryStructure: EmployeeSalaryStructure) {
    this.apiService.update(Api.EmployeeSalaryStructure, salaryStructure).subscribe(async (data) => {
      if (data.IsValid) {
        await this.getPakages().then(() => this.closeModel());
      }
    });
  }

  async getIncentive() {
    this.incentives = await this.apiService.getByDate(Api.Incentive, new RequestDto(null, this.from, this.to)).toPromise();
  }

  async getPakages() {
    const salaryStructures = await this.apiService.getByDate(Api.EmployeeSalaryStructure, new RequestDto(null, null, null)).toPromise();
    this.employeeSalaryStructures = salaryStructures;
    this.employees = this.employeeSalaryStructures.map((data) => data.Employee);
  }
  async loadSalaries() {
    this.getSalaries();
    this.getPakages();
    this.updateFormFields();
  }

  async getSalaries() {
    const employeeSalaries = await this.apiService
      .getByDate(Api.EmployeeSalary, new RequestDto(this.updateId, this.from, this.to))
      .toPromise();
    this.employeeSalary = employeeSalaries.sort((a, b) => new Date(b.SalaryForAMonth).getTime() - new Date(a.SalaryForAMonth).getTime());
  }
  JsonToCsv() {
    this.commonService.exportToCsv(this.employeeSalary, 'SigaEmployeesList.csv');
  }

  DetailsEmployee(id: number) {
    this.updateId = id;
    this.actionLink = 'profile';
  }
}
function getFirstDateOfMonth(toDate: any): any {
  throw new Error('Function not implemented.');
}
