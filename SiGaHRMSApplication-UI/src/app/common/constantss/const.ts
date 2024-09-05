import {
  billingTypeOptions,
  clientStatusOptions,
  employeeStatusOptions,
  FormField,
  leaveBalanceStatusOptions,
  projectStatusOptions
} from '../datatypes/DataTypes';

export const userRoles: string[] = ['Management', 'Sales & Marketing', 'Accounts & Finance', 'Manager', 'QA', 'Developer'];

export const empSalaryFormFields: FormField[] = [
  {
    type: 'number',
    id: 'employeeSalaryId',
    label: 'Employee Salary Id',
    model: 'EmployeeSalaryId',
    required: false,
    hidden: true
  },
  { type: 'number', id: 'basic', label: 'Basic', placeholder: 'Enter Basic Salary', model: 'Basic', required: true },
  { type: 'number', id: 'hra', label: 'HRA', model: 'HRA', placeholder: 'HRA', required: true },
  { type: 'number', id: 'da', label: 'DA', model: 'DA', placeholder: 'DA', required: true },
  { type: 'number', id: 'conveyance', label: 'Conveyance', model: 'Conveyance', placeholder: 'Conveyance', required: true },
  {
    type: 'number',
    id: 'medicalAllowance',
    label: 'Medical Allowance',
    model: 'MedicalAllowance',
    placeholder: 'MedicalAllowance',
    required: true
  },
  {
    type: 'number',
    id: 'specialAllowance',
    label: 'Special Allowance',
    model: 'SpecialAllowance',
    placeholder: 'SpecialAllowance',
    required: true
  },
  { type: 'number', id: 'pt', label: 'PT', model: 'PT', placeholder: 'PT', required: true },
  { type: 'number', id: 'tds', label: 'TDS', model: 'TDS', placeholder: 'TDS', required: true },
  {
    type: 'number',
    id: 'leaveDeduction',
    label: 'Leave Deduction',
    placeholder: 'Leave Deduction',
    model: 'LeaveDeduction',
    required: true
  },
  {
    type: 'number',
    id: 'otherDeduction',
    label: 'Other Deduction',
    placeholder: 'Other Deduction',
    model: 'OtherDeduction',
    required: true
  },
  { type: 'number', id: 'daysInAMonth', label: 'Days In A Month', placeholder: 'Days In A Month', model: 'DaysInAMonth', required: true },
  { type: 'number', id: 'presentDays', label: 'Present Days', placeholder: 'Present Days', model: 'PresentDays', required: true },
  { type: 'number', id: 'leaves', label: 'Leaves', model: 'Leaves', placeholder: 'Leaves', required: true },
  { type: 'number', id: 'grossSalary', label: 'Gross Salary', placeholder: 'Gross Salary', model: 'GrossSalary', required: true },
  { type: 'number', id: 'netSalary', label: 'Net Salary', placeholder: 'Net Salary', model: 'NetSalary', required: true },
  { type: 'date', id: 'salaryForAMonth', label: 'Salary Month', placeholder: 'Salary Month', model: 'SalaryForAMonth', required: true },
  { type: 'select', id: 'employeeId', label: 'Employee', model: 'EmployeeId', required: true, options: [] }
];

export const empSalaryStructureFormFields: FormField[] = [
  {
    type: 'number',
    id: 'employeeSalaryStructureId',
    label: ' EmployeeSalaryStructure Id',
    model: 'EmployeeSalaryStructureId',
    required: false,
    hidden: true
  },
  {
    type: 'date',
    id: 'fromDate',
    label: 'From Date',
    model: 'FromDate',
    required: true
  },
  {
    type: 'date',
    id: 'toDate',
    label: 'To Date',
    model: 'ToDate',
    required: false,
    disabled: true
  },
  {
    type: 'number',
    id: 'basic',
    label: 'Basic',
    model: 'Basic',
    required: true,
    placeholder: 'Enter Basic Salary',
    step: '0.01'
  },
  {
    type: 'number',
    id: 'hra',
    label: 'HRA',
    model: 'HRA',
    required: true,
    placeholder: 'Enter HRA',
    step: '0.01'
  },
  {
    type: 'number',
    id: 'da',
    label: 'DA',
    model: 'DA',
    required: true,
    placeholder: 'Enter DA',
    step: '0.01'
  },
  {
    type: 'number',
    id: 'conveyance',
    label: 'Conveyance',
    model: 'Conveyance',
    required: true,
    placeholder: 'Enter Conveyance',
    step: '0.01'
  },
  {
    type: 'number',
    id: 'medicalAllowance',
    label: 'Medical Allowance',
    model: 'MedicalAllowance',
    required: true,
    placeholder: 'Enter Medical Allowance',
    step: '0.01'
  },
  {
    type: 'number',
    id: 'specialAllowance',
    label: 'Special Allowance',
    model: 'SpecialAllowance',
    required: true,
    placeholder: 'Enter Special Allowance',
    step: '0.01'
  },
  {
    type: 'number',
    id: 'tds',
    label: 'TDS',
    model: 'TDS',
    required: true,
    placeholder: 'Enter TDS',
    step: '0.01'
  },
  { type: 'select', id: 'employeeId', label: 'Employee', model: 'EmployeeId', required: true, options: [] }
];

