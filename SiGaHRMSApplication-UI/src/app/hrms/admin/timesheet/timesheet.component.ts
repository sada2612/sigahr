import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { RequestDto, TimeSheet, TimeSheetDetail, timeSheetStatusOptions, timeSheetTypeOptions } from 'src/app/common/datatypes/DataTypes';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { TimesheetDetailComponent } from './timesheet-detail/timesheet-detail.component';
import { Api, TimeSheetStatus, TimeSheetType, UserRole } from 'src/app/common/enum/enum';
import { AuthService } from 'src/app/common/service/authitication/auth.service';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss'],
  imports: [CommonModule, SharedModule, TimesheetDetailComponent]
})
export default class TimesheetComponent {
  timeSheets: TimeSheet[];
  actionLink = 'list';
  selectedTimeSheet:TimeSheet;
  to: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  from: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  active: any;
  timeSheetTypeOptions = timeSheetTypeOptions;
  timeSheetType = TimeSheetType;
  timeSheetTypeConst: TimeSheetType = TimeSheetType.Daily;
  timeSheetStatusOptions = timeSheetStatusOptions;
  timeSheetStatusConst = TimeSheetStatus.All;
  timeSheetStatus = TimeSheetStatus;
  userRole = UserRole;
  user = this.authService.loginUser();

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.from = this.getWeekRange(new Date()).startOfWeek;
    this.getTimeSheets();
  }

  getWeekRange(date: Date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return {
      startOfWeek: this.datePipe.transform(startOfWeek, 'yyyy-MM-dd'),
      endOfWeek: this.datePipe.transform(endOfWeek, 'yyyy-MM-dd')
    };
  }

  getTimeSheets(employeeId = null) {
    const apiEndpoint = this.timeSheetTypeConst === TimeSheetType.Weekly ? this.getWeeklyTimeSheets : this.getDailyTimeSheets;
    apiEndpoint.call(this, employeeId);
  }

  private getDailyTimeSheets(employeeId = null) {
    this.apiService.getByDate(Api.TimesheetDetail, new RequestDto(employeeId, this.from, this.to)).subscribe((data: TimeSheetDetail[]) => {
      const filteredData = this.filterDataByStatus(data);
      this.timeSheets = this.aggregateTimeSheets(filteredData, this.timeSheetTypeConst);
    });
  }

  private getWeeklyTimeSheets(employeeId = null) {
    const startDate = this.getWeekRange(new Date(this.from)).startOfWeek;
    const endDate = this.getWeekRange(new Date(this.to)).endOfWeek;

    this.apiService.getByDate(Api.TimesheetDetail, new RequestDto(employeeId, startDate, endDate)).subscribe((data: TimeSheetDetail[]) => {
      const filteredData = this.filterDataByStatus(data);
      this.timeSheets = this.aggregateTimeSheets(filteredData, TimeSheetType.Weekly);
    });
  }

  private filterDataByStatus(data: TimeSheetDetail[]): TimeSheetDetail[] {
    return this.timeSheetStatusConst !== TimeSheetStatus.All
      ? data.filter((x) => x.Timesheet.TimesheetStatus === this.timeSheetStatusConst)
      : data;
  }

  private aggregateTimeSheets(data: TimeSheetDetail[], type: TimeSheetType): any[] {
    const uniqueTimesheets = new Map<string, any>();

    data.forEach((e) => {
      const timesheetDate = new Date(e.Timesheet.TimesheetDate);
      const startOfWeek = this.getWeekRange(timesheetDate).startOfWeek;
      const endOfWeek = this.getWeekRange(timesheetDate).endOfWeek;
      const key =
        type === TimeSheetType.Weekly
          ? JSON.stringify({ TimesheetDate: startOfWeek, ToTimesheetDate: endOfWeek, EmployeeId: e.Timesheet.EmployeeId })
          : JSON.stringify({ TimesheetDate: e.Timesheet.TimesheetDate, EmployeeId: e.Timesheet.EmployeeId });

      if (!uniqueTimesheets.has(key)) {
        uniqueTimesheets.set(key, {
          TimesheetDate: type === TimeSheetType.Weekly ? startOfWeek : e.Timesheet.TimesheetDate,
          ToTimesheetDate: type === TimeSheetType.Weekly ? endOfWeek : undefined,
          EmployeeId: e.Timesheet.EmployeeId,
          Employee: e.Timesheet.Employee,
          WorkingHours: 0
        });
      }

      const timesheetEntry = uniqueTimesheets.get(key);
      timesheetEntry.WorkingHours += e.HoursSpent;
    });

    return Array.from(uniqueTimesheets.values());
  }
}
