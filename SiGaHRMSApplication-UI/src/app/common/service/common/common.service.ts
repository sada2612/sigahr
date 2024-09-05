import { Injectable } from '@angular/core';
import { EmailDto } from '../../datatypes/DataTypes';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(
    private datePipe: DatePipe,
    private AlertService: AlertService
  ) {}

  exportToCsv(data: any[], fileName: string): void {
    if (data[0].employee) {
      data = data
        .filter((data) => {
          return (data.employeeId = data.employee.firstName + ' ' + data.employee.lastName);
        })
        .map((item) => {
          const { employee, ...rest } = item;
          return rest;
        });
    }

    if (data[0].project) {
      data = data
        .filter((data) => {
          console.log(data.project);

          return (data.projectId = data.project == null ? 'Not Assigned' : data.project.projectName);
        })
        .map((item) => {
          const { project, ...rest } = item;
          return rest;
        });
    }

    if (data[0].job) {
      data = data
        .filter((data) => {
          return (data.jobId = data.job.title);
        })
        .map((item) => {
          const { job, feedBack, ...rest } = item;
          return rest;
        });
    }

    if (data[0].client) {
      data = data
        .filter((data) => {
          return (data.clientId = data.client == null ? '' : data.client.firstName + ' ' + data.client == null ? '' : data.client.lastName);
        })
        .map((item) => {
          const { client, ...rest } = item;
          return rest;
        });
    }
    Swal.fire({
      title: 'Do you want to download the File?',
      showCancelButton: true,
      confirmButtonText: 'download'
    }).then((result) => {
      if (result.isConfirmed) {
        this.AlertService.Toast()
          .fire({ icon: 'success', title: 'File Download successfully' })
          .then(() => {
            const csv = this.convertToCsv(data);
            const blob = new Blob([csv], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
      }
    });
  }

  calculateWorkedTime(inTime: any, outTime: any): number {
    // Set outTime to current date if it is not provided
    outTime = !outTime ? new Date() : new Date(outTime);

    // Calculate the difference in milliseconds
    const diffMs = new Date(outTime).getTime() - new Date(inTime).getTime();

    // Convert milliseconds to minutes
    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    return totalMinutes;
  }

  convertSecondsToTime(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    return date;
  }

  getMiddleDates(start: string | Date, end: string | Date): string[] {
    const middleDates = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
      middleDates.push(this.datePipe.transform(currentDate, 'yyyy-MM-dd'));
    }
    return middleDates;
  }

  getWeekRange(date: Date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return {
      startOfWeek: this.datePipe.transform(startOfWeek, 'yyyy-MM-dd'),
      endOfWeek: this.datePipe.transform(endOfWeek, 'yyyy-MM-dd')
    };
  }

  calculateWorkedTimeinSeconds(inTime: any, outTime: any): number {
    if (!outTime) {
      outTime = new Date();
    } else {
      outTime = new Date(outTime);
    }

    const inTimeDate = new Date(inTime);
    const outTimeDate = new Date(outTime);

    const diffMs = outTimeDate.getTime() - inTimeDate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);

    return diffSeconds;
  }

  private convertToCsv(data: any[]): string {
    const header = Object.keys(data[0]).join(',');
    const rows = data
      .map((obj) => {
        return Object.values(obj).join(',');
      })
      .join('\n');
    return `${header}\n${rows}`;
  }

  getCalculateWorkedTime(inTime: any, outTime: any): string {
    if (!outTime) {
      outTime = new Date();
    } else {
      outTime = new Date(outTime);
    }
  
    const inTimeDate = new Date(inTime);
    const outTimeDate = new Date(outTime);
  
    const diffMs = outTimeDate.getTime() - inTimeDate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
  
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = diffSeconds % 60;
  
    // Format hours, minutes, and seconds as "HH:MM:SS"
    const formattedTime = `${this.padNumber(hours)}:${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
    return formattedTime;
  }
  
  padNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }
  forgetPassword(email, otp) {
    var Email = new EmailDto();
    Email.toEmail = email;
    Email.subject = 'Password OTP';
    Email.body = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your Brand</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
      <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Your Brand Inc</p>
        <p>1600 Amphitheatre Parkway</p>
        <p>California</p>
      </div>
    </div>
  </div>`;
    return Email;
  }
}
