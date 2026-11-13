export type UserRole =
  | 'Super Administrator'
  | 'General Administration Manager'
  | 'General Administration Staff'
  | 'Department Head'
  | 'Employee';

export type WorkflowStatus =
  | 'Draft'
  | 'Submitted'
  | 'Approved'
  | 'Rejected'
  | 'Returned'
  | 'Completed'
  | 'Cancelled';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

// Master Data Types
export interface Employee {
  id: string; // Employee ID e.g., EMP-1001
  name: string;
  departmentId: string;
  departmentName: string;
  division: string;
  position: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  avatar?: string;
}

export interface Department {
  id: string; // Dept Code e.g., DEPT-GA
  code: string;
  name: string;
  headName: string;
  employeeCount: number;
}

export interface Vendor {
  id: string;
  code: string;
  name: string;
  category: 'IT Hardware' | 'Vehicle Service' | 'Facility & Maintenance' | 'Courier' | 'Stationery & Office' | 'Other';
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  rating: number; // 1 to 5
}

export interface Location {
  id: string;
  building: string;
  floor: string;
  room: string;
  fullLocation: string;
}

export interface AssetCategory {
  id: string;
  code: string;
  name: 'IT' | 'Furniture' | 'Machinery' | 'Electronic' | 'Vehicle' | 'Other';
  usefulLifeYears: number;
  depreciationRatePercent: number;
  description: string;
}

// Module 1: Asset Management
export interface Asset {
  id: string; // Asset Code e.g., AST-2024-001
  name: string;
  categoryId: string;
  categoryName: string;
  brandModel: string;
  serialNumber: string;
  locationId: string;
  locationName: string;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  purchaseDate: string;
  purchaseCost: number;
  salvageValue: number;
  usefulLifeYears: number;
  currentBookValue: number;
  status: 'Active' | 'In Use' | 'Maintenance' | 'Borrowed' | 'Mutated' | 'Disposed' | 'In Audit';
  warrantyExpiry: string;
  insuranceExpiry?: string;
  insurancePolicyNo?: string;
  qrCodeData: string;
  barcodeData: string;
  condition: 'Good' | 'Fair' | 'Damaged' | 'Under Repair';
  photoUrl?: string;
  attachments?: { name: string; url: string; size: string; date: string }[];
  history?: AssetMovementHistory[];
  workflowStatus: WorkflowStatus;
}

export interface AssetMovementHistory {
  id: string;
  assetId: string;
  type: 'Transfer' | 'Mutation' | 'Borrowing' | 'Return' | 'Maintenance' | 'Disposal';
  date: string;
  fromLocationOrUser: string;
  toLocationOrUser: string;
  notes: string;
  approvedBy: string;
}

// Module 2: Vehicle Management
export interface Vehicle {
  id: string; // License Plate e.g., B 1234 GAMS
  brandModel: string;
  type: 'Sedan' | 'SUV' | 'MPV' | 'Van' | 'Truck' | 'Motorcycle';
  year: number;
  color: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  status: 'Available' | 'In Trip' | 'Reserved' | 'In Maintenance' | 'Decommissioned';
  currentMileageKm: number;
  fuelType: 'Gasoline (RON 92)' | 'Gasoline (RON 95)' | 'Diesel' | 'Electric';
  stnkExpiry: string;
  kirExpiry: string;
  insuranceExpiry: string;
  taxExpiry: string;
  lastServiceDate: string;
  nextServiceKm: number;
  photoUrl?: string;
}

export interface VehicleBooking {
  id: string; // REQ-2409-004
  vehicleId: string;
  vehiclePlate: string;
  vehicleName: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  driverId?: string;
  driverName?: string;
  destination: string;
  purpose: string;
  startDate: string;
  endDate: string;
  startMileageKm?: number;
  endMileageKm?: number;
  status: WorkflowStatus;
  approvedBy?: string;
  notes?: string;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  date: string;
  driverName: string;
  liters: number;
  costPerLiter: number;
  totalCost: number;
  odometerKm: number;
  receiptNumber: string;
}

