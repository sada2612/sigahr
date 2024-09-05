import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { SharedModule } from '../module/shared.module';

@Component({
  selector: 'app-salaryslip',
  standalone:true,
  imports:[CommonModule,SharedModule],
  templateUrl: './salaryslip.component.html',
  styleUrls: ['./salaryslip.component.scss']
})
export class SalaryslipComponent {
  @Output() onClose = new EventEmitter();
  salaryDetails = {
    employeeName: 'John-Doe',
    employeeId: 'EMP12345',
    department: 'Finance',
    salaryAmount: 5000,
    month: 'August',
  };

  downloadSalarySlip() {
    const originalContents = document.body.innerHTML;
    
    const printContents = document.getElementById('salary-slip')!.innerHTML;
    
    document.body.innerHTML = printContents;
    
    window.print();
  
    document.body.innerHTML = originalContents;
    
    window.location.reload();
  }
}
