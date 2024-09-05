import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthResponse, Designation, Employee } from 'src/app/common/datatypes/DataTypes';
import { CommonService } from 'src/app/common/service/common/common.service';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { Api, UserRole } from 'src/app/common/enum/enum';
import { employeeFields } from 'src/app/common/constantss/const';
import { FormComponent } from '../../../common/component/form/form.component';
import { AuthService } from 'src/app/common/service/authitication/auth.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  imports: [CommonModule, SharedModule, FormComponent]
})
export default class EmployeeComponent implements AfterViewInit {
  @ViewChild('empModal') empModalRef!: ElementRef;
  selectedEmployee: Employee | null = null;
  designations: Designation[] = [];
  employees: Employee[] = [];
  employeeFields = [...employeeFields];
  private empModal: any;

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private authService:AuthService
  ) {
    
  }

  async ngOnInit() {
    await this.loadInitialData();
  }

  ngAfterViewInit() {
    if ((window as any).bootstrap) {
      this.empModal = new (window as any).bootstrap.Modal(this.empModalRef.nativeElement);
    }
  }

  private async loadInitialData() {
    try {
      const [employees, designations] = await Promise.all([
        this.apiService.getAll(Api.Employee).toPromise(),
        this.apiService.getAll(Api.Designation).toPromise()
      ]);
      this.employees = employees;
      this.designations = designations;
      this.populateFieldOptions();
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  private populateFieldOptions() {
    this.employeeFields = this.employeeFields.map((field) => {
      if (field.type === 'select') {
        if (['TeamLeadId', 'ReportingManagerId'].includes(field.model)) {
          field.options = this.employees.map((emp) => ({
            value: emp.EmployeeId,
            label: `${emp.FirstName} ${emp.LastName}`
          }));
        }
        if (field.model === 'DesignationId') {
          field.options = this.designations.map((desig) => ({
            value: desig.DesignationId,
            label: desig.DesignationName
          }));
        }
      }
      return field;
    });
  }

  JsonToCsv() {
    this.commonService.exportToCsv(this.employees, 'SigaEmployeesList.csv');
  }

  openModal(employee?: Employee) {
    this.selectedEmployee = employee ? { ...employee } : new Employee();
    this.empModal.show();
  }

  async onEmployeeSaved(employee: Employee) {
    try {
      const saveAction = employee.EmployeeId ? this.updateEmployee(employee) : this.addEmployee(employee);
      await saveAction;
      await this.getEmployees();
      this.closeModal();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  }

  closeModal() {
    this.empModal.hide();
    this.selectedEmployee = null;
  }

  private async getEmployees() {
    try {
      this.employees = await this.apiService.getAll(Api.Employee).toPromise();
      this.populateFieldOptions();
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }

  private async addEmployee(employee: Employee) {
    try {
      const response = await this.apiService.post(Api.Employee, employee).toPromise();
      if (response.IsValid && employee.NewFile) {
        await this.uploadFile(employee.CompanyEmail, employee.NewFile);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  }

  private async updateEmployee(employee: Employee) {
    try {
      const response = await this.apiService.update(Api.Employee, employee).toPromise();
      if (response.IsValid && employee.NewFile) {
        await this.uploadFile(employee.CompanyEmail, employee.NewFile);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  }

  private async uploadFile(fileName: string, file: File) {
    try {
      const response = await this.apiService.upload(Api.Employee, fileName, file).toPromise();
      if (response.IsValid) {
        await this.getEmployees();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  async employeeDelete(employee: Employee) {
    try {
      const response = await this.apiService.update(Api.Employee, employee).toPromise();
      if (response.IsValid) {
        await this.getEmployees();
        this.closeModal();
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  }
}
