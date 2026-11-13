import React, { useState } from 'react';
import { useGams } from '../../../context/GamsContext';
import { MessengerDelivery } from '../../../types/gams';
import { WorkflowStatusBadge } from '../../common/WorkflowStatusBadge';
import {
  Send,
  Truck,
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  QrCode,
  MapPin,
  CheckCheck,
  Trash2
} from 'lucide-react';

interface Props {
  onOpenApprovalModal: (module: 'Messenger', id: string, title: string) => void;
}

export const MessengerManagementView: React.FC<Props> = ({ onOpenApprovalModal }) => {
  const { messengerDeliveries, addMessengerDelivery, deleteMessengerDelivery } = useGams();

  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [selectedDeliveryPOD, setSelectedDeliveryPOD] = useState<MessengerDelivery | null>(null);

  // Dispatch Form
  const [docType, setDocType] = useState<'Outgoing Document' | 'Incoming Document' | 'Internal Parcel'>('Outgoing Document');
  const [recipientName, setRecipientName] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [courierName, setCourierName] = useState('JNE Corporate Express');

  const handleDispatch = () => {
    addMessengerDelivery({
      type: docType,
      recipientName: recipientName || 'Tax Consultant Office',
      destinationAddress: destinationAddress || 'Jl. Gatot Subroto No 42, Jakarta',
      courierName
    });
    setShowDispatchModal(false);
    setRecipientName('');
  };

  return (
    <div className="p-3.5 sm:p-5 lg:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Send className="w-5 h-5 mr-2 text-indigo-600" /> Module 4: Messenger & Courier Dispatch
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Incoming & Outgoing Document Courier Tracking, Route History, & Proof of Delivery (POD) Signature Verification.
          </p>
        </div>

        <button
          onClick={() => setShowDispatchModal(true)}
          className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch Document / Parcel</span>
        </button>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
              <th className="px-6 py-3">Tracking No</th>
              <th className="px-6 py-3">Type & Courier</th>
              <th className="px-6 py-3">Sender / Recipient</th>
              <th className="px-6 py-3">Destination Address</th>
              <th className="px-6 py-3">Dispatch Status</th>
              <th className="px-6 py-3 text-right">Proof of Delivery</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800">
            {messengerDeliveries.map((del) => (
              <tr key={del.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-3 font-mono font-bold text-indigo-600">
                  {del.trackingNumber}
                  <p className="text-[10px] text-slate-400 font-normal">{del.id}</p>
                </td>
                <td className="px-6 py-3">
                  <p className="font-bold text-slate-900 dark:text-slate-100">{del.type}</p>
                  <p className="text-[11px] text-slate-500">{del.courierName}</p>
                </td>
                <td className="px-6 py-3">
                  <p className="font-bold text-slate-800 dark:text-slate-200">{del.recipientName}</p>
                  <p className="text-[10px] text-slate-400">From: {del.senderName}</p>
                </td>
                <td className="px-6 py-3 text-slate-600 dark:text-slate-300 truncate max-w-xs">
                  {del.destinationAddress}
                </td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    del.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {del.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-right space-x-1">
                  {del.proofOfDelivery ? (
                    <button
                      onClick={() => setSelectedDeliveryPOD(del)}
                      className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded flex items-center space-x-1 ml-auto inline-flex"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>View POD</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenApprovalModal('Messenger', del.id, `Dispatch to ${del.recipientName}`)}
                      className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 rounded"
                    >
                      Review
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm(`Apakah Anda yakin ingin menghapus data pengiriman (${del.trackingNumber})?`)) {
                        deleteMessengerDelivery(del.id);
                      }
                    }}
                    title="Hapus Dispatch"
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

      {/* POD Modal */}
      {selectedDeliveryPOD && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center">
              <CheckCheck className="w-4 h-4 mr-2 text-emerald-500" /> Proof of Delivery (POD)
            </h3>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-2">
              <p>Received By: <strong className="font-bold">{selectedDeliveryPOD.proofOfDelivery?.receivedBy}</strong></p>
              <p>Timestamp: <span className="font-mono">{selectedDeliveryPOD.proofOfDelivery?.timestamp}</span></p>
              <div className="pt-2 border-t">
                <p className="text-[10px] text-slate-400 font-semibold mb-1">Digital Recipient Signature</p>
                <div className="p-4 bg-white border border-slate-200 rounded flex items-center justify-center">
                  <span className="font-serif italic text-lg text-indigo-900 font-bold">
                    {selectedDeliveryPOD.proofOfDelivery?.receivedBy}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedDeliveryPOD(null)} className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg">
                Close POD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Dispatch Document or Parcel
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Director of Tax Regulations"
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Destination Address</label>
                <textarea
                  rows={2}
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  placeholder="Full delivery street address..."
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button onClick={() => setShowDispatchModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">
                Cancel
              </button>
              <button onClick={handleDispatch} className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg">
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
