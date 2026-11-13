import {
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

export const mockEmployees: Employee[] = [
  {
    id: 'EMP-1001',
    name: 'Michael Scott',
    departmentId: 'DEPT-GA',
    departmentName: 'General Administration',
    division: 'Operations',
    position: 'GA Manager',
    phone: '+62 812-3456-7890',
    email: 'm.scott@gams-corp.com',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  {
    id: 'EMP-1002',
    name: 'Dwight Schrute',
    departmentId: 'DEPT-GA',
    departmentName: 'General Administration',
    division: 'Operations',
    position: 'GA Senior Officer',
    phone: '+62 813-9876-5432',
    email: 'd.schrute@gams-corp.com',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 'EMP-1003',
    name: 'Jim Halpert',
    departmentId: 'DEPT-IT',
    departmentName: 'Information Technology',
    division: 'Technology',
    position: 'Head of IT',
    phone: '+62 811-2233-4455',
    email: 'j.halpert@gams-corp.com',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  {
    id: 'EMP-1004',
    name: 'Pam Beesly',
    departmentId: 'DEPT-HR',
    departmentName: 'Human Resources',
    division: 'Corporate Services',
    position: 'HR Administrator',
    phone: '+62 815-6677-8899',
    email: 'p.beesly@gams-corp.com',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    id: 'EMP-1005',
    name: 'Angela Martin',
    departmentId: 'DEPT-FIN',
    departmentName: 'Finance & Accounting',
    division: 'Finance',
    position: 'Finance Manager',
    phone: '+62 817-4433-2211',
    email: 'a.martin@gams-corp.com',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
  }
];

export const mockDepartments: Department[] = [
  { id: 'DEPT-GA', code: 'GA', name: 'General Administration', headName: 'Michael Scott', employeeCount: 14 },
  { id: 'DEPT-IT', code: 'IT', name: 'Information Technology', headName: 'Jim Halpert', employeeCount: 22 },
  { id: 'DEPT-HR', code: 'HR', name: 'Human Resources', headName: 'Pam Beesly', employeeCount: 10 },
  { id: 'DEPT-FIN', code: 'FIN', name: 'Finance & Accounting', headName: 'Angela Martin', employeeCount: 18 },
  { id: 'DEPT-MKT', code: 'MKT', name: 'Sales & Marketing', headName: 'Ryan Howard', employeeCount: 35 }
];

export const mockVendors: Vendor[] = [
  {
    id: 'VND-001',
    code: 'VND-TECH',
    name: 'PT Mitra Teknologi Utama',
    category: 'IT Hardware',
    contactPerson: 'Budi Santoso',
    phone: '+62 21-555-0192',
    email: 'sales@mitratech.co.id',
    address: 'Gedung Cyber 2 Lt. 12, Jl. HR Rasuna Said, Jakarta',
    rating: 4.8
  },
  {
    id: 'VND-002',
    code: 'VND-AUTO',
    name: 'Auto2000 Service Center',
    category: 'Vehicle Service',
    contactPerson: 'Hendra Wijaya',
    phone: '+62 21-555-0188',
    email: 'service@auto2000-partner.id',
    address: 'Jl. Sudirman No. 45, Jakarta Selatan',
    rating: 4.9
  },
  {
    id: 'VND-003',
    code: 'VND-FAC',
    name: 'PT Clean & Cool Facilities',
    category: 'Facility & Maintenance',
    contactPerson: 'Siti Rahma',
    phone: '+62 21-555-0144',
    email: 'helpdesk@cleancool.co.id',
    address: 'Kawasan Industri Pulogadung Blok C3, Jakarta',
    rating: 4.6
  },
  {
    id: 'VND-004',
    code: 'VND-EXPR',
    name: 'JNE Express Corporate',
    category: 'Courier',
    contactPerson: 'Dedi Kurniawan',
    phone: '+62 21-555-0111',
    email: 'corp@jne-service.co.id',
    address: 'Jl. Tomang Raya No. 11, Jakarta Barat',
    rating: 4.7
  }
];

export const mockLocations: Location[] = [
  { id: 'LOC-01', building: 'Headquarters Tower A', floor: '3rd Floor', room: 'Server Room A-301', fullLocation: 'HQ Tower A - 3rd Floor - Server Room A-301' },
  { id: 'LOC-02', building: 'Headquarters Tower A', floor: '4th Floor', room: 'GA Office & Storage', fullLocation: 'HQ Tower A - 4th Floor - GA Office & Storage' },
  { id: 'LOC-03', building: 'Headquarters Tower A', floor: '5th Floor', room: 'Executive Boardroom', fullLocation: 'HQ Tower A - 5th Floor - Executive Boardroom' },
  { id: 'LOC-04', building: 'Logistics Warehouse B', floor: '1st Floor', room: 'Fleet Parking & Bay', fullLocation: 'Warehouse B - 1st Floor - Fleet Parking Bay' }
];

export const mockAssetCategories: AssetCategory[] = [
  { id: 'CAT-IT', code: 'IT', name: 'IT', usefulLifeYears: 4, depreciationRatePercent: 25, description: 'Laptops, Desktops, Servers, Printers, Monitors' },
  { id: 'CAT-FUR', code: 'FUR', name: 'Furniture', usefulLifeYears: 8, depreciationRatePercent: 12.5, description: 'Office Desks, Ergonomic Chairs, Filing Cabinets' },
  { id: 'CAT-MCH', code: 'MCH', name: 'Machinery', usefulLifeYears: 10, depreciationRatePercent: 10, description: 'Generators, Industrial HVAC, Printing Presses' },
  { id: 'CAT-ELE', code: 'ELE', name: 'Electronic', usefulLifeYears: 5, depreciationRatePercent: 20, description: 'Projectors, Televisions, Air Conditioners' },
  { id: 'CAT-VEH', code: 'VEH', name: 'Vehicle', usefulLifeYears: 5, depreciationRatePercent: 20, description: 'Operational Cars, Vans, Delivery Motorcycles' }
];

export const mockAssets: Asset[] = [
  {
    id: 'AST-2024-001',
    name: 'Dell XPS 15 9530 Workstation',
    categoryId: 'CAT-IT',
    categoryName: 'IT',
    brandModel: 'Dell XPS 15 (i9 / 32GB RAM / 1TB SSD)',
    serialNumber: 'SN-DELL-99821X',
    locationId: 'LOC-02',
    locationName: 'HQ Tower A - 4th Floor - GA Office',
    assignedEmployeeId: 'EMP-1002',
    assignedEmployeeName: 'Dwight Schrute',
    purchaseDate: '2024-01-15',
    purchaseCost: 28500000,
    salvageValue: 2850000,
    usefulLifeYears: 4,
    currentBookValue: 18525000,
    status: 'In Use',
    warrantyExpiry: '2027-01-15',
    insuranceExpiry: '2026-12-31',
    insurancePolicyNo: 'INS-POL-88219',
    qrCodeData: 'https://gams.corp/qr/AST-2024-001',
    barcodeData: 'AST2024001',
    condition: 'Good',
    photoUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
    attachments: [
      { name: 'Purchase_Invoice_DELL.pdf', url: '#', size: '1.2 MB', date: '2024-01-15' },
      { name: 'Warranty_Card_Dell.pdf', url: '#', size: '450 KB', date: '2024-01-15' }
    ],
    history: [
      { id: 'HIS-01', assetId: 'AST-2024-001', type: 'Transfer', date: '2024-01-16', fromLocationOrUser: 'IT Storage', toLocationOrUser: 'Dwight Schrute (GA)', notes: 'Initial Issue for Senior GA Officer', approvedBy: 'Jim Halpert' }
    ],
    workflowStatus: 'Approved'
  },
  {
    id: 'AST-2024-002',
    name: 'Herman Miller Aeron Ergonomic Chair',
    categoryId: 'CAT-FUR',
    categoryName: 'Furniture',
    brandModel: 'Herman Miller Aeron Size B Black',
    serialNumber: 'HM-AERON-77312',
    locationId: 'LOC-03',
    locationName: 'HQ Tower A - 5th Floor - Boardroom',
    assignedEmployeeId: 'EMP-1001',
    assignedEmployeeName: 'Michael Scott',
    purchaseDate: '2023-06-10',
    purchaseCost: 18000000,
    salvageValue: 1800000,
    usefulLifeYears: 8,
    currentBookValue: 12150000,
    status: 'In Use',
    warrantyExpiry: '2035-06-10',
    qrCodeData: 'https://gams.corp/qr/AST-2024-002',
    barcodeData: 'AST2024002',
    condition: 'Good',
    photoUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=400',
    workflowStatus: 'Approved'
  },
  {
    id: 'AST-2024-003',
    name: 'Daikin Inverter AC 2.5 HP (Boardroom)',
    categoryId: 'CAT-ELE',
    categoryName: 'Electronic',
    brandModel: 'Daikin FTKM60SV2S',
    serialNumber: 'DKN-AC-2023-99',
    locationId: 'LOC-03',
    locationName: 'HQ Tower A - 5th Floor - Executive Boardroom',
    purchaseDate: '2023-03-20',
    purchaseCost: 14500000,
    salvageValue: 1450000,
    usefulLifeYears: 5,
    currentBookValue: 6525000,
    status: 'Maintenance',
    warrantyExpiry: '2026-03-20',
    qrCodeData: 'https://gams.corp/qr/AST-2024-003',
    barcodeData: 'AST2024003',
    condition: 'Under Repair',
    photoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
    workflowStatus: 'Approved'
  },
  {
    id: 'AST-2024-004',
    name: 'Epson EB-2250U High Brightness Projector',
    categoryId: 'CAT-ELE',
    categoryName: 'Electronic',
    brandModel: 'Epson EB-2250U WUXGA 5000 Lumens',
    serialNumber: 'EPS-PRJ-33412',
    locationId: 'LOC-02',
    locationName: 'HQ Tower A - 4th Floor - GA Storage',
    purchaseDate: '2024-02-10',
    purchaseCost: 22000000,
    salvageValue: 2200000,
    usefulLifeYears: 5,
    currentBookValue: 17600000,
    status: 'Borrowed',
    warrantyExpiry: '2026-02-10',
    qrCodeData: 'https://gams.corp/qr/AST-2024-004',
    barcodeData: 'AST2024004',
    condition: 'Good',
    workflowStatus: 'Approved'
  }
];

export const mockVehicles: Vehicle[] = [
  {
    id: 'B 1982 GAMS',
    brandModel: 'Toyota Innova Zenix Hybrid 2.0 V',
    type: 'MPV',
    year: 2023,
    color: 'Attitude Black Metallic',
    assignedDriverId: 'DRV-001',
    assignedDriverName: 'Bambang Susilo',
    status: 'Available',
    currentMileageKm: 28450,
    fuelType: 'Gasoline (RON 92)',
    stnkExpiry: '2026-08-15',
    kirExpiry: '2026-09-10',
    insuranceExpiry: '2026-11-30',
    taxExpiry: '2026-08-15',
    lastServiceDate: '2026-06-10',
    nextServiceKm: 30000,
    photoUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400'
  },
  {
    id: 'B 2210 GAMS',
    brandModel: 'Toyota Fortuner 2.8 GR Sport 4x2',
    type: 'SUV',
    year: 2024,
    color: 'Super White',
    assignedDriverId: 'DRV-002',
    assignedDriverName: 'Agus Setiawan',
    status: 'In Trip',
    currentMileageKm: 14200,
    fuelType: 'Diesel',
    stnkExpiry: '2027-02-20',
    kirExpiry: '2026-12-05',
    insuranceExpiry: '2027-02-20',
    taxExpiry: '2027-02-20',
    lastServiceDate: '2026-05-18',
    nextServiceKm: 20000,
    photoUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400'
  },
  {
    id: 'B 9081 GAMS',
    brandModel: 'Daihatsu Gran Max Blind Van 1.5',
    type: 'Van',
    year: 2022,
    color: 'Silver Metallic',
    assignedDriverId: 'DRV-003',
    assignedDriverName: 'Rahmat Hidayat',
    status: 'In Maintenance',
    currentMileageKm: 62100,
    fuelType: 'Gasoline (RON 92)',
    stnkExpiry: '2026-08-05', // Expiry notice soon!
    kirExpiry: '2026-08-10', // Expiry notice soon!
    insuranceExpiry: '2026-10-15',
    taxExpiry: '2026-08-05',
    lastServiceDate: '2026-07-20',
    nextServiceKm: 65000,
    photoUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400'
  }
];

export const mockVehicleBookings: VehicleBooking[] = [
  {
    id: 'REQ-2409-004',
    vehicleId: 'B 1982 GAMS',
    vehiclePlate: 'B 1982 GAMS',
    vehicleName: 'Toyota Innova Zenix Hybrid',
    employeeId: 'EMP-1002',
    employeeName: 'Dwight Schrute',
    departmentName: 'General Administration',
    driverId: 'DRV-001',
    driverName: 'Bambang Susilo',
    destination: 'Ministry of Industry Office & Vendor Plant B',
    purpose: 'Official Site Audit & Document Submission',
    startDate: '2026-07-26 08:30',
    endDate: '2026-07-26 17:00',
    status: 'Approved',
    approvedBy: 'Michael Scott'
  },
  {
    id: 'REQ-2409-012',
    vehicleId: 'B 2210 GAMS',
    vehiclePlate: 'B 2210 GAMS',
    vehicleName: 'Toyota Fortuner GR Sport',
    employeeId: 'EMP-1003',
    employeeName: 'Jim Halpert',
    departmentName: 'Information Technology',
    driverId: 'DRV-002',
    driverName: 'Agus Setiawan',
    destination: 'Data Center BSD Serpong',
    purpose: 'Quarterly Infrastructure Hardware Inspection',
    startDate: '2026-07-27 09:00',
    endDate: '2026-07-27 16:00',
    status: 'Submitted'
  }
];

export const mockFuelLogs: FuelLog[] = [
  { id: 'FL-001', vehicleId: 'B 1982 GAMS', vehiclePlate: 'B 1982 GAMS', date: '2026-07-20', driverName: 'Bambang Susilo', liters: 45, costPerLiter: 13800, totalCost: 621000, odometerKm: 28100, receiptNumber: 'INV-SPBU-9021' },
  { id: 'FL-002', vehicleId: 'B 2210 GAMS', vehiclePlate: 'B 2210 GAMS', date: '2026-07-22', driverName: 'Agus Setiawan', liters: 55, costPerLiter: 15200, totalCost: 836000, odometerKm: 14050, receiptNumber: 'INV-SPBU-9099' }
];

export const mockServiceLogs: ServiceLog[] = [
  {
    id: 'SL-2026-001',
    workOrderId: 'WO-2026-081',
    targetType: 'Asset',
    targetId: 'AST-2024-001',
    targetName: 'Dell XPS 15 9530 Workstation',
    workType: 'Preventive',
    actualWorkDescription: 'Pembersihan heatsink internal, penggantian thermal paste CPU/GPU, dan reinstall driver grafis.',
    actualCompletionDate: '2026-07-22',
    vendorOrTechnician: 'PT IT Solutions Nusantara',
    totalCost: 1250000,
    invoiceNumber: 'INV-ITS-2026-092',
    invoiceAttachment: { name: 'Invoice_ITS_Service_Dell.pdf', url: '#', size: '1.1 MB' },
    createdAt: '2026-07-22'
  }
];

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'WO-2026-088',
    title: 'AC Central Compressor Repair & Freon Refill',
    type: 'Corrective',
    targetType: 'Asset',
    targetName: 'Daikin Inverter AC 2.5 HP (Boardroom)',
    targetId: 'AST-2024-003',
    description: 'Pemeriksaan kebocoran freon R32, penggantian kapasitor outdoor compressor 45uF, pencucian evakuasi unit indoor/outdoor, dan pengisian ulang freon R32 hingga tekanan standar 140 PSI.',
    priority: 'High',
    requestedBy: 'Pam Beesly',
    departmentName: 'General Administration',
    assignedTechnicianOrVendor: 'PT Clean & Cool Facilities',
    vendorId: 'VND-003',
    assignedPicId: 'EMP-1002',
    assignedPicName: 'Dwight Schrute',
    assignedPicEmail: 'd.schrute@gams-corp.com',
    estimatedCost: 3500000,
    actualCost: 3200000,
    estimatedDate: '2026-07-28',
    workExecutionStatus: 'On-Going',
    startDate: '2026-07-24',
    status: 'Approved',
    sparepartsUsed: [
      { name: 'Compressor Capacitor 45uF', qty: 1, unitCost: 450000 },
      { name: 'R32 Refrigerant Gas Refill', qty: 2, unitCost: 375000 }
    ],
    checklistItems: [
      { id: 'chk-1', label: 'Safety lockout/tagout completed', done: true },
      { id: 'chk-2', label: 'Pressure leakage test passed', done: true },
      { id: 'chk-3', label: 'Temperature output measured at 18°C', done: false }
    ],
    attachments: [
      { name: 'Penawaran_Perbaikan_AC_CleanCool.pdf', url: '#', size: '850 KB', date: '2026-07-23' }
    ]
  },
  {
    id: 'WO-2026-092',
    title: 'Periodic 30,000 KM Engine Service & Wheel Alignment',
    type: 'Preventive',
    targetType: 'Vehicle',
    targetName: 'Toyota Innova Zenix Hybrid (B 1982 GAMS)',
    targetId: 'B 1982 GAMS',
    description: 'Servis berkala 30.000 KM meliputi ganti oli mesin sintetis 0W-20, ganti filter oli & filter udara, pembersihan kampas rem 4 roda, serta spooring & balancing roda depan.',
    priority: 'Medium',
    requestedBy: 'Dwight Schrute',
    departmentName: 'General Administration',
    assignedTechnicianOrVendor: 'Auto2000 Service Center',
    vendorId: 'VND-002',
    estimatedCost: 2800000,
    actualCost: 0,
    estimatedDate: '2026-08-02',
    workExecutionStatus: 'Pending',
    status: 'Submitted',
    attachments: [
      { name: 'Estimasi_Biaya_Auto2000_Zenix.pdf', url: '#', size: '1.4 MB', date: '2026-07-24' }
    ]
  },
  {
    id: 'WO-2026-081',
    title: 'Preventive Overhaul & Thermal Paste Replacement',
    type: 'Preventive',
    targetType: 'Asset',
    targetName: 'Dell XPS 15 9530 Workstation',
    targetId: 'AST-2024-001',
    description: 'Perawatan rutin laptop workstation GA untuk mencegah overheating dan perbaikan fan noise.',
    priority: 'Low',
    requestedBy: 'Dwight Schrute',
    departmentName: 'General Administration',
    assignedTechnicianOrVendor: 'PT IT Solutions Nusantara',
    vendorId: 'VND-001',
    estimatedCost: 1500000,
    actualCost: 1250000,
    estimatedDate: '2026-07-22',
    workExecutionStatus: 'Done',
    startDate: '2026-07-21',
    completedDate: '2026-07-22',
    status: 'Completed',
    attachments: [
      { name: 'Penawaran_Vendor_ITS.pdf', url: '#', size: '620 KB', date: '2026-07-20' }
    ],
    serviceLog: {
      id: 'SL-2026-001',
      workOrderId: 'WO-2026-081',
      targetType: 'Asset',
      targetId: 'AST-2024-001',
      targetName: 'Dell XPS 15 9530 Workstation',
      workType: 'Preventive',
      actualWorkDescription: 'Pembersihan heatsink internal, penggantian thermal paste CPU/GPU, dan reinstall driver grafis.',
      actualCompletionDate: '2026-07-22',
      vendorOrTechnician: 'PT IT Solutions Nusantara',
      totalCost: 1250000,
      invoiceNumber: 'INV-ITS-2026-092',
      invoiceAttachment: { name: 'Invoice_ITS_Service_Dell.pdf', url: '#', size: '1.1 MB' },
      createdAt: '2026-07-22'
    }
  }
];

export const mockMessengerDeliveries: MessengerDelivery[] = [
  {
    id: 'COU-2026-102',
    trackingNumber: 'GAMS-EXP-881920',
    type: 'Outgoing Document',
    senderName: 'Michael Scott',
    senderDeptOrCompany: 'General Administration',
    recipientName: 'Director of Taxation - KPP Pratama',
    recipientDeptOrCompany: 'Kawasan Gatot Subroto No 40',
    courierName: 'JNE Express Corporate (Rudi Hartono)',
    originAddress: 'HQ Tower A 4th Floor',
    destinationAddress: 'KPP Pratama Gatot Subroto, Jakarta Pusat',
    status: 'In Transit',
    workflowStatus: 'Approved',
    sentDate: '2026-07-25 10:00',
    estimatedDelivery: '2026-07-25 16:00',
    trackingLogs: [
      { timestamp: '2026-07-25 10:00', location: 'GA Mailroom HQ', status: 'Pickup Completed', note: 'Handed over to JNE Express Courier' },
      { timestamp: '2026-07-25 12:30', location: 'JNE Sorting Hub South Jakarta', status: 'In Transit', note: 'Out for final delivery' }
    ]
  },
  {
    id: 'COU-2026-105',
    trackingNumber: 'GAMS-INC-990112',
    type: 'Incoming Document',
    senderName: 'PT Bank Central Asia Tbk',
    senderDeptOrCompany: 'BCA Corporate Credit Dept',
    recipientName: 'Angela Martin',
    recipientDeptOrCompany: 'Finance & Accounting',
    courierName: 'Internal Messenger (Eko)',
    originAddress: 'Menara BCA Grand Indonesia',
    destinationAddress: 'HQ Tower A 5th Floor Finance',
    status: 'Delivered',
    workflowStatus: 'Completed',
    sentDate: '2026-07-24 14:00',
    estimatedDelivery: '2026-07-24 16:30',
    deliveredDate: '2026-07-24 16:15',
    proofOfDelivery: {
      receivedBy: 'Angela Martin',
      signatureUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M10,25 Q30,5 50,25 T90,15" fill="none" stroke="black" stroke-width="2"/></svg>',
      timestamp: '2026-07-24 16:15'
    },
    trackingLogs: [
      { timestamp: '2026-07-24 14:00', location: 'Lobby Reception', status: 'Received at Security', note: 'Verified envelope sealed' },
      { timestamp: '2026-07-24 16:15', location: 'Finance Desk', status: 'Delivered', note: 'Signed by recipient Angela Martin' }
    ]
  }
];

export const mockOvertimeRequests: OvertimeRequest[] = [
  {
    id: 'OVT-2026-045',
    employeeId: 'EMP-1004',
    employeeName: 'Pam Beesly',
    departmentName: 'Human Resources',
    division: 'Corporate Services',
    date: '2026-07-24',
    startTime: '17:30',
    endTime: '21:30',
    totalHours: 4,
    taskDescription: 'Q3 Mass Employee Performance Appraisal Data Entry & Synchronization',
    hourlyRate: 75000,
    estimatedAllowance: 300000,
    attendanceVerified: true,
    attendanceIn: '08:02',
    attendanceOut: '21:35',
    status: 'Approved',
    approvals: [
      { level: 'Manager', approverName: 'Pam Beesly (Self HR Manager)', status: 'Approved', date: '2026-07-24 17:00' },
      { level: 'HR', approverName: 'HR Dept', status: 'Approved', date: '2026-07-24 17:15' },
      { level: 'GA', approverName: 'Michael Scott', status: 'Approved', date: '2026-07-25 09:00', comments: 'Verified overtime work in office' }
    ]
  },
  {
    id: 'OVT-2026-048',
    employeeId: 'EMP-1002',
    employeeName: 'Dwight Schrute',
    departmentName: 'General Administration',
    division: 'Operations',
    date: '2026-07-25',
    startTime: '17:00',
    endTime: '21:00',
    totalHours: 4,
    taskDescription: 'Annual Physical Asset Stock Take Audit in Server Room & Storage B',
    hourlyRate: 85000,
    estimatedAllowance: 340000,
    attendanceVerified: true,
    attendanceIn: '07:45',
    attendanceOut: '21:10',
    status: 'Submitted',
    approvals: [
      { level: 'Manager', approverName: 'Michael Scott', status: 'Pending' },
      { level: 'HR', approverName: 'Pam Beesly', status: 'Pending' },
      { level: 'GA', approverName: 'GA Manager', status: 'Pending' }
    ]
  }
];

export const mockAuditLogs: WorkflowAuditLog[] = [
  {
    id: 'AUD-9001',
    referenceId: 'AST-2024-001',
    module: 'Asset',
    action: 'ASSET_REGISTRATION_CREATED',
    actorName: 'Dwight Schrute',
    actorRole: 'General Administration Staff',
    timestamp: '2026-07-25 08:30:12',
    ipAddress: '192.168.1.104',
    deviceBrowser: 'Chrome 126.0 (Windows 11)',
    newStatus: 'Approved',
    comment: 'New Dell XPS Workstation registered into inventory.'
  },
  {
    id: 'AUD-9002',
    referenceId: 'WO-2026-088',
    module: 'Maintenance',
    action: 'WORK_ORDER_APPROVED',
    actorName: 'Michael Scott',
    actorRole: 'General Administration Manager',
    timestamp: '2026-07-25 09:15:44',
    ipAddress: '192.168.1.101',
    deviceBrowser: 'Edge 126.0 (macOS)',
    previousStatus: 'Submitted',
    newStatus: 'Approved',
    comment: 'Approved budget of IDR 3,500,000 for AC compressor repair.'
  }
];

export const mockNotifications: InAppNotification[] = [
  {
    id: 'NOTIF-01',
    title: 'STNK Expiry Alert',
    message: 'Vehicle Daihatsu Gran Max (B 9081 GAMS) STNK expires on 05 Aug 2026 (11 days remaining).',
    timestamp: '2026-07-25 08:00',
    type: 'Tax',
    read: false,
    referenceId: 'B 9081 GAMS',
    module: 'Vehicle'
  },
  {
    id: 'NOTIF-02',
    title: 'Pending Overtime Approval',
    message: 'Overtime request OVT-2026-048 by Dwight Schrute requires your manager approval.',
    timestamp: '2026-07-25 09:00',
    type: 'Approval',
    read: false,
    referenceId: 'OVT-2026-048',
    module: 'Overtime'
  },
  {
    id: 'NOTIF-03',
    title: 'Maintenance Due Alert',
    message: 'Scheduled 30,000 KM service for Toyota Innova Zenix (B 1982 GAMS) is upcoming.',
    timestamp: '2026-07-24 16:30',
    type: 'Maintenance',
    read: true,
    referenceId: 'B 1982 GAMS',
    module: 'Vehicle'
  }
];

export const defaultSystemSettings: SystemSetting = {
  companyName: 'PT GAMS Corporate Indonesia',
  companyAddress: 'GAMS Tower Lt. 15-18, Jl. Jend. Sudirman KAV 52-53, Jakarta Selatan',
  companyEmail: 'ga-admin@gams-corp.com',
  autoApprovalThreshold: 5000000,
  sessionTimeoutMinutes: 30,
  enable2FA: true,
  maintenanceReminderDays: 7,
  vehicleTaxReminderDays: 30,
  warrantyReminderDays: 30
};
