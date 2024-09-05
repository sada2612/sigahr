import { CommonModule, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Attendance, RequestDto } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthService } from 'src/app/common/service/authitication/auth.service';
import { CommonService } from 'src/app/common/service/common/common.service';
import { AttedanceProfileComponent } from '../../admin/attendance/attedance-profile/attedance-profile.component';

@Component({
  selector: 'app-user-attendance',
  standalone: true,
  templateUrl: './user-attendance.component.html',
  styleUrls: ['./user-attendance.component.scss'],
  imports: [CommonModule, SharedModule, AttedanceProfileComponent]
})
export default class UserAttendanceComponent {
  @ViewChild('attedanceProfile') attedanceProfileComponent!: AttedanceProfileComponent;
  today: string = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  attendancelist: Attendance[] = [];
  allAtedanceList: Attendance[] = [];
  activeLink: string = 'list';
  from: string = this.today;
  to: string = this.today;
  private timerSubscription?: Subscription;
  attendanceButton: string = 'InTime';
  childAttendancelist: Attendance[] = [];
  active: any;
  employeeId: number;

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private authService: AuthService
  ) {}
  async ngOnInit() {
    const { startOfWeek, endOfWeek } = this.getWeekRange(new Date());
    this.from = startOfWeek;
    this.to = endOfWeek;

    this.employeeId = await this.authService.loginId();
    this.fetchAttendanceData();
  }
  JsonToCsv(): void {
    this.commonService.exportToCsv(this.attendancelist, `Attendance-${this.today}.csv`);
  }

  async setChildList(date: string): Promise<void> {
    this.childAttendancelist = this.filterAndSortAttendances(date, 'CreatedDateTime', 'asc');
  }

  getAttendanceTime(date: string, timeType: 'InTime' | 'OutTime', sortOrder: 'asc' | 'desc'): Attendance | undefined {
    return this.filterAndSortAttendances(date, timeType, sortOrder)[0];
  }

  private filterAndSortAttendances(date: string, sortField: string, sortOrder: 'asc' | 'desc'): Attendance[] {
    return this.attendancelist
      .filter((x) => x.AttendanceDate === date)
      .sort((a, b) =>
        sortOrder === 'asc'
          ? new Date(a[sortField]!).getTime() - new Date(b[sortField]!).getTime()
          : new Date(b[sortField]!).getTime() - new Date(a[sortField]!).getTime()
      );
  }

  getWeekRange(date: Date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4);
    return {
      startOfWeek: this.datePipe.transform(startOfWeek, 'yyyy-MM-dd'),
      endOfWeek: this.datePipe.transform(endOfWeek, 'yyyy-MM-dd')
    };
  }

  fetchAttendanceData(): void {
    this.apiService.getByDate(Api.Attendance, new RequestDto(this.employeeId, this.from, this.to)).subscribe((data: Attendance[]) => {
      this.attendancelist = data;
      this.allAtedanceList = this.aggregateTimeSheets(data);
      this.setAttendanceButton();
    });
  }

  getInTime(date: string): Attendance | undefined {
    return this.filterAndSortAttendances(date, 'InTime', 'asc')[0];
  }

  getOutTime(date: string): Attendance | undefined {
    return this.filterAndSortAttendances(date, 'OutTime', 'desc')[0];
  }
  private aggregateTimeSheets(data: Attendance[]): any[] {
    const uniqueTimesheets = new Map<string, any>();

    data.forEach((e) => {
      const key = JSON.stringify({ AttendanceDate: e.AttendanceDate, EmployeeId: e.EmployeeId });

      if (!uniqueTimesheets.has(key)) {
        uniqueTimesheets.set(key, {
          AttendanceDate: e.AttendanceDate,
          EmployeeId: e.EmployeeId,
          Employee: e.Employee,
          WorkTime: 0
        });
      }

      const timesheetEntry = uniqueTimesheets.get(key);
      timesheetEntry.WorkTime += this.commonService.calculateWorkedTimeinSeconds(e.InTime, e.OutTime);
    });

    return Array.from(uniqueTimesheets.values());
  }

  convertSecondsToTime(data): any {
    return this.commonService.convertSecondsToTime(data);
  }

  private async setAttendanceButton(): Promise<void> {
    this.attendanceButton = this.attendancelist.some((x) => x.OutTime === null) ? 'OutTime' : 'InTime';
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }
}
