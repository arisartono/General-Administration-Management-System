import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatCurrency } from '../utils/exportUtils';
import {
  UserRole,
  WorkflowStatus,
  Employee,
  Department,
  Vendor,
  Location,
  AssetCategory,
  Asset,
  Vehicle,
  VehicleBooking,
  FuelLog,
  MaintenanceRequest,
  ServiceLog,
  MessengerDelivery,
  OvertimeRequest,
  WorkflowAuditLog,
  InAppNotification,
  SystemSetting
} from '../types/gams';
import {
  mockEmployees,
  mockDepartments,
  mockVendors,
  mockLocations,
  mockAssetCategories,
  mockAssets,
  mockVehicles,
  mockVehicleBookings,
  mockFuelLogs,
  mockMaintenanceRequests,
  mockServiceLogs,
  mockMessengerDeliveries,
  mockOvertimeRequests,
  mockAuditLogs,
  mockNotifications,
  defaultSystemSettings
} from '../data/mockData';

interface GamsContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: Employee;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Master Data
  employees: Employee[];
  departments: Department[];
  vendors: Vendor[];
  locations: Location[];
  assetCategories: AssetCategory[];
  addEmployee: (emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addVendor: (v: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  deleteDepartment: (id: string) => void;
  deleteLocation: (id: string) => void;
  deleteAssetCategory: (id: string) => void;

  // Modules
  assets: Asset[];
  vehicles: Vehicle[];
  vehicleBookings: VehicleBooking[];
  fuelLogs: FuelLog[];
  maintenanceRequests: MaintenanceRequest[];
  serviceLogs: ServiceLog[];
  messengerDeliveries: MessengerDelivery[];
  overtimeRequests: OvertimeRequest[];

  // Workflow & Audit & Notifs
  auditLogs: WorkflowAuditLog[];
  notifications: InAppNotification[];
  systemSettings: SystemSetting;

  // Handlers
  updateWorkflowStatus: (
    module: 'Asset' | 'Vehicle' | 'Maintenance' | 'Messenger' | 'Overtime',
    id: string,
    newStatus: WorkflowStatus,
    comment?: string
  ) => void;

  addAsset: (asset: Partial<Asset>) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;

  addVehicle: (veh: Partial<Vehicle>) => void;
  updateVehicle: (id: string, veh: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addVehicleBooking: (booking: Partial<VehicleBooking>) => void;
  deleteVehicleBooking: (id: string) => void;
  addFuelLog: (log: Partial<FuelLog>) => void;
  deleteFuelLog: (id: string) => void;

  addMaintenanceRequest: (req: Partial<MaintenanceRequest>) => void;
  updateMaintenanceRequest: (id: string, req: Partial<MaintenanceRequest>) => void;
  deleteMaintenanceRequest: (id: string) => void;
  addServiceLog: (log: Partial<ServiceLog>) => void;
  deleteServiceLog: (id: string) => void;

  addMessengerDelivery: (delivery: Partial<MessengerDelivery>) => void;
  updateMessengerDelivery: (id: string, delivery: Partial<MessengerDelivery>) => void;
  deleteMessengerDelivery: (id: string) => void;

  addOvertimeRequest: (ovt: Partial<OvertimeRequest>) => void;
  updateOvertimeRequest: (id: string, ovt: Partial<OvertimeRequest>) => void;
  deleteOvertimeRequest: (id: string) => void;

  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  updateSettings: (settings: Partial<SystemSetting>) => void;

  // Active Search Query
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
}

const GamsContext = createContext<GamsContextType | undefined>(undefined);

export const GamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('General Administration Manager');
  const [currentUser] = useState<Employee>(mockEmployees[0]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [assetCategories, setAssetCategories] = useState<AssetCategory[]>(mockAssetCategories);

  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [vehicleBookings, setVehicleBookings] = useState<VehicleBooking[]>(mockVehicleBookings);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(mockFuelLogs);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(mockMaintenanceRequests);
  const [serviceLogs, setServiceLogs] = useState<ServiceLog[]>(mockServiceLogs);
  const [messengerDeliveries, setMessengerDeliveries] = useState<MessengerDelivery[]>(mockMessengerDeliveries);
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>(mockOvertimeRequests);

  const [auditLogs, setAuditLogs] = useState<WorkflowAuditLog[]>(mockAuditLogs);
  const [notifications, setNotifications] = useState<InAppNotification[]>(mockNotifications);
  const [systemSettings, setSystemSettings] = useState<SystemSetting>(defaultSystemSettings);

  // Sync dark class on body element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addAuditLog = (
    module: 'Asset' | 'Vehicle' | 'Maintenance' | 'Messenger' | 'Overtime' | 'Master Data' | 'System',
    referenceId: string,
    action: string,
    prevStatus?: string,
    newStatus?: string,
    comment?: string
  ) => {
    const newLog: WorkflowAuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      referenceId,
      module,
      action,
      actorName: currentUser.name,
      actorRole: currentRole,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: '192.168.1.100',
      deviceBrowser: 'Enterprise Web Client (Chrome 126)',
      previousStatus: prevStatus,
      newStatus: newStatus,
      comment
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const updateWorkflowStatus = (
    module: 'Asset' | 'Vehicle' | 'Maintenance' | 'Messenger' | 'Overtime',
    id: string,
    newStatus: WorkflowStatus,
    comment?: string
  ) => {
    let prevStatus = '';

    if (module === 'Asset') {
      setAssets((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            prevStatus = item.workflowStatus;
            return { ...item, workflowStatus: newStatus };
          }
          return item;
        })
      );
    } else if (module === 'Vehicle') {
      setVehicleBookings((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            prevStatus = item.status;
            return { ...item, status: newStatus, approvedBy: currentUser.name };
          }
          return item;
        })
      );
    } else if (module === 'Maintenance') {
      setMaintenanceRequests((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            prevStatus = item.status;
            return { ...item, status: newStatus };
          }
          return item;
        })
      );
    } else if (module === 'Messenger') {
      setMessengerDeliveries((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            prevStatus = item.workflowStatus;
            return { ...item, workflowStatus: newStatus };
          }
          return item;
        })
      );
    } else if (module === 'Overtime') {
      setOvertimeRequests((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            prevStatus = item.status;
            return { ...item, status: newStatus };
          }
          return item;
        })
      );
    }

    addAuditLog(module, id, `${module.toUpperCase()}_STATUS_CHANGED`, prevStatus, newStatus, comment);

    // Add In-App Notification
    const notif: InAppNotification = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: `${module} Request Updated`,
      message: `${id} status changed to ${newStatus} by ${currentUser.name}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: 'Approval',
      read: false,
      referenceId: id,
      module
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Asset Actions
  const addAsset = (asset: Partial<Asset>) => {
    const id = `AST-2026-${(assets.length + 1).toString().padStart(3, '0')}`;
    const newAsset: Asset = {
      id,
      name: asset.name || 'New Asset',
      categoryId: asset.categoryId || 'CAT-IT',
      categoryName: asset.categoryName || 'IT',
      brandModel: asset.brandModel || 'Generic Brand Model',
      serialNumber: asset.serialNumber || `SN-${Date.now().toString().slice(-6)}`,
      locationId: asset.locationId || 'LOC-02',
      locationName: asset.locationName || 'HQ Tower A - 4th Floor',
      assignedEmployeeName: asset.assignedEmployeeName,
      purchaseDate: asset.purchaseDate || new Date().toISOString().slice(0, 10),
      purchaseCost: asset.purchaseCost || 10000000,
      salvageValue: asset.salvageValue || 1000000,
      usefulLifeYears: asset.usefulLifeYears || 5,
      currentBookValue: asset.purchaseCost || 10000000,
      status: 'Active',
      warrantyExpiry: asset.warrantyExpiry || '2028-12-31',
      qrCodeData: `https://gams.corp/qr/${id}`,
      barcodeData: id.replace(/-/g, ''),
      condition: asset.condition || 'Good',
      photoUrl: asset.photoUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      workflowStatus: 'Submitted',
      history: [
        {
          id: `HIS-${Date.now().toString().slice(-4)}`,
          assetId: id,
          type: 'Transfer',
          date: new Date().toISOString().slice(0, 10),
          fromLocationOrUser: 'Vendor Intake',
          toLocationOrUser: asset.assignedEmployeeName || asset.locationName || 'Storage',
          notes: 'Asset Initial Registration',
          approvedBy: currentUser.name
        }
      ]
    };
    setAssets((prev) => [newAsset, ...prev]);
    addAuditLog('Asset', id, 'ASSET_REGISTERED', undefined, 'Submitted', 'Registered new asset into system');
  };

  const updateAsset = (id: string, assetData: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...assetData } : item))
    );
    addAuditLog('Asset', id, 'ASSET_UPDATED', undefined, undefined, 'Updated asset properties');
  };

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((item) => item.id !== id));
    addAuditLog('Asset', id, 'ASSET_DELETED', undefined, undefined, 'Asset removed from inventory');
  };

  // Vehicle Actions
  const addVehicle = (veh: Partial<Vehicle>) => {
    const id = veh.id || `B ${Math.floor(1000 + Math.random() * 9000)} GAMS`;
    const newVeh: Vehicle = {
      id,
      brandModel: veh.brandModel || 'Toyota Commercial Van',
      type: veh.type || 'Van',
      year: veh.year || 2024,
      color: veh.color || 'White',
      assignedDriverName: veh.assignedDriverName || 'Pool Driver',
      status: 'Available',
      currentMileageKm: veh.currentMileageKm || 5000,
      fuelType: veh.fuelType || 'Gasoline (RON 92)',
      stnkExpiry: veh.stnkExpiry || '2027-12-31',
      kirExpiry: veh.kirExpiry || '2027-12-31',
      insuranceExpiry: veh.insuranceExpiry || '2027-12-31',
      taxExpiry: veh.taxExpiry || '2027-12-31',
      lastServiceDate: new Date().toISOString().slice(0, 10),
      nextServiceKm: (veh.currentMileageKm || 5000) + 10000,
      photoUrl: veh.photoUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400'
    };
    setVehicles((prev) => [newVeh, ...prev]);
    addAuditLog('Vehicle', id, 'VEHICLE_ADDED', undefined, 'Available', 'Registered new vehicle');
  };

  const updateVehicle = (id: string, vehData: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...vehData } : item))
    );
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((item) => item.id !== id));
    addAuditLog('Vehicle', id, 'VEHICLE_DELETED', undefined, undefined, 'Vehicle removed from fleet');
  };

  const addVehicleBooking = (booking: Partial<VehicleBooking>) => {
    const id = `REQ-2409-${(vehicleBookings.length + 1).toString().padStart(3, '0')}`;
    const newBooking: VehicleBooking = {
      id,
      vehicleId: booking.vehicleId || vehicles[0]?.id || 'B 1982 GAMS',
      vehiclePlate: booking.vehiclePlate || vehicles[0]?.id || 'B 1982 GAMS',
      vehicleName: booking.vehicleName || 'Corporate Fleet Vehicle',
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      departmentName: currentUser.departmentName,
      destination: booking.destination || 'Client Meeting Site',
      purpose: booking.purpose || 'Official Business Trip',
      startDate: booking.startDate || new Date().toISOString().slice(0, 16),
      endDate: booking.endDate || new Date().toISOString().slice(0, 16),
      status: 'Submitted'
    };
    setVehicleBookings((prev) => [newBooking, ...prev]);
    addAuditLog('Vehicle', id, 'VEHICLE_BOOKING_SUBMITTED', undefined, 'Submitted', 'Submitted vehicle reservation');
  };

  const deleteVehicleBooking = (id: string) => {
    setVehicleBookings((prev) => prev.filter((item) => item.id !== id));
    addAuditLog('Vehicle', id, 'VEHICLE_BOOKING_DELETED', undefined, undefined, 'Vehicle booking canceled and removed');
  };

  const addFuelLog = (log: Partial<FuelLog>) => {
    const newLog: FuelLog = {
      id: `FL-${Date.now().toString().slice(-4)}`,
      vehicleId: log.vehicleId || vehicles[0]?.id || 'B 1982 GAMS',
      vehiclePlate: log.vehiclePlate || vehicles[0]?.id || 'B 1982 GAMS',
      date: log.date || new Date().toISOString().slice(0, 10),
      driverName: log.driverName || currentUser.name,
      liters: log.liters || 40,
      costPerLiter: log.costPerLiter || 13800,
      totalCost: (log.liters || 40) * (log.costPerLiter || 13800),
      odometerKm: log.odometerKm || 29000,
      receiptNumber: log.receiptNumber || `SPBU-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setFuelLogs((prev) => [newLog, ...prev]);
  };

  const deleteFuelLog = (id: string) => {
    setFuelLogs((prev) => prev.filter((item) => item.id !== id));
  };

  // Maintenance Actions
  const addMaintenanceRequest = (req: Partial<MaintenanceRequest>) => {
    const id = `WO-2026-${(maintenanceRequests.length + 1).toString().padStart(3, '0')}`;
    const initialWorkStatus = req.workExecutionStatus || (req.status === 'Completed' ? 'Done' : 'On-Going');
    const newWO: MaintenanceRequest = {
      id,
      title: req.title || 'Facility Maintenance Work Order',
      type: req.type || 'Corrective',
      targetType: req.targetType || 'Asset',
      targetName: req.targetName || 'Office Equipment',
      targetId: req.targetId || 'AST-001',
      description: req.description || 'Issue detected during inspection.',
      priority: req.priority || 'Medium',
      requestedBy: currentUser.name,
      departmentName: currentUser.departmentName,
      assignedTechnicianOrVendor: req.assignedTechnicianOrVendor || 'In-house GA Technician',
      vendorId: req.vendorId,
      assignedPicId: req.assignedPicId,
      assignedPicName: req.assignedPicName,
      assignedPicEmail: req.assignedPicEmail,
      estimatedCost: req.estimatedCost || 1500000,
      actualCost: req.actualCost || 0,
      estimatedDate: req.estimatedDate || new Date(Date.now() + 604800000).toISOString().slice(0, 10),
      workExecutionStatus: initialWorkStatus,
      status: req.status || 'Submitted',
      checklistItems: req.checklistItems || [
        { id: 'c1', label: 'Initial Site Safety Assessment', done: false },
        { id: 'c2', label: 'Replacement Parts Verified', done: false },
        { id: 'c3', label: 'Final Functionality Test', done: false }
      ],
      attachments: req.attachments || [
        { name: 'Penawaran_Vendor_Estimasi.pdf', url: '#', size: '1.2 MB', date: new Date().toISOString().slice(0, 10) }
      ]
    };
    setMaintenanceRequests((prev) => [newWO, ...prev]);
    addAuditLog('Maintenance', id, 'MAINTENANCE_WO_CREATED', undefined, newWO.status, `Created ${newWO.type} Work Order for ${newWO.targetName}`);

    if (newWO.assignedPicName) {
      const picNotif: InAppNotification = {
        id: `NTF-${Date.now().toString().slice(-4)}`,
        title: `📧 Email Disampaikan: Assignment WO ${id}`,
        message: `Work Order ${id} ditugaskan ke ${newWO.assignedPicName} (${newWO.assignedPicEmail || 'pic@gams-corp.com'}). Email notifikasi penugasan telah berhasil dikirim.`,
        timestamp: 'Baru saja',
        type: 'System',
        read: false,
        referenceId: id,
        module: 'Maintenance'
      };
      setNotifications((prev) => [picNotif, ...prev]);
    }
  };

  const updateMaintenanceRequest = (id: string, reqData: Partial<MaintenanceRequest>) => {
    setMaintenanceRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...reqData } : item))
    );
  };

  const deleteMaintenanceRequest = (id: string) => {
    setMaintenanceRequests((prev) => prev.filter((item) => item.id !== id));
    addAuditLog('Maintenance', id, 'MAINTENANCE_WO_DELETED', undefined, undefined, 'Work order deleted');
  };

  const addServiceLog = (logData: Partial<ServiceLog>) => {
    const logId = `SL-2026-${(serviceLogs.length + 1).toString().padStart(3, '0')}`;
    const newServiceLog: ServiceLog = {
      id: logId,
      workOrderId: logData.workOrderId || 'WO-GENERIC',
      targetType: logData.targetType || 'Asset',
      targetId: logData.targetId || 'UNKNOWN',
      targetName: logData.targetName || 'Item Servis',
      workType: logData.workType || 'Corrective',
      actualWorkDescription: logData.actualWorkDescription || 'Servis dan perbaikan telah diselesaikan dengan baik.',
      actualCompletionDate: logData.actualCompletionDate || new Date().toISOString().slice(0, 10),
      vendorOrTechnician: logData.vendorOrTechnician || 'Teknisi GA',
      totalCost: logData.totalCost || 0,
      invoiceNumber: logData.invoiceNumber || `INV-${Math.floor(10000 + Math.random() * 90000)}`,
      invoiceAttachment: logData.invoiceAttachment || { name: 'Bukti_Invoice_Servis.pdf', url: '#', size: '1.5 MB' },
      createdAt: new Date().toISOString().slice(0, 10)
    };

    setServiceLogs((prev) => [newServiceLog, ...prev]);

    // Also update corresponding Work Order
    if (logData.workOrderId) {
      setMaintenanceRequests((prev) =>
        prev.map((wo) =>
          wo.id === logData.workOrderId
            ? {
                ...wo,
                status: 'Completed',
                workExecutionStatus: 'Done',
                actualCost: newServiceLog.totalCost,
                completedDate: newServiceLog.actualCompletionDate,
                serviceLog: newServiceLog
              }
            : wo
        )
      );
    }

    addAuditLog('Maintenance', newServiceLog.workOrderId, 'SERVICE_LOG_CREATED', 'On-Going', 'Done', `Recorded actual service log: ${formatCurrency(newServiceLog.totalCost, 'IDR')}`);
  };

  const deleteServiceLog = (id: string) => {
    setServiceLogs((prev) => prev.filter((item) => item.id !== id));
    addAuditLog('Maintenance', id, 'SERVICE_LOG_DELETED', undefined, undefined, 'Service log entry deleted');
  };

  // Messenger Actions
  const addMessengerDelivery = (delivery: Partial<MessengerDelivery>) => {
    const id = `COU-2026-${(messengerDeliveries.length + 1).toString().padStart(3, '0')}`;
    const newDelivery: MessengerDelivery = {
      id,
      trackingNumber: `GAMS-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      type: delivery.type || 'Outgoing Document',
      senderName: delivery.senderName || currentUser.name,
      senderDeptOrCompany: delivery.senderDeptOrCompany || currentUser.departmentName,
      recipientName: delivery.recipientName || 'External Recipient',
      recipientDeptOrCompany: delivery.recipientDeptOrCompany || 'Client Office',
      courierName: delivery.courierName || 'Assigned Messenger',
      originAddress: delivery.originAddress || 'GAMS Headquarters',
      destinationAddress: delivery.destinationAddress || 'Destination Office Address',
      status: 'Pickup Pending',
      workflowStatus: 'Submitted',
      sentDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      estimatedDelivery: new Date(Date.now() + 86400000).toISOString().replace('T', ' ').slice(0, 16),
      trackingLogs: [
        {
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          location: 'GA Dispatch Mailroom',
          status: 'Pickup Pending',
          note: 'Document registered for dispatch'
        }
      ]
    };
    setMessengerDeliveries((prev) => [newDelivery, ...prev]);
    addAuditLog('Messenger', id, 'DELIVERY_DISPATCHED', undefined, 'Submitted', 'Dispatched new courier parcel/document');
  };

  const updateMessengerDelivery = (id: string, deliveryData: Partial<MessengerDelivery>) => {
    setMessengerDeliveries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...deliveryData } : item))
    );
  };

  const deleteMessengerDelivery = (id: string) => {
    setMessengerDeliveries((prev) => prev.filter((item) => item.id !== id));
    addAuditLog('Messenger', id, 'DELIVERY_DELETED', undefined, undefined, 'Messenger delivery record removed');
  };

  // Overtime Actions
  const addOvertimeRequest = (ovt: Partial<OvertimeRequest>) => {
    const id = `OVT-2026-${(overtimeRequests.length + 1).toString().padStart(3, '0')}`;
    const hours = ovt.totalHours || 3;
    const rate = ovt.hourlyRate || 75000;
    const newOvt: OvertimeRequest = {
      id,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      departmentName: currentUser.departmentName,
      division: currentUser.division,
      date: ovt.date || new Date().toISOString().slice(0, 10),
      startTime: ovt.startTime || '17:00',
      endTime: ovt.endTime || '20:00',
      totalHours: hours,
      taskDescription: ovt.taskDescription || 'Operational overtime work',
      hourlyRate: rate,
      estimatedAllowance: hours * rate,
      attendanceVerified: true,
      attendanceIn: '08:00',
      attendanceOut: '20:10',
      status: 'Submitted',
      approvals: [
        { level: 'Manager', approverName: 'Department Head', status: 'Pending' },
        { level: 'HR', approverName: 'HR Officer', status: 'Pending' },
        { level: 'GA', approverName: 'GA Manager', status: 'Pending' }
      ]
    };
    setOvertimeRequests((prev) => [newOvt, ...prev]);
    addAuditLog('Overtime', id, 'OVERTIME_REQUEST_SUBMITTED', undefined, 'Submitted', 'Submitted overtime request');
  };

  const updateOvertimeRequest = (id: string, ovtData: Partial<OvertimeRequest>) => {
    setOvertimeRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...ovtData } : item))
    );
  };

  const deleteOvertimeRequest = (id: string) => {
    setOvertimeRequests((prev) => prev.filter((item) => item.id !== id));
    addAuditLog('Overtime', id, 'OVERTIME_DELETED', undefined, undefined, 'Overtime request deleted');
  };

  // Master Data Actions
  const addEmployee = (emp: Partial<Employee>) => {
    const id = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEmp: Employee = {
      id,
      name: emp.name || 'New Staff',
      departmentId: emp.departmentId || 'DEPT-GA',
      departmentName: emp.departmentName || 'General Administration',
      division: emp.division || 'Operations',
      position: emp.position || 'Staff',
      phone: emp.phone || '+62 812-0000-0000',
      email: emp.email || 'staff@gams-corp.com',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    };
    setEmployees((prev) => [...prev, newEmp]);
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((item) => item.id !== id));
  };

  const addVendor = (v: Partial<Vendor>) => {
    const id = `VND-${Math.floor(100 + Math.random() * 900)}`;
    const newVendor: Vendor = {
      id,
      code: v.code || `VND-${v.name?.slice(0, 4).toUpperCase()}`,
      name: v.name || 'New Service Vendor',
      category: v.category || 'Facility & Maintenance',
      contactPerson: v.contactPerson || 'Contact Representative',
      phone: v.phone || '+62 21-555-0000',
      email: v.email || 'vendor@partner.co.id',
      address: v.address || 'Jakarta Business Park',
      rating: 4.5
    };
    setVendors((prev) => [...prev, newVendor]);
  };

  const deleteVendor = (id: string) => {
    setVendors((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteLocation = (id: string) => {
    setLocations((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteAssetCategory = (id: string) => {
    setAssetCategories((prev) => prev.filter((item) => item.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateSettings = (settings: Partial<SystemSetting>) => {
    setSystemSettings((prev) => ({ ...prev, ...settings }));
    addAuditLog('System', 'SETTINGS', 'SYSTEM_SETTINGS_UPDATED', undefined, undefined, 'Updated system parameters');
  };

  return (
    <GamsContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        darkMode,
        setDarkMode,
        employees,
        departments,
        vendors,
        locations,
        assetCategories,
        addEmployee,
        deleteEmployee,
        addVendor,
        deleteVendor,
        deleteDepartment,
        deleteLocation,
        deleteAssetCategory,
        assets,
        vehicles,
        vehicleBookings,
        fuelLogs,
        maintenanceRequests,
        serviceLogs,
        messengerDeliveries,
        overtimeRequests,
        auditLogs,
        notifications,
        systemSettings,
        updateWorkflowStatus,
        addAsset,
        updateAsset,
        deleteAsset,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addVehicleBooking,
        deleteVehicleBooking,
        addFuelLog,
        deleteFuelLog,
        addMaintenanceRequest,
        updateMaintenanceRequest,
        deleteMaintenanceRequest,
        addServiceLog,
        deleteServiceLog,
        addMessengerDelivery,
        updateMessengerDelivery,
        deleteMessengerDelivery,
        addOvertimeRequest,
        updateOvertimeRequest,
        deleteOvertimeRequest,
        markNotificationRead,
        clearNotifications,
        updateSettings,
        globalSearchQuery,
        setGlobalSearchQuery
      }}
    >
      {children}
    </GamsContext.Provider>
  );
};

export const useGams = () => {
  const context = useContext(GamsContext);
  if (!context) {
    throw new Error('useGams must be used within a GamsProvider');
  }
  return context;
};
