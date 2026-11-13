import React from 'react';
import { WorkflowStatus } from '../../types/gams';
import {
  FileText,
  Send,
  CheckCircle2,
  XCircle,
  RotateCcw,
  CheckCheck,
  Ban
} from 'lucide-react';

interface Props {
  status: WorkflowStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const WorkflowStatusBadge: React.FC<Props> = ({ status, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  }[size];

  const getConfig = () => {
    switch (status) {
      case 'Draft':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          icon: <FileText className="w-3 h-3 mr-1" />
        };
      case 'Submitted':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
          icon: <Send className="w-3 h-3 mr-1" />
        };
      case 'Approved':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
          icon: <CheckCircle2 className="w-3 h-3 mr-1" />
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
          icon: <XCircle className="w-3 h-3 mr-1" />
        };
      case 'Returned':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800',
          icon: <RotateCcw className="w-3 h-3 mr-1" />
        };
      case 'Completed':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800',
          icon: <CheckCheck className="w-3 h-3 mr-1" />
        };
      case 'Cancelled':
        return {
          bg: 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
          icon: <Ban className="w-3 h-3 mr-1" />
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-200',
          icon: null
        };
    }
  };

  const config = getConfig();

  return (
    <span
      className={`inline-flex items-center font-bold tracking-tight rounded-full border ${config.bg} ${sizeClasses}`}
    >
      {config.icon}
      {status.toUpperCase()}
    </span>
  );
};
