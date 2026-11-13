import React, { useState } from 'react';
import { useGams } from '../../../context/GamsContext';
import { MaintenanceRequest, ServiceLog } from '../../../types/gams';
import { WorkflowStatusBadge } from '../../common/WorkflowStatusBadge';
import { formatCurrency, exportWorkOrderPDF } from '../../../utils/exportUtils';
import { CreateWorkOrderModal } from './CreateWorkOrderModal';
import { CreateServiceLogModal } from './CreateServiceLogModal';
import {
  Wrench,
  Calendar,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  UserCheck,
  FileSpreadsheet,
  FileText,
  Printer,
  FileCheck,
  Paperclip,
  Trash2,
  DollarSign,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface Props {
  onOpenApprovalModal: (module: 'Maintenance', id: string, title: string) => void;
}

export const MaintenanceManagementView: React.FC<Props> = ({ onOpenApprovalModal }) => {
  const {
    maintenanceRequests,
    serviceLogs = [],
    addMaintenanceRequest,
    deleteMaintenanceRequest,
    deleteServiceLog,
    vendors
  } = useGams();

  const [activeTab, setActiveTab] = useState<'work-orders' | 'service-logs' | 'calendar'>('work-orders');

  // Modals state
  const [showCreateWoModal, setShowCreateWoModal] = useState(false);
  const [selectedWoForServiceLog, setSelectedWoForServiceLog] = useState<MaintenanceRequest | null>(null);

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredWO = maintenanceRequests.filter((wo) => {
    const matchesSearch =
      wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.assignedTechnicianOrVendor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'All' || wo.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || wo.workExecutionStatus === statusFilter || wo.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="p-3.5 sm:p-5 lg:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Wrench className="w-5 h-5 mr-2 text-rose-500" /> Module 3: Maintenance, Work Orders & Service Logs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola Work Order (Preventive/Correction), Cetak WO PDF, Lampiran Estimasi Vendor, & Pencatatan Service Log Biaya Aktual.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreateWoModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center space-x-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Work Order Baru</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-sm overflow-x-auto gap-1 sm:gap-0">
        <button
          onClick={() => setActiveTab('work-orders')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'work-orders' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Work Orders List ({maintenanceRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('service-logs')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'service-logs' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Service Logs & Expense Realization ({serviceLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'calendar' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Maintenance Schedule Matrix</span>
        </button>
      </div>

      {/* WORK ORDERS LIST TAB */}
      {activeTab === 'work-orders' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="md:col-span-2 flex items-center space-x-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari Work Order berdasarkan WO Ref, Judul, Target, atau Vendor..."
                className="w-full bg-transparent text-xs font-medium outline-none text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
              >
                <option value="All">Semua Tipe Work Order</option>
                <option value="Preventive">Preventive Maintenance</option>
                <option value="Corrective">Correction / Perbaikan</option>
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
              >
                <option value="All">Semua Status Pekerjaan</option>
                <option value="On-Going">On-Going (Sedang Berjalan)</option>
                <option value="Done">Done (Telah Selesai)</option>
              </select>
            </div>
          </div>

          {/* Work Order Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                    <th className="px-5 py-3">WO Reference</th>
                    <th className="px-5 py-3">Work Order Title & Description</th>
                    <th className="px-5 py-3">Type & Priority</th>
                    <th className="px-5 py-3">Target Objek</th>
                    <th className="px-5 py-3">Tgl Perkiraan & Vendor</th>
                    <th className="px-5 py-3">Status Pekerjaan</th>
                    <th className="px-5 py-3">Estimasi Biaya</th>
                    <th className="px-5 py-3 text-right">Aksi & Service Log</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredWO.map((wo) => {
                    const isDone = wo.workExecutionStatus === 'Done' || wo.status === 'Completed';

                    return (
                      <tr key={wo.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400 align-top">
                          {wo.id}
                        </td>
                        <td className="px-5 py-3.5 max-w-xs align-top">
                          <p className="font-bold text-slate-900 dark:text-slate-100">{wo.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{wo.description}</p>
                          {wo.attachments && wo.attachments.length > 0 && (
                            <div className="mt-1.5 flex items-center space-x-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                              <Paperclip className="w-3 h-3" />
                              <span>{wo.attachments[0].name}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5 align-top">
                          <div className="flex flex-col space-y-1">
                            <span
                              className={`px-2 py-0.5 font-bold text-[10px] rounded inline-block w-max ${
                                wo.type === 'Preventive'
                                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {wo.type === 'Preventive' ? 'Preventive' : 'Correction'}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-semibold rounded inline-block w-max ${
                                wo.priority === 'Urgent' || wo.priority === 'High'
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {wo.priority}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-medium align-top">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                            {wo.targetName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">({wo.targetType})</span>
                        </td>
                        <td className="px-5 py-3.5 align-top">
                          <div className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            {wo.estimatedDate || '2026-08-01'}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {wo.assignedTechnicianOrVendor}
                          </div>
                          {wo.assignedPicName && (
                            <div className="mt-1 flex items-center text-[10px] bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800 w-max font-medium">
                              <UserCheck className="w-3 h-3 mr-1 shrink-0 text-indigo-600" />
                              <span>PIC: {wo.assignedPicName}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5 align-top">
                          <span
                            className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full inline-flex items-center space-x-1 ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 animate-pulse'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full mr-1 ${isDone ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                            {isDone ? 'Done' : 'On-Going'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-mono font-bold text-emerald-600 align-top">
                          <div>Est: {formatCurrency(wo.estimatedCost, 'IDR')}</div>
                          {wo.actualCost > 0 && (
                            <div className="text-[10px] text-slate-500">
                              Act: {formatCurrency(wo.actualCost, 'IDR')}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right space-y-1 align-top">
                          <div className="flex items-center justify-end space-x-1">
                            {/* Cetak Work Order PDF */}
                            <button
                              onClick={() => exportWorkOrderPDF(wo)}
                              title="Cetak Work Order (PDF / Hardcopy)"
                              className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-lg flex items-center space-x-1 border border-indigo-200 dark:border-indigo-800"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>PDF</span>
                            </button>

                            {/* Service Log Button */}
                            <button
                              onClick={() => setSelectedWoForServiceLog(wo)}
                              title="Buat / Edit Service Log Pekerjaan Selesai"
                              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg flex items-center space-x-1 border transition-colors ${
                                isDone
                                  ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
                                  : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
                              }`}
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                              <span>{isDone ? 'Service Log' : '+ Service Log'}</span>
                            </button>

                            {/* Hapus Record */}
                            <button
                              onClick={() => {
                                if (window.confirm(`Apakah Anda yakin ingin menghapus Work Order "${wo.title}" (${wo.id})?`)) {
                                  deleteMaintenanceRequest(wo.id);
                                }
                              }}
                              title="Hapus Work Order Record"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE LOGS TAB */}
      {activeTab === 'service-logs' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 font-medium">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>
                <strong>Service Log Registry:</strong> Catatan histori aktual perbaikan dan realisasi biaya pekerjaan maintenance yang mempengaruhi kalkulasi Monthly Expenses.
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                  <th className="px-6 py-3">Log ID & WO</th>
                  <th className="px-6 py-3">Objek & Tipe Servis</th>
                  <th className="px-6 py-3">Deskripsi Pekerjaan Aktual</th>
                  <th className="px-6 py-3">Teknisi / Vendor</th>
                  <th className="px-6 py-3">Tanggal Selesai</th>
                  <th className="px-6 py-3">Biaya Riil (Actual Cost)</th>
                  <th className="px-6 py-3">Invoice / Bukti</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800">
                {serviceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <div>{log.id}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{log.workOrderId}</div>
                    </td>
                    <td className="px-6 py-3">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{log.targetName}</p>
                      <span className="text-[10px] font-semibold text-slate-500">{log.workType}</span>
                    </td>
                    <td className="px-6 py-3 max-w-xs text-slate-700 dark:text-slate-300">
                      {log.actualWorkDescription}
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-800 dark:text-slate-200">
                      {log.vendorOrTechnician}
                    </td>
                    <td className="px-6 py-3 font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      {log.actualCompletionDate}
                    </td>
                    <td className="px-6 py-3 font-mono font-bold text-emerald-600">
                      {formatCurrency(log.totalCost, 'IDR')}
                    </td>
                    <td className="px-6 py-3">
                      <div className="text-[11px] font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {log.invoiceNumber}
                      </div>
                      {log.invoiceAttachment && (
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 flex items-center mt-0.5">
                          <Paperclip className="w-3 h-3 mr-1" />
                          {log.invoiceAttachment.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus entri Service Log "${log.id}"?`)) {
                            deleteServiceLog(log.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                        title="Hapus Service Log"
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

      {/* CALENDAR SCHEDULE MATRIX TAB */}
      {activeTab === 'calendar' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              July 2026 Preventive & Corrective Maintenance Schedule
            </h3>
            <span className="text-xs text-slate-500 font-mono">Calendar View</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="font-bold text-slate-400 py-2 border-b">
                {day}
              </div>
            ))}

            {calendarDays.map((day) => {
              const matchingWo = maintenanceRequests.find((m) => {
                const woDay = parseInt(m.estimatedDate?.split('-')[2] || '0', 10);
                return woDay === day;
              });

              const isScheduled = Boolean(matchingWo) || day === 24 || day === 28;

              return (
                <div
                  key={day}
                  className={`min-h-[80px] p-2 rounded-lg border text-left flex flex-col justify-between transition-colors ${
                    isScheduled
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30'
                  }`}
                >
                  <span className="font-mono font-bold text-[10px] text-slate-500">{day}</span>
                  {isScheduled && (
                    <div className="p-1 bg-indigo-600 text-white rounded text-[9px] font-bold truncate">
                      {matchingWo ? matchingWo.title : 'Preventive Servicing'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Work Order Modal */}
      <CreateWorkOrderModal
        isOpen={showCreateWoModal}
        onClose={() => setShowCreateWoModal(false)}
      />

      {/* Create Service Log Modal */}
      <CreateServiceLogModal
        isOpen={Boolean(selectedWoForServiceLog)}
        onClose={() => setSelectedWoForServiceLog(null)}
        workOrder={selectedWoForServiceLog}
      />
    </div>
  );
};

