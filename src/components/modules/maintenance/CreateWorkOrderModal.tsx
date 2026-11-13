import React, { useState, useEffect } from 'react';
import { useGams } from '../../../context/GamsContext';
import {
  Wrench,
  X,
  Calendar,
  Upload,
  FileText,
  CheckCircle2,
  DollarSign,
  Paperclip,
  AlertCircle,
  Mail,
  UserCheck,
  Send,
  Check
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTargetType?: 'Asset' | 'Vehicle' | 'Building Facility';
  initialTargetId?: string;
  initialTargetName?: string;
  onSuccess?: () => void;
}

export const CreateWorkOrderModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialTargetType = 'Asset',
  initialTargetId = '',
  initialTargetName = '',
  onSuccess
}) => {
  const { assets, vehicles, vendors, employees, addMaintenanceRequest, currentUser } = useGams();

  const [targetType, setTargetType] = useState<'Asset' | 'Vehicle' | 'Building Facility'>(initialTargetType);
  const [targetId, setTargetId] = useState(initialTargetId);
  const [targetName, setTargetName] = useState(initialTargetName);

  const [title, setTitle] = useState('');
  const [woType, setWoType] = useState<'Preventive' | 'Corrective'>('Corrective');
  const [estimatedDate, setEstimatedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().slice(0, 10);
  });
  const [workExecutionStatus, setWorkExecutionStatus] = useState<'On-Going' | 'Done' | 'Pending'>('On-Going');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [assignedVendor, setAssignedVendor] = useState(vendors[0]?.name || 'Auto2000 Service Center');
  const [estimatedCost, setEstimatedCost] = useState(2500000);
  const [description, setDescription] = useState('');

  // PIC Assignment state from Employee database
  const [assignedPicId, setAssignedPicId] = useState<string>(() => employees[1]?.id || employees[0]?.id || '');
  const [sendEmailNotification, setSendEmailNotification] = useState<boolean>(true);

  // Email Notification Success Dialog State
  const [emailNoticeData, setEmailNoticeData] = useState<{
    isOpen: boolean;
    picName: string;
    picEmail: string;
    woTitle: string;
    targetName: string;
    vendor: string;
    estimatedDate: string;
  } | null>(null);

  // Attachment state simulation
  const [attachmentName, setAttachmentName] = useState('Estimasi_Penawaran_Vendor_Quotation.pdf');
  const [attachmentList, setAttachmentList] = useState<{ name: string; url: string; size: string; date: string }[]>([]);

  useEffect(() => {
    setTargetType(initialTargetType);
    setTargetId(initialTargetId);
    setTargetName(initialTargetName);
    if (initialTargetName) {
      setTitle(`Servis Perbaikan - ${initialTargetName}`);
    }
  }, [initialTargetType, initialTargetId, initialTargetName, isOpen]);

  if (!isOpen) return null;

  const selectedPic = employees.find((e) => e.id === assignedPicId) || employees[0];

  const handleAddAttachment = () => {
    if (!attachmentName.trim()) return;
    setAttachmentList((prev) => [
      ...prev,
      {
        name: attachmentName,
        url: '#',
        size: '1.2 MB',
        date: new Date().toISOString().slice(0, 10)
      }
    ]);
    setAttachmentName('');
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachmentList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalTargetName = targetName;
    if (targetType === 'Asset' && targetId) {
      const selectedAsset = assets.find((a) => a.id === targetId);
      if (selectedAsset) finalTargetName = `${selectedAsset.name} (${selectedAsset.id})`;
    } else if (targetType === 'Vehicle' && targetId) {
      const selectedVehicle = vehicles.find((v) => v.id === targetId);
      if (selectedVehicle) finalTargetName = `${selectedVehicle.brandModel} (${selectedVehicle.id})`;
    }

    const finalAttachments =
      attachmentList.length > 0
        ? attachmentList
        : [
            {
              name: 'Penawaran_Vendor_Estimasi.pdf',
              url: '#',
              size: '1.1 MB',
              date: new Date().toISOString().slice(0, 10)
            }
          ];

    const finalTitle = title || `Work Order Servis - ${finalTargetName || 'Fasilitas GA'}`;

    addMaintenanceRequest({
      title: finalTitle,
      type: woType,
      targetType,
      targetId: targetId || 'GENERIC-ID',
      targetName: finalTargetName || 'GAMS Asset/Vehicle',
      description: description || 'Pemeriksaan dan perbaikan sesuai standar operasional prosedur maintenance.',
      priority,
      estimatedCost: Number(estimatedCost),
      actualCost: workExecutionStatus === 'Done' ? Number(estimatedCost) : 0,
      estimatedDate,
      workExecutionStatus,
      status: workExecutionStatus === 'Done' ? 'Completed' : 'Approved',
      assignedTechnicianOrVendor: assignedVendor,
      assignedPicId: selectedPic?.id,
      assignedPicName: selectedPic?.name,
      assignedPicEmail: selectedPic?.email,
      attachments: finalAttachments
    });

    if (sendEmailNotification && selectedPic) {
      setEmailNoticeData({
        isOpen: true,
        picName: selectedPic.name,
        picEmail: selectedPic.email,
        woTitle: finalTitle,
        targetName: finalTargetName || 'GAMS Asset/Vehicle',
        vendor: assignedVendor,
        estimatedDate
      });
    } else {
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  const handleCloseEmailDialog = () => {
    setEmailNoticeData(null);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden animate-fade-in relative">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Buat Work Order Baru (Perintah Kerja)
              </h2>
              <p className="text-xs text-slate-500">
                Lengkapi rincian estimasi pekerjaan, penugasan PIC, & notifikasi email
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

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Target Selection Section */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              1. Pilih Target Objek Maintenance
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetType('Asset')}
                className={`py-2 px-3 rounded-lg font-bold text-center border transition-all ${
                  targetType === 'Asset'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Aset Fisik
              </button>
              <button
                type="button"
                onClick={() => setTargetType('Vehicle')}
                className={`py-2 px-3 rounded-lg font-bold text-center border transition-all ${
                  targetType === 'Vehicle'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Kendaraan Armada
              </button>
              <button
                type="button"
                onClick={() => setTargetType('Building Facility')}
                className={`py-2 px-3 rounded-lg font-bold text-center border transition-all ${
                  targetType === 'Building Facility'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Fasilitas Gedung
              </button>
            </div>

            {/* Target Item Dropdown */}
            {targetType === 'Asset' && (
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">Pilih Aset Spesifik:</label>
                <select
                  value={targetId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setTargetId(id);
                    const selected = assets.find((a) => a.id === id);
                    if (selected) {
                      setTargetName(`${selected.name} (${selected.id})`);
                      if (!title) setTitle(`Servis Perbaikan - ${selected.name}`);
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-medium"
                >
                  <option value="">-- Pilih dari Daftar Aset --</option>
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.id} - {a.name} ({a.categoryName})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {targetType === 'Vehicle' && (
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">Pilih Kendaraan Spesifik:</label>
                <select
                  value={targetId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setTargetId(id);
                    const selected = vehicles.find((v) => v.id === id);
                    if (selected) {
                      setTargetName(`${selected.brandModel} (${selected.id})`);
                      if (!title) setTitle(`Servis Berkala Armada - ${selected.id}`);
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-medium"
                >
                  <option value="">-- Pilih dari Daftar Armada --</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.id} - {v.brandModel} ({v.type})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {targetType === 'Building Facility' && (
              <div>
                <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">Nama Fasilitas Gedung / Ruangan:</label>
                <input
                  type="text"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  placeholder="misal: Ruang Rapat Lt. 5 / Lift Penumpang A"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-medium"
                />
              </div>
            )}
          </div>

          {/* Section 2: Assignment PIC (Employee Database) & Notifikasi Email */}
          <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-indigo-900 dark:text-indigo-200 font-bold uppercase tracking-wider text-[10px] flex items-center">
                <UserCheck className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                2. Assignment PIC (Employee Database) & Email Notification
              </label>
              <span className="text-[10px] bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold px-2 py-0.5 rounded-full">
                Wajib Ditugaskan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Pilih PIC Penanggung Jawab:
                </label>
                <select
                  value={assignedPicId}
                  onChange={(e) => setAssignedPicId(e.target.value)}
                  className="w-full px-3 py-2 border border-indigo-200 dark:border-indigo-800 rounded-lg bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-slate-100 text-xs shadow-sm"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} — {emp.position} ({emp.departmentName})
                    </option>
                  ))}
                </select>
              </div>

              {selectedPic && (
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-indigo-200 dark:border-indigo-900 flex items-center space-x-3 shadow-sm">
                  {selectedPic.avatar ? (
                    <img
                      src={selectedPic.avatar}
                      alt={selectedPic.name}
                      className="w-9 h-9 rounded-full object-cover border border-indigo-300 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                      {selectedPic.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1 text-[11px]">
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{selectedPic.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {selectedPic.position} • {selectedPic.departmentName}
                    </p>
                    <div className="flex items-center text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                      <Mail className="w-3 h-3 mr-1 shrink-0" />
                      <span className="truncate">{selectedPic.email}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Email Notification Checkbox / Alert Toggle */}
            <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendEmailNotification}
                  onChange={(e) => setSendEmailNotification(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                  Kirim Email Notifikasi Penugasan ke PIC ({selectedPic?.email})
                </span>
              </label>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>SMTP Active</span>
              </span>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Judul Work Order */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Judul Perbaikan / Subjek Work Order <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="misal: Service AC Central Compressor & Refill Freon"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Tipe Work Order (Preventive / Correction) */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Tipe Work Order <span className="text-rose-500">*</span>
              </label>
              <div className="flex space-x-2">
                <label
                  className={`flex-1 p-2 rounded-lg border cursor-pointer text-center font-bold transition-colors ${
                    woType === 'Corrective'
                      ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700'
                      : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="woType"
                    value="Corrective"
                    checked={woType === 'Corrective'}
                    onChange={() => setWoType('Corrective')}
                    className="sr-only"
                  />
                  <span>Correction / Perbaikan</span>
                </label>
                <label
                  className={`flex-1 p-2 rounded-lg border cursor-pointer text-center font-bold transition-colors ${
                    woType === 'Preventive'
                      ? 'bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-700'
                      : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="woType"
                    value="Preventive"
                    checked={woType === 'Preventive'}
                    onChange={() => setWoType('Preventive')}
                    className="sr-only"
                  />
                  <span>Preventive / Berkala</span>
                </label>
              </div>
            </div>

            {/* Tanggal Perkiraan Pekerjaan */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Tanggal Perkiraan Pekerjaan <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={estimatedDate}
                  onChange={(e) => setEstimatedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-mono font-bold"
                />
              </div>
            </div>

            {/* Status Pekerjaan (On-Going / Done) */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Status Pekerjaan <span className="text-rose-500">*</span>
              </label>
              <select
                value={workExecutionStatus}
                onChange={(e) => setWorkExecutionStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-bold"
              >
                <option value="On-Going">On-Going (Sedang Berjalan)</option>
                <option value="Done">Done (Telah Selesai)</option>
                <option value="Pending">Pending (Menunggu Penjadwalan)</option>
              </select>
            </div>

            {/* Prioritas */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Prioritas Pekerjaan</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-medium"
              >
                <option value="Low">Low - Rendah</option>
                <option value="Medium">Medium - Normal</option>
                <option value="High">High - Penting</option>
                <option value="Urgent">Urgent - Sangat Mendesak</option>
              </select>
            </div>

            {/* Vendor / Teknisi */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Vendor / Teknisi Pelaksana
              </label>
              <input
                type="text"
                value={assignedVendor}
                onChange={(e) => setAssignedVendor(e.target.value)}
                placeholder="misal: Auto2000 / PT Clean & Cool"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-medium"
              />
            </div>

            {/* Perkiraan Biaya (IDR) */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Perkiraan Biaya Pekerjaan (IDR)
              </label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                placeholder="2500000"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-mono font-bold text-emerald-600"
              />
            </div>
          </div>

          {/* Deskripsi Pekerjaan */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Deskripsi Pekerjaan & Lingkup Perbaikan <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan deskripsi rincian lingkup pekerjaan, indikasi gejala kerusakan, komponen/sparepart yang direncanakan untuk diganti, serta instruksi khusus untuk teknisi/vendor..."
              className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-medium text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Melampirkan Dokumen Pendukung */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
            <label className="block font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span className="flex items-center">
                <Paperclip className="w-4 h-4 mr-1.5 text-indigo-600" />
                Dokumen Pendukung / Estimasi Biaya Vendor
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Surat Penawaran / Quotation / SPK Vendor</span>
            </label>

            <div className="flex space-x-2">
              <input
                type="text"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                placeholder="Nama file dokumen pendukung (e.g. Surat_Penawaran_Vendor.pdf)"
                className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-medium text-xs"
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center space-x-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Lampirkan</span>
              </button>
            </div>

            {/* List of Attached Documents */}
            <div className="space-y-1.5">
              {attachmentList.length === 0 ? (
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-center text-[11px] flex items-center justify-center space-x-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>File penawaran resmi vendor otomatis terlampir saat Work Order disimpan.</span>
                </div>
              ) : (
                attachmentList.map((att, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{att.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({att.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(idx)}
                      className="text-rose-500 hover:underline font-bold text-[10px]"
                    >
                      Hapus
                    </button>
                  </div>
                ))
              )}
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
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan & Terbitkan Work Order</span>
            </button>
          </div>
        </form>

        {/* EMAIL SENT CONFIRMATION OVERLAY DIALOG */}
        {emailNoticeData?.isOpen && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md z-50 p-6 flex items-center justify-center animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800 shadow-2xl max-w-md w-full space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full shrink-0">
                  <Send className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    Notifikasi Email Penugasan Terkirim!
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Work Order telah berhasil disimpan & notifikasi email dikirim ke PIC.
                  </p>
                </div>
              </div>

              {/* Email Envelope Card Preview */}
              <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/60 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-2 text-xs">
                <div className="flex justify-between items-center text-[11px] font-bold pb-2 border-b border-indigo-200 dark:border-indigo-800">
                  <span className="text-indigo-900 dark:text-indigo-200 flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                    Detail Pesan Mailer (SMTP)
                  </span>
                  <span className="text-[9px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full">
                    Delivered
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Kepada (PIC Email):</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-[11px]">
                    {emailNoticeData.picName} &lt;{emailNoticeData.picEmail}&gt;
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Subjek Email:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    [GAMS Work Order] Assignment Perintah Kerja: {emailNoticeData.woTitle}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div>
                    <span className="text-slate-400 block">Target Objek:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{emailNoticeData.targetName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Perkiraan Tgl:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{emailNoticeData.estimatedDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleCloseEmailDialog}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesai & Tutup</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
