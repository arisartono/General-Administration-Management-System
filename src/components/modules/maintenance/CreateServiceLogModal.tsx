import React, { useState, useEffect } from 'react';
import { useGams } from '../../../context/GamsContext';
import { MaintenanceRequest } from '../../../types/gams';
import { FileCheck, X, Calendar, DollarSign, Paperclip, CheckCircle2, Building, Upload } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workOrder: MaintenanceRequest | null;
  onSuccess?: () => void;
}

export const CreateServiceLogModal: React.FC<Props> = ({
  isOpen,
  onClose,
  workOrder,
  onSuccess
}) => {
  const { addServiceLog } = useGams();

  const [actualWorkDescription, setActualWorkDescription] = useState('');
  const [actualCompletionDate, setActualCompletionDate] = useState(new Date().toISOString().slice(0, 10));
  const [vendorOrTechnician, setVendorOrTechnician] = useState('');
  const [totalCost, setTotalCost] = useState<number>(0);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceFileName, setInvoiceFileName] = useState('Bukti_Invoice_Kwitansi_Servis.pdf');

  useEffect(() => {
    if (workOrder) {
      setActualWorkDescription(workOrder.description || 'Pekerjaan perbaikan telah diselesaikan sesuai standar GA.');
      setVendorOrTechnician(workOrder.assignedTechnicianOrVendor || 'Teknisi GA');
      setTotalCost(workOrder.estimatedCost || 1500000);
      setInvoiceNumber(`INV-${Math.floor(10000 + Math.random() * 90000)}`);
      setInvoiceFileName(`Invoice_${workOrder.id}_Selesai.pdf`);
    }
  }, [workOrder, isOpen]);

  if (!isOpen || !workOrder) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addServiceLog({
      workOrderId: workOrder.id,
      targetType: workOrder.targetType,
      targetId: workOrder.targetId,
      targetName: workOrder.targetName,
      workType: workOrder.type,
      actualWorkDescription,
      actualCompletionDate,
      vendorOrTechnician,
      totalCost: Number(totalCost),
      invoiceNumber,
      invoiceAttachment: {
        name: invoiceFileName || 'Kwitansi_Pembayaran_Servis.pdf',
        url: '#',
        size: '1.4 MB'
      }
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden animate-fade-in">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 rounded-xl">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Buat Service Log (Pekerjaan Selesai)
              </h2>
              <p className="text-xs text-slate-500">
                Catat rincian aktual pekerjaan & biaya yang dikeluarkan untuk Work Order <span className="font-mono font-bold text-emerald-600">{workOrder.id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Work Order Info Box */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex flex-wrap justify-between items-center gap-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Objek Servis:</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">{workOrder.targetName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Estimasi Awal:</span>
              <p className="font-mono font-bold text-slate-600 dark:text-slate-300">
                IDR {workOrder.estimatedCost?.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tipe Maintenance:</span>
              <p className="font-semibold text-indigo-600 dark:text-indigo-400">{workOrder.type}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tanggal Penyelesaian Aktual */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Tanggal Aktual Pekerjaan Selesai <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={actualCompletionDate}
                onChange={(e) => setActualCompletionDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-mono font-bold"
              />
            </div>

            {/* Total Biaya Aktual (Actual Cost) */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Total Biaya Aktual / Biaya Riil (IDR) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={totalCost}
                onChange={(e) => setTotalCost(Number(e.target.value))}
                placeholder="2500000"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-mono font-bold text-emerald-600"
              />
              <span className="text-[10px] text-slate-400 italic mt-0.5 block">
                Total biaya ini otomatis diperhitungkan dalam Monthly Expenses Dashboard.
              </span>
            </div>

            {/* Vendor / Teknisi Pelaksana */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Teknisi / Vendor Pelaksana <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={vendorOrTechnician}
                onChange={(e) => setVendorOrTechnician(e.target.value)}
                placeholder="misal: Auto2000 Cilandak / Teknisi GA"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-medium"
              />
            </div>

            {/* Nomor Invoice / Kwitansi */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Nomor Invoice / BAP / Kwitansi Vendor
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV/2026/07/991"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-mono font-semibold"
              />
            </div>
          </div>

          {/* Deskripsi Aktual Pekerjaan */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Deskripsi Aktual Pekerjaan & Hasil Servis <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={actualWorkDescription}
              onChange={(e) => setActualWorkDescription(e.target.value)}
              placeholder="Jelaskan secara akurat bagian yang telah diperbaiki, sparepart yang diganti, serta catatan garansi dari vendor..."
              className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-medium text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Lampiran Invoice / Bukti Pembayaran */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
            <label className="block font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span className="flex items-center">
                <Paperclip className="w-4 h-4 mr-1 text-emerald-600" />
                Bukti Invoice / Kwitansi Pembayaran
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Lampiran Bukti Resmi</span>
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={invoiceFileName}
                onChange={(e) => setInvoiceFileName(e.target.value)}
                placeholder="Bukti_Pembayaran_Invoice.pdf"
                className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-medium text-xs"
              />
              <span className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg flex items-center space-x-1 text-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Terlampir</span>
              </span>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Service Log & Perbarui Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