export const incentiveTypeFormFields: FormField[] = [
  {
    type: 'number',
    id: 'incentiveId',
    label: 'Incentive Id',
    model: 'IncentiveId',
    required: false,
    hidden: true
  },
  {
    type: 'select',
    id: 'employeeId',
    label: 'Employee',
    model: 'EmployeeId',
    required: true,
    options: []
  },
  {
    type: 'select',
    id: 'incentivePurposeId',
    label: 'Incentive Purpose',
    model: 'IncentivePurposeId',
    required: true,
    options: []
  },
  {
    type: 'number',
    id: 'amount',
    label: 'Amount',
    model: 'Amount',
    required: true,
    placeholder: 'Enter Amount'
  },
  {
    type: 'textarea',
    id: 'description',
    label: 'Description',
    model: 'Description',
    required: true,
    placeholder: 'Type Reason here'
  }
];

export const employeeFields: FormField[] = [
  {
    id: 'employeeId',
    label: 'Employee ID',
    type: 'number',
    model: 'EmployeeId',
    required: false,
    hidden: true
  },
  {
    id: 'firstName',
    label: 'First Name',
    type: 'text',
    model: 'FirstName',
    required: true,
    placeholder: 'Enter First Name'
  },
  {
    id: 'middleName',
    label: 'Middle Name',
    type: 'text',
    model: 'MiddleName',
    required: false,
    placeholder: 'Enter Middle Name'
  },
  {
    id: 'lastName',
    label: 'Last Name',
    type: 'text',
    model: 'LastName',
    required: true,
    placeholder: 'Enter Last Name'
  },
  {
    id: 'gender',
    label: 'Gender',
    type: 'select',
    model: 'Gender',
    required: true,
    options: [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
      { value: 'Other', label: 'Other' }
    ],
    placeholder: 'Select Gender'
  },
  {
    id: 'dateOfBirth',
    label: 'Date of Birth',
    type: 'date',
    model: 'DateOfBirth',
    required: true,
    placeholder: 'Select Date of Birth'
  },
  {
    id: 'contactNumber',
    label: 'Contact Number',
    type: 'text',
    model: 'ContactNumber',
    required: true,
    placeholder: 'Enter Contact Number'
  },
  {
    id: 'altContactNumber',
    label: 'Alternate Contact Number',
    type: 'text',
    model: 'AltContactNumber',
    required: false,
    placeholder: 'Enter Alternate Contact Number'
  },
  {
    id: 'personalEmail',
    label: 'Personal Email',
    type: 'email',
    model: 'PersonalEmail',
    required: false,
    placeholder: 'Enter Personal Email'
  },
  {
    id: 'companyEmail',
    label: 'Company Email',
    type: 'email',
    model: 'CompanyEmail',
    required: true,
    placeholder: 'Enter Company Email'
  },
  {
    id: 'dateOfJoining',
    label: 'Date of Joining',
    type: 'date',
    model: 'DateOfJoining',
    required: true,
    placeholder: 'Select Date of Joining'
  },
  {
    id: 'designationId',
    label: 'Designation',
    type: 'select',
    model: 'DesignationId',
    required: true,
    options: [],
    placeholder: 'Select Designation'
  },
  {
    id: 'currentGrossSalary',
    label: 'Current Gross Salary',
    type: 'number',
    model: 'CurrentGrossSalary',
    required: true,
    placeholder: 'Enter Current Gross Salary'
  },
  {
    id: 'fileUrl',
    label: 'File URL',
    type: 'file',
    model: 'FileUrl',
    required: false
  },
  {
    id: 'dateOfRelieving',
    label: 'Date of Relieving',
    type: 'date',
    model: 'DateOfRelieving',
    required: false,
    placeholder: 'Select Date of Relieving'
  },
  {
    id: 'employeeStatus',
    label: 'Employee Status',
    type: 'select',
    model: 'EmployeeStatus',
    options: employeeStatusOptions,
    required: true
  },
  {
    id: 'teamLeadId',
    label: 'Team Lead ID',
    type: 'select',
    model: 'TeamLeadId',
    required: false,
    options: [],
    placeholder: 'Select Team Lead'
  },
  {
    id: 'reportingManagerId',
    label: 'Reporting Manager',
    type: 'select',
    model: 'ReportingManagerId',
    required: false,
    options: [],
    placeholder: 'Select Reporting Manager'
  }
];

