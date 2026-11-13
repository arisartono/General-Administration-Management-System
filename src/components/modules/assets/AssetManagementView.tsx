import React, { useState, ChangeEvent } from 'react';
import { useGams } from '../../../context/GamsContext';
import { Asset } from '../../../types/gams';
import { WorkflowStatusBadge } from '../../common/WorkflowStatusBadge';
import { formatCurrency, exportToPDF, exportToExcel, downloadAssetRegistryTemplate, parseExcelFile } from '../../../utils/exportUtils';
import { CreateWorkOrderModal } from '../maintenance/CreateWorkOrderModal';
import { EditAssetModal } from './EditAssetModal';
import { PhysicalPhotoLightboxModal } from '../../common/PhysicalPhotoLightboxModal';
import { ImageUploadWidget } from '../../common/ImageUploadWidget';
import {
  Package,
  Plus,
  Search,
  Filter,
  Printer,
  QrCode,
  FileSpreadsheet,
  FileText,
  Eye,
  ArrowRightLeft,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Paperclip,
  TrendingDown,
  Download,
  Upload,
  Check,
  Wrench,
  Edit3,
  Camera,
  Image as ImageIcon
} from 'lucide-react';

interface Props {
  onOpenLabelModal: (asset: Asset) => void;
  onOpenDocumentModal: (name: string, url?: string, cat?: string) => void;
  onOpenApprovalModal: (module: 'Asset', id: string, title: string) => void;
}

