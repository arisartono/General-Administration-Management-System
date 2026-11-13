import React, { useState } from 'react';
import { useGams } from '../../context/GamsContext';
import { WorkflowStatus } from '../../types/gams';
import { CheckCircle2, XCircle, RotateCcw, AlertCircle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  module: 'Asset' | 'Vehicle' | 'Maintenance' | 'Messenger' | 'Overtime';
  requestId: string;
  requestTitle: string;
  currentStatus: WorkflowStatus;
}

export const ApprovalActionDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  module,
  requestId,
  requestTitle,
  currentStatus
}) => {
  const { updateWorkflowStatus, currentRole } = useGams();
  const [comment, setComment] = useState('');
  const [actionType, setActionType] = useState<'Approved' | 'Rejected' | 'Returned'>('Approved');

  if (!isOpen) return null;

  const handleExecute = () => {
    updateWorkflowStatus(module, requestId, actionType, comment || `Action executed by ${currentRole}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <h3 className="text-sm font-bold tracking-wide uppercase">
              Workflow Approval Engine • {module}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-slate-800 dark:text-slate-200">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg border border-indigo-100 dark:border-indigo-900 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-indigo-950 dark:text-indigo-200">{requestId}</p>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">{requestTitle}</p>
              <p className="mt-1 italic text-slate-500 dark:text-slate-400">
                Acting as: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentRole}</span> | Current Status: <span className="font-bold">{currentStatus}</span>
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select Workflow Action
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setActionType('Approved')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                  actionType === 'Approved'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 mb-1 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold">APPROVE</span>
              </button>

              <button
                type="button"
                onClick={() => setActionType('Returned')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                  actionType === 'Returned'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 ring-2 ring-purple-500/30'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <RotateCcw className="w-5 h-5 mb-1 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-bold">RETURN</span>
              </button>

              <button
                type="button"
                onClick={() => setActionType('Rejected')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                  actionType === 'Rejected'
                    ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 ring-2 ring-rose-500/30'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <XCircle className="w-5 h-5 mb-1 text-rose-600 dark:text-rose-400" />
                <span className="text-xs font-bold">REJECT</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Approval Notes / Comments
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Provide reason, budget notes, or revisions requested..."
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExecute}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            Submit Decision
          </button>
        </div>
      </div>
    </div>
  );
};
