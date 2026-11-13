import React, { useState, useEffect } from 'react';
import { useGams } from '../../../context/GamsContext';
import { Vehicle } from '../../../types/gams';
import { X, Save } from 'lucide-react';
import { ImageUploadWidget } from '../../common/ImageUploadWidget';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

const SAMPLE_VEHICLE_PHOTOS = [
  {
    label: 'Toyota Innova Zenix MPV',
    url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Toyota Fortuner SUV 4x4',
    url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Daihatsu Gran Max Van Operational',
    url: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Executive Sedan Black',
    url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Compact Crossover SUV',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Motorcycle Delivery / Courier',
    url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80'
  }
];

export const EditVehicleModal: React.FC<Props> = ({ isOpen, onClose, vehicle }) => {
  const { updateVehicle, employees } = useGams();

  const [plate, setPlate] = useState('');
  const [brandModel, setBrandModel] = useState('');
  const [type, setType] = useState<Vehicle['type']>('MPV');
  const [year, setYear] = useState(2023);
  const [color, setColor] = useState('');
  const [assignedDriverName, setAssignedDriverName] = useState('');
  const [status, setStatus] = useState<Vehicle['status']>('Available');
  const [currentMileageKm, setCurrentMileageKm] = useState(0);
  const [fuelType, setFuelType] = useState<Vehicle['fuelType']>('Gasoline (RON 92)');
  const [stnkExpiry, setStnkExpiry] = useState('');
  const [kirExpiry, setKirExpiry] = useState('');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');
  const [taxExpiry, setTaxExpiry] = useState('');
  const [lastServiceDate, setLastServiceDate] = useState('');
  const [nextServiceKm, setNextServiceKm] = useState(0);
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (vehicle) {
      setPlate(vehicle.id || '');
      setBrandModel(vehicle.brandModel || '');
      setType(vehicle.type || 'MPV');
      setYear(vehicle.year || 2023);
      setColor(vehicle.color || 'Black');
      setAssignedDriverName(vehicle.assignedDriverName || '');
      setStatus(vehicle.status || 'Available');
      setCurrentMileageKm(vehicle.currentMileageKm || 0);
      setFuelType(vehicle.fuelType || 'Gasoline (RON 92)');
      setStnkExpiry(vehicle.stnkExpiry || '');
      setKirExpiry(vehicle.kirExpiry || '');
      setInsuranceExpiry(vehicle.insuranceExpiry || '');
      setTaxExpiry(vehicle.taxExpiry || '');
      setLastServiceDate(vehicle.lastServiceDate || '');
      setNextServiceKm(vehicle.nextServiceKm || 0);
      setPhotoUrl(vehicle.photoUrl || '');
    }
  }, [vehicle]);

  if (!isOpen || !vehicle) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateVehicle(vehicle.id, {
      id: plate,
      brandModel,
      type,
      year: Number(year),
      color,
      assignedDriverName,
      status,
      currentMileageKm: Number(currentMileageKm),
      fuelType,
      stnkExpiry,
      kirExpiry,
      insuranceExpiry,
      taxExpiry,
      lastServiceDate,
      nextServiceKm: Number(nextServiceKm),
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
            <span className="px-2.5 py-1 bg-amber-500 text-white font-mono text-xs font-bold rounded">
              {vehicle.id}
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Edit Informasi & Foto Fisik Kendaraan
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Plat Nomor (Nopol)
              </label>
              <input
                type="text"
                required
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Merk & Model Kendaraan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={brandModel}
                onChange={(e) => setBrandModel(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tipe Bodi
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="MPV">MPV (Multi-Purpose Vehicle)</option>
                <option value="SUV">SUV (Sport Utility Vehicle)</option>
                <option value="Sedan">Sedan Exec</option>
                <option value="Van">Van Blind / Cargo</option>
                <option value="Truck">Truck Box / Commercial</option>
                <option value="Motorcycle">Motorcycle / Kurir</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tahun Pembuatan & Warna
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-1/2 px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Warna"
                  className="w-1/2 px-3 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Odometer Saat Ini (KM)
              </label>
              <input
                type="number"
                value={currentMileageKm}
                onChange={(e) => setCurrentMileageKm(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jenis Bahan Bakar (BBM)
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="Gasoline (RON 92)">Gasoline (RON 92 / Pertamax)</option>
                <option value="Gasoline (RON 95)">Gasoline (RON 95 / Shell V-Power)</option>
                <option value="Diesel">Diesel / Pertamina Dex</option>
                <option value="Electric">Electric Vehicle (EV)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Driver / Pengemudi Tetap
              </label>
              <input
                type="text"
                value={assignedDriverName}
                onChange={(e) => setAssignedDriverName(e.target.value)}
                placeholder="e.g. Bambang Susilo (Pool Driver)"
                className="w-full px-3 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Status Armada
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="Available">Available (Siap Pakai)</option>
                <option value="In Trip">In Trip (Sedang Perjalanan Perdinasan)</option>
                <option value="Reserved">Reserved (Terbooking)</option>
                <option value="In Maintenance">In Maintenance (Servis Bengkel)</option>
                <option value="Decommissioned">Decommissioned (Tidak Beroperasi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Masa Berlaku STNK
              </label>
              <input
                type="date"
                value={stnkExpiry}
                onChange={(e) => setStnkExpiry(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Masa Berlaku KIR (Uji Berkala)
              </label>
              <input
                type="date"
                value={kirExpiry}
                onChange={(e) => setKirExpiry(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Masa Berlaku Asuransi
              </label>
              <input
                type="date"
                value={insuranceExpiry}
                onChange={(e) => setInsuranceExpiry(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tanggal Terakhir Servis
              </label>
              <input
                type="date"
                value={lastServiceDate}
                onChange={(e) => setLastServiceDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Photo Section */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <ImageUploadWidget
              photoUrl={photoUrl}
              onChange={setPhotoUrl}
              presetPhotos={SAMPLE_VEHICLE_PHOTOS}
              accentColor="amber"
              label="Foto Fisik Kendaraan Armada"
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
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl flex items-center space-x-1.5 shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Armada</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