export const projectFields: FormField[] = [
  {
    id: 'projectId',
    label: 'Project ID',
    model: 'ProjectId',
    type: 'number',
    required: false,
    hidden: true
  },
  {
    id: 'title',
    label: 'Title',
    model: 'Title',
    type: 'text',
    required: true,
    placeholder: 'Enter Title'
  },
  {
    id: 'startDate',
    label: 'Start Date',
    model: 'StartDate',
    type: 'date',
    required: true,
    placeholder: 'Select Start Date'
  },
  {
    id: 'endDate',
    label: 'End Date',
    model: 'EndDate',
    type: 'date',
    required: false,
    placeholder: 'Select End Date'
  },
  {
    id: 'rateUSD',
    label: 'Rate (USD)',
    model: 'RateUSD',
    type: 'number',
    required: true,
    placeholder: 'Enter Rate in USD'
  },
  {
    id: 'rateINR',
    label: 'Rate (INR)',
    model: 'RateINR',
    type: 'number',
    required: true,
    placeholder: 'Enter Rate in INR'
  },
  {
    id: 'weeklyLimit',
    label: 'Weekly Limit',
    type: 'number',
    model: 'WeeklyLimit',
    required: true,
    placeholder: 'Enter Weekly Limit'
  },
  {
    id: 'billingType',
    label: 'Billing Type',
    type: 'select',
    model: 'BillingType',
    required: true,
    options: billingTypeOptions
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    model: 'Status',
    required: true,
    options: projectStatusOptions,
    placeholder: 'Enter Status'
  },
  {
    id: 'clientId',
    label: 'Client',
    type: 'select',
    model: 'ClientId',
    required: true,
    options: []
  },
  {
    id: 'billingPlatformId',
    label: 'Billing Platform',
    type: 'select',
    model: 'BillingPlatformId',
    required: true,
    options: []
  }
];

export const clientFields: FormField[] = [
  {
    id: 'clientId',
    model: 'ClientId',
    type: 'number',
    label: 'Client ID',
    required: false,
    hidden: true
  },
  {
    id: 'name',
    model: 'Name',
    type: 'text',
    label: 'Name',
    required: true,
    placeholder: 'Enter Name'
  },
  {
    id: 'companyName',
    model: 'CompanyName',
    type: 'text',
    label: 'Company Name',
    required: false,
    placeholder: 'Enter Company Name'
  },
  {
    id: 'contactPersonName',
    model: 'ContactPersonName',
    type: 'text',
    label: 'Contact Person Name',
    required: false,
    placeholder: 'Enter Contact Person Name'
  },
  {
    id: 'status',
    model: 'Status',
    type: 'select',
    label: 'Status',
    required: true,
    placeholder: 'Select Status',
    options: clientStatusOptions
  }
];

export const leaveRequestFields: FormField[] = [
  {
    id: 'leaveRequestId',
    model: 'LeaveRequestId',
    type: 'number',
    label: 'Leave Request ID',
    required: false,
    hidden: true
  },
  {
    id: 'leaveType',
    model: 'LeaveType',
    type: 'text',
    label: 'Leave Type',
    required: true,
    placeholder: 'Enter Leave Type'
  },
  {
    id: 'fromDate',
    model: 'FromDate',
    type: 'date',
    label: 'From Date',
    required: true,
    placeholder: 'Select From Date'
  },
  {
    id: 'toDate',
    model: 'ToDate',
    type: 'date',
    label: 'To Date',
    required: true,
    placeholder: 'Select To Date'
  },
  {
    id: 'isHalfDay',
    model: 'IsHalfDay',
    type: 'select',
    options: [],
    label: 'Half Day',
    required: false
  },
  {
    id: 'reason',
    model: 'Reason',
    type: 'textarea',
    label: 'Reason',
    required: true,
    placeholder: 'Enter Reason for Leave'
  }
];

