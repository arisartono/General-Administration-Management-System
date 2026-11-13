import React, { useState, ChangeEvent } from 'react';
import { useGams } from '../../../context/GamsContext';
import { Vehicle } from '../../../types/gams';
import { WorkflowStatusBadge } from '../../common/WorkflowStatusBadge';
import { CreateWorkOrderModal } from '../maintenance/CreateWorkOrderModal';
import { EditVehicleModal } from './EditVehicleModal';
import { PhysicalPhotoLightboxModal } from '../../common/PhysicalPhotoLightboxModal';
import {
  formatCurrency,
  exportToPDF,
  exportToExcel,
  downloadVehicleTemplate,
  parseExcelFile
} from '../../../utils/exportUtils';
import {
  Car,
  Fuel,
  Calendar,
  AlertCircle,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ShieldAlert,
  FileText,
  Download,
  Upload,
  FileSpreadsheet,
  Check,
  Trash2,
  Wrench,
  Edit3,
  Eye,
  Camera,
  LayoutGrid,
  List
} from 'lucide-react';

interface Props {
  onOpenApprovalModal: (module: 'Vehicle', id: string, title: string) => void;
}

export const VehicleManagementView: React.FC<Props> = ({ onOpenApprovalModal }) => {
  const {
    vehicles,
    vehicleBookings,
    fuelLogs,
    addVehicle,
    deleteVehicle,
    addVehicleBooking,
    deleteVehicleBooking,
    addFuelLog,
    deleteFuelLog,
    currentUser
  } = useGams();

  const [activeTab, setActiveTab] = useState<'fleet' | 'bookings' | 'fuel'>('fleet');
  const [fleetViewMode, setFleetViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [woModalVehicle, setWoModalVehicle] = useState<Vehicle | null>(null);
  const [editModalVehicle, setEditModalVehicle] = useState<Vehicle | null>(null);
  const [lightboxVehicle, setLightboxVehicle] = useState<Vehicle | null>(null);

  // Import Toast Feedback
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // Booking Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || '');
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [startDate, setStartDate] = useState('2026-07-26 09:00');
  const [endDate, setEndDate] = useState('2026-07-26 17:00');

  // Fuel Form State
  const [fuelLiters, setFuelLiters] = useState(40);
  const [fuelOdometer, setFuelOdometer] = useState(28500);

  const handleCreateBooking = () => {
    const v = vehicles.find((item) => item.id === selectedVehicleId);
    addVehicleBooking({
      vehicleId: selectedVehicleId,
      vehiclePlate: selectedVehicleId,
      vehicleName: v?.brandModel || 'Pool Fleet',
      destination,
      purpose,
      startDate,
      endDate
    });
    setShowBookingModal(false);
    setDestination('');
  };

  const handleCreateFuelLog = () => {
    addFuelLog({
      vehicleId: selectedVehicleId,
      vehiclePlate: selectedVehicleId,
      liters: Number(fuelLiters),
      odometerKm: Number(fuelOdometer)
    });
    setShowFuelModal(false);
  };

  const handleExportPDF = () => {
    const rows = vehicles.map((v) => [
      v.id,
      v.brandModel,
      v.type,
      v.assignedDriverName || 'Pool / Unassigned',
      `${v.currentMileageKm.toLocaleString()} KM`,
      v.status,
      v.stnkExpiry
    ]);
    exportToPDF('GAMS Vehicle Fleet & Expiry Summary Report', ['Nopol', 'Brand & Model', 'Type', 'Driver', 'Odometer', 'Status', 'STNK Exp'], rows, 'GAMS_Vehicle_Fleet');
  };

  const handleExportExcel = () => {
    const exportData = vehicles.map((v) => ({
      'License Plate (Nopol)': v.id,
      'Brand & Model': v.brandModel,
      'Vehicle Type': v.type,
      'Manufacturing Year': v.year,
      'Color': v.color,
      'Odometer Reading (KM)': v.currentMileageKm,
      'Assigned Driver': v.assignedDriverName || 'Pool / Unassigned',
      'Fleet Status': v.status,
      'STNK Expiry': v.stnkExpiry,
      'KIR Expiry': v.kirExpiry
    }));
    exportToExcel(exportData, 'GAMS_Vehicle_Fleet_Data');
  };

  const handleImportExcelFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      const parsedRows = await parseExcelFile(file);

      let importedCount = 0;
      parsedRows.forEach((row) => {
        const plate = row['License Plate (Nopol)'] || row['id'] || row['Nopol'] || row['Plat Nomor'];
        const brandModel = row['Brand & Model'] || row['brandModel'] || row['Merk & Model'] || 'Operasional Vehicle';
        if (!plate && !brandModel) return;

        addVehicle({
          id: plate ? String(plate) : `B ${Math.floor(1000 + Math.random() * 9000)} GAMS`,
          brandModel: String(brandModel),
          type: (row['Vehicle Type'] || row['type'] || row['Tipe'] || 'MPV') as any,
          year: Number(row['Manufacturing Year'] || row['year'] || row['Tahun'] || 2024),
          color: String(row['Color'] || row['color'] || row['Warna'] || 'Black'),
          currentMileageKm: Number(row['Odometer Reading (KM)'] || row['currentMileageKm'] || row['Odometer'] || 10000),
          assignedDriverName: String(row['Assigned Driver'] || row['assignedDriverName'] || row['Driver'] || ''),
          status: 'Available',
          stnkExpiry: String(row['STNK Expiry (YYYY-MM-DD)'] || row['stnkExpiry'] || row['STNK Exp'] || '2028-12-31'),
          kirExpiry: String(row['KIR Expiry (YYYY-MM-DD)'] || row['kirExpiry'] || row['KIR Exp'] || '2027-06-30'),
          photoUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop&q=60'
        });
        importedCount++;
      });

      setImportNotice(`Berhasil mengimpor ${importedCount} kendaraan armada baru ke Fleet Registry!`);
      setTimeout(() => setImportNotice(null), 6000);
    } catch (err) {
      console.error('Error importing Vehicle Excel:', err);
      alert('Gagal mengimpor file Excel armada. Pastikan format kolom sesuai.');
    }
  };

  return (
    <div className="p-3.5 sm:p-5 lg:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
      {/* Import Toast Notice */}
      {importNotice && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-between text-emerald-800 dark:text-emerald-200 text-xs font-bold shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{importNotice}</span>
          </div>
          <button onClick={() => setImportNotice(null)} className="text-xs text-emerald-600 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Car className="w-5 h-5 mr-2 text-amber-500" /> Module 2: Vehicle & Fleet Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Fleet Registration, Vehicle Booking, Driver Assignment, Fuel Monitoring, STNK/KIR Expiry Alerts & Excel Bulk Import/Export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download Template Excel */}
          <button
            onClick={downloadVehicleTemplate}
            title="Download Template Excel untuk Pengisian Data Kendaraan Armada"
            className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Template Excel</span>
          </button>

          {/* Import Excel */}
          <label className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center space-x-1 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>Import Excel</span>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleImportExcelFile}
              className="hidden"
            />
          </label>

          {/* Export Excel Registry */}
          <button
            onClick={handleExportExcel}
            title="Export data Kendaraan ke Excel"
            className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center space-x-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Excel</span>
          </button>

          {/* PDF Report */}
          <button
            onClick={handleExportPDF}
            className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center space-x-1"
          >
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            <span>PDF Report</span>
          </button>

          <button
            onClick={() => setShowFuelModal(true)}
            className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center space-x-1"
          >
            <Fuel className="w-3.5 h-3.5 text-amber-500" />
            <span>Log Fuel</span>
          </button>
          <button
            onClick={() => setShowBookingModal(true)}
            className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Book Vehicle</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-sm overflow-x-auto gap-1 sm:gap-0">
        <button
          onClick={() => setActiveTab('fleet')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'fleet' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Vehicle Fleet ({vehicles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'bookings' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Vehicle Bookings ({vehicleBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fuel')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'fuel' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Fuel className="w-4 h-4" />
          <span>Fuel Consumption Logs ({fuelLogs.length})</span>
        </button>
      </div>

      {/* FLEET VIEW HEADER & TOGGLE */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Menampilkan {vehicles.length} Kendaraan Armada Registered
            </span>
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setFleetViewMode('grid')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center space-x-1 transition-all ${
                  fleetViewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setFleetViewMode('table')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center space-x-1 transition-all ${
                  fleetViewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Tabel</span>
              </button>
            </div>
          </div>

          {/* GRID VIEW */}
          {fleetViewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div
                      onClick={() => setLightboxVehicle(v)}
                      className="relative h-40 bg-slate-100 dark:bg-slate-950 cursor-pointer group overflow-hidden"
                      title="Klik untuk Perbesar Foto Fisik Kendaraan"
                    >
                      {v.photoUrl ? (
                        <img
                          src={v.photoUrl}
                          alt={v.brandModel}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                          <Car className="w-8 h-8 opacity-40 mb-1" />
                          <span className="text-[10px]">Tanpa Foto</span>
                        </div>
                      )}
                      <span className="absolute top-3 left-3 px-2 py-1 bg-slate-900/80 text-white font-mono font-bold text-xs rounded shadow">
                        {v.id}
                      </span>
                      <span className={`absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                        v.status === 'Available' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {v.status}
                      </span>
                      <span className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white space-x-1 font-bold text-xs">
                        <Eye className="w-4 h-4" />
                        <span>Lihat Foto Fisik</span>
                      </span>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{v.brandModel}</h3>
                        <p className="text-xs text-slate-500">{v.type} • {v.year} • {v.color}</p>
                      </div>

                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Odometer:</span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{v.currentMileageKm.toLocaleString()} KM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Driver:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{v.assignedDriverName || 'Unassigned'}</span>
                        </div>
                      </div>

                      {/* Document Expiry Badges */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                        <div className="p-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 rounded border border-rose-200 dark:border-rose-900 flex justify-between">
                          <span>STNK Exp:</span>
                          <strong className="font-bold">{v.stnkExpiry}</strong>
                        </div>
                        <div className="p-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded border border-amber-200 dark:border-amber-900 flex justify-between">
                          <span>KIR Exp:</span>
                          <strong className="font-bold">{v.kirExpiry}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setEditModalVehicle(v)}
                        title="Edit Data & Foto Kendaraan"
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Apakah Anda yakin ingin menghapus kendaraan "${v.brandModel}" (${v.id})?`)) {
                            deleteVehicle(v.id);
                          }
                        }}
                        title="Hapus Kendaraan"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setWoModalVehicle(v)}
                        title="Buat Work Order / Servis Perbaikan untuk Kendaraan ini"
                        className="px-2 py-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded flex items-center space-x-1"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Work Order</span>
                      </button>
                    </div>
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Reserve Vehicle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TABLE VIEW */}
          {fleetViewMode === 'table' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                      <th className="px-5 py-3">Plat Nomor</th>
                      <th className="px-5 py-3">Foto Fisik</th>
                      <th className="px-5 py-3">Merk & Model</th>
                      <th className="px-5 py-3">Tipe & Warna</th>
                      <th className="px-5 py-3">Odometer</th>
                      <th className="px-5 py-3">Driver</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">STNK / KIR</th>
                      <th className="px-5 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800">
                    {vehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-5 py-3 font-mono font-bold text-slate-900 dark:text-slate-100 align-middle">
                          {v.id}
                        </td>
                        <td className="px-5 py-3 align-middle">
                          <button
                            onClick={() => setLightboxVehicle(v)}
                            title="Klik untuk Perbesar Foto Fisik Kendaraan"
                            className="group relative w-12 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 shrink-0 block hover:ring-2 hover:ring-amber-500 transition-all"
                          >
                            {v.photoUrl ? (
                              <img src={v.photoUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Car className="w-4 h-4" />
                              </div>
                            )}
                            <span className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye className="w-3.5 h-3.5" />
                            </span>
                          </button>
                        </td>
                        <td className="px-5 py-3 font-bold text-slate-900 dark:text-slate-100 align-middle">
                          {v.brandModel}
                        </td>
                        <td className="px-5 py-3 text-slate-600 dark:text-slate-400 align-middle">
                          {v.type} ({v.year}) - {v.color}
                        </td>
                        <td className="px-5 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400 align-middle">
                          {v.currentMileageKm.toLocaleString()} KM
                        </td>
                        <td className="px-5 py-3 font-medium align-middle">
                          {v.assignedDriverName || <span className="text-slate-400 italic">Unassigned</span>}
                        </td>
                        <td className="px-5 py-3 align-middle">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                            v.status === 'Available' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-mono text-[10px] space-y-0.5 align-middle">
                          <div className="text-rose-600">STNK: {v.stnkExpiry}</div>
                          <div className="text-amber-600">KIR: {v.kirExpiry}</div>
                        </td>
                        <td className="px-5 py-3 text-right space-x-1 align-middle">
                          <button
                            onClick={() => setEditModalVehicle(v)}
                            title="Edit Data Kendaraan"
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setWoModalVehicle(v)}
                            title="Buat Work Order"
                            className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded"
                          >
                            <Wrench className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Apakah Anda yakin ingin menghapus kendaraan "${v.brandModel}" (${v.id})?`)) {
                                deleteVehicle(v.id);
                              }
                            }}
                            title="Hapus Record Kendaraan"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BOOKINGS TABLE */}
      {activeTab === 'bookings' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                <th className="px-6 py-3">Booking ID</th>
                <th className="px-6 py-3">Vehicle</th>
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Destination & Purpose</th>
                <th className="px-6 py-3">Dates</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800">
              {vehicleBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-3 font-mono font-bold text-indigo-600">{b.id}</td>
                  <td className="px-6 py-3 font-bold">{b.vehicleName} ({b.vehiclePlate})</td>
                  <td className="px-6 py-3 font-medium">{b.employeeName}</td>
                  <td className="px-6 py-3 text-slate-600 dark:text-slate-300">
                    <p className="font-bold">{b.destination}</p>
                    <p className="text-[11px] text-slate-400">{b.purpose}</p>
                  </td>
                  <td className="px-6 py-3 font-mono text-[11px]">{b.startDate}</td>
                  <td className="px-6 py-3">
                    <WorkflowStatusBadge status={b.status} />
                  </td>
                  <td className="px-6 py-3 text-right space-x-1">
                    <button
                      onClick={() => onOpenApprovalModal('Vehicle', b.id, b.purpose)}
                      className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 rounded"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Apakah Anda yakin ingin menghapus pemesanan kendaraan (${b.id})?`)) {
                          deleteVehicleBooking(b.id);
                        }
                      }}
                      title="Hapus Pemesanan"
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FUEL LOGS TABLE */}
      {activeTab === 'fuel' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                <th className="px-6 py-3">Log ID</th>
                <th className="px-6 py-3">Vehicle Plate</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Driver</th>
                <th className="px-6 py-3">Volume (Liters)</th>
                <th className="px-6 py-3 text-right">Total Cost</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800">
              {fuelLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-3 font-mono font-bold text-indigo-600">{log.id}</td>
                  <td className="px-6 py-3 font-mono font-bold">{log.vehiclePlate}</td>
                  <td className="px-6 py-3">{log.date}</td>
                  <td className="px-6 py-3">{log.driverName}</td>
                  <td className="px-6 py-3 font-bold text-amber-600">{log.liters} L</td>
                  <td className="px-6 py-3 text-right font-mono font-bold text-emerald-600">
                    {formatCurrency(log.totalCost, 'IDR')}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => {
                        if (window.confirm(`Apakah Anda yakin ingin menghapus log BBM (${log.id})?`)) {
                          deleteFuelLog(log.id);
                        }
                      }}
                      title="Hapus Log BBM"
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Book Vehicle Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Vehicle Booking Request
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Pool Vehicle</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.brandModel} ({v.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Destination Address</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Ministry Office, South Jakarta"
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Trip Purpose</label>
                <textarea
                  rows={2}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Official business reason..."
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button onClick={() => setShowBookingModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">
                Cancel
              </button>
              <button onClick={handleCreateBooking} className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fuel Log Modal */}
      {showFuelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Log Fuel Refill
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Vehicle</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.brandModel} ({v.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Liters Filled</label>
                <input
                  type="number"
                  value={fuelLiters}
                  onChange={(e) => setFuelLiters(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Odometer Reading (KM)</label>
                <input
                  type="number"
                  value={fuelOdometer}
                  onChange={(e) => setFuelOdometer(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button onClick={() => setShowFuelModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">
                Cancel
              </button>
              <button onClick={handleCreateFuelLog} className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg">
                Save Fuel Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      <EditVehicleModal
        isOpen={Boolean(editModalVehicle)}
        onClose={() => setEditModalVehicle(null)}
        vehicle={editModalVehicle}
      />

      {/* Lightbox Physical Photo Preview Modal */}
      <PhysicalPhotoLightboxModal
        isOpen={Boolean(lightboxVehicle)}
        onClose={() => setLightboxVehicle(null)}
        title={lightboxVehicle?.brandModel || ''}
        tagOrPlate={lightboxVehicle?.id || ''}
        photoUrl={lightboxVehicle?.photoUrl}
        categoryOrType={`${lightboxVehicle?.type} (${lightboxVehicle?.year})`}
        locationOrDriver={lightboxVehicle?.assignedDriverName || 'Pool Vehicle'}
        statusOrCondition={lightboxVehicle?.status}
        onEditRequested={() => {
          if (lightboxVehicle) {
            setEditModalVehicle(lightboxVehicle);
          }
        }}
      />

      {/* Work Order Modal for Vehicle */}
      <CreateWorkOrderModal
        isOpen={Boolean(woModalVehicle)}
        onClose={() => setWoModalVehicle(null)}
        initialTargetType="Vehicle"
        initialTargetId={woModalVehicle?.id || ''}
        initialTargetName={woModalVehicle ? `${woModalVehicle.brandModel} (${woModalVehicle.id})` : ''}
      />
    </div>
  );
};
