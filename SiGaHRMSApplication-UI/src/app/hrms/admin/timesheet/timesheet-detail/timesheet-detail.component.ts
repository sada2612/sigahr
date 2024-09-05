import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import {
  Client,
  Employee,
  Project,
  RequestDto,
  TaskName,
  TimeSheet,
  TimeSheetDetail,
  taskTypeOptions
} from 'src/app/common/datatypes/DataTypes';
import { Api, TimeSheetStatus } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthService } from 'src/app/common/service/authitication/auth.service';
import { DayTaskFormComponent } from './day-task-form/day-task-form.component';
import { CommonService } from 'src/app/common/service/common/common.service';
import { taskFields } from 'src/app/common/constantss/const';
import { FormComponent } from '../../../../common/component/form/form.component';

class DaySheet {
  Task: TaskName;
  Time: number = 0;
  Date: any;
  EmployeeId: number;
  TimeSheetDetail: TimeSheetDetail[] = [];
  TimeSheetId: number = null;
}
@Component({
  selector: 'app-timesheet-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, DayTaskFormComponent, FormComponent],
  templateUrl: './timesheet-detail.component.html',
  styleUrls: ['./timesheet-detail.component.scss']
})
export class TimesheetDetailComponent {
  @ViewChild('dayTaskModal') dayTaskModalRef!: ElementRef;
  @ViewChild('taskModal') taskModalRef!: ElementRef;
  @Input() timeSheet: TimeSheet = new TimeSheet();
  selectedDayTask: DaySheet | null = null;
  taskTypeOptions = taskTypeOptions;
  timeSheetDetails: TimeSheetDetail[] = [];
  timeSheetDetail: TimeSheetDetail = new TimeSheetDetail();
  TimeSheetStatus = TimeSheetStatus;
  employeeId: number;
  taskArray: any[] = [];
  date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  dates = [];
  private dayTaskModal: any;
  private taskModal: any;
  taskFields = taskFields;
  selectedTask: TaskName | null = null;
  clientOptions: { value: number; label: string }[];
  projectOptions: { value: number; label: string }[];

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    private authService: AuthService,
    private commonService: CommonService
  ) {}
  async ngOnInit() {
    !this.timeSheet.Employee
      ? await this.getEmployee()
      : ((this.employeeId = this.timeSheet.EmployeeId), (this.date = this.timeSheet.TimesheetDate), await this.getTimesheetDetail());
  }
  ngAfterViewInit() {
    if (typeof (window as any).bootstrap !== 'undefined') {
      this.dayTaskModal = new (window as any).bootstrap.Modal(this.dayTaskModalRef.nativeElement);
      this.taskModal = new (window as any).bootstrap.Modal(this.taskModalRef.nativeElement);
    }
  }
  closeModel() {
    this.taskModal.hide();
    this.selectedTask = null;
    this.dayTaskModal.hide();
    this.selectedDayTask = null;
  }
  openModal(daySheet?: DaySheet) {
    this.selectedDayTask = daySheet ? { ...daySheet } : null;
    this.dayTaskModal.show();
  }

  openTaskModal(task?: TaskName) {
    this.selectedTask = task ? { ...task } : new TaskName();
    this.setOptions();
    this.taskModal.show();
  }
  async onSaved() {
    await this.getTimesheetDetail().then(() => this.closeModel());
  }
  async getEmployee() {
    this.apiService.get(Api.Employee, this.authService.loginId()).subscribe(async (employee: Employee) => {
      this.timeSheet.Employee = employee;
      this.employeeId = employee.EmployeeId;
      this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      await this.getTimesheetDetail();
    });
  }
  async getTimesheetDetail() {
    const { startOfWeek, endOfWeek } = this.getWeekRange(this.date);
    this.dates = this.commonService.getMiddleDates(new Date(startOfWeek), new Date(endOfWeek));
    await this.fetchTimeSheetDetails(this.employeeId, startOfWeek, endOfWeek);
  }
  onTaskSaved(task?: TaskName) {
    if (task.TaskId) {
      this.updateTask(task);
    } else {
      this.addTask(task);
    }
  }
  async fetchTimeSheetDetails(employeeId: number, startDate: string, endDate: string) {
    this.apiService.getByDate(Api.TimesheetDetail, new RequestDto(employeeId, startDate, endDate)).subscribe((data: TimeSheetDetail[]) => {
      const taskMap: { [key: string]: TimeSheetDetail[] } = {};

      data.forEach((item) => {
        if (!taskMap[item.Task.TaskDetails]) {
          taskMap[item.Task.TaskDetails] = [];
        }
        taskMap[item.Task.TaskDetails].push(item);
      });

      const daySheetMap: { [key: string]: DaySheet[] } = {};

      for (let taskDetails in taskMap) {
        this.dates.forEach((date) => {
          if (!daySheetMap[taskDetails]) {
            daySheetMap[taskDetails] = [];
          }
          const daySheet = new DaySheet();
          daySheet.Task = taskMap[taskDetails][0].Task;
          daySheet.Date = date;
          daySheet.EmployeeId = this.employeeId;
          daySheetMap[taskDetails].push(daySheet);
        });
      }

      for (let taskDetails in taskMap) {
        taskMap[taskDetails].forEach((detail) => {
          daySheetMap[taskDetails].forEach((daySheet) => {
            if (daySheet.Task.TaskId === detail.TaskId && daySheet.Date === detail.Timesheet.TimesheetDate) {
              daySheet.TimeSheetId = detail.TimesheetId;
              daySheet.Time += detail.HoursSpent;
              daySheet.TimeSheetDetail.push(detail);
            }
          });
        });
      }
      this.taskArray = Object.values(daySheetMap);
    });
    this.getOptions();
  }
  getOptions() {
    this.apiService.getAll(Api.Client).subscribe((clients: Client[]) => {
      this.clientOptions = clients.map((client) => ({
        value: client.ClientId,
        label: client.Name
      }));
    });

    this.apiService.getAll(Api.Project).subscribe((projects: Project[]) => {
      this.projectOptions = projects.map((project) => ({
        value: project.ProjectId,
        label: project.Title
      }));
    });
  }

  setOptions() {
    this.taskFields = this.taskFields.map((field) => {
      if (field.type === 'select') {
        if (field.id == 'projectId') {
          field.options = this.projectOptions;
        } else if (field.id === 'clientId') {
          field.options = this.clientOptions;
        }
      }
      return field;
    });
  }
  getTaskWeekHours(TaskId) {
    const taskArrayMap = new Map();
    this.taskArray.forEach((taskDetailsArray) => {
      taskDetailsArray.forEach((data) => {
        const id = data.Task.TaskId;
        const currentHours = taskArrayMap.get(id) || 0;
        taskArrayMap.set(id, currentHours + data.Time);
      });
    });
    return taskArrayMap.get(TaskId) || 0;
  }

  getDayHours(date: any) {
    const dateHoursMap = new Map();
    this.taskArray.forEach((taskDetailsArray) => {
      taskDetailsArray.forEach((data) => {
        const taskDate = data.Date;
        const currentHours = dateHoursMap.get(taskDate) || 0;
        dateHoursMap.set(taskDate, currentHours + data.Time);
      });
    });
    return (dateHoursMap.get(date) || 0).toFixed(2);
  }

  navigate(data) {
    const offset = data ? 7 : -7;
    const currentDate = new Date(this.date);
    currentDate.setDate(currentDate.getDate() + offset);
    this.date = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    this.taskArray = [];
    this.getTimesheetDetail();
  }

  getWeekRange(date: any) {
    return this.commonService.getWeekRange(new Date(date));
  }

  async addTask(task: TaskName) {
    this.apiService.post(Api.TaskName, task).subscribe(async (data) => {
      if (data.IsValid) {
        this.onSaved();
      }
    });
  }

  async updateTask(task: TaskName) {
    this.apiService.update(Api.TaskName, task).subscribe(async (data) => {
      if (data.IsValid) {
        this.onSaved();
      }
    });
  }
}
