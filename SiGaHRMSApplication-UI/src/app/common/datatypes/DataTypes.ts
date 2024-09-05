import {
  BillingType,
  ClientStatus,
  EmployeeStatus,
  LeaveBalanceStatus,
  LeaveRequestStatus,
  LeaveType,
  ProjectStatus,
  TaskType,
  TimeSheetStatus,
  TimeSheetType
} from '../enum/enum';

export class EmailDto {
  toEmail: string;
  subject: string;
  body: string;
}

export class TaskName {
  TaskId: number;
  TaskDetails: string;
  ProjectId?: number;
  Project?: Project | null;
  ClientId?: number;
  Client?: Client | null;
}

export class Designation {
  DesignationId: number;
  DesignationName: string;
}

export interface AuthResponse {
  aud: string;
  email: string;
  employeeId: number;
  exp: number;
  iat: number;
  iss: string;
  name: string;
  nbf: number;
  role: string;
  sub: string;
}
export class Employee {
  EmployeeId: number;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Gender: string;
  DateOfBirth: Date;
  ContactNumber: string;
  AltContactNumber: string;
  PersonalEmail: string;
  CompanyEmail: string;
  DateOfJoining: Date;
  DesignationId: number;
  CurrentDesignation: Designation;
  CurrentGrossSalary: number;
  FileUrl?: string | null;
  DateOfRelieving: any;
  EmployeeStatus: string;
  TeamLeadId?: number | null;
  ReportingManagerId?: number | null;
  IsDeleted: boolean = false;
  CreatedBy?: number | null;
  CreatedDateTime: any;
  LastModifiedBy?: number | null;
  LastModifiedDateTime?: any | null;
  DeletedBy?: number | null;
  DeletedDateTime?: any | null;
  NewFile: File | null = null;
}

export class Holiday {
  HolidayId: number;
  FileUrl: string;
  Date: any;
  NewFile: File | null = null;
  Description: any;
  IsDeleted: boolean;
  CreatedBy: number | null;
  CreatedDateTime: any;
  LastModifiedBy: number | null;
  LastModifiedDateTime: any | null;
  DeletedBy: number | null;
  DeletedDateTime: Date | null;
}

export class Project {
  ProjectId: number;
  Title: string;
  StartDate: any;
  EndDate: any | null;
  RateUSD: number;
  RateINR: number;
  WeeklyLimit: number;
  BillingType: BillingType;
  Status: string;
  ClientId: number;
  Client: Client;
  BillingPlatformId: number;
  BillingPlatform: BillingPlatform;
  IsDeleted: boolean = false;
  CreatedBy: number | null;
  CreatedDateTime: Date | null;
  LastModifiedBy: number | null;
  LastModifiedDateTime: Date | null;
  DeletedBy: number | null;
  DeletedDateTime: Date | null;
}

export class BillingPlatform {
  BillingPlatformId: number;
  Name: string;
  IsDeleted: boolean = false;
  CreatedBy: number | null;
  CreatedDateTime: Date | null;
  LastModifiedBy: number | null;
  LastModifiedDateTime: Date | null;
  DeletedBy: number | null;
  DeletedDateTime: Date | null;
}
export class Client {
  ClientId: number;
  Name: string;
  CompanyName: string | null;
  ContactPersonName: string | null;
  Status: any;
  IsDeleted: boolean = false;
  CreatedBy: number | null;
  CreatedDateTime: Date | null;
  LastModifiedBy: number | null;
  LastModifiedDateTime: Date | null;
  DeletedBy: number | null;
  DeletedDateTime: Date | null;
}
export class RequestDto {
  EmployeeId: number = null;
  FormDate: any = null;
  ToDate: any = null;
  constructor(EmployeeId: number = null, FormDate: any = null, ToDate: any = null) {
    this.EmployeeId = EmployeeId;
    this.FormDate = FormDate;
    this.ToDate = ToDate;
  }
}

export class Attendance {
  AttendanceId: number;
  AttendanceDate: any|null;
  InTime: any|null;
  OutTime: any | null;
  EmployeeId: number;
  WorkTime: any | null;
  Employee: Employee | null;
  IsDeleted: boolean;
  CreatedBy: number | null;
  CreatedDateTime: any;
  LastModifiedBy: number | null;
  LastModifiedDateTime: any | null;
  DeletedBy: number | null;
  DeletedDateTime: Date | null;
}

export class LeaveRequest {
  LeaveRequestId: number;
  LeaveType: string;
  FromDate: any;
  ToDate: any;
  IsHalfDay: boolean | null;
  Reason: string;
  LeaveRequestStatus: string = LeaveRequestStatus.Open;
  ApproverComment: string | null = ' ';
  Approver: number | null;
  EmployeeId: number;
  Employee: Employee | null;
  IsDeleted: boolean;
  CreatedBy: number | null;
  CreatedDateTime: any;
  LastModifiedBy: number | null;
  LastModifiedDateTime: any | null;
  DeletedBy: number | null;
  DeletedDateTime: any | null;
}

