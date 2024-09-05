import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { TimesheetDetailComponent } from "../../admin/timesheet/timesheet-detail/timesheet-detail.component";

@Component({
  selector: 'app-user-timesheet',
  standalone: true,
  templateUrl: './user-timesheet.component.html',
  styleUrls: ['./user-timesheet.component.scss'],
  imports: [CommonModule, SharedModule, TimesheetDetailComponent]
})
export default class UserTimesheetComponent {
  
}
