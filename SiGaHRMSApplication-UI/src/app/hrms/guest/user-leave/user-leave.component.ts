import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { leaveTypeOptions, LeaveRequest, RequestDto } from 'src/app/common/datatypes/DataTypes';
import { LeaveRequestStatus, UserRole, Api } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthService } from 'src/app/common/service/authitication/auth.service';
import { LeaveFormComponent } from "../../admin/leave/leave-form/leave-form.component";

@Component({
  selector: 'app-user-leave',
  standalone: true,
  templateUrl: './user-leave.component.html',
  styleUrls: ['./user-leave.component.scss'],
  imports: [CommonModule, SharedModule, LeaveFormComponent]
})
export default class UserLeaveComponent {
  @ViewChild('leaveRequestModal') leaveRequestModalRef!: ElementRef;
  @ViewChild('leaveRequestReasonModal') leaveRequestReasonModalRef!: ElementRef;
  active: any;
  from: string;
  to: string;
  today: string;
  leaveTypeOptions = leaveTypeOptions;
  leaveRequest = new LeaveRequest();
  leaveRequests: LeaveRequest[] = [];
  activeSection: string = 'leave';
  currentUser: any;
  leaveRequestStatus = LeaveRequestStatus;
  userRole = UserRole;
  selectedLeaveRequest: LeaveRequest | null = null;
  selectedLeaveRequestReason: LeaveRequest | null = null;
  private leaveRequestModel: any;
  private leaveRequestReasonModel: any;
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {
    const today = new Date();
    this.from = this.datePipe.transform(today, 'yyyy-MM-dd')!;
    this.to = this.datePipe.transform(new Date(today.getFullYear(), 11, 31), 'yyyy-MM-dd')!;
    this.today = this.datePipe.transform(today, 'yyyy-MM-dd')!;
  }
  ngAfterViewInit() {
    if (typeof (window as any).bootstrap !== 'undefined') {
      this.leaveRequestModel = new (window as any).bootstrap.Modal(this.leaveRequestModalRef.nativeElement);
      this.leaveRequestReasonModel = new (window as any).bootstrap.Modal(this.leaveRequestReasonModalRef.nativeElement);
    } 
  }
  ngOnInit() {
    this.currentUser = this.authService.loginUser();
    this.loadLeaveRequests();
  }

  closeModel() {
    this.leaveRequestModel.hide();
    this.selectedLeaveRequest = null;
    this.leaveRequestReasonModel.hide();
    this.selectedLeaveRequestReason = null;
  }
  openModal(leaveRequest?: LeaveRequest) {
    if (this.leaveRequestModel) {
      this.selectedLeaveRequest = leaveRequest ? { ...leaveRequest } : new LeaveRequest();
      this.leaveRequestModel.show();
    }
  }

  openReasonModel(leaveRequest?: LeaveRequest) {
    this.selectedLeaveRequestReason = { ...leaveRequest };
    this.leaveRequestReasonModel.show();
  }

  onSaved() {
    this.loadLeaveRequests().then(() => this.closeModel());
  }

  async loadLeaveRequests() {
    const requestDto = new RequestDto(null, this.from, this.to);
    this.apiService.getByDate(Api.LeaveRequest, requestDto).subscribe((data) => {
      this.leaveRequests = data;
    });
  }

  updateLeaveRequestStatus(request: LeaveRequest) {
    this.apiService.updateLeaveRequestStatus(Api.LeaveRequest, request).subscribe((data) => {
      if (data.IsValid) {
        this.loadLeaveRequests();
      }
    });
  }

  deleteLeaveRequest(leaveRequest: LeaveRequest) {
    if (leaveRequest.LeaveRequestStatus === LeaveRequestStatus.Open) {
      this.apiService.update(Api.LeaveRequest, leaveRequest).subscribe((leaveRequestRespone) => {
        leaveRequestRespone.IsValid ? this.loadLeaveRequests() : '';
      });
    }
  }

  GetLeaveByDate() {
    this.apiService.getByDate(Api.LeaveRequest, new RequestDto(this.currentUser , this.from, this.to)).subscribe((data) => {
      this.leaveRequests = data;
      console.log(this.leaveRequests);
    });
  }

}
