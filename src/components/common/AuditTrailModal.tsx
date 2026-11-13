import React from 'react';
import { useGams } from '../../context/GamsContext';
import { Shield, Clock, Monitor, Globe, X, User } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filterReferenceId?: string;
}

export const AuditTrailModal: React.FC<Props> = ({ isOpen, onClose, filterReferenceId }) => {
  const { auditLogs } = useGams();

  if (!isOpen) return null;

  const logs = filterReferenceId
    ? auditLogs.filter((l) => l.referenceId === filterReferenceId)
    : auditLogs;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold tracking-wide uppercase">
              System Audit Trail & Workflow Logs
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {logs.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No audit logs recorded for this transaction.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{log.referenceId}</span>
                    <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold rounded text-[9px] uppercase">
                      {log.module}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{log.action}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {log.timestamp}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Actor: <strong className="text-slate-800 dark:text-slate-200">{log.actorName}</strong> ({log.actorRole})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>IP: <strong className="font-mono text-slate-800 dark:text-slate-200">{log.ipAddress}</strong></span>
                  </div>
                </div>

                {log.comment && (
                  <p className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-[11px] italic text-slate-600 dark:text-slate-300">
                    "{log.comment}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};