// Module 3: Maintenance Management
export interface ServiceLog {
  id: string; // e.g., SL-2026-001
  workOrderId: string; // WO-2026-088
  targetType: 'Asset' | 'Vehicle' | 'Building Facility';
  targetId: string;
  targetName: string;
  workType: 'Corrective' | 'Preventive';
  actualWorkDescription: string;
  actualCompletionDate: string;
  vendorOrTechnician: string;
  totalCost: number; // Actual Expense IDR
  invoiceNumber?: string;
  invoiceAttachment?: { name: string; url: string; size?: string };
  createdAt: string;
}

export interface MaintenanceRequest {
  id: string; // WO-2026-088
  title: string;
  type: 'Corrective' | 'Preventive';
  targetType: 'Asset' | 'Vehicle' | 'Building Facility';
  targetName: string;
  targetId: string;
  description: string;
  priority: Priority;
  requestedBy: string;
  departmentName: string;
  assignedTechnicianOrVendor: string;
  vendorId?: string;
  assignedPicId?: string;
  assignedPicName?: string;
  assignedPicEmail?: string;
  estimatedCost: number;
  actualCost: number;
  estimatedDate?: string; // Tanggal Perkiraan Pekerjaan
  workExecutionStatus?: 'On-Going' | 'Done' | 'Pending'; // Status Pekerjaan (On-Going / Done)
  startDate?: string;
  completedDate?: string;
  status: WorkflowStatus;
  sparepartsUsed?: { name: string; qty: number; unitCost: number }[];
  checklistItems?: { id: string; label: string; done: boolean }[];
  attachments?: { name: string; url: string; size?: string; date?: string }[]; // Evidence / Vendor quote attachments
  serviceLog?: ServiceLog;
}

// Module 4: Messenger Management
export interface MessengerDelivery {
  id: string; // COU-2026-102
  trackingNumber: string;
  type: 'Incoming Document' | 'Outgoing Document' | 'Internal Parcel';
  senderName: string;
  senderDeptOrCompany: string;
  recipientName: string;
  recipientDeptOrCompany: string;
  courierName: string;
  originAddress: string;
  destinationAddress: string;
  status: 'Pickup Pending' | 'In Transit' | 'Delivered' | 'Returned';
  workflowStatus: WorkflowStatus;
  sentDate: string;
  estimatedDelivery: string;
  deliveredDate?: string;
  proofOfDelivery?: {
    receivedBy: string;
    signatureUrl?: string;
    photoUrl?: string;
    timestamp: string;
  };
  trackingLogs: { timestamp: string; location: string; status: string; note: string }[];
}

// Module 5: Overtime Management
export interface OvertimeRequest {
  id: string; // OVT-2026-045
  employeeId: string;
  employeeName: string;
  departmentName: string;
  division: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  taskDescription: string;
  hourlyRate: number;
  estimatedAllowance: number;
  attendanceVerified: boolean;
  attendanceIn?: string;
  attendanceOut?: string;
  status: WorkflowStatus;
  approvals: {
    level: 'Manager' | 'HR' | 'GA';
    approverName: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    date?: string;
    comments?: string;
  }[];
}

// Workflow & System Administration
export interface WorkflowAuditLog {
  id: string;
  referenceId: string;
  module: 'Asset' | 'Vehicle' | 'Maintenance' | 'Messenger' | 'Overtime' | 'Master Data' | 'System';
  action: string;
  actorName: string;
  actorRole: UserRole;
  timestamp: string;
  ipAddress: string;
  deviceBrowser: string;
  previousStatus?: string;
  newStatus?: string;
  comment?: string;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'Approval' | 'Maintenance' | 'Insurance' | 'Tax' | 'Warranty' | 'System';
  read: boolean;
  referenceId?: string;
  module?: string;
}

export interface SystemSetting {
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  autoApprovalThreshold: number;
  sessionTimeoutMinutes: number;
  enable2FA: boolean;
  maintenanceReminderDays: number;
  vehicleTaxReminderDays: number;
  warrantyReminderDays: number;
}
