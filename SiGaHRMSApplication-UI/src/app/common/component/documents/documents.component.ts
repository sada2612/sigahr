import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { documentfields } from 'src/app/common/constantss/const';
import { AuthResponse, DocumentDto } from 'src/app/common/datatypes/DataTypes';
import { Api, UserRole } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { FormComponent } from '../form/form.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../service/authitication/auth.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, SharedModule, FormComponent],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export default class DocumentsComponent {
  @ViewChild('documentModal') documentModalRef!: ElementRef;
  @ViewChild('documentsModal') documentsModalRef!: ElementRef;
  selectedDocument: DocumentDto | null = null;
  documents;
  userRole = UserRole;
  loginUser: AuthResponse;
  base: string = 'http://localhost:5238/';
  private documentModal;
  private documentsModal;
  documentfields = [...documentfields];
  selectedDocuments: any | null = [];
  sanitizedFileUrl: SafeResourceUrl ;
  deleteId: any;
  fileType: any;
  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.loginUser = this.authService.loginUser();
    this.getDocuments();
  }
  ngAfterViewInit() {
    if (typeof (window as any).bootstrap !== 'undefined') {
      this.documentModal = new (window as any).bootstrap.Modal(this.documentModalRef.nativeElement);
      this.documentsModal = new (window as any).bootstrap.Modal(this.documentsModalRef.nativeElement);
    }
  }
  async getDocuments() {
    if (this.loginUser.role == this.userRole.HR || this.loginUser.role == this.userRole.SUPER_ADMIN) {
      this.apiService
        .getAll(Api.Document)
        .subscribe((data) => ((this.documents = this.groupDocumentsByEmployeeId(data)), console.log(this.documents)));
    } else {
      this.apiService
        .get(Api.Document, this.loginUser.employeeId)
        .subscribe((data) => ((this.documents = this.groupDocumentsByEmployeeId(data)), console.log(this.documents)));
    }
  }
  closeModel() {

      this.sanitizedFileUrl = null;

      this.documentModal.hide();
      this.selectedDocument = null;
      this.documentsModal.hide();
      this.selectedDocuments = [];

  }
  openDocumentModal(document?: DocumentDto) {
    this.documents;
    this.selectedDocument = document ? { ...document } : new DocumentDto();
    this.documentModal.show();
  }

  openDocumentsModal(document?: DocumentDto[]) {
    this.documents;
    this.selectedDocuments = document ? document : [];
    this.documentsModal.show();
  }

  groupDocumentsByEmployeeId(documents: DocumentDto[]): DocumentDto[][] {
    const employeeGroups = new Map<number, DocumentDto[]>();
    documents.forEach((doc) => {
      if (!employeeGroups.has(doc.EmployeeId)) {
        employeeGroups.set(doc.EmployeeId, []);
      }
      employeeGroups.get(doc.EmployeeId)!.push(doc);
    });
    return Array.from(employeeGroups.values());
  }

  openIFrame(document: DocumentDto): void {
    this.deleteId = document.DocumentId;
    this.sanitizedFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.base + document.FileUrl);
    console.log(this.sanitizedFileUrl);
    
    this.fileType=this.getType(document.FileUrl);
  }
  getType(fileUrl) {
    console.log(fileUrl);
    
    const fileExtension = fileUrl.split('.').pop().toLowerCase();
    console.log(fileExtension);
    
    if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
      return 'image';
    }
    return fileExtension;
  }

  async onDocumentSaved(document: DocumentDto) {
    if (document.DocumentId) {
      await this.updateDocument(document);
    } else {
      await this.addDocument(document);
    }
  }

  private async addDocument(document: DocumentDto) {
    this.apiService.post(Api.Document, document).subscribe(async (data) => {
      if (data.IsValid) {
        if (document.NewFile) {
          await this.uploadDocument(document!.DocumentName, document.NewFile);
        } else {
          this.getDocuments().then(() => this.closeModel());
        }
      }
    });
  }

  private async updateDocument(document: DocumentDto) {
    this.apiService.update(Api.Document, document).subscribe(async (data) => {
      if (data.IsValid) {
        if (document.NewFile) {
          await this.uploadDocument(document!.DocumentName, document.NewFile);
        } else {
          this.getDocuments().then(() => this.closeModel());
        }
      }
    });
  }

  private async uploadDocument(fileName: string, file: File) {
    this.apiService.upload(Api.Document, fileName, file).subscribe(() => this.getDocuments().then(() => this.closeModel()));
  }

  deleteDocument(id){
    this.apiService.delete(Api.Document, id).subscribe(async (data) => {
      if (data.IsValid) {
        this.getDocuments().then(() => this.closeModel())
      }
    });
  }
}
