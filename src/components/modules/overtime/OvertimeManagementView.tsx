import React, { useState } from 'react';
import { useGams } from '../../../context/GamsContext';
import { OvertimeRequest } from '../../../types/gams';
import { WorkflowStatusBadge } from '../../common/WorkflowStatusBadge';
import { formatCurrency, exportToPDF, exportToExcel } from '../../../utils/exportUtils';
import {
  Clock,
  Plus,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  UserCheck,
  ShieldCheck,
  DollarSign,
  Trash2
} from 'lucide-react';

interface Props {
  onOpenApprovalModal: (module: 'Overtime', id: string, title: string) => void;
}

export const OvertimeManagementView: React.FC<Props> = ({ onOpenApprovalModal }) => {
  const { overtimeRequests, addOvertimeRequest, deleteOvertimeRequest, currentUser } = useGams();

  const [showRequestModal, setShowRequestModal] = useState(false);

  // Form
  const [taskDesc, setTaskDesc] = useState('');
  const [hours, setHours] = useState(3);
  const [ovtDate, setOvtDate] = useState('2026-07-26');

  const handleCreateRequest = () => {
    addOvertimeRequest({
      date: ovtDate,
      totalHours: Number(hours),
      taskDescription: taskDesc || 'Operational overtime work'
    });
    setShowRequestModal(false);
    setTaskDesc('');
  };

  const handleExportPayrollExcel = () => {
    exportToExcel(overtimeRequests, 'GAMS_Overtime_Payroll_Summary');
  };

  return (
    <div className="p-3.5 sm:p-5 lg:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-600" /> Module 5: Overtime & Payroll Admin
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Employee Requests, Attendance Verification, Multi-level Approvals (Manager, HR, GA), & Payroll Allowance Export.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportPayrollExcel}
            className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center space-x-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Payroll Summary</span>
          </button>
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Overtime</span>
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
              <th className="px-6 py-3">Overtime Ref</th>
              <th className="px-6 py-3">Employee & Dept</th>
              <th className="px-6 py-3">Date & Duration</th>
              <th className="px-6 py-3">Task Description</th>
              <th className="px-6 py-3">Attendance Match</th>
              <th className="px-6 py-3">Allowance</th>
              <th className="px-6 py-3">Approval Workflow</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800">
            {overtimeRequests.map((ovt) => (
              <tr key={ovt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-3 font-mono font-bold text-indigo-600">{ovt.id}</td>
                <td className="px-6 py-3 font-bold text-slate-900 dark:text-slate-100">
                  {ovt.employeeName}
                  <p className="text-[10px] text-slate-400 font-normal">{ovt.departmentName}</p>
                </td>
                <td className="px-6 py-3 font-mono">
                  <p className="font-bold">{ovt.date}</p>
                  <p className="text-[10px] text-slate-500">{ovt.totalHours} Hours ({ovt.startTime} - {ovt.endTime})</p>
                </td>
                <td className="px-6 py-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                  {ovt.taskDescription}
                </td>
                <td className="px-6 py-3">
                  {ovt.attendanceVerified ? (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center w-max">
                      <UserCheck className="w-3 h-3 mr-1" /> Verified ({ovt.attendanceOut})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">Unverified</span>
                  )}
                </td>
                <td className="px-6 py-3 font-mono font-bold text-emerald-600">
                  {formatCurrency(ovt.estimatedAllowance, 'IDR')}
                </td>
                <td className="px-6 py-3">
                  <WorkflowStatusBadge status={ovt.status} />
                </td>
                <td className="px-6 py-3 text-right space-x-1">
                  <button
                    onClick={() => onOpenApprovalModal('Overtime', ovt.id, `${ovt.employeeName} - ${ovt.taskDescription}`)}
                    className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 rounded"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Apakah Anda yakin ingin menghapus pengajuan lembur (${ovt.id})?`)) {
                        deleteOvertimeRequest(ovt.id);
                      }
                    }}
                    title="Hapus Pengajuan Lembur"
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors inline-flex"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Submit Overtime Request
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Overtime Date</label>
                <input
                  type="date"
                  value={ovtDate}
                  onChange={(e) => setOvtDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Total Overtime Hours</label>
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Task Description / Deliverables</label>
                <textarea
                  rows={2}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Task completed during overtime..."
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button onClick={() => setShowRequestModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">
                Cancel
              </button>
              <button onClick={handleCreateRequest} className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