export const taskFields: FormField[] = [
  {
    id: 'taskId',
    model: 'TaskId',
    type: 'number',
    label: 'Task ID',
    required: false,
    hidden: true
  },
  {
    id: 'projectId',
    model: 'ProjectId',
    type: 'select',
    options: [],
    label: 'Project ID',
    required: false,
    placeholder: 'Enter Project ID'
  },
  {
    id: 'clientId',
    model: 'ClientId',
    type: 'select',
    options: [],
    label: 'Client ID',
    required: false,
    placeholder: 'Enter Client ID'
  },
  {
    id: 'taskDetails',
    model: 'TaskDetails',
    type: 'textarea',
    label: 'Task Details',
    required: true,
    placeholder: 'Enter Task Details'
  }
];

export const announcementfields: FormField[] = [
  {
    id: 'announcementId',
    model: 'AnnouncementId',
    type: 'number',
    label: 'Announcement ID',
    required: false,
    hidden: true
  },
  {
    id: 'title',
    model: 'Title',
    type: 'text',
    label: 'Title',
    placeholder: 'Enter the title',
    required: true
  },
  {
    id: 'fileUrl',
    model: 'FileUrl',
    type: 'file',
    label: 'Upload File',
    required: false
  },
  {
    id: 'description',
    model: 'Description',
    type: 'textarea',
    label: 'Description',
    placeholder: 'Enter the description',
    required: true
  }
];

export const eventfields: FormField[] = [
  {
    id: 'eventId',
    model: 'EventId',
    type: 'number',
    label: 'Event ID',
    required: false,
    hidden: true
  },
  {
    id: 'name',
    model: 'Name',
    type: 'text',
    label: 'Name',
    placeholder: 'Enter the event name',
    required: true
  },
  {
    id: 'date',
    model: 'Date',
    type: 'date',
    label: 'Date',
    required: true
  },
  {
    id: 'fileUrl',
    model: 'FileUrl',
    type: 'file',
    label: 'Upload File',
    required: false
  },
  {
    id: 'description',
    model: 'Description',
    type: 'textarea',
    label: 'Description',
    placeholder: 'Enter the event description',
    required: false
  }
];

export const holidayfields: FormField[] = [
  {
    id: 'holidayId',
    model: 'HolidayId',
    type: 'number',
    label: 'Holiday ID',
    required: false,
    hidden: true
  },
  {
    id: 'fileUrl',
    model: 'FileUrl',
    type: 'file',
    label: 'Upload File',
    required: true
  },
  {
    id: 'date',
    model: 'Date',
    type: 'date',
    label: 'Date',
    required: true
  },
  {
    id: 'description',
    model: 'Description',
    type: 'textarea',
    label: 'Description',
    placeholder: 'Enter a description',
    required: true
  }
];

export const documentfields: FormField[] = [
  {
    id: 'documnetId',
    model: 'DocumnetId',
    type: 'number',
    label: 'Documnet Id',
    required: false,
    hidden: true
  },
  {
    id: 'fileUrl',
    model: 'FileUrl',
    type: 'file',
    label: 'Upload File',
    required: true
  },
  {
    id: 'documentName',
    model: 'DocumentName',
    type: 'text',
    label: 'Document Name',
    required: true,
    placeholder:'Document Name'
  },
  {
    id: 'employeeId',
    model: 'EmployeeId',
    type: 'number',
    label: 'Employee',
    hidden: true
  }
];

