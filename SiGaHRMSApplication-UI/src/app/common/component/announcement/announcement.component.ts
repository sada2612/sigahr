import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../module/shared.module';
import { ApiService } from '../../service/api/api-service.service';
import { Api, UserRole } from '../../enum/enum';
import { Announcement, AuthResponse } from '../../datatypes/DataTypes';
import { AlertService } from '../../service/alert/alert.service';
import { AuthService } from '../../service/authitication/auth.service';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent {
  @Input() announcements: Announcement[] = [];
  @Output() onUpdate = new EventEmitter<Announcement>();
  @Output() onDelete = new EventEmitter();
  selectedAnnouncement: Announcement | null = null;
  currentUser: AuthResponse;
  userRole = UserRole;
  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.currentUser = this.authService.loginUser();
  }
  async updateAnnouncement(announcement: Announcement) {
    this.onUpdate.emit(announcement);
  }

  deleteAnnouncement(id) {
    this.apiService.delete(Api.Announcement, id).subscribe((data) => {
      if (data.IsValid) {
        this.alertService
          .Toast()
          .fire({ icon: 'success', title: 'Announcement Deleted Successfully' })
          .then((data) => (data.dismiss ? this.onDelete.emit() : ''));
      }
    });
  }
}
