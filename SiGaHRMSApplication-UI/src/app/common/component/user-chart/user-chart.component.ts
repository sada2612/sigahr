import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { SharedModule } from '../module/shared.module';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { CommonService } from '../../service/common/common.service';
import { Attendance, Employee, Holiday, LeaveRequest, RequestDto, TimeSheetDetail } from '../../datatypes/DataTypes';
import { Api, LeaveRequestStatus } from '../../enum/enum';
import { ApiService } from '../../service/api/api-service.service';
import { AuthService } from '../../service/authitication/auth.service';
import { ClockComponent } from '../clock/clock.component';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  colors: string[];
  stroke: ApexStroke;
  responsive: ApexResponsive[];
  grid: ApexGrid;
  yaxis: ApexYAxis;
  legend: ApexLegend;
};

@Component({
  selector: 'app-user-chart',
  standalone: true,
  imports: [CommonModule, SharedModule, NgApexchartsModule, ClockComponent],
  templateUrl: './user-chart.component.html',
  styleUrls: ['./user-chart.component.scss']
})
export class UserChartComponent {
  @ViewChild('chart') chart: ChartComponent;
  @Output() pendingLeavesRequests = new EventEmitter<number>();
  chartOptions: Partial<ChartOptions>;
  monthChart: ApexCharts;
  weekChart: ApexCharts;
  AllTimesheetDetail: TimeSheetDetail[];
  attendanceList: any = [];
  currentUser: any;
  attendanceButton: string;
  employee: number = 0;
  pendingLeavesRequest: number = 0;
  currentMonthLeave: number = 0;
  holidays: Holiday[];

  constructor(
    private datePipe: DatePipe,
    private commonService: CommonService,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.loginUser();
    this.getAttendanceByDate();
    this.decodeJwt();
  }

  getLeave() {
    this.apiService.get(Api.LeaveRequest, this.getCurrentUserId()).subscribe((leaveRequest: LeaveRequest[]) => {
      this.pendingLeavesRequest = leaveRequest.filter((data) => data.LeaveRequestStatus == LeaveRequestStatus.Open).length;
      var approvedCurrentMonthLeave = leaveRequest.filter(
        (data) =>
          data.LeaveRequestStatus == LeaveRequestStatus.Approved &&
          (new Date(data.FromDate).getMonth() == new Date().getMonth() || new Date(data.ToDate).getMonth() == new Date().getMonth())
      );
      approvedCurrentMonthLeave.forEach((approvedLeaveRequest: LeaveRequest) => {
        this.currentMonthLeave += this.calculateDateDifference(
          approvedLeaveRequest.FromDate,
          approvedLeaveRequest.ToDate,
          approvedLeaveRequest.IsHalfDay
        );
      });
    });
  }

  calculateDateDifference(FromDate, ToDate, IsHalfDay): number {
    if (!FromDate || !ToDate) return 0;
    const from = new Date(FromDate);
    const to = new Date(ToDate);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const adjustedFrom = from < startOfMonth ? startOfMonth : from;
    const adjustedTo = to > endOfMonth ? endOfMonth : to;

    if (adjustedFrom > adjustedTo) return 0;

    let totalDays = (adjustedTo.getTime() - adjustedFrom.getTime()) / (1000 * 60 * 60 * 24) + 1;

    let weekendDays = 0;
    for (let date = new Date(adjustedFrom); date <= adjustedTo; date.setDate(date.getDate() + 1)) {
      if (date.getDay() === 0 || date.getDay() === 6) weekendDays++;
    }

    const workingDays = totalDays - weekendDays - this.getHolidayCount(adjustedFrom, adjustedTo);
    return IsHalfDay ? workingDays / 2 : workingDays;
  }

  private getHolidayCount(from: Date, to: Date): number {
    return this.holidays.filter((holiday) => {
      const date = new Date(holiday.Date);
      return date >= from && date <= to && date.getDay() !== 0 && date.getDay() !== 6;
    }).length;
  }

  private getHolidays() {
    this.apiService.getAll(Api.Holiday).subscribe((holidays: Holiday[]) => {
      this.holidays = holidays;
      this.getLeave()
    });
    
  }
  async checkIn() {
    var attendanceDto = new Attendance();
    await this.apiService.post(Api.Attendance, attendanceDto).toPromise();
    await this.getAttendanceByDate();
  }
  checkOut(): void {
    const currentAttendance = this.attendanceList.find(
      (attendance: Attendance) => attendance.Employee.EmployeeId === this.getCurrentUserId() && attendance.OutTime == null
    );
    if (currentAttendance) {
      this.apiService.update(Api.Attendance, currentAttendance).subscribe(() => this.getAttendanceByDate());
    }
  }

  getAttendanceByDate(): void {
    const transformedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.apiService.getByDate(Api.Attendance, new RequestDto(null, transformedDate, transformedDate)).subscribe((data) => {
      this.attendanceList = data;
      this.setAttendanceButton();
    });
  }

  private setAttendanceButton(): void {
    const currentAttendance = this.attendanceList.find(
      (attendance) => attendance.Employee.EmployeeId == this.getCurrentUserId() && attendance.OutTime == null
    );
    this.attendanceButton = !currentAttendance ? 'InTime' : 'OutTime';
  }

  renderChart(selector: string, options) {
    setTimeout(() => {
      this.weekChart = new ApexCharts(document.querySelector(selector), options);
      this.weekChart.render();
    }, 200);
  }