export const leavebalancefields: FormField[] = [
  {
    id: 'leaveBalanceId',
    model: 'LeaveBalanceId',
    type: 'number',
    label: 'Leave Balance ID',
    required: false,
    hidden: true
  },
  {
    id: 'year',
    model: 'Year',
    type: 'number',
    label: 'Year',
    required: true,
    placeholder: 'Enter Year'
  },
  {
    id: 'earnedLeaves',
    model: 'EarnedLeaves',
    type: 'number',
    label: 'Earned Leaves',
    required: true,
    placeholder: 'Enter Earned Leaves'
  },
  {
    id: 'casualLeaves',
    model: 'CasualLeaves',
    type: 'number',
    label: 'Casual Leaves',
    required: true,
    placeholder: 'Enter Casual Leaves'
  },
  {
    id: 'sickLeaves',
    model: 'SickLeaves',
    type: 'number',
    label: 'Sick Leaves',
    required: true,
    placeholder: 'Enter Sick Leaves'
  },
  {
    id: 'maternityLeaves',
    model: 'MaternityLeaves',
    type: 'number',
    label: 'Maternity Leaves',
    required: true,
    placeholder: 'Enter Maternity Leaves'
  },
  {
    id: 'compensatoryOffs',
    model: 'CompensatoryOffs',
    type: 'number',
    label: 'Compensatory Offs',
    required: true,
    placeholder: 'Enter Compensatory Offs'
  },
  {
    id: 'marriageLeaves',
    model: 'MarriageLeaves',
    type: 'number',
    label: 'Marriage Leaves',
    required: true,
    placeholder: 'Enter Marriage Leaves'
  },
  {
    id: 'paternityLeaves',
    model: 'PaternityLeaves',
    type: 'number',
    label: 'Paternity Leaves',
    required: true,
    placeholder: 'Enter Paternity Leaves'
  },
  {
    id: 'bereavementLeaves',
    model: 'BereavementLeaves',
    type: 'number',
    label: 'Bereavement Leaves',
    required: true,
    placeholder: 'Enter Bereavement Leaves'
  },
  {
    id: 'lossofPayLeaves',
    model: 'LossofPayLeaves',
    type: 'number',
    label: 'Loss of Pay Leaves',
    required: true,
    placeholder: 'Enter Loss of Pay Leaves'
  },
  {
    id: 'earnedLeavesAvailaed',
    model: 'EarnedLeavesAvailaed',
    type: 'number',
    label: 'Earned Leaves Availed',
    required: false,
    placeholder: 'Enter Earned Leaves Availed'
  },
  {
    id: 'casualLeavesAvailaed',
    model: 'CasualLeavesAvailaed',
    type: 'number',
    label: 'Casual Leaves Availed',
    required: false,
    placeholder: 'Enter Casual Leaves Availed'
  },
  {
    id: 'sickLeavesAvailaed',
    model: 'SickLeavesAvailaed',
    type: 'number',
    label: 'Sick Leaves Availed',
    required: false,
    placeholder: 'Enter Sick Leaves Availed'
  },
  {
    id: 'maternityLeavesAvailaed',
    model: 'MaternityLeavesAvailaed',
    type: 'number',
    label: 'Maternity Leaves Availed',
    required: false,
    placeholder: 'Enter Maternity Leaves Availed'
  },
  {
    id: 'compensatoryOffsAvailaed',
    model: 'CompensatoryOffsAvailaed',
    type: 'number',
    label: 'Compensatory Offs Availed',
    required: false,
    placeholder: 'Enter Compensatory Offs Availed'
  },
  {
    id: 'marriageLeavesAvailaed',
    model: 'MarriageLeavesAvailaed',
    type: 'number',
    label: 'Marriage Leaves Availed',
    required: false,
    placeholder: 'Enter Marriage Leaves Availed'
  },
  {
    id: 'paternityLeavesAvailaed',
    model: 'PaternityLeavesAvailaed',
    type: 'number',
    label: 'Paternity Leaves Availed',
    required: false,
    placeholder: 'Enter Paternity Leaves Availed'
  },
  {
    id: 'bereavementLeavesAvailaed',
    model: 'BereavementLeavesAvailaed',
    type: 'number',
    label: 'Bereavement Leaves Availed',
    required: false,
    placeholder: 'Enter Bereavement Leaves Availed'
  },
  {
    id: 'lossofPayLeavesAvailaed',
    model: 'LossofPayLeavesAvailaed',
    type: 'number',
    label: 'Loss of Pay Leaves Availed',
    required: false,
    placeholder: 'Enter Loss of Pay Leaves Availed'
  },
  {
    id: 'leaveBalanceStatus',
    model: 'LeaveBalanceStatus',
    type: 'select',
    options: leaveBalanceStatusOptions,
    label: 'LeaveBalance Status',
    required: false
  },
  {
    id: 'employeeId',
    model: 'EmployeeId',
    type: 'select',
    options: [],
    label: 'Employee ID',
    required: true,
    placeholder: 'Enter Employee ID'
  }
];
