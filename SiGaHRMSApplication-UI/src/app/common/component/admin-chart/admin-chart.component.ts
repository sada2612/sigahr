import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../module/shared.module';
import { CommonModule, DatePipe } from '@angular/common';
import { ApiService } from '../../service/api/api-service.service';
import { Api, BillingType, LeaveRequestStatus } from '../../enum/enum';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Attendance, LeaveRequest, RequestDto, TimeSheetDetail } from '../../datatypes/DataTypes';
import { CommonService } from '../../service/common/common.service';
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
  selector: 'app-admin-chart',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule, CommonModule, ClockComponent],
  templateUrl: './admin-chart.component.html',
  styleUrls: ['./admin-chart.component.scss']
})
export class AdminChartComponent {
  @ViewChild('chart') chart: ChartComponent;
  projects: any;
  today = new Date();
  Billing: any = null;
  monthChart: ApexCharts;
  weekChart: ApexCharts;
  chartOptions: Partial<ChartOptions>;
  AllProjectBiling: Map<string, any[]>;
  AllTimesheetDetail: TimeSheetDetail[] = [];
  BillingTypeEnum = BillingType;
  attendanceCount: number = 0;
  pendingleaveRequest: number = 0;
  todayApprovedLeave: number = 0;

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private datePipe: DatePipe
  ) {
    this.getProject();
  }
  ngOnInit() {
    this.getTimesheetDetail();
  }
  getProject() {
    const transformedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.apiService.getAll(Api.Project).subscribe((data) => {
      this.projects = data;
    });

    this.apiService.getByDate(Api.Attendance, new RequestDto(null, transformedDate, transformedDate)).subscribe((data: Attendance[]) => {
      this.attendanceCount = new Set(data.map((data) => data.EmployeeId)).size;
    });

    this.apiService.getByDate(Api.LeaveRequest, new RequestDto(null, transformedDate, null)).subscribe((data: LeaveRequest[]) => {
      this.pendingleaveRequest = data.filter((leave) => leave.LeaveRequestStatus == LeaveRequestStatus.Open).length;
      console.log('LeaveRequest', data);

      this.todayApprovedLeave = data.filter(
        (leave) =>
          leave.LeaveRequestStatus == LeaveRequestStatus.Approved &&
          new Date(leave.FromDate).getTime() <= new Date().getTime() &&
          new Date(leave.ToDate).getTime() <= new Date().getTime()
      ).length;
    });
  }

  fetch() {
    const isMonthly = this.AllProjectBiling.get('All').length > 7;
    const options = isMonthly ? this.monthOptions : this.weekOptions;
    const chartSelector = isMonthly ? '#admin-chart-1' : '#admin-chart';
    options.series = [
      { name: 'Total', data: this.AllProjectBiling.get('All') },
      { name: this.Billing, data: this.AllProjectBiling.get(this.Billing) }
    ];
    this.renderChart(chartSelector, options);
  }

  private aggregateBilling(data: TimeSheetDetail[], month: boolean): number[] {
    if (!data.length) return [];

    if (!data[0].Task.Project) return [];

    const { BillingType, RateUSD } = data[0].Task.Project;
    const isHourlyBilling = BillingType === this.BillingTypeEnum.Hourly;
    const isWeeklyBilling = BillingType === this.BillingTypeEnum.Weekly;
    const rateMultiplier = isHourlyBilling ? RateUSD : isWeeklyBilling ? RateUSD / 40 : 0;

    const currentYear = new Date().getFullYear();
    const { startOfWeek, endOfWeek } = this.commonService.getWeekRange(new Date());
    const dates = month
      ? this.commonService.getMiddleDates(new Date(currentYear, 0, 1), new Date(currentYear, 11, 31))
      : this.commonService.getMiddleDates(startOfWeek, endOfWeek);

    const totalHours = new Map<string, number>();
    dates.forEach((date) => {
      const key = month ? `${new Date(date).getMonth()}-true` : `${date}-true`;
      totalHours.set(key, 0);
    });

    data.forEach(({ Timesheet: { TimesheetDate }, IsBillable, HoursSpent }) => {
      const dateKey = new Date(TimesheetDate);
      const key = month ? `${dateKey.getMonth()}-${IsBillable}` : `${TimesheetDate}-${IsBillable}`;
      if (totalHours.has(key)) {
        totalHours.set(key, (totalHours.get(key) || 0) + HoursSpent);
      }
    });

    return Array.from(totalHours.values()).map((hours) => parseFloat(((hours || 0) * rateMultiplier).toFixed(2)));
  }

  getTimesheetDetail() {
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear}-01-01`;
    const endDate = `${currentYear}-12-31`;

    this.apiService.getByDate(Api.TimesheetDetail, new RequestDto(null, startDate, endDate)).subscribe((data: TimeSheetDetail[]) => {
      this.AllTimesheetDetail = data;
      this.getTimeSheetBilling(data, false);
    });
  }
  getTimeSheetBilling(data: TimeSheetDetail[], month = false) {
    if (data.length === 0) return new Map();

    const arrays = new Map<string, number[]>();
    const totalBilling = new Array<number>(month ? 12 : 7).fill(0);

    const { startOfWeek, endOfWeek } = this.commonService.getWeekRange(new Date());
    const startOfWeekTime = new Date(startOfWeek).getTime();
    const endOfWeekTime = new Date(endOfWeek).getTime();

    data.forEach((item) => {
      console.log(item);

      const projectTitle = item.Task.Project ? item.Task.Project.Title : null;
      if (projectTitle && !arrays.has(projectTitle)) {
        arrays.set(projectTitle, new Array<number>(month ? 12 : 7).fill(0));
      }

      const timesheetDate = new Date(item.Timesheet.TimesheetDate).getTime();
      if (month || (timesheetDate >= startOfWeekTime && timesheetDate <= endOfWeekTime)) {
        const projectData = arrays.get(projectTitle)!;
        const aggregatedData = this.aggregateBilling([item], month);

        aggregatedData.forEach((amount, index) => {
          projectData[index] += amount;
          totalBilling[index] += amount;
        });
      }
    });

    arrays.set('All', totalBilling);
    this.AllProjectBiling = arrays;

    const chartOptions = month ? this.monthOptions : this.weekOptions;
    chartOptions.series = [{ name: 'Total', data: totalBilling }];
    this.renderChart(month ? '#admin-chart-1' : '#admin-chart', chartOptions);

    return arrays;
  }

  onNavChange(changeEvent: NgbNavChangeEvent): void {
    switch (changeEvent.nextId) {
      case 1:
        this.getTimeSheetBilling(this.AllTimesheetDetail, false);
        break;
      case 2:
        this.getTimeSheetBilling(this.AllTimesheetDetail, true);
        break;
    }
  }

  renderChart(selector: string, options) {
    setTimeout(() => {
      this.weekChart = new ApexCharts(document.querySelector(selector), options);
      this.weekChart.render();
    }, 200);
  }

  monthOptions = {
    chart: { height: 450, type: 'area', toolbar: { show: true } },
    dataLabels: {
      enabled: true,
      formatter: (val) => `$${val.toFixed(2)}`
    },
    colors: ['#1890ff', '#13c2c2'],
    series: [{ name: 'Page Views', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
    tooltip: {
      y: {
        formatter: (val) => `$${val.toFixed(2)}`
      }
    }
  };

  weekOptions = {
    chart: { height: 450, type: 'area', toolbar: { show: true } },
    dataLabels: {
      enabled: true,
      formatter: (val) => `$${val.toFixed(2)}`
    },
    colors: ['#1890ff', '#13c2c2'],
    series: [
      { name: 'Working Hours', data: [0, 0, 0, 0, 0, 0, 0] },
      { name: 'Billable Hours', data: [0, 0, 0, 0, 0, 0, 0] }
    ],
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    tooltip: {
      y: {
        formatter: (val) => `$${val.toFixed(2)}`
      }
    }
  };
}
