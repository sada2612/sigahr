import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../module/shared.module';
import { AnnouncementComponent } from '../announcement/announcement.component';
import { ApiService } from '../../service/api/api-service.service';
import { Api, UserRole } from '../../enum/enum';
import { Announcement, AuthResponse, Employee, Event } from '../../datatypes/DataTypes';
import { AlertService } from '../../service/alert/alert.service';
import { AuthService } from '../../service/authitication/auth.service';
import { FormComponent } from '../form/form.component';
import { announcementfields, eventfields } from '../../constantss/const';

@Component({
  selector: 'app-events',
  standalone: true,
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  imports: [CommonModule, SharedModule, AnnouncementComponent, FormComponent]
})
export default class EventsComponent {
  @ViewChild('eventModal') eventModalRef!: ElementRef;
  @ViewChild('announcementModal') announcementModalRef!: ElementRef;
  selectedAnnouncement: Announcement | null = null;
  selectedFile: File;
  updateState: boolean;
  FileUrl: string = 'assets/images/user/avatar-2.jpg';
  events: Event[];
  eventId: Event = null;
  selectedEvent: Event | null = null;
  actionLink = false;
  employees: Employee[] = [];
  currentUser: AuthResponse;
  userRole = UserRole;
  private eventModal: any;
  private announcementModal: any;
  announcements: Announcement[] = [];
  announcementfields = [...announcementfields];
  eventfields = [...eventfields];
  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.currentUser = this.authService.loginUser();
    this.getEvents();
  }
  ngAfterViewInit() {
    if (typeof (window as any).bootstrap !== 'undefined') {
      this.eventModal = new (window as any).bootstrap.Modal(this.eventModalRef.nativeElement);
      this.announcementModal = new (window as any).bootstrap.Modal(this.announcementModalRef.nativeElement);
    } else {
      console.error('Bootstrap JavaScript is not loaded.');
    }
  }
  async getAnnouncement() {
    this.apiService.getAll(Api.Announcement).subscribe((data) => (this.announcements = data));
  }
  async getEvents() {
    this.apiService.getAll(Api.Event).subscribe((data) => {
      this.events = data;
      this.getAnnouncement();
    });
  }

  closeModel() {
    this.eventModal.hide();
    this.announcementModal.hide();
    this.selectedEvent = null;
    this.selectedAnnouncement = null;
  }
  openEventModal(event?: Event) {
    this.selectedEvent = event ? { ...event } : new Event();
    this.eventModal.show();
  }

  openAnnouncementModal(announcement?: Announcement) {
    this.selectedAnnouncement = announcement ? { ...announcement } : new Announcement();
    this.announcementModal.show();
  }

  async onAnnouncementSaved(announcement: Announcement) {
    if (announcement.AnnouncementId) {
      await this.updateAnnouncement(announcement);
    } else {
      await this.addAnnouncement(announcement);
    }
  }

  async onEventSaved(event: Event) {
    if (event.EventId) {
      await this.updateEvent(event);
    } else {
      await this.addEvent(event);
    }
  }

  private async addAnnouncement(announcement: Announcement) {
    console.log(announcement);

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
  deleteEvent(eventId) {
    this.apiService.delete(Api.Event, eventId).subscribe((data) => {
      if (data.IsValid) {
        this.alertService
          .Toast()
          .fire({ icon: 'success', title: 'Event Deleted Successfully' })
          .then(async (data) => (data.dismiss ? await this.getEvents() : ''));
      }
    });
  }

  private async addEvent(event: Event) {
    this.apiService.post(Api.Event, event).subscribe(async (data) => {
      if (data.IsValid) {
        if (event.NewFile) {
          await this.upload(event!.Name, event.NewFile);
        } else {
          this.getEvents().then(() => this.closeModel());
        }
      }
    });
  }

  private async updateEvent(event: Event) {
    this.apiService.update(Api.Event, event).subscribe(async (data) => {
      if (data.IsValid) {
        if (event.NewFile) {
          await this.upload(event!.Name, event.NewFile);
        } else {
          this.getEvents().then(() => this.closeModel());
        }
      }
    });
  }

  private async upload(fileName: string, file: File) {
    this.apiService.upload(Api.Event, fileName, file).subscribe(() => this.getEvents().then(() => this.closeModel()));
  }
}
