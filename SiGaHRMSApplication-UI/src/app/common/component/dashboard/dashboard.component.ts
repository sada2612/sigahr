import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../component/module/shared.module';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthService } from '../../service/authitication/auth.service';
import { Announcement, AuthResponse, Employee, Event, Holiday, OfficeFest } from '../../datatypes/DataTypes';
import { Api, UserRole } from '../../enum/enum';
import { AdminChartComponent } from '../admin-chart/admin-chart.component';
import { UserChartComponent } from '../user-chart/user-chart.component';
import { AnnouncementComponent } from '../announcement/announcement.component';
import { announcementfields } from '../../constantss/const';
import { FormComponent } from '../form/form.component';

class Upcoming {
  ImgUrl: string;
  Title: string;
  Date: any;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, SharedModule, AdminChartComponent, UserChartComponent, AnnouncementComponent, FormComponent]
})
export default class DashboardComponent {
  @ViewChild('announcementModal') announcementModalRef!: ElementRef;
  currentUser: AuthResponse;
  userRole = UserRole;
  private announcementModal: any;
  announcements: Announcement[] = [];
  announcementfields = [...announcementfields];
  selectedAnnouncement: Announcement | null = null;
  base: string = 'http://localhost:5238/';
  selectedFile: File;
  officeFests: OfficeFest[];
  employee: Employee[] = [];
  holidays: Holiday[];
  events: Event[];
  upcomingArray: Upcoming[] = [];
  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.loginUser();
  }
  ngOnInit() {
    this.getAnnouncement();
    this.getOfficeFests();
  }

  private getEmployee() {
    this.apiService
      .getAll(Api.Employee)
      .subscribe(
        (data: Employee[]) => (this.employee = data.sort((a, b) => new Date(a.DateOfBirth).getTime() - new Date(b.DateOfBirth).getTime()))
      );
    this.arrangeUpcoming();
  }

  private arrangeUpcoming() {
    var index = new Date().getMonth();

    while (index <= 11) {
      this.employee.forEach((data: Employee) => {
        if (new Date(data.DateOfBirth).getMonth() === index) {
          var upcoming = new Upcoming();
          upcoming.Date = data.DateOfBirth;
          upcoming.ImgUrl = this.base + data.FileUrl;
          upcoming.Title = `${data.FirstName} ${data.LastName} BirthDay`;
          this.upcomingArray.push(upcoming);
        }
        if (new Date(data.DateOfJoining).getMonth() === index) {
          var upcoming = new Upcoming();
          upcoming.Date = data.DateOfJoining;
          upcoming.ImgUrl = this.base + data.FileUrl;
          upcoming.Title = `${data.FirstName} ${data.LastName} Work Anniversary`;
          this.upcomingArray.push(upcoming);
        }
      });

      this.holidays.forEach((data: Holiday) => {
        if (new Date(data.Date).getMonth() === index && new Date(data.Date).getTime() >= new Date().getTime()) {
          var upcoming = new Upcoming();
          upcoming.Date = data.Date;
          upcoming.ImgUrl = this.base + data.FileUrl;
          upcoming.Title = data.Description;
          this.upcomingArray.push(upcoming);
        }
      });

      this.events.forEach((data: Event) => {
        if (new Date(data.Date).getMonth() === index && new Date(data.Date).getTime() >= new Date().getTime()) {
          var upcoming = new Upcoming();
          upcoming.Date = data.Date;
          upcoming.ImgUrl = this.base + data.FileUrl;
          upcoming.Title = data.Name;
          this.upcomingArray.push(upcoming);
        }
      });

      if (this.upcomingArray.length >= 6) break;

      index++;
      if (index > 11) index = 0;
    }
    console.log(this.upcomingArray);
  }
  private getHolidays() {
    this.apiService.getAll(Api.Holiday).subscribe((holidays: Holiday[]) => {
      this.holidays = holidays.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
      this.getEmployee();
    });
  }

  private getEvent() {
    this.apiService.getAll(Api.Event).subscribe((event: Event[]) => {
      this.events = event.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
      this.getHolidays();
    });
  }

  ngAfterViewInit() {
    if (typeof (window as any).bootstrap !== 'undefined') {
      this.announcementModal = new (window as any).bootstrap.Modal(this.announcementModalRef.nativeElement);
    }
  }
  async getAnnouncement() {
    this.apiService.getAll(Api.Announcement).subscribe((data) => (this.announcements = data));
  }

  async getOfficeFests() {
    this.apiService.getAll(Api.OfficeFest).subscribe((data) => (this.officeFests = data));
    this.getEvent();
  }

  closeModel() {
    this.announcementModal.hide();
    this.selectedAnnouncement = null;
  }
  openAnnouncementModal(announcement?: Announcement) {
    this.selectedAnnouncement = announcement ? { ...announcement } : new Announcement();
    this.announcementModal.show();
  }
  private async addAnnouncement(announcement: Announcement) {
    this.apiService.post(Api.Announcement, announcement).subscribe(async (data) => {
      if (data.IsValid) {
        if (announcement.NewFile) {
          await this.uploadAnnouncement(announcement!.Title, announcement.NewFile);
        } else {
          this.getAnnouncement().then(() => this.closeModel());
        }
      }
    });
  }

  private async updateAnnouncement(announcement: Announcement) {
    this.apiService.update(Api.Announcement, announcement).subscribe(async (data) => {
      if (data.IsValid) {
        if (announcement.NewFile) {
          await this.uploadAnnouncement(announcement!.Title, announcement.NewFile);
        } else {
          this.getAnnouncement().then(() => this.closeModel());
        }
      }
    });
  }

  private async uploadAnnouncement(fileName: string, file: File) {
    this.apiService.upload(Api.Announcement, fileName, file).subscribe(() => this.getAnnouncement().then(() => this.closeModel()));
  }
  async onAnnouncementSaved(announcement: Announcement) {
    if (announcement.AnnouncementId) {
      await this.updateAnnouncement(announcement);
    } else {
      await this.addAnnouncement(announcement);
    }
  }

  transaction = [
    {
      background: 'text-success bg-light-success',
      icon: 'ti ti-gift',
      title: 'Order #002434',
      time: 'Today, 2:00 AM',
      amount: '+ $1,430',
      percentage: '78%'
    },
    {
      background: 'text-primary bg-light-primary',
      icon: 'ti ti-message-circle',
      title: 'Order #984947',
      time: '5 August, 1:45 PM',
      amount: '- $302',
      percentage: '8%'
    },
    {
      background: 'text-danger bg-light-danger',
      icon: 'ti ti-settings',
      title: 'Order #988784',
      time: '7 hours ago',
      amount: '- $682',
      percentage: '16%'
    },
    {
      background: 'text-dark bg-light-secondary',
      icon: 'bi bi-cake',
      title: 'Order #002434',
      time: 'Today, 2:00 AM',
      amount: '+ $1,430',
      percentage: '78%'
    },
    {
      background: 'text-info bg-light-info',
      icon: 'ti ti-confetti',
      title: 'Order #984947',
      time: '5 August, 1:45 PM',
      amount: '- $302',
      percentage: '8%'
    },
    {
      background: 'text-warning bg-light-warning',
      icon: 'ti ti-bell-ringing',
      title: 'Order #988784',
      time: '7 hours ago',
      amount: '- $682',
      percentage: '16%'
    }
  ];
}
