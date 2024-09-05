import { Injectable } from '@angular/core';
import { UserRole } from 'src/app/common/enum/enum';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}
const AdminNavigationItems = [
  {
    id: 'dashboard',
    title: 'Home',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/dashboard',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'elements',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Employees',
        title: 'Employees',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/employees',
        icon: 'ti ti-users'
      },
      {
        id: 'Project',
        title: 'Projects',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/projects',
        icon: 'ti ti-device-laptop'
      },
      {
        id: 'Client',
        title: 'Clients',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/clients',
        icon: 'ti ti-brush'
      },
      {
        id: 'Leave',
        title: 'Leaves',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/leaves',
        icon: 'ti ti-bed'
      },
      {
        id: 'Attendance',
        title: 'Attendance',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/attendances',
        icon: 'ti ti-hierarchy-2'
      },
      {
        id: 'TimeSheet',
        title: 'TimeSheet',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/timesheets',
        icon: 'ti ti-clock'
      },
      {
        id: 'Salary',
        title: 'Salary',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/salarys',
        icon: 'ti ti-credit-card'
      },
      {
        id: 'Holidays',
        title: 'Holidays',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/holidays',
        icon: 'ti ti-leaf',
        breadcrumbs: false
      },
      {
        id: 'Documents',
        title: 'Documents',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/documents',
        icon: 'ti ti-brand-google-drive'
      }
    ]
  },
  {
    id: 'Entertainments',
    title: 'Entertainments',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Birthdays',
        title: 'Birthdays',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/birthdays',
        icon: 'ti ti-gift',
        breadcrumbs: false
      },
      {
        id: 'Events',
        title: 'Events && Announcements',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/event',
        icon: 'ti ti-speakerphone',
        breadcrumbs: false
      },
      {
        id: 'Office Fest',
        title: 'Office Fest',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/fest',
        icon: 'ti ti-upload'
      }
    ]
  },
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Calendar',
        title: 'Calendar',
        type: 'item',
        url: '/admin/calendar',
        classes: 'nav-item',
        icon: 'ti ti-calendar',
        breadcrumbs: false
      }
    ]
  }
];

const GuestNavigationItems = [
  {
    id: 'dashboard',
    title: 'Home',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/dashboard',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'elements',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Employees',
        title: 'Profiles',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/profile',
        icon: 'ti ti-typography'
      },
      {
        id: 'Leave',
        title: 'Leave',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/leave',
        icon: 'ti ti-bed'
      },
      {
        id: 'Attendance',
        title: 'Attendance',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/attendance',
        icon: 'ti ti-hierarchy-2'
      },
      {
        id: 'TimeSheet',
        title: 'TimeSheet',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/timesheet',
        icon: 'ti ti-clock'
      },
      {
        id: 'Salary',
        title: 'Salary',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/salary',
        icon: 'ti ti-credit-card'
      },
      {
        id: 'Holidays',
        title: 'Holidays',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/holidays',
        icon: 'ti ti-leaf',
      },
      {
        id: 'Documents',
        title: 'Documents',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/documents',
        icon: 'ti ti-brand-google-drive'
      }
    ]
  },
  {
    id: 'Entertainments',
    title: 'Entertainments',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Birthdays',
        title: 'Birthdays',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/birthday',
        icon: 'ti ti-gift',
        breadcrumbs: false
      },
      {
        id: 'Events',
        title: 'Events && Announcements',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/event',
        icon: 'ti ti-speakerphone',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Calendar',
        title: 'Calendar',
        type: 'item',
        url: '/guest/calendar',
        classes: 'nav-item',
        icon: 'ti ti-calendar',
        breadcrumbs: false
      }
    ]
  }
];

@Injectable()
export class NavigationItem {
  get(role: string) {
    if (role == UserRole.HR || role == UserRole.SUPER_ADMIN) {
      return AdminNavigationItems;
    } else {
      return GuestNavigationItems;
    }
  }
}