export class CalendarDto {
  date: any;
  eventName: string;
}

export class TimeSheet {
  TimesheetId: number;
  TimesheetDate: any;
  ToTimesheetDate: any | null;
  TimesheetStatus: any;
  Approver?: number | null;
  WorkingHours: any | null;
  ApproverEmployee?: Employee | null;
  EmployeeId: number;
  Employee?: Employee | null;
  IsDeleted: boolean;
  CreatedBy?: number | null;
  CreatedDateTime: Date;
  LastModifiedBy?: number | null;
  LastModifiedDateTime?: any | null;
  DeletedBy?: number | null;
  DeletedDateTime?: Date | null;
}

export class TimeSheetDetail {
  TimeSheetDetailId: number;
  TaskId: number;
  Task: TaskName;
  HoursSpent: number;
  IsBillable: boolean;
  TimeSheetDate: any | null;
  TaskType: any;
  TimesheetId: number;
  Timesheet?: TimeSheet | null;
  IsDeleted: boolean = false;
  CreatedBy?: number | null;
  CreatedDateTime: any | null;
  LastModifiedBy?: number | null;
  LastModifiedDateTime?: any | null;
  DeletedBy?: number | null;
  DeletedDateTime?: any | null;
}

export class IncentivePurpose {
  IncentivePurposeId: number;
  Purpose: any;
  IsDeleted: boolean;
  CreatedBy: number | null;
  CreatedDateTime: any | null;
  LastModifiedBy: number | null;
  LastModifiedDateTime: any | null;
  DeletedBy: number | null;
  DeletedDateTime: any | null;
}

export class Incentive {
  IncentiveId: number;
  IncentivePurposeId: number;
  IncentivePurpose: IncentivePurpose;
  Amount: number;
  Description: string | null;
  EmployeeId: number;
  Employee: Employee | null;
  IsDeleted: boolean;
  CreatedBy: number | null;
  CreatedDateTime: any | null;
  LastModifiedBy: number | null;
  LastModifiedDateTime: any | null;
  DeletedBy: number | null;
  DeletedDateTime: any | null;
}

export class OfficeFestFileDto {
  FileName: string | null = null;
  File: (File | null)[] | null = null;

  constructor(fileName: string | null = null, file: (File | null)[] | null = null) {
    this.FileName = fileName;
    this.File = file;
  }
}

export class OfficeFest {
  OfficeFestId: number;
  OfficeFestName: string;
  OfficeFestDate: string;  
  FileUrl: string[] | null = null;
}
export class DocumentDto {
  DocumentId: number;
  DocumentName: string|null;
  FileUrl: string;
  NewFile: File | null = null;
  EmployeeId: number;
  Employee:Employee|null;
}
export class FormField {
  type: 'text' | 'select' | 'date' | 'number' | 'email' | 'textarea' | 'file';
  id: string;
  label: string;
  model: string;
  required?: boolean;
  placeholder?: string;
  step?: string;
  options?: { value: any; label: string }[];
  changeAction?: string;
  readonly?: boolean;
  hidden?: boolean;
  disabled?: boolean;
}
export class EmployeeSalaryStructure {
  EmployeeSalaryStructureId: number;
  FromDate: string;
  ToDate: string | null;
  Basic: number;
  HRA: number;
  DA: number;
  Conveyance: number;
  MedicalAllowance: number;
  SpecialAllowance: number;
  TDS: number;
  EmployeeId: number;
  Employee: Employee | null;
  IsDeleted: boolean = false;
  CreatedBy: number | null;
  CreatedDateTime: any | null;
  LastModifiedBy: number | null;
  LastModifiedDateTime: any | null;
  DeletedBy: number | null;
  DeletedDateTime: any | null;
}
export class EmployeeSalaryDto {
  EmployeeSalaryId: number;
  SalaryForAMonth: any;
  Basic: number;
  HRA: number;
  DA: number;
  Conveyance: number;
  MedicalAllowance: number;
  SpecialAllowance: number;
  PT: number;
  TDS: number;
  LeaveDeduction: number;
  OtherDeduction: number;
  DaysInAMonth: number;
  PresentDays: number;
  Leaves: number;
  GrossSalary: number;
  NetSalary: number;
  EmployeeId: number;
  Employee?: Employee | null;
  IsDeleted: boolean = false;
  CreatedBy?: number | null;
  CreatedDateTime?: any | null;
  LastModifiedBy?: number | null;
  LastModifiedDateTime?: any | null;
  DeletedBy?: number | null;
  DeletedDateTime?: any | null;
}

