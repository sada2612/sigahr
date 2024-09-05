import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { AuthResponse, Employee, LeaveBalance } from 'src/app/common/datatypes/DataTypes';
import { Api, LeaveBalanceStatus } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthService } from 'src/app/common/service/authitication/auth.service';
import { FormComponent } from '../../../common/component/form/form.component';
import { leavebalancefields } from 'src/app/common/constantss/const';

@Component({
  selector: 'app-leavebalances',
  standalone: true,
  templateUrl: './leavebalances.component.html',
  styleUrls: ['./leavebalances.component.scss'],
  imports: [CommonModule, SharedModule, FormComponent]
})
export default class LeavebalancesComponent {
  @ViewChild('leavebalanceModal') leavebalanceModalRef!: ElementRef;
  leavebalances: LeaveBalance[] = [];
  leaveBalanceStatus = LeaveBalanceStatus;
  selectedLeavebalance: LeaveBalance | null = null;
  currentUser: AuthResponse;
  leavebalancefields = leavebalancefields;
  employeeOptions: { value: number; label: string }[];
  private leavebalanceModal: any;
  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.loginUser();
    this.getEmployee();
  }
  ngOnInit() {}
  ngAfterViewInit() {
    if (typeof (window as any).bootstrap !== 'undefined') {
      this.leavebalanceModal = new (window as any).bootstrap.Modal(this.leavebalanceModalRef.nativeElement);
    }
  }

  getOptions() {
    this.leavebalancefields = this.leavebalancefields.map((field) => {
      if (field.type === 'select' && field.id == 'employeeId') {
        field.options = this.employeeOptions;
      }
      return field;
    });
  }
  expandedRow: number | null = null; // Tracks the currently expanded row

  toggleRow(index: number) {
    this.expandedRow = this.expandedRow === index ? null : index;
  }
  openModal(leavebalance?: LeaveBalance) {
    this.getOptions();
    this.selectedLeavebalance = leavebalance ? { ...leavebalance } : new LeaveBalance();
    this.leavebalanceModal.show();
  }

  getEmployee() {
    this.apiService.getAll(Api.Employee).subscribe((employees: Employee[]) => {
      this.employeeOptions = employees.map((employee) => ({
        value: employee.EmployeeId,
        label: employee.FirstName + ' ' + employee.LastName
      }));
    });
    this.getLeaveBalance();
  }

  onLeavebalanceSaved(leavebalance: LeaveBalance) {
    if (!leavebalance.LeaveBalanceId) {
      this.addLeavebalance(leavebalance);
    } else {
      this.updateLeavebalance(leavebalance);
    }
  }

  addLeavebalance(leavebalance: LeaveBalance) {
    this.apiService
      .post(Api.LeaveBalance, leavebalance)
      .subscribe((res) => (res.IsValid ? (this.getLeaveBalance(), this.closeModal()) : ''));
  }

  updateLeavebalance(leavebalance: LeaveBalance) {
    this.apiService
      .update(Api.LeaveBalance, leavebalance)
      .subscribe((res) => (res.IsValid ? (this.getLeaveBalance(), this.closeModal()) : ''));
  }
  closeModal() {
    if (this.leavebalanceModal.show()) {
      this.leavebalanceModal.hide();
      this.selectedLeavebalance = null;
    }
  }

  getLeaveBalance() {
    this.apiService.getAll(Api.LeaveBalance).subscribe((data) => {
      this.leavebalances = data;
    });
  }
}
