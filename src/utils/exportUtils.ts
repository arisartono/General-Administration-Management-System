import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

/**
 * Export generic array of objects to Excel file
 */
export function exportToExcel(data: Record<string, any>[], filename: string = 'GAMS_Report') {
  if (!data || data.length === 0) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/**
 * Generate and download standard Excel Template for Asset Registry import
 */
export function downloadAssetRegistryTemplate() {
  const templateData = [
    {
      'Asset Name': 'MacBook Pro M3 Max 16"',
      'Brand & Model': 'Apple MacBook Pro M3 36GB',
      'Category': 'IT',
      'Location': 'HQ Tower A - 4th Floor - GA Office',
      'Assigned Employee': 'Andi Pratama',
      'Purchase Cost (IDR)': 35000000,
      'Useful Life (Years)': 4,
      'Warranty Expiry (YYYY-MM-DD)': '2028-12-31'
    },
    {
      'Asset Name': 'Executive Leather Office Chair',
      'Brand & Model': 'Ergohuman Pro Black',
      'Category': 'Furniture',
      'Location': 'HQ Tower A - 5th Floor - Executive Boardroom',
      'Assigned Employee': 'Siti Nurhaliza',
      'Purchase Cost (IDR)': 7500000,
      'Useful Life (Years)': 5,
      'Warranty Expiry (YYYY-MM-DD)': '2027-06-30'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  
  // Set column widths for convenience
  worksheet['!cols'] = [
    { wch: 30 }, // Asset Name
    { wch: 30 }, // Brand & Model
    { wch: 15 }, // Category
    { wch: 40 }, // Location
    { wch: 25 }, // Assigned Employee
    { wch: 20 }, // Purchase Cost
    { wch: 18 }, // Useful Life
    { wch: 25 }  // Warranty Expiry
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Asset_Registry_Template');
  XLSX.writeFile(workbook, 'Template_Asset_Registry_GAMS.xlsx');
}

/**
 * Generate and download standard Excel Template for Vehicle Fleet import
 */
export function downloadVehicleTemplate() {
  const templateData = [
    {
      'License Plate (Nopol)': 'B 1234 GAMS',
      'Brand & Model': 'Toyota Innova Zenix 2.0 V HV',
      'Vehicle Type': 'MPV',
      'Manufacturing Year': 2024,
      'Color': 'Attitude Black',
      'Odometer Reading (KM)': 12500,
      'Assigned Driver': 'Pak Budi Santoso',
      'STNK Expiry (YYYY-MM-DD)': '2028-11-15',
      'KIR Expiry (YYYY-MM-DD)': '2027-05-20'
    },
    {
      'License Plate (Nopol)': 'B 5678 ADM',
      'Brand & Model': 'Honda HR-V 1.5 SE CVT',
      'Vehicle Type': 'SUV',
      'Manufacturing Year': 2023,
      'Color': 'Platinum White Pearl',
      'Odometer Reading (KM)': 28400,
      'Assigned Driver': 'Pak Suprianto',
      'STNK Expiry (YYYY-MM-DD)': '2027-09-10',
      'KIR Expiry (YYYY-MM-DD)': '2026-12-15'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  
  worksheet['!cols'] = [
    { wch: 22 }, // Plate
    { wch: 32 }, // Brand & Model
    { wch: 15 }, // Type
    { wch: 18 }, // Year
    { wch: 20 }, // Color
    { wch: 22 }, // Odometer
    { wch: 25 }, // Assigned Driver
    { wch: 22 }, // STNK Expiry
    { wch: 22 }  // KIR Expiry
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Vehicle_Fleet_Template');
  XLSX.writeFile(workbook, 'Template_Vehicle_Fleet_GAMS.xlsx');
}

/**
 * Parse an uploaded Excel (.xlsx, .xls) or CSV file into JSON objects
 */
export function parseExcelFile(file: File): Promise<Record<string, any>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonResult = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);
        resolve(jsonResult);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Export generic data to CSV file
 */
export function exportToCSV(data: Record<string, any>[], filename: string = 'GAMS_Report') {
  if (!data || data.length === 0) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate PDF Report with Company Letterhead & Clean Table
 */
export function exportToPDF(
  title: string,
  headers: string[],
  rows: (string | number)[][],
  filename: string = 'GAMS_Document'
) {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  // Header Letterhead
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(79, 70, 229); // Indigo 600
  doc.text('GAMS - General Administration System', 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text(`Official Executive Summary Report • Generated on ${dateStr}`, 14, 27);
  doc.line(14, 30, 196, 30);

  // Report Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text(title, 14, 40);

  // Draw simple clean tabular data
  let yPos = 50;
  const colWidth = Math.floor(180 / Math.max(headers.length, 1));

  // Table Header
  doc.setFillColor(241, 245, 249); // Slate 100
  doc.rect(14, yPos - 5, 182, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);

  headers.forEach((h, i) => {
    doc.text(String(h).slice(0, 18), 16 + i * colWidth, yPos);
  });

  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  rows.forEach((row) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    row.forEach((cell, i) => {
      doc.text(String(cell || '').slice(0, 22), 16 + i * colWidth, yPos);
    });
    yPos += 7;
    doc.setDrawColor(241, 245, 249);
    doc.line(14, yPos - 4, 196, yPos - 4);
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount} - PT GAMS Corporate Confidential`, 14, 287);
  }

  doc.save(`${filename}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * Generate QR code Data URL for Asset/Document Labels
 */
export async function generateQRCodeDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 150,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

/**
 * Format currency to IDR Rupiah / USD format
 */
export function formatCurrency(amount: number, currency: 'IDR' | 'USD' = 'IDR'): string {
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

/**
 * Generate official Work Order PDF / Hardcopy Document
 */
export function exportWorkOrderPDF(wo: any) {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  // Letterhead Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(79, 70, 229); // Indigo 600
  doc.text('PT GENERAL ADMINISTRATION SYSTEM (GAMS)', 14, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('GAMS Building Lt. 4, Jl. Jend. Sudirman Kav. 52, Jakarta Selatan | Telp: (021) 555-0199', 14, 24);
  doc.line(14, 27, 196, 27);

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('SURAT PERINTAH KERJA / WORK ORDER (WO)', 14, 36);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(79, 70, 229);
  doc.text(`NO. DOKUMEN: ${wo.id}`, 145, 36);

  let y = 46;

  // Metadata Table Box
  doc.setFillColor(248, 250, 252);
  doc.rect(14, y, 182, 42, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, y, 182, 42, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);

  doc.text('Tipe Work Order:', 18, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${wo.type || 'Corrective'} Maintenance`, 55, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.text('Tanggal Perkiraan:', 18, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(`${wo.estimatedDate || wo.startDate || dateStr}`, 55, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.text('Status Pekerjaan:', 18, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.text(`${wo.workExecutionStatus || wo.status || 'On-Going'}`, 55, y + 24);

  doc.setFont('helvetica', 'bold');
  doc.text('Pemohon:', 18, y + 32);
  doc.setFont('helvetica', 'normal');
  doc.text(`${wo.requestedBy} (${wo.departmentName || 'GA'})`, 55, y + 32);

  // Right column inside box
  doc.setFont('helvetica', 'bold');
  doc.text('Target Item:', 110, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(`[${wo.targetType}] ${wo.targetName || wo.targetId}`, 138, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.text('Target ID:', 110, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(`${wo.targetId}`, 138, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.text('Prioritas:', 110, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.text(`${wo.priority}`, 138, y + 24);

  doc.setFont('helvetica', 'bold');
  doc.text('Vendor / Teknisi:', 110, y + 32);
  doc.setFont('helvetica', 'normal');
  doc.text(`${wo.assignedTechnicianOrVendor || 'Teknisi Internal'}`, 138, y + 32);

  y += 50;

  // Title & Deskripsi Pekerjaan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('JUDUL PERBAIKAN / SERVIS:', 14, y);

  doc.setFont('helvetica', 'normal');
  doc.text(`${wo.title}`, 14, y + 6);

  y += 14;

  doc.setFont('helvetica', 'bold');
  doc.text('DESKRIPSI LINGKUP PEKERJAAN:', 14, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  
  const splitDesc = doc.splitTextToSize(wo.description || 'Tidak ada deskripsi rinci.', 180);
  doc.text(splitDesc, 14, y + 6);

  y += 8 + (splitDesc.length * 5);

  // Estimasi Biaya & Lampiran
  doc.setFont('helvetica', 'bold');
  doc.text('ESTIMASI BIAYA PEKERJAAN:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text(`${formatCurrency(wo.estimatedCost || 0, 'IDR')}`, 70, y);

  y += 8;

  if (wo.attachments && wo.attachments.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text('DOKUMEN / BUKTI ESTIMASI VENDOR:', 14, y);
    doc.setFont('helvetica', 'normal');
    const attList = wo.attachments.map((a: any) => `${a.name} (${a.size || 'Attached'})`).join(', ');
    doc.text(attList, 80, y);
    y += 10;
  }

  // Service Log Section (if completed / status Done)
  if (wo.serviceLog || wo.workExecutionStatus === 'Done' || wo.status === 'Completed') {
    y += 4;
    doc.setFillColor(240, 253, 244);
    doc.rect(14, y, 182, 32, 'F');
    doc.setDrawColor(187, 247, 208);
    doc.rect(14, y, 182, 32, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(22, 101, 52);
    doc.text('SERVICE LOG AKTUAL (PEKERJAAN SELESAI)', 18, y + 7);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Tgl Selesai:', 18, y + 15);
    doc.setFont('helvetica', 'normal');
    doc.text(`${wo.serviceLog?.actualCompletionDate || wo.completedDate || dateStr}`, 45, y + 15);

    doc.setFont('helvetica', 'bold');
    doc.text('Total Biaya Aktual:', 110, y + 15);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formatCurrency(wo.serviceLog?.totalCost || wo.actualCost || 0, 'IDR')}`, 145, y + 15);

    doc.setFont('helvetica', 'bold');
    doc.text('Pekerjaan Aktual:', 18, y + 23);
    doc.setFont('helvetica', 'normal');
    const actDesc = (wo.serviceLog?.actualWorkDescription || wo.description || '').slice(0, 90);
    doc.text(`${actDesc}`, 45, y + 23);

    y += 40;
  } else {
    y += 10;
  }

  // Signature Block
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  doc.text('Diajukan Oleh,', 20, y);
  doc.text('Disetujui Oleh,', 85, y);
  doc.text('Pelaksana / Vendor,', 150, y);

  doc.line(20, y + 25, 65, y + 25);
  doc.line(85, y + 25, 130, y + 25);
  doc.line(150, y + 25, 190, y + 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`${wo.requestedBy}`, 20, y + 29);
  doc.text('GA Manager / Dept Head', 85, y + 29);
  doc.text(`${wo.assignedTechnicianOrVendor || 'Teknisi'}`, 150, y + 29);

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Halaman ${i} dari ${pageCount} - GAMS Official Work Order Document`, 14, 287);
  }

  doc.save(`Work_Order_${wo.id}.pdf`);
}
