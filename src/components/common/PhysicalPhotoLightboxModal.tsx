import React from 'react';
import { X, Edit3, Image, Download, ShieldCheck, Tag, MapPin, User, Calendar } from 'lucide-react';

interface PhysicalPhotoProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tagOrPlate: string;
  photoUrl?: string;
  categoryOrType?: string;
  locationOrDriver?: string;
  statusOrCondition?: string;
  onEditRequested?: () => void;
}

export const PhysicalPhotoLightboxModal: React.FC<PhysicalPhotoProps> = ({
  isOpen,
  onClose,
  title,
  tagOrPlate,
  photoUrl,
  categoryOrType,
  locationOrDriver,
  statusOrCondition,
  onEditRequested
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row">
        {/* Image Display */}
        <div className="w-full md:w-3/5 bg-black flex items-center justify-center min-h-[280px] md:min-h-[400px] relative">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={title}
              className="max-h-[450px] w-full object-contain p-2"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 p-8">
              <Image className="w-16 h-16 mb-2 opacity-40" />
              <p className="text-xs font-semibold">Foto fisik belum diunggah</p>
            </div>
          )}
          <span className="absolute top-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-xs text-white font-mono font-bold text-xs rounded-lg shadow border border-slate-700">
            {tagOrPlate}
          </span>
        </div>

        {/* Info Sidebar */}
        <div className="w-full md:w-2/5 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-md">
                Bentuk Fisik Objek
              </span>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-3">
              {title}
            </h2>

            <div className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              {categoryOrType && (
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Kategori / Tipe: <strong>{categoryOrType}</strong></span>
                </div>
              )}

              {locationOrDriver && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">Penempatan / Driver: <strong>{locationOrDriver}</strong></span>
                </div>
              )}

              {statusOrCondition && (
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Status / Kondisi: <strong className="text-emerald-600 dark:text-emerald-400">{statusOrCondition}</strong></span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {onEditRequested && (
              <button
                onClick={() => {
                  onClose();
                  onEditRequested();
                }}
                className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Informasi & Foto Fisik</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Tutup Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
