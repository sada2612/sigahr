import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../module/shared.module';
import { ApiService } from '../../service/api/api-service.service';
import { Api, EventType } from '../../enum/enum';
import { Employee, Event, Holiday, RequestDto } from '../../datatypes/DataTypes';

class EventDto {
  EventName: string;
  EventDate: Date;
  EventUrl: string;
  EventType: EventType;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export default class CalendarComponent {
  @ViewChild('exampleModalCenter') exampleModalCenter!: ElementRef;
  daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  calendar: { Date: Date | null; Event: EventDto[] }[] = [];
  currentMonth: number;
  currentYear: number;
  employees: Employee[] = [];
  events: Event[] = [];
  holidays: Holiday[] = [];
  EventTypeEnum = EventType;
  eventDetails: boolean = false;
  selectedEvents: EventDto[] = [];
  years: number[] = [];
  private modal: any;

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe
  ) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.getEmployees();
  }

  ngOnInit() {
    this.years = Array.from({ length: 2 * 5 + 1 }, (_, i) => this.currentYear - 5 + i);
  }

  fetchData() {
    this.generateCalendar(this.currentMonth, this.currentYear)
  }
  ngAfterViewInit() {
    if (typeof (window as any).bootstrap !== 'undefined') {
      this.modal = new (window as any).bootstrap.Modal(this.exampleModalCenter.nativeElement);
    } else {
      console.error('Bootstrap JavaScript is not loaded.');
    }
  }

  getEmployees() {
    this.apiService.getAll(Api.Employee).subscribe((employees: Employee[]) => {
      this.employees = employees;
      this.loadInitialData();
    });
  }

   loadInitialData() {
    const fromDate = this.datePipe.transform(new Date(this.currentYear, 0, 1), 'yyyy-MM-dd');
    const toDate = this.datePipe.transform(new Date(this.currentYear, 11, 31), 'yyyy-MM-dd');
    this.apiService.getByDate(Api.Event, new RequestDto(null, fromDate, toDate)).subscribe((events: Event[]) => {
      this.events = events;
      this.apiService.getByDate(Api.Holiday, new RequestDto(null, fromDate, toDate)).subscribe((holidays: Holiday[]) => {
        this.holidays = holidays;
        this.generateCalendar(this.currentMonth, this.currentYear);
      });
    });
  }

  private generateCalendar(month: number, year: number) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const startDay = (firstDay + 6) % 7;
    this.calendar = [];

    for (let i = 0; i < daysInMonth + startDay; i++) {
      if (i < startDay) {
        this.calendar.push({ Date: null, Event: [] });
      } else {
        const date = new Date(year, month, i - startDay + 1);
        this.calendar.push({ Date: date, Event: [] });
      }
    }

    this.populateEvents();
  }

  private populateEvents() {
    this.calendar.forEach((day) => {
      if (day.Date) {
        const dateStr = day.Date.toDateString();
        day.Event = [
          ...this.getEventsOnDate(dateStr),
          ...this.getHolidaysOnDate(dateStr),
          ...this.getBirthdaysOnDate(dateStr),
          ...this.getAnniversariesOnDate(dateStr)
        ];
      }
    });
  }

  private getEventsOnDate(dateStr: string): EventDto[] {
    return this.events
      .filter((event) => new Date(event.Date).toDateString() === dateStr)
      .map((event) => ({
        EventName: event.Name,
        EventDate: new Date(event.Date),
        EventUrl: event.FileUrl,
        EventType: this.EventTypeEnum.Event
      }));
  }

  private getHolidaysOnDate(dateStr: string): EventDto[] {
    return this.holidays
      .filter((holiday) => new Date(holiday.Date).toDateString() === dateStr)
      .map((holiday) => ({
        EventName: holiday.Description,
        EventDate: new Date(holiday.Date),
        EventUrl: holiday.FileUrl,
        EventType: this.EventTypeEnum.Holiday
      }));
  }

  private getBirthdaysOnDate(dateStr: string): EventDto[] {
    const targetDate = new Date(dateStr);
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    return this.employees
      .filter((employee) => {
        const dob = new Date(employee.DateOfBirth);
        return dob.getMonth() === targetMonth && dob.getDate() === targetDay;
      })
      .map((employee) => ({
        EventName: `${employee.FirstName}'s Birthday`,
        EventDate: new Date(employee.DateOfBirth),
        EventUrl: employee.FileUrl,
        EventType: this.EventTypeEnum.Birthday
      }));
  }

  private getAnniversariesOnDate(dateStr: string): EventDto[] {
    const targetDate = new Date(dateStr);
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    return this.employees
      .filter((employee) => {
        const doj = new Date(employee.DateOfJoining);
        return doj.getMonth() === targetMonth && doj.getDate() === targetDay;
      })
      .map((employee) => ({
        EventName: `${employee.FirstName}'s Work Anniversary`,
        EventDate: new Date(employee.DateOfJoining),
        EventUrl: employee.FileUrl,
        EventType: this.EventTypeEnum.Anniversary
      }));
  }

  isWeekend(date: Date | null): boolean {
    return date ? date.getDay() === 0 || date.getDay() === 6 : false;
  }

  hasHoliday(events: EventDto[]): boolean {
    return events.some((event) => event.EventType === this.EventTypeEnum.Holiday);
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  openModal(event: EventDto[]): void {
    if (this.modal) {
      this.selectedEvents = event;
      this.modal.show();
    }
  }

  closeModal(): void {
    if (this.modal) {
      this.modal.hide();
    }
  }

  // trackBy function to optimize rendering
  trackByDate(index: number, item: { Date: Date | null; Event: EventDto[] }) {
    return item.Date ? item.Date.getTime() : null;
  }
}
