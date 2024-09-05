import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { BillingPlatform, Client, Project } from 'src/app/common/datatypes/DataTypes';
import { Api } from 'src/app/common/enum/enum';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { projectFields } from 'src/app/common/constantss/const';
import { FormComponent } from '../../../common/component/form/form.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [SharedModule, CommonModule, FormComponent],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export default class ProjectComponent {
  @ViewChild('projectModal') projectModalRef!: ElementRef;
  projectFields = [...projectFields];
  projects: Project[] = [];
  clients: Client[] = [];
  active: any;
  from: any;
  to: any;
  updateId: any;
  billingPlatforms: BillingPlatform[] = [];
  private projectModal: any;
  selectedProject: Project | null = null;

  constructor(private apiService: ApiService) {
    
  }

  ngOnInit(){
    this.getProjects();
    this.getBillingPlatforms();
  }
 async getProjects() {
    this.apiService.getAll(Api.Project).subscribe((data) => {
      this.projects = data;
    });
  }

  getClient() {
    this.apiService.getAll(Api.Client).subscribe((data) => {
      this.clients = data;
      this.getOptions();
    });
  }
  getBillingPlatforms() {
    this.apiService.getAll(Api.BillingPlatform).subscribe((data) => {
      this.billingPlatforms = data;
      this.getClient();
    });
  }
  ngAfterViewInit() {
    if ((window as any).bootstrap) {
      this.projectModalRef.nativeElement && (this.projectModal = new (window as any).bootstrap.Modal(this.projectModalRef.nativeElement));
    }
  }
  onProjectSaved(project: Project) {
    if (project.ProjectId) {
      this.updateProject(project);
    } else {
      this.addProject(project);
    }
  }

  getOptions() {
    this.projectFields = this.projectFields.map((field) => {
      if (field.type === 'select') {
        if (field.model == 'BillingPlatformId') {
          field.options = this.billingPlatforms.map((platform) => ({
            value: platform.BillingPlatformId,
            label: platform.Name
          }));
        }

        if (field.model == 'ClientId') {
          field.options = this.clients.map((client) => ({
            value: client.ClientId,
            label: client.Name
          }));
        }
      }
      return field;
    });
  }

  openModal(project?: Project) {
    this.selectedProject = project ? { ...project } : new Project();
    this.projectModal.show();
  }
  closeModal() {
    this.projectModal.hide();
    this.selectedProject = null;
  }

  addProject(project: Project) {
    this.apiService.post(Api.Project, project).subscribe(async (response) => {
      if (response.IsValid) {
       await this.getProjects().then(()=>this.closeModal());
      }
    });
  }
  updateProject(project: Project) {
    this.apiService.update(Api.Project, project).subscribe(async (response) => {
      if (response.IsValid) {
       await this.getProjects().then(()=>this.closeModal());
      }
    });
  }

  deleteProject(project:Project){
    this.apiService.update(Api.Project, project).subscribe(async (response) => {
      if (response.IsValid) {
       await this.getProjects().then(()=>this.closeModal());
      }
    });
  }
}
