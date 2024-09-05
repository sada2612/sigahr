import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Attendance, RequestDto } from 'src/app/common/datatypes/DataTypes';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { CommonService } from 'src/app/common/service/common/common.service';
import { AttedanceProfileComponent } from './attedance-profile/attedance-profile.component';
import { Api } from 'src/app/common/enum/enum';
import { AuthService } from 'src/app/common/service/authitication/auth.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
  imports: [CommonModule, SharedModule, AttedanceProfileComponent]
})
export default class AttendanceComponent implements AfterViewInit, OnDestroy {
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

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private authService: AuthService
  ) {
    
  }

  async ngAfterViewInit(): Promise<void> {
    await this.fetchAttendanceData();
  }

  JsonToCsv(): void {
    this.commonService.exportToCsv(this.attendancelist, `Attendance-${this.today}.csv`);
  }

  async setChildList(employeeId: number, date: string): Promise<void> {
    this.childAttendancelist = this.filterAndSortAttendances(employeeId, date, 'CreatedDateTime', 'asc');
  }

  getAttendanceTime(employeeId: number, date: string, timeType: 'InTime' | 'OutTime', sortOrder: 'asc' | 'desc'): Attendance | undefined {
    return this.filterAndSortAttendances(employeeId, date, timeType, sortOrder)[0];
  }

  private filterAndSortAttendances(employeeId: number, date: string, sortField: string, sortOrder: 'asc' | 'desc'): Attendance[] {
    return this.attendancelist
      .filter(x => x.EmployeeId === employeeId && x.AttendanceDate === date)
      .sort((a, b) => sortOrder === 'asc' 
        ? new Date(a[sortField]!).getTime() - new Date(b[sortField]!).getTime() 
        : new Date(b[sortField]!).getTime() - new Date(a[sortField]!).getTime()
      );
  }

   fetchAttendanceData(): void {
    this.apiService.getByDate(Api.Attendance, new RequestDto(null, this.from, this.to)).subscribe((data: Attendance[]) => {
      this.attendancelist = data;
      this.allAtedanceList = this.aggregateTimeSheets(data);
      this.setAttendanceButton();
    });
  }

  getInTime(employeeId: number, date: string): Attendance | undefined {
    return this.filterAndSortAttendances(employeeId, date, 'InTime', 'asc')[0];
  }

  getOutTime(employeeId: number, date: string): Attendance | undefined {
    return this.filterAndSortAttendances(employeeId, date, 'OutTime', 'desc')[0];
  }
  private aggregateTimeSheets(data: Attendance[]): any[] {
    const uniqueTimesheets = new Map<string, any>();

    data.forEach(e => {
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
    const loginId= this.authService.loginId();
    this.attendanceButton = this.attendancelist.some(x => x.Employee.EmployeeId === loginId && x.OutTime === null)
      ? 'OutTime'
      : 'InTime';
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }
}
