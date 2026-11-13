import React, { useState, useEffect } from 'react';
import { useGams } from '../../../context/GamsContext';
import { Asset } from '../../../types/gams';
import { X, Save } from 'lucide-react';
import { ImageUploadWidget } from '../../common/ImageUploadWidget';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
}

const SAMPLE_ASSET_PHOTOS = [
  {
    label: 'Laptop Workstation (Dell XPS / ThinkPad)',
    url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Kursi Kerja Ergonomis (Herman Miller)',
    url: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Air Conditioner / AC Inverter (Daikin)',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Projector / Proyektor Boardroom (Epson)',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Server Rack & IT Hardware (PowerEdge)',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Printer / Mesin Fotokopi Office (Canon)',
    url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Monitor Display / Desktop Screen',
    url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Meja Kerja / Office Workstation Desk',
    url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80'
  }
];

export const EditAssetModal: React.FC<Props> = ({ isOpen, onClose, asset }) => {
  const { updateAsset, locations, employees, assetCategories } = useGams();

  const [name, setName] = useState('');
  const [brandModel, setBrandModel] = useState('');
  const [categoryName, setCategoryName] = useState('IT');
  const [serialNumber, setSerialNumber] = useState('');
  const [locationName, setLocationName] = useState('');
  const [assignedEmployeeName, setAssignedEmployeeName] = useState('');
  const [purchaseCost, setPurchaseCost] = useState(0);
  const [salvageValue, setSalvageValue] = useState(0);
  const [usefulLifeYears, setUsefulLifeYears] = useState(4);
  const [status, setStatus] = useState<Asset['status']>('Active');
  const [condition, setCondition] = useState<Asset['condition']>('Good');
  const [warrantyExpiry, setWarrantyExpiry] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (asset) {
      setName(asset.name || '');
      setBrandModel(asset.brandModel || '');
      setCategoryName(asset.categoryName || 'IT');
      setSerialNumber(asset.serialNumber || '');
      setLocationName(asset.locationName || (locations[0]?.fullLocation || ''));
      setAssignedEmployeeName(asset.assignedEmployeeName || '');
      setPurchaseCost(asset.purchaseCost || 0);
      setSalvageValue(asset.salvageValue || 0);
      setUsefulLifeYears(asset.usefulLifeYears || 4);
      setStatus(asset.status || 'Active');
      setCondition(asset.condition || 'Good');
      setWarrantyExpiry(asset.warrantyExpiry || '');
      setPhotoUrl(asset.photoUrl || '');
    }
  }, [asset, locations]);

  if (!isOpen || !asset) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAsset(asset.id, {
      name,
      brandModel,
      categoryName: categoryName as any,
      serialNumber,
      locationName,
      assignedEmployeeName,
      purchaseCost: Number(purchaseCost),
      salvageValue: Number(salvageValue),
      usefulLifeYears: Number(usefulLifeYears),
      status,
      condition,
      warrantyExpiry,
      photoUrl
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-amber-500 text-white font-mono text-xs font-bold rounded">
              {asset.id}
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Edit Informasi & Foto Fisik Aset
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Aset <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Merk / Spesifikasi Model
              </label>
              <input
                type="text"
                value={brandModel}
                onChange={(e) => setBrandModel(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Aset
              </label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {assetCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name} ({cat.description})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nomor Seri / Serial Number
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. SN-99812-XX"
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Lokasi Keberadaan Aset
              </label>
              <select
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.fullLocation}>
                    {loc.fullLocation}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Penanggung Jawab / User Pemegang
              </label>
              <select
                value={assignedEmployeeName}
                onChange={(e) => setAssignedEmployeeName(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">-- Unassigned / Pool Asset --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name} ({emp.departmentName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Harga Perolehan (IDR)
              </label>
              <input
                type="number"
                value={purchaseCost}
                onChange={(e) => setPurchaseCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nilai Residu (IDR)
              </label>
              <input
                type="number"
                value={salvageValue}
                onChange={(e) => setSalvageValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Masa Manfaat (Tahun)
              </label>
              <input
                type="number"
                value={usefulLifeYears}
                onChange={(e) => setUsefulLifeYears(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Masa Garansi Berlaku s/d
              </label>
              <input
                type="date"
                value={warrantyExpiry}
                onChange={(e) => setWarrantyExpiry(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Status Operasional
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Active">Active (Aktif di Inventaris)</option>
                <option value="In Use">In Use (Sedang Digunakan User)</option>
                <option value="Maintenance">Maintenance (Dalam Perbaikan)</option>
                <option value="Borrowed">Borrowed (Dipinjam Sementara)</option>
                <option value="Mutated">Mutated (Dipindahkan)</option>
                <option value="Disposed">Disposed (Dihapuskan / Afkir)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kondisi Fisik Barang
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Good">Good (Kondisi Baik & Layak)</option>
                <option value="Fair">Fair (Kondisi Sedang / Ada Baret)</option>
                <option value="Damaged">Damaged (Rusak Minor)</option>
                <option value="Under Repair">Under Repair (Sedang Perbaikan Bengkel/Servis)</option>
              </select>
            </div>
          </div>

          {/* Photo Section */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <ImageUploadWidget
              photoUrl={photoUrl}
              onChange={setPhotoUrl}
              presetPhotos={SAMPLE_ASSET_PHOTOS}
              accentColor="indigo"
              label="Foto Bentuk Fisik Barang / Aset"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center space-x-1.5 shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Aset</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
