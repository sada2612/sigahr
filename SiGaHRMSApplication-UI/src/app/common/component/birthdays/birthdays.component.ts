import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '../module/shared.module';
import { ApiService } from '../../service/api/api-service.service';
import { Api } from '../../enum/enum';
import { Employee } from '../../datatypes/DataTypes';

@Component({
  selector: 'app-birthdays',
  standalone:true,
  imports:[CommonModule,SharedModule],
  templateUrl: './birthdays.component.html',
  styleUrls: ['./birthdays.component.scss']
})
export default class BirthdaysComponent {
  employees: Employee[]=[];

  constructor(private apiService:ApiService){

  }
  ngOnInit(){
    this.apiService.getAll(Api.Employee).subscribe((employees)=>{
      this.employees=employees
    })
  }
}
