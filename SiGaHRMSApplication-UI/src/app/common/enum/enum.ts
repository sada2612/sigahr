export enum TimeSheetStatus {
  All = 'All',
  Open = 'Open',
  Submitted = 'Submitted',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

export enum TimeSheetType {
  Weekly = 'Weekly',
  Daily = 'Daily'
}

export enum LeaveBalanceStatus {
  Applicable = 'Applicable',
  NotApplicable = 'NotApplicable'
}

export enum LeaveRequestStatus {
  Open = 'Open',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

export enum BillingType {
  Hourly = 'Hourly',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Fixed = 'Fixed',
  NonBillable = 'NonBillable'
}

export enum EmployeeStatus {
  Active = "Active",
  Inactive = "Inactive",
  Relieved = "Relieved"
}

export enum LeaveType {
  EarnedLeave = 'EarnedLeave',
  CasualLeave = 'CasualLeave',
  SickLeave = 'SickLeave',
  MaternityLeave = 'MaternityLeave',
  CompensatoryOff = 'CompensatoryOff',
  MarriageLeave = 'MarriageLeave',
  PaternityLeave = 'PaternityLeave',
  BereavementLeave = 'BereavementLeave',
  LossOfPay = 'LossOfPay'
}

export enum ProjectStatus {
  New = 'New',
  InProgress = 'InProgress',
  OnHold = 'OnHold',
  Cancelled = 'Cancelled',
  Completed = 'Completed'
}
export enum TaskType {
  Development = 'Development',
  Design = 'Design',
  Testing = 'Testing',
  Review = 'Review',
  Support = 'Support',
  Learning = 'Learning',
  Meeting = 'Meeting',
  Management = 'Management',
  SocialTime = 'SocialTime'
}

export enum Api {
  Client = 'Client',
  Employee = 'Employee',
  Incentive = 'Incentive',
  IncentivePurpose = 'IncentivePurpose',
  EmployeeSalary = 'EmployeeSalary',
  EmployeeSalaryStructure = 'EmployeeSalaryStructure',
  Project = 'Project',
  Applicant = 'Applicant',
  Attendance = 'Attendance',
  Holiday = 'Holiday',
  LeaveRequest = 'LeaveRequest',
  LeaveBalance = 'LeaveBalance',
  Job = 'Job',
  Event = 'Event',
  Bank = 'Bank',
  OfficeFest = 'OfficeFest',
  TimeSheet = 'TimeSheet',
  TimesheetDetail = 'TimesheetDetail',
  TaskName = 'TaskName',
  BillingPlatform = 'BillingPlatform',
  Designation = 'Designation',
  Announcement = 'Announcement',
  Document='Document'
}

export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  MANAGEMENT = 'Management',
  HR = 'HR',
  SALES_MARKETING = 'Sales & Marketing',
  ACCOUNTS_FINANCE = 'Accounts & Finance',
  MANAGER = 'Manager',
  QA = 'QA',
  DEVELOPER = 'Developer'
}

export enum ClientStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

export enum EventType {
  Holiday = 'Holiday',
  Birthday = 'Birthday',
  Anniversary='Anniversary',
  Event='Event'
}
