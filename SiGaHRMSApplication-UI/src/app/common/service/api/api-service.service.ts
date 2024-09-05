import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = 'http://localhost:5238/api/';
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>('http://localhost:5238/api/auth/login', loginData);
  }

  getAll(route: string) {
    return this.http.get<any>(`${this.baseUrl}${route}`);
  }

  get(route: string, id: number) {
    return this.http.get<any>(`${this.baseUrl}${route}/${id}`);
  }

  post(route: string, data: any) {
    return this.http.post<any>(`${this.baseUrl}${route}`, data);
  }

  delete(route: string, id: any) {
    return this.http.delete<any>(`${this.baseUrl}${route}/${id}`);
  }

  upload(route: string, fileName: string, file) {
    const formData = new FormData();
    if (file.length) {
      formData.append('FileName', fileName);
      file.forEach((file) => {
        formData.append('File', file, file.name);
      });
    } else {
      formData.append('File', file, file.name);
      formData.append('FileName', fileName);
    }

    return this.http.post<any>(`${this.baseUrl}${route}/Upload`, formData);
  }

  update(route: string, data: any) {
    return this.http.put<any>(`${this.baseUrl}${route}`, data);
  }

  generateSalaries() {
    return this.http.post<any>(`${this.baseUrl}EmployeeSalary/generatesalaries`, {});
  }
  getUsingEmail(route: string, email: any) {
    return this.http.get<any>(`${this.baseUrl}${route}/getByEmail/${email}`);
  }

  getByDate(route: string, body: any) {
    return this.http.post<any>(`${this.baseUrl}${route}/ByDate`, body);
  }

  updateLeaveRequestStatus(route: string, body: any) {
    return this.http.put<any>(`${this.baseUrl}${route}/update_leaverequest_status`, body);
  }
}
