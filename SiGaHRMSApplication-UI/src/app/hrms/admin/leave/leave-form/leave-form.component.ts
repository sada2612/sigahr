import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Holiday, LeaveBalance, LeaveRequest, leaveTypeOptions } from 'src/app/common/datatypes/DataTypes';
import { Api, LeaveRequestStatus } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthService } from 'src/app/common/service/authitication/auth.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.scss']
})
export class LeaveFormComponent implements OnInit {
  @Input() leaveRequest: LeaveRequest | null = null;
  @Input() leaveRequests: LeaveRequest[] = [];
  @Output() onSave = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();
  private originalLeaveRequest: LeaveRequest | null = null;
  leaveTypeOptions = leaveTypeOptions;
  leaveBalance: LeaveBalance | null = null;
  holidays: Holiday[] = [];
  isLeaveBalanceAvailable = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.leaveRequest ??= new LeaveRequest();
    this.originalLeaveRequest = cloneDeep(this.leaveRequest);
    this.getLeaveBalance();
    this.getHolidays();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['leaveRequest'] && !changes['leaveRequest'].firstChange) {
      this.validateLeaveType();
    }
  }

  hasChanges(): boolean {
    return !this.originalLeaveRequest || JSON.stringify(this.originalLeaveRequest) !== JSON.stringify(this.leaveRequest);
  }

  private getLeaveBalance() {
    const employeeId = this.authService.loginId();
    if (employeeId) {
      this.apiService.get(Api.LeaveBalance, employeeId).subscribe((data) => {
        this.leaveBalance = data;
      });
    }
  }

  onIsHalfDayChange(value) {
    if (this.leaveRequest) {
      this.leaveRequest.IsHalfDay = value === 'true';
    }
  }
  private getHolidays() {
    this.apiService.getAll(Api.Holiday).subscribe((holidays: Holiday[]) => {
      this.holidays = holidays;
    });
  }

  async saveLeaveRequest() {
    if (this.leaveRequest) {
      const method = this.leaveRequest.LeaveRequestId ? 'updateLeaveRequest' : 'addLeaveRequest';
      await this[method]();
    }
  }

  private async addLeaveRequest() {
    const employeeId = this.authService.loginId();
    if (this.leaveRequest && employeeId) {
      this.leaveRequest.EmployeeId = Number(employeeId);
      this.apiService.post(Api.LeaveRequest, this.leaveRequest).subscribe((data) => {
        if (data.IsValid) this.onSave.emit();
      });
    }
  }

  private async updateLeaveRequest() {
    if (this.leaveRequest) {
      this.apiService.update(Api.LeaveRequest, this.leaveRequest).subscribe((data) => {
        if (data.IsValid) this.onSave.emit();
      });
    }
  }

  validateLeaveType() {
    if (this.leaveBalance && this.leaveRequest?.LeaveType) {
      this.isLeaveBalanceAvailable = 
        this.leaveBalance[this.leaveRequest.LeaveType + 's'] - 
        this.leaveBalance[this.leaveRequest.LeaveType + 'sAvailaed'] <= 0;
    }
  }

  isInvalidDate(date: string | null | undefined): boolean {
    return this.isWeekend(date) || this.isHoliday(date) || this.isLeaveRequestConflict(date);
  }

  getInvalidDateMessage(date: string | null | undefined): string {
    if (!date) return '';
    if (this.isWeekend(date)) return 'Date cannot be a weekend.';
    if (this.isHoliday(date)) return 'Date cannot be a holiday.';
    if (this.isLeaveRequestConflict(date)) return 'Date conflict with another request.';
    return '';
  }

  leaveBalanceExceeded(): boolean {
    return this.leaveBalance && this.leaveRequest?.FromDate && this.leaveRequest.ToDate && this.leaveRequest.LeaveType
      ? this.calculateDateDifference() > this.leaveBalance[this.leaveRequest.LeaveType + 's']
      : false;
  }

  private calculateDateDifference(): number {
    if (!this.leaveRequest?.FromDate || !this.leaveRequest.ToDate) return 0;

    const from = new Date(this.leaveRequest.FromDate);
    const to = new Date(this.leaveRequest.ToDate);
    let totalDays = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24) + 1;

    let weekendDays = 0;
    for (let date = new Date(from); date <= to; date.setDate(date.getDate() + 1)) {
      if (date.getDay() === 0 || date.getDay() === 6) weekendDays++;
    }

    const workingDays = totalDays - weekendDays - this.getHolidayCount(from, to);
    return this.leaveRequest.IsHalfDay ? workingDays / 2 : workingDays;
  }

  private getHolidayCount(from: Date, to: Date): number {
    return this.holidays.filter(holiday => {
      const date = new Date(holiday.Date);
      return date >= from && date <= to && date.getDay() !== 0 && date.getDay() !== 6;
    }).length;
  }

  private isWeekend(date: string | null | undefined): boolean {
    if (!date) return false;
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  }

  private isHoliday(date: string | null | undefined): boolean {
    return date ? !!this.holidays.find(holiday => new Date(holiday.Date).getTime() === new Date(date).getTime()) : false;
  }

  private isLeaveRequestConflict(date: string | null | undefined): boolean {
    return date
      ? !!this.leaveRequests?.find(
          request =>
            request.LeaveRequestStatus!=LeaveRequestStatus.Rejected&&(
            new Date(request.FromDate).getTime() === new Date(date).getTime() ||
            new Date(request.ToDate).getTime() === new Date(date).getTime())
        )
      : false;
  }

  close() {
    this.onClose.emit();
  }
}


