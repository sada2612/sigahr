import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { documentfields } from 'src/app/common/constantss/const';
import { AuthResponse, OfficeFest } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthService } from 'src/app/common/service/authitication/auth.service';
import { FormComponent } from '../../../common/component/form/form.component';

@Component({
  selector: 'app-officefest',
  standalone: true,
  imports: [CommonModule, SharedModule, FormComponent],
  templateUrl: './officefest.component.html',
  styleUrls: ['./officefest.component.scss']
})
export default class OfficefestComponent {
  @ViewChild('officeFestModal') officeFestModalRef!: ElementRef;
  @ViewChild('officeFestsModal') officeFestsModalRef!: ElementRef;
  selectedOfficeFest: OfficeFest | null = null;
  base: string = 'http://localhost:5238/';
  documentfields = [...documentfields];
  officeFests: OfficeFest[] = [];
  officeFestModal: any;
  officeFestsModal: any;
  selectedOfficeFests: OfficeFest;
  selectedFiles: File[] = []; 
  fileUrls: string[] = [];
  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.getOfficeFests();
  }

  ngAfterViewInit() {
    if (typeof (window as any).bootstrap !== 'undefined') {
      this.officeFestModal = new (window as any).bootstrap.Modal(this.officeFestModalRef.nativeElement);
      this.officeFestsModal = new (window as any).bootstrap.Modal(this.officeFestsModalRef.nativeElement);
    }
  }

  async getOfficeFests() {
    this.apiService.getAll(Api.OfficeFest).subscribe((data) => (this.officeFests = data));
  }

  closeModel() {
    this.officeFestModal.hide();
    this.selectedOfficeFest = null;
    this.officeFestsModal.hide();
    this.selectedOfficeFests = null;
  
  }

  openOfficeFestModal() {
    this.selectedOfficeFest = new OfficeFest();
    this.officeFestModal.show();
  }
  openOfficeFestsModal(officeFest?: OfficeFest) {
    this.selectedOfficeFests = document ? officeFest : new OfficeFest();
    this.officeFestsModal.show();
  }

  onFilesSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files); // Get all selected files
    this.fileUrls = this.selectedFiles.map(file => URL.createObjectURL(file)); // Generate URLs for preview
  }

  async addDocument(officeFest: OfficeFest) {
    this.apiService.post(Api.OfficeFest, officeFest).subscribe(async (data) => {
      if (data.IsValid) {
        if (this.selectedFiles.length) {
          await this.uploadDocuments(officeFest.OfficeFestName, this.selectedFiles);
        } else {
          this.getOfficeFests().then(() => this.closeModel());
        }
      }
    });
  }

  deleteOfficeFest(id){
    this.apiService.delete(Api.OfficeFest, id).subscribe(async (data) => {
      if (data.IsValid) {
        this.getOfficeFests().then(() => this.closeModel())
      }
    });
  }
  private async uploadDocuments(fileName: string, files: any[]) {
    this.apiService.upload(Api.OfficeFest, fileName, files).subscribe(() =>
      this.getOfficeFests().then(() => this.closeModel())
    );
  }
}
