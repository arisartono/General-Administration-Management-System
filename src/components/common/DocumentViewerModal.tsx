import React, { useState } from 'react';
import { FileText, Image, Download, History, Eye, X, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  documentUrl?: string;
  category?: string;
}

export const DocumentViewerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  documentName,
  documentUrl,
  category = 'General Document'
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'versions'>('preview');

  if (!isOpen) return null;

  const versions = [
    { version: 'v2.0 (Current)', updatedBy: 'Dwight Schrute', date: '2026-07-25 10:15', size: '1.4 MB', note: 'Added updated serial number tags' },
    { version: 'v1.0', updatedBy: 'Michael Scott', date: '2026-01-15 09:00', size: '1.2 MB', note: 'Original uploaded agreement' }
  ];

  const isImage = documentName.match(/\.(jpg|jpeg|png|webp|gif)$/i) || documentUrl?.includes('images.unsplash.com');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold tracking-wide">{documentName}</h3>
              <p className="text-[10px] text-slate-400 font-mono">{category}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6">
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition-colors ${
              activeTab === 'preview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Document Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('versions')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition-colors ${
              activeTab === 'versions'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Version History (2)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'preview' ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 bg-slate-50/50 dark:bg-slate-950/50 min-h-[250px]">
              {isImage && documentUrl ? (
                <img
                  src={documentUrl}
                  alt={documentName}
                  className="max-h-[300px] object-contain rounded-lg shadow-md border border-slate-200"
                />
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{documentName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">PDF / Office Document Rendered Viewer</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-left text-xs font-mono max-w-md text-slate-600 dark:text-slate-300">
                    <p className="font-bold text-indigo-600 dark:text-indigo-400">--- EXECUTIVE APPROVAL PREVIEW ---</p>
                    <p className="mt-1">Document Status: Verified Active</p>
                    <p>Security Clearance: GA Manager Approved</p>
                    <p>Encryption: SHA-256 Validated</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((v, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{v.version}</p>
                        {i === 0 && (
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{v.note}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        By {v.updatedBy} • {v.date} • {v.size}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
          >
            Close
          </button>
          <a
            href={documentUrl || '#'}
            download={documentName}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download Document</span>
          </a>
        </div>
      </div>
    </div>
  );
};