export const AssetManagementView: React.FC<Props> = ({
  onOpenLabelModal,
  onOpenDocumentModal,
  onOpenApprovalModal
}) => {
  const { assets, addAsset, updateAsset, deleteAsset, locations, assetCategories, employees } = useGams();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState<Asset | null>(null);
  const [woModalAsset, setWoModalAsset] = useState<Asset | null>(null);
  const [editModalAsset, setEditModalAsset] = useState<Asset | null>(null);
  const [lightboxAsset, setLightboxAsset] = useState<Asset | null>(null);

  // Import Toast Feedback
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // Registration Form State
  const [assetName, setAssetName] = useState('');
  const [brandModel, setBrandModel] = useState('');
  const [categoryName, setCategoryName] = useState('IT');
  const [locationName, setLocationName] = useState('HQ Tower A - 4th Floor - GA Office');
  const [assignedEmp, setAssignedEmp] = useState('');
  const [purchaseCost, setPurchaseCost] = useState(15000000);
  const [usefulYears, setUsefulYears] = useState(4);
  const [warrantyDate, setWarrantyDate] = useState('2028-12-31');
  const [registerPhotoUrl, setRegisterPhotoUrl] = useState('https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500');

  // Transfer State
  const [transferUser, setTransferUser] = useState('');
  const [transferNotes, setTransferNotes] = useState('');

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.brandModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.assignedEmployeeName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || a.categoryName === categoryFilter;
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateAsset = () => {
    addAsset({
      name: assetName || 'Corporate Asset',
      brandModel: brandModel || 'Model Specification',
      categoryName: categoryName as any,
      locationName,
      assignedEmployeeName: assignedEmp,
      purchaseCost: Number(purchaseCost),
      salvageValue: Number(purchaseCost) * 0.1,
      usefulLifeYears: Number(usefulYears),
      warrantyExpiry: warrantyDate,
      photoUrl: registerPhotoUrl || 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500'
    });
    setShowRegisterModal(false);
    setAssetName('');
  };

  const handleExecuteTransfer = () => {
    if (!showTransferModal) return;
    updateAsset(showTransferModal.id, {
      assignedEmployeeName: transferUser,
      status: 'In Use',
      history: [
        ...(showTransferModal.history || []),
        {
          id: `HIS-${Date.now().toString().slice(-4)}`,
          assetId: showTransferModal.id,
          type: 'Mutation',
          date: new Date().toISOString().slice(0, 10),
          fromLocationOrUser: showTransferModal.assignedEmployeeName || 'Storage',
          toLocationOrUser: transferUser,
          notes: transferNotes || 'Asset mutation transfer',
          approvedBy: 'GA Manager'
        }
      ]
    });
    setShowTransferModal(null);
  };

  const handleExportPDF = () => {
    const rows = filteredAssets.map((a) => [a.id, a.name, a.categoryName, a.assignedEmployeeName || 'Unassigned', formatCurrency(a.purchaseCost, 'IDR'), a.status, a.warrantyExpiry]);
    exportToPDF('GAMS Asset Inventory & Depreciation Report', ['Asset Tag', 'Asset Name', 'Category', 'User', 'Cost', 'Status', 'Warranty'], rows, 'GAMS_Asset_Inventory');
  };

  const handleExportExcel = () => {
    const exportData = filteredAssets.map((a) => ({
      'Asset Tag': a.id,
      'Asset Name': a.name,
      'Brand & Model': a.brandModel,
      'Category': a.categoryName,
      'Location': a.locationName,
      'Assigned Employee': a.assignedEmployeeName || 'Unassigned',
      'Purchase Cost (IDR)': a.purchaseCost,
      'Book Value (IDR)': a.currentBookValue,
      'Useful Life (Years)': a.usefulLifeYears,
      'Status': a.status,
      'Workflow Status': a.workflowStatus,
      'Warranty Expiry': a.warrantyExpiry
    }));
    exportToExcel(exportData, 'GAMS_Asset_Registry');
  };

  const handleImportExcelFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      const parsedRows = await parseExcelFile(file);
      
      let importedCount = 0;
      parsedRows.forEach((row) => {
        const name = row['Asset Name'] || row['name'] || row['Nama Aset'];
        if (!name) return;

        addAsset({
          name: String(name),
          brandModel: String(row['Brand & Model'] || row['brandModel'] || row['Merk & Model'] || 'Standard Specification'),
          categoryName: (row['Category'] || row['categoryName'] || row['Kategori'] || 'IT') as any,
          locationName: String(row['Location'] || row['locationName'] || row['Lokasi'] || 'HQ Office'),
          assignedEmployeeName: row['Assigned Employee'] || row['assignedEmployeeName'] || row['Karyawan'] || '',
          purchaseCost: Number(row['Purchase Cost (IDR)'] || row['purchaseCost'] || row['Harga Beli'] || 10000000),
          salvageValue: Number(row['Purchase Cost (IDR)'] || 10000000) * 0.1,
          usefulLifeYears: Number(row['Useful Life (Years)'] || row['usefulLifeYears'] || row['Masa Manfaat'] || 4),
          warrantyExpiry: String(row['Warranty Expiry (YYYY-MM-DD)'] || row['warrantyExpiry'] || row['Garansi'] || '2028-12-31')
        });
        importedCount++;
      });

      setImportNotice(`Berhasil mengimpor ${importedCount} aset baru ke Asset Registry!`);
      setTimeout(() => setImportNotice(null), 6000);
    } catch (err) {
      console.error('Error importing Excel:', err);
      alert('Gagal mengimpor file Excel. Pastikan format kolom sesuai.');
    }
  };

  return (
    <div className="p-3.5 sm:p-5 lg:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
      {/* Import Toast Notice */}
      {importNotice && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-between text-emerald-800 dark:text-emerald-200 text-xs font-bold shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{importNotice}</span>
          </div>
          <button onClick={() => setImportNotice(null)} className="text-xs text-emerald-600 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Package className="w-5 h-5 mr-2 text-indigo-600" /> Module 1: Enterprise Asset Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Registration, Transfer/Mutation, Label Printing, Depreciation, & Excel Bulk Import/Export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download Template Excel */}
          <button
            onClick={downloadAssetRegistryTemplate}
            title="Download Template Excel untuk Pengisian Asset Registry"
            className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Template Excel</span>
          </button>

          {/* Import Excel */}
          <label className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center space-x-1 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>Import Excel</span>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleImportExcelFile}
              className="hidden"
            />
          </label>

          {/* Export Excel Registry */}
          <button
            onClick={handleExportExcel}
            title="Export data Asset Registry ke Excel"
            className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center space-x-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Excel</span>
          </button>

          {/* PDF Report */}
          <button
            onClick={handleExportPDF}
            className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center space-x-1"
          >
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            <span>PDF Report</span>
          </button>

          {/* Single Register */}
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Register Asset</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="md:col-span-2 flex items-center space-x-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Asset Tag, Name, Serial, or Employee..."
            className="w-full bg-transparent text-xs font-medium outline-none text-slate-800 dark:text-slate-200"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
          >
            <option value="All">All Categories</option>
            <option value="IT">IT Hardware</option>
            <option value="Furniture">Furniture</option>
            <option value="Electronic">Electronic</option>
            <option value="Vehicle">Vehicle</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="In Use">In Use</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Borrowed">Borrowed</option>
          </select>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                <th className="px-5 py-3">Asset Tag</th>
                <th className="px-5 py-3">Foto Fisik</th>
                <th className="px-5 py-3">Asset & Specification</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Assigned User</th>
                <th className="px-5 py-3">Book Value</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Warranty</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400 align-middle">
                    {asset.id}
                  </td>
                  <td className="px-5 py-3 align-middle">
                    <button
                      onClick={() => setLightboxAsset(asset)}
                      title="Klik untuk Perbesar Foto Bentuk Fisik"
                      className="group relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0 block hover:ring-2 hover:ring-indigo-500 transition-all"
                    >
                      {asset.photoUrl ? (
                        <img src={asset.photoUrl} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                          <Camera className="w-5 h-5 opacity-60" />
                        </div>
                      )}
                      <span className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Eye className="w-4 h-4" />
                      </span>
                    </button>
                  </td>
                  <td className="px-5 py-3 align-middle">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{asset.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{asset.brandModel}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-700 dark:text-slate-300 align-middle">
                    {asset.categoryName}
                  </td>
                  <td className="px-5 py-3 font-medium align-middle">
                    {asset.assignedEmployeeName ? (
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{asset.assignedEmployeeName}</span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned Pool</span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-mono font-bold text-emerald-600 align-middle">
                    {formatCurrency(asset.currentBookValue, 'IDR')}
                  </td>
                  <td className="px-5 py-3 align-middle">
                    <WorkflowStatusBadge status={asset.workflowStatus} />
                  </td>
                  <td className="px-5 py-3 font-mono text-[11px] align-middle">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded">
                      {asset.warrantyExpiry}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right space-x-1 align-middle">
                    {/* EDIT BUTTON */}
                    <button
                      onClick={() => setEditModalAsset(asset)}
                      title="Edit Informasi & Foto Fisik Aset"
                      className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setWoModalAsset(asset)}
                      title="Buat Work Order / Maintenance Request untuk Aset ini"
                      className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded"
                    >
                      <Wrench className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenLabelModal(asset)}
                      title="Print Barcode/QR Sticker Label"
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowTransferModal(asset)}
                      title="Mutate / Transfer Asset"
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenApprovalModal('Asset', asset.id, asset.name)}
                      title="Workflow Decision"
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Apakah Anda yakin ingin menghapus record aset "${asset.name}" (${asset.id})?`)) {
                          deleteAsset(asset.id);
                        }
                      }}
                      title="Delete Asset Record"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors"
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

      {/* Asset Transfer / Mutation Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Asset Mutation / Transfer • {showTransferModal.id}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Transfer To Employee / Dept</label>
                <select
                  value={transferUser}
                  onChange={(e) => setTransferUser(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                >
                  <option value="">Select Employee...</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.name}>{e.name} ({e.departmentName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Mutation Purpose / Notes</label>
                <textarea
                  rows={2}
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="Reason for asset reassignment..."
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button onClick={() => setShowTransferModal(null)} className="px-4 py-2 text-xs font-semibold text-slate-600">
                Cancel
              </button>
              <button onClick={handleExecuteTransfer} className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg">
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Asset Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Register New Asset
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block font-semibold mb-1">Asset Name</label>
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="e.g. MacBook Pro M3 Max"
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Brand & Model</label>
                <input
                  type="text"
                  value={brandModel}
                  onChange={(e) => setBrandModel(e.target.value)}
                  placeholder="e.g. Apple M3 36GB"
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                >
                  <option value="IT">IT Hardware</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Electronic">Electronic</option>
                  <option value="Vehicle">Vehicle</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Purchase Cost (IDR)</label>
                <input
                  type="number"
                  value={purchaseCost}
                  onChange={(e) => setPurchaseCost(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Useful Life (Years)</label>
                <input
                  type="number"
                  value={usefulYears}
                  onChange={(e) => setUsefulYears(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="md:col-span-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <ImageUploadWidget
                  photoUrl={registerPhotoUrl}
                  onChange={setRegisterPhotoUrl}
                  accentColor="indigo"
                  label="Foto Fisik Aset"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <button onClick={() => setShowRegisterModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">
                Cancel
              </button>
              <button onClick={handleCreateAsset} className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg">
                Submit Registration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      <EditAssetModal
        isOpen={Boolean(editModalAsset)}
        onClose={() => setEditModalAsset(null)}
        asset={editModalAsset}
      />

      {/* Lightbox Physical Photo Preview Modal */}
      <PhysicalPhotoLightboxModal
        isOpen={Boolean(lightboxAsset)}
        onClose={() => setLightboxAsset(null)}
        title={lightboxAsset?.name || ''}
        tagOrPlate={lightboxAsset?.id || ''}
        photoUrl={lightboxAsset?.photoUrl}
        categoryOrType={lightboxAsset?.categoryName}
        locationOrDriver={lightboxAsset?.locationName}
        statusOrCondition={`${lightboxAsset?.status} (${lightboxAsset?.condition})`}
        onEditRequested={() => {
          if (lightboxAsset) {
            setEditModalAsset(lightboxAsset);
          }
        }}
      />

      {/* Work Order Modal for Asset */}
      <CreateWorkOrderModal
        isOpen={Boolean(woModalAsset)}
        onClose={() => setWoModalAsset(null)}
        initialTargetType="Asset"
        initialTargetId={woModalAsset?.id || ''}
        initialTargetName={woModalAsset ? `${woModalAsset.name} (${woModalAsset.id})` : ''}
      />
    </div>
  );
};
