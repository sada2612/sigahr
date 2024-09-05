import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../module/shared.module';
import { AuthResponse, Holiday, RequestDto } from '../../datatypes/DataTypes';
import { ApiService } from '../../service/api/api-service.service';
import { Api, UserRole } from '../../enum/enum';
import { AlertService } from '../../service/alert/alert.service';
import { AuthService } from '../../service/authitication/auth.service';
import { FormComponent } from '../form/form.component';
import { holidayfields } from '../../constantss/const';

@Component({
  selector: 'app-holiday',
  standalone: true,
  imports: [CommonModule, SharedModule, FormComponent],
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss']
})
export default class HolidayComponent {
  @ViewChild('holidayModal') holidayModalRef!: ElementRef;
  selectedHoliday: Holiday | null = null;
  holidays: Holiday[];
  userRole = UserRole;
  from: any = this.datePipe.transform(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd');
  to: any = this.datePipe.transform(new Date(new Date().getFullYear(), 11, 31), 'yyyy-MM-dd');
  currentUser: AuthResponse;
  updateState: boolean = false;
  modal: any;
  holidayfields = [...holidayfields];

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    private alertService: AlertService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.loginUser();
    this.getHoliday();
  }

  getHoliday() {
    this.apiService.getByDate(Api.Holiday, new RequestDto(null, this.from, this.to)).subscribe((data) => {
      this.holidays = data;
    });
  }

  ngAfterViewInit() {
    if (typeof (window as any).bootstrap !== 'undefined') {
      this.modal = new (window as any).bootstrap.Modal(this.holidayModalRef.nativeElement);
    } else {
      console.error('Bootstrap JavaScript is not loaded.');
    }
  }

  openModal(holiday?: Holiday): void {
    this.selectedHoliday = holiday ? { ...holiday } : new Holiday();
    this.modal.show();
  }

  closeModal(): void {
    this.modal.hide();
    this.selectedHoliday = null;
  }

  async onHolidaySaved(holiday: Holiday) {
    console.log(holiday);
    
    if (holiday.HolidayId) {
      await this.updateHoliday(holiday);
    } else {
      await this.addHoliday(holiday);
    }
  }

  private async addHoliday(holiday: Holiday) {
    this.apiService.post(Api.Holiday, holiday).subscribe(async (data) => {
      if (data.IsValid) {
        if (holiday.NewFile) {
          await this.upload(holiday!.Description, holiday.NewFile);
        }else{
          this.getHoliday()
          this.closeModal()
        }
      }
    });
  }

  private async updateHoliday(holiday: Holiday) {
    this.apiService.update(Api.Holiday, holiday).subscribe(async (data) => {
      if (data.IsValid) {
        if (holiday.NewFile) {
          await this.upload(holiday!.Description, holiday.NewFile);
        }else{
          this.getHoliday()
          this.closeModal()
        }
      }
    });
  }

  private async upload(fileName: string, file: File) {
    this.apiService.upload(Api.Holiday, fileName, file).subscribe((res)=>res.IsValid?(this.getHoliday(),this.closeModal()):'');
  }

  async deleteHoliday(holidayId: number) {
    this.apiService.delete(Api.Holiday, holidayId).subscribe((data) => {
      if (data.IsValid) {
        this.getHoliday()
      }
    });
  }
}
