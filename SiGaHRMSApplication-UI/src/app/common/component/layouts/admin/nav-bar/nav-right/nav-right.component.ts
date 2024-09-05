import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse, Employee, LeaveRequest, NotificationDto, RequestDto } from 'src/app/common/datatypes/DataTypes';
import { AuthService } from 'src/app/common/service/authitication/auth.service';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { Api, LeaveRequestStatus, UserRole } from 'src/app/common/enum/enum';
class Notification {
  Date: any;
  Name: any;
  EventName: any;
  Color: any;
  Icon: any;
  Link: any;
}
@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  employee: Employee = new Employee();
  notification: NotificationDto[] = [];
  time: string;
  isDropdownOpen: boolean = false;
  User: AuthResponse;
  UserRole = UserRole;
  notifications: Notification[] = [];
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.decodeJwt();
  }
  ngOnInit() {}
  async decodeJwt() {
    this.User = this.authService.loginUser();
    this.apiService.get(Api.Employee, Number(this.User.employeeId)).subscribe((data) => (this.employee = data));
    this.getLeaves();
  }

  getLeaves() {
    this.apiService
      .getByDate(Api.LeaveRequest, new RequestDto(null, this.datePipe.transform(new Date(), 'yyyy-MM-dd'), null))
      .subscribe((data: LeaveRequest[]) => {
        var res = data.filter(
          (leave) =>
            (new Date(leave.FromDate).getTime() <= new Date().getTime() && new Date(leave.ToDate).getTime() >= new Date().getTime()) ||
            leave.LeaveRequestStatus == LeaveRequestStatus.Open
        );
        res.forEach((data) => {
          if (data.LeaveRequestStatus == LeaveRequestStatus.Open) {
            var noti = new Notification();
            noti.Date = data.FromDate + ' - ' + data.ToDate;
            noti.EventName = 'Leave Apprval Pending';
            noti.Color = 'warning';
            noti.Icon = 'ti ti-bell-ringing';
            noti.Name = data.Employee.FirstName + ' ' + data.Employee.LastName;
            noti.Link = this.User.role == UserRole.SUPER_ADMIN || this.User.role == UserRole.HR ? 'admin/leaves' : 'guest/leave';
            this.notifications.push(noti);
          } else {
            var noti = new Notification();
            noti.Date = data.FromDate + ' - ' + data.ToDate;
            noti.EventName = 'On Leave';
            noti.Color = 'error';
            noti.Icon = 'ti ti-bell-ringing';
            noti.Name = data.Employee.FirstName + ' ' + data.Employee.LastName;
            noti.Link = this.User.role == UserRole.SUPER_ADMIN || this.User.role == UserRole.HR ? 'admin/leaves' : 'guest/leave';
            this.notifications.push(noti);
          }
        });
      });
  }

  getProfileLink(employeeId: any): string[] {
    const baseRoute = this.User.role === this.UserRole.SUPER_ADMIN || this.User.role === this.UserRole.HR ? 'admin' : 'guest';

    return [`/${baseRoute}/profile`, employeeId];
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  profile = [
    {
      icon: 'ti ti-user',
      title: 'View Profile'
    },
    {
      icon: 'ti ti-edit-circle',
      title: 'Edit Profile'
    },

    {
      icon: 'ti ti-power',
      title: 'Logout'
    }
  ];

  setting = [
    {
      icon: 'ti ti-help',
      title: 'Support'
    },
    {
      icon: 'ti ti-user',
      title: 'Account Settings'
    },
    {
      icon: 'ti ti-lock',
      title: 'Privacy Center'
    },
    {
      icon: 'ti ti-messages',
      title: 'Feedback'
    },
    {
      icon: 'ti ti-list',
      title: 'Contect Us'
    }
  ];

  LogOut() {
    this.authService.logout();
  }

  RouterLink() {
    this.toggleDropdown();
    this.router.navigate(['admin/leaves']);
  }
}