  getTimesheetDetail() {
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear}-01-01`;
    const endDate = `${currentYear}-12-31`;

    this.apiService
      .getByDate(Api.TimesheetDetail, new RequestDto(this.getCurrentUserId(), startDate, endDate))
      .subscribe((data: TimeSheetDetail[]) => {
        this.AllTimesheetDetail = data;
        this.getTimeSheetDetails(data);
      });
  }
  getTimeSheetDetails(data, month = false) {
    const { startOfWeek, endOfWeek } = this.commonService.getWeekRange(new Date());
    const filteredData = data.filter((item) => {
      const timesheetDate = new Date(item.Timesheet.TimesheetDate).getTime();
      return timesheetDate >= new Date(startOfWeek).getTime() && timesheetDate <= new Date(endOfWeek).getTime();
    });
    const aggregatedData = this.aggregateTimeSheets(month ? data : filteredData, month);
    if (!month) {
      this.weekOptions.series = [
        { name: 'Working Hours', data: aggregatedData[0] },
        { name: 'Billable Hours', data: aggregatedData[1] }
      ];
      this.renderChart('#visitor-chart', this.weekOptions);
    } else {
      this.monthOptions.series = [
        { name: 'Working Hours', data: aggregatedData[0] },
        { name: 'Billable Hours', data: aggregatedData[1] }
      ];
      this.renderChart('#visitor-chart-1', this.monthOptions);
    }
  }

  private aggregateTimeSheets(data: TimeSheetDetail[], month): any[] {
    const totalWeekHours = new Map<string, number>();
    const totalBillableWeekHours = new Map<string, number>();
    const totalMonthHours = new Map<string, number>();
    const totalMonthBillableHours = new Map<string, number>();

    if (month) {
      const dates = this.commonService.getMiddleDates(new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 31));
      dates.forEach((date) => {
        totalMonthHours.set(new Date(date).getMonth().toString(), 0);
        totalMonthBillableHours.set(`${new Date(date).getMonth()}-true`, 0);
      });

      data.forEach(({ Timesheet: { TimesheetDate }, IsBillable, HoursSpent }) => {
        if (totalMonthHours.has(new Date(TimesheetDate).getMonth().toString())) {
          totalMonthHours.set(
            new Date(TimesheetDate).getMonth().toString(),
            totalMonthHours.get(new Date(TimesheetDate).getMonth().toString()) + HoursSpent
          );
        }
        const billableKey = `${new Date(TimesheetDate).getMonth()}-${IsBillable}`;
        if (totalMonthBillableHours.has(billableKey)) {
          totalMonthBillableHours.set(billableKey, totalMonthBillableHours.get(billableKey) + HoursSpent);
        }
      });

      return [Array.from(totalMonthHours.values()), Array.from(totalMonthBillableHours.values())];
    } else {
      const { startOfWeek, endOfWeek } = this.commonService.getWeekRange(
        data.length === 0 ? new Date() : new Date(data[0].Timesheet.TimesheetDate)
      );
      const dates = this.commonService.getMiddleDates(startOfWeek, endOfWeek);

      dates.forEach((date) => {
        totalWeekHours.set(date, 0);
        totalBillableWeekHours.set(`${date}-true`, 0);
      });

      data.forEach(({ Timesheet: { TimesheetDate }, IsBillable, HoursSpent }) => {
        if (totalWeekHours.has(TimesheetDate)) {
          totalWeekHours.set(TimesheetDate, totalWeekHours.get(TimesheetDate) + HoursSpent);
        }
        const billableKey = `${TimesheetDate}-${IsBillable}`;
        if (totalBillableWeekHours.has(billableKey)) {
          totalBillableWeekHours.set(billableKey, totalBillableWeekHours.get(billableKey) + HoursSpent);
        }
      });

      return [Array.from(totalWeekHours.values()), Array.from(dates.map((date) => totalBillableWeekHours.get(`${date}-true`)))];
    }
  }

  private async decodeJwt(): Promise<void> {
    this.getTimesheetDetail();
    this.getHolidays();
    this.apiService.getAll(Api.Employee).subscribe((data: Employee[]) => (this.employee = data.length));
    
  }

  private getCurrentUserId(): number {
    return Number(this.authService.loginId());
  }

  onNavChange(changeEvent: NgbNavChangeEvent): void {
    switch (changeEvent.nextId) {
      case 1:
        this.getTimeSheetDetails(this.AllTimesheetDetail, false);
        break;
      case 2:
        this.getTimeSheetDetails(this.AllTimesheetDetail, true);
        break;
    }
  }

  monthOptions = {
    chart: { height: 450, type: 'area', toolbar: { show: true } },
    dataLabels: {
      enabled: true,
      formatter: function (value) {
        return value + ' h';
      }
    },
    colors: ['#1890ff', '#13c2c2'],
    series: [{ name: 'Page Views', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] }
  };

  weekOptions = {
    chart: { height: 450, type: 'area', toolbar: { show: true } },
    dataLabels: {
      enabled: true,
      formatter: function (value) {
        return value + ' h';
      }
    },
    colors: ['#1890ff', '#13c2c2'],
    series: [
      { name: 'Working Hours', data: [0, 0, 0, 0, 0, 0, 0] },
      { name: 'Billable Hours', data: [0, 0, 0, 0, 0, 0, 0] }
    ],
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }
  };
}