export class LeaveBalance {
  LeaveBalanceId: number;
  Year: number;
  EarnedLeaves: number;
  CasualLeaves: number;
  SickLeaves: number;
  MaternityLeaves: number;
  CompensatoryOffs: number;
  MarriageLeaves: number;
  PaternityLeaves: number;
  BereavementLeaves: number;
  LossofPayLeaves: number;
  EarnedLeavesAvailaed: number | null;
  CasualLeavesAvailaed: number | null;
  SickLeavesAvailaed: number | null;
  MaternityLeavesAvailaed: number | null;
  CompensatoryOffsAvailaed: number | null;
  MarriageLeavesAvailaed: number | null;
  PaternityLeavesAvailaed: number | null;
  BereavementLeavesAvailaed: number | null;
  LossofPayLeavesAvailaed: number | null;
  LeaveBalanceStatus: any;
  EmployeeId: number;
  Employee: Employee | null;
  IsDeleted: boolean = false;
  CreatedBy: number | null;
  CreatedDateTime: Date | null;
  LastModifiedBy: number | null;
  LastModifiedDateTime: any;
  DeletedBy: number | null;
  DeletedDateTime: Date | null;
}

export class Event {
  EventId: number;
  Name: string;
  Description?: string;
  Date: any;
  NewFile: File | null = null;
  FileUrl: string | null;
}

export class Announcement {
  AnnouncementId: number;
  Title: string;
  FileUrl: string | null;
  Description: string;
  NewFile: File | null = null;
  CreatedBy?: number | null;
  Employee?: Employee | null;
}

export class NotificationDto {
  Name: string;
  Link: string;
  Time: string;
  Icon: string;
  color: string;
}

export const leaveTypeOptions = [
  { value: LeaveType.EarnedLeave, label: 'Earned Leave' },
  { value: LeaveType.CasualLeave, label: 'Casual Leave' },
  { value: LeaveType.SickLeave, label: 'Sick Leave' },
  { value: LeaveType.MaternityLeave, label: 'Maternity Leave' },
  { value: LeaveType.CompensatoryOff, label: 'Compensatory Off' },
  { value: LeaveType.MarriageLeave, label: 'Marriage Leave' },
  { value: LeaveType.PaternityLeave, label: 'Paternity Leave' },
  { value: LeaveType.BereavementLeave, label: 'Bereavement Leave' },
  { value: LeaveType.LossOfPay, label: 'Loss Of Pay' }
];

export const projectStatusOptions = Object.values(ProjectStatus).map((status) => ({
  label: status,
  value: status
}));
export const billingTypeOptions = Object.values(BillingType).map((status) => ({
  label: status,
  value: status
}));

export const employeeStatusOptions = Object.values(EmployeeStatus).map((status) => ({
  label: status,
  value: status
}));

export const leaveBalanceStatusOptions = Object.values(LeaveBalanceStatus).map((status) => ({
  label: status,
  value: status
}));

export const leaveTypeArray = [
  'Earned Leave',
  'Casual Leave',
  'Sick Leave',
  'Maternity Leave',
  'Compensatory Off',
  'Marriage Leave',
  'Paternity Leave',
  'Bereavement Leave',
  'Loss Of Pay'
];

export const taskTypeOptions = [
  { value: TaskType.Development, label: 'Development' },
  { value: TaskType.Design, label: 'Design' },
  { value: TaskType.Testing, label: 'Testing' },
  { value: TaskType.Review, label: 'Review' },
  { value: TaskType.Support, label: 'Support' },
  { value: TaskType.Learning, label: 'Learning' },
  { value: TaskType.Meeting, label: 'Meeting' },
  { value: TaskType.Management, label: 'Management' },
  { value: TaskType.SocialTime, label: 'Social Time' }
];

export const timeSheetStatusOptions = [
  { value: TimeSheetStatus.Open, label: 'Open' },
  { value: TimeSheetStatus.Submitted, label: 'Submitted' },
  { value: TimeSheetStatus.Approved, label: 'Approved' },
  { value: TimeSheetStatus.Rejected, label: 'Rejected' }
];

export const timeSheetTypeOptions = [
  { value: TimeSheetType.Daily, label: 'Daily' },
  { value: TimeSheetType.Weekly, label: 'Weekly' }
];

export const LeaveBalanceStatusOptions = [
  { value: LeaveBalanceStatus.Applicable, label: 'Applicable' },
  { value: LeaveBalanceStatus.NotApplicable, label: 'NotApplicable' }
];

export const clientStatusOptions = [
  { value: ClientStatus.Active, label: 'Active' },
  { value: ClientStatus.Inactive, label: 'Inactive' }
];
