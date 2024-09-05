import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import LoginComponent from './common/component/login/login.component';
import { AdminAuthGuardService } from './common/service/authguard/admin-auth-guard.service';
import { NotFoundComponent } from './common/unauthorized/not-found/not-found.component';
import { AdminComponent } from './common/component/layouts/admin/admin.component';
import { GuestComponent } from './common/component/layouts/guest/guest.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminAuthGuardService],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./common/component/dashboard/dashboard.component')
      },
       //----------------Employees route---------------------------------------
       {
        path: 'employees',
        loadComponent: () => import('./hrms/admin/employe/employee.component')
      },
      //----------------Employee Profile route---------------------------------------
      {
        path: 'profile/:id',
        loadComponent: () => import('./hrms/admin/employe/employee-profile/employee-profile.component')
      },
      //----------------Leave route---------------------------------------
      {
        path: 'leaves',
        loadComponent: () => import('./hrms/admin/leave/leave.component')
      },
      //----------------Leave route---------------------------------------
      {
        path: 'attendances',
        loadComponent: () => import('./hrms/admin/attendance/attendance.component')
      },
       //----------------Salary route---------------------------------------
       {
        path: 'salarys',
        loadComponent: () => import('./hrms/admin/employee-salary/employee-salary.component')
      },
      //----------------Salary route---------------------------------------
      {
        path: 'timesheets',
        loadComponent: () => import('./hrms/admin/timesheet/timesheet.component')
      },
       //----------------Holiday route---------------------------------------
       {
        path: 'holidays',
        loadComponent: () => import('./common/component/holiday/holiday.component')
      },
      //----------------Birthday route---------------------------------------
      {
        path: 'birthdays',
        loadComponent: () => import('./common/component/birthdays/birthdays.component')
      },
      //----------------Birthday route---------------------------------------
      {
        path: 'event',
        loadComponent: () => import('./common/component/events/events.component')
      },
      {
        path: 'projects',
        loadComponent: () => import('./hrms/admin/project/project.component')
      },
      {
        path: 'clients',
        loadComponent: () => import('./hrms/admin/client/client.component')
      },
      {
        path: 'calendar',
        loadComponent: () => import('./common/component/calendar/calendar.component')
      },
      {
        path: 'documents',
        loadComponent: () => import('./common/component/documents/documents.component')
      },
      {
        path: 'fest',
        loadComponent: () => import('./hrms/admin/officefest/officefest.component')
      },
      
    ]
  },
  {
    path: 'guest',
    component: GuestComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./common/component/dashboard/dashboard.component')
      },
      {
        path: 'leave',
        loadComponent: () => import('./hrms/guest/user-leave/user-leave.component')
      },
      {
        path: 'timesheet',
        loadComponent: () => import('./hrms/guest/user-timesheet/user-timesheet.component')
      },
      {
        path: 'attendance',
        loadComponent: () => import('./hrms/guest/user-attendance/user-attendance.component')
      },
      {
        path: 'profile',
        loadComponent: () => import('./hrms/guest/employee-profile/employee-profile.component')
      },
      {
        path: 'profile/:id',
        loadComponent: () => import('./hrms/admin/employe/employee-profile/employee-profile.component')
      },
      {
        path: 'salary',
        loadComponent: () => import('./hrms/guest/user-salary/user-salary.component')
      },
       //----------------Holiday route---------------------------------------
       {
        path: 'holidays',
        loadComponent: () => import('./common/component/holiday/holiday.component')
      },
      //----------------Birthday route---------------------------------------
      {
        path: 'birthday',
        loadComponent: () => import('./common/component/birthdays/birthdays.component')
      },
      //----------------Birthday route---------------------------------------
      {
        path: 'event',
        loadComponent: () => import('./common/component/events/events.component')
      },
      {
        path: 'calendar',
        loadComponent: () => import('./common/component/calendar/calendar.component')
      },
      {
        path: 'documents',
        loadComponent: () => import('./common/component/documents/documents.component')
      },


    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
