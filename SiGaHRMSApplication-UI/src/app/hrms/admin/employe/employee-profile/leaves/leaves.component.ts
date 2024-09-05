import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Employee, LeaveRequest, RequestDto } from 'src/app/common/datatypes/DataTypes';
import { Api, LeaveRequestStatus } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexStroke,
  NgApexchartsModule
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [CommonModule, SharedModule, NgApexchartsModule],
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent {
  @Input() employee: Employee;
  public chartOptions: Partial<ChartOptions>;
  leaveBalance: any;
  totalAssignLeaves: any;
  totalAvailedLeaves: any;
  totalAvailableLeaves: number;

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe
  ) {
    this.chartOptions = {
      series: [
        {
          name: 'Example Data',
          data: []
        }
      ],
      chart: {
        type: 'scatter',
        height: 350
      },
      xaxis: {
        categories: Array.from({ length: 31 }, (_, i) => i + 1),
        title: {
          text: 'Days'
        }
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months[value - 1];
          }
        },
        title: {
          text: 'Months'
        }
      },
      title: {
        text: 'Leaves Chart',
        align: 'center'
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        width: 1,
        colors: ['#008FFB']
      }
    };
  }
  ngOnInit() {
    this.getLeaveBalance();
  }
  getLeaveBalance() {
    !this.leaveBalance
      ? this.apiService
          .get(Api.LeaveBalance, this.employee.EmployeeId)
          .subscribe((data) => ((this.leaveBalance = data), this.calculateTotals()))
      : '';
  }

  calculateTotals() {
    if (this.leaveBalance) {
      this.totalAssignLeaves =
        this.leaveBalance.EarnedLeaves +
        this.leaveBalance.CasualLeaves +
        this.leaveBalance.SickLeaves +
        (this.employee.Gender === 'Male' ? this.leaveBalance.PaternityLeaves : this.leaveBalance.MaternityLeaves) +
        this.leaveBalance.CompensatoryOffs +
        this.leaveBalance.MarriageLeaves +
        this.leaveBalance.BereavementLeaves +
        this.leaveBalance.LossofPayLeaves;

      this.totalAvailedLeaves =
        this.leaveBalance.EarnedLeavesAvailaed +
        this.leaveBalance.CasualLeavesAvailaed +
        this.leaveBalance.SickLeavesAvailaed +
        (this.employee.Gender === 'Male' ? this.leaveBalance.PaternityLeavesAvailaed : this.leaveBalance.MaternityLeavesAvailaed) +
        this.leaveBalance.CompensatoryOffsAvailaed +
        this.leaveBalance.MarriageLeavesAvailaed +
        this.leaveBalance.BereavementLeavesAvailaed +
        this.leaveBalance.LossofPayLeavesAvailaed;

      this.totalAvailableLeaves = this.totalAssignLeaves - this.totalAvailedLeaves;
    }
    this.getLeaves();
  }

  getLeaves() {
    const currentYear = new Date().getFullYear();
    const startOfYear = this.datePipe.transform(new Date(currentYear, 0, 1), 'yyyy-MM-dd');
    const endOfYear = this.datePipe.transform(new Date(currentYear, 11, 1), 'yyyy-MM-dd');

    this.apiService
      .getByDate(Api.LeaveRequest, new RequestDto(this.employee.EmployeeId, startOfYear, endOfYear))
      .subscribe((data: LeaveRequest[]) => {
        const leaves = new Map<string, any>();

        data.forEach((e) => {
          const key = e.LeaveType;
          if (!leaves.has(key)) {
            leaves.set(key, { Leave: [] });
          }

          if (e.LeaveRequestStatus == LeaveRequestStatus.Approved) {
            const fromDate = new Date(e.FromDate);
            const toDate = new Date(e.ToDate);

            let currentDate = new Date(fromDate);
            while (currentDate <= toDate) {
              const month = currentDate.getMonth();
              const day = currentDate.getDate();
              leaves.get(key).Leave.push([month + 1, day]);
              currentDate.setDate(currentDate.getDate() + 1);
            }
          }
        });
        const series = Array.from(leaves.entries()).map(([key, value]) => {
          return {
            name: key,
            data: value.Leave.map(([month, day]) => ({ x: day, y: month }))
          };
        });
        this.chartOptions.series = series;
      });
  }
}
