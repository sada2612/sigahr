import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { TaskName, taskTypeOptions, TimeSheetDetail } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthService } from 'src/app/common/service/authitication/auth.service';

class DaySheet {
  Task: TaskName;
  Time: number = 0;
  Date: any = null;
  EmployeeId: number;
  TimeSheetDetail: TimeSheetDetail[] = [];
  TimeSheetId: number | null = null;
}

@Component({
  selector: 'app-day-task-form',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule],
  templateUrl: './day-task-form.component.html',
  styleUrls: ['./day-task-form.component.scss']
})
export class DayTaskFormComponent implements OnChanges {
  @Input() daySheet: DaySheet | null = null;
  @Output() onSave = new EventEmitter<void>();
  @Input() employeeId: number;
  taskTypeOptions = taskTypeOptions;
  originalDaySheet: DaySheet = new DaySheet();
  loginId: number;

  newSheet: TimeSheetDetail = new TimeSheetDetail();

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.loginId = this.authService.loginId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['daySheet'] && changes['daySheet'].currentValue) {
      this.onDaySheetChange(changes['daySheet'].currentValue);
    }
  }

  onDaySheetChange(newValue: DaySheet): void {
    this.originalDaySheet = this.deepCopy(newValue);
  }

  addNewSheet(): void {
    if (this.daySheet && this.newSheet.TaskType) {
      this.daySheet.TimeSheetDetail.push({ ...this.newSheet });
      this.newSheet = new TimeSheetDetail();
    }
  }

  deepCopy(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  removeSheet(sheet: TimeSheetDetail): void {
    if (this.daySheet) {
      this.daySheet.TimeSheetDetail = this.daySheet.TimeSheetDetail.filter((s) => s != sheet);
    }
  }

  saveChanges(): void {
    if (!this.hasChanges()) {
      return;
    }
    if (this.daySheet) {
      const updatedOrNewSheets = this.getUpdatedOrNewSheets(this.daySheet, this.originalDaySheet);
      if (updatedOrNewSheets.length > 0) {
        const apiCalls = updatedOrNewSheets.map((sheet) => {
          if (sheet.TimeSheetDetailId) {
            return this.apiService.update(Api.TimesheetDetail, sheet).pipe(
              catchError(() => {
                return of(null);
              })
            );
          } else {
            sheet.TimeSheetDate = this.daySheet.Date;
            sheet.TaskId = this.daySheet.Task.TaskId;
            return this.apiService.post(Api.TimesheetDetail, sheet).pipe(
              catchError(() => {
                return of(null);
              })
            );
          }
        });
        forkJoin(apiCalls).subscribe(() => {
          this.onSave.emit();
        });
      }
    }
  }

  getUpdatedOrNewSheets(current: DaySheet, original: DaySheet): TimeSheetDetail[] {
    return current.TimeSheetDetail.filter((currentSheet) => {
      const originalSheet = original.TimeSheetDetail.find(
        (sheet: TimeSheetDetail) => sheet.TimeSheetDetailId === currentSheet.TimeSheetDetailId
      );
      return !originalSheet || this.isSheetUpdated(currentSheet, originalSheet);
    });
  }

  hasChanges(): boolean {
    if (!this.daySheet) return false;
    return this.getUpdatedOrNewSheets(this.daySheet, this.originalDaySheet).length > 0;
  }
  isSheetUpdated(currentSheet: TimeSheetDetail, originalSheet: TimeSheetDetail): boolean {
    return (
      currentSheet.TaskType !== originalSheet.TaskType ||
      currentSheet.HoursSpent !== originalSheet.HoursSpent ||
      currentSheet.IsBillable != originalSheet.IsBillable
    );
  }
}
