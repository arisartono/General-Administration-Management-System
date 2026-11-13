import React, { useState } from 'react';
import { useGams } from '../../context/GamsContext';
import {
  Settings,
  Shield,
  Sliders,
  Calendar,
  Mail,
  Save,
  Check,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const SystemAdminView: React.FC = () => {
  const { systemSettings, updateSettings, currentRole } = useGams();

  const [activeTab, setActiveTab] = useState<'matrix' | 'settings' | 'holidays' | 'templates'>('matrix');

  const [companyName, setCompanyName] = useState(systemSettings.companyName);
  const [autoThreshold, setAutoThreshold] = useState(systemSettings.autoApprovalThreshold);

  const permissionsMatrix = [
    { module: 'Asset Registration & Edit', superAdmin: true, gaManager: true, gaStaff: true, deptHead: false, employee: false },
    { module: 'Asset Approval & Disposal', superAdmin: true, gaManager: true, gaStaff: false, deptHead: false, employee: false },
    { module: 'Vehicle Booking Request', superAdmin: true, gaManager: true, gaStaff: true, deptHead: true, employee: true },
    { module: 'Vehicle Booking Approval', superAdmin: true, gaManager: true, gaStaff: false, deptHead: true, employee: false },
    { module: 'Maintenance Work Orders', superAdmin: true, gaManager: true, gaStaff: true, deptHead: true, employee: false },
    { module: 'Messenger & Courier Dispatch', superAdmin: true, gaManager: true, gaStaff: true, deptHead: false, employee: false },
    { module: 'Overtime Submission', superAdmin: true, gaManager: true, gaStaff: true, deptHead: true, employee: true },
    { module: 'Overtime GA/HR Approval', superAdmin: true, gaManager: true, gaStaff: false, deptHead: true, employee: false },
    { module: 'System Admin Configuration', superAdmin: true, gaManager: false, gaStaff: false, deptHead: false, employee: false }
  ];

  const holidays = [
    { date: '2026-08-17', name: 'Indonesia Independence Day', type: 'National Public Holiday' },
    { date: '2026-12-25', name: 'Christmas Day', type: 'National Public Holiday' }
  ];

  const handleSaveSettings = () => {
    updateSettings({ companyName, autoApprovalThreshold: Number(autoThreshold) });
  };

  return (
    <div className="p-3.5 sm:p-5 lg:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-indigo-600" /> System Administration & Configuration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            RBAC Permission Matrix, Dynamic Approval Thresholds, Holiday Calendar, & Notification Templates.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center space-x-1.5 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-sm">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'matrix' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>RBAC Permission Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Application Parameters</span>
        </button>

        <button
          onClick={() => setActiveTab('holidays')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'holidays' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Holiday Calendar</span>
        </button>
      </div>

      {/* RBAC MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                <th className="px-6 py-3">Module Capability</th>
                <th className="px-6 py-3 text-center">Super Admin</th>
                <th className="px-6 py-3 text-center">GA Manager</th>
                <th className="px-6 py-3 text-center">GA Staff</th>
                <th className="px-6 py-3 text-center">Dept Head</th>
                <th className="px-6 py-3 text-center">Employee</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-3 font-bold text-slate-900 dark:text-slate-100">{row.module}</td>
                  <td className="px-6 py-3 text-center">{row.superAdmin && <Check className="w-4 h-4 text-emerald-600 mx-auto" />}</td>
                  <td className="px-6 py-3 text-center">{row.gaManager && <Check className="w-4 h-4 text-emerald-600 mx-auto" />}</td>
                  <td className="px-6 py-3 text-center">{row.gaStaff && <Check className="w-4 h-4 text-emerald-600 mx-auto" />}</td>
                  <td className="px-6 py-3 text-center">{row.deptHead && <Check className="w-4 h-4 text-emerald-600 mx-auto" />}</td>
                  <td className="px-6 py-3 text-center">{row.employee && <Check className="w-4 h-4 text-emerald-600 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PARAMETERS */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 max-w-2xl">
          <div>
            <label className="block text-xs font-bold mb-1">Company Legal Entity Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Auto Approval Budget Threshold (IDR)</label>
            <input
              type="number"
              value={autoThreshold}
              onChange={(e) => setAutoThreshold(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800"
            />
          </div>
        </div>
      )}

      {/* HOLIDAY CALENDAR */}
      {activeTab === 'holidays' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                <th className="px-6 py-3">Holiday Date</th>
                <th className="px-6 py-3">Event Name</th>
                <th className="px-6 py-3">Type</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800">
              {holidays.map((h, i) => (
                <tr key={i}>
                  <td className="px-6 py-3 font-mono font-bold text-indigo-600">{h.date}</td>
                  <td className="px-6 py-3 font-bold">{h.name}</td>
                  <td className="px-6 py-3 text-slate-500">{h.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
