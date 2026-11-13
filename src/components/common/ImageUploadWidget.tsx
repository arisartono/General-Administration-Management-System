import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Link as LinkIcon, X, Check, RefreshCw, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';

interface PresetPhoto {
  label: string;
  url: string;
}

interface ImageUploadWidgetProps {
  photoUrl: string;
  onChange: (url: string) => void;
  presetPhotos?: PresetPhoto[];
  accentColor?: 'indigo' | 'amber' | 'emerald';
  label?: string;
}

export const ImageUploadWidget: React.FC<ImageUploadWidgetProps> = ({
  photoUrl,
  onChange,
  presetPhotos = [],
  accentColor = 'indigo',
  label = 'Foto Bentuk Fisik'
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'camera' | 'url' | 'presets'>('upload');
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraStarting, setIsCameraStarting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraFileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const colorClasses = {
    indigo: {
      btn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      border: 'border-indigo-600',
      text: 'text-indigo-600 dark:text-indigo-400',
      bgLight: 'bg-indigo-50 dark:bg-indigo-950/60',
      ring: 'focus:ring-indigo-500'
    },
    amber: {
      btn: 'bg-amber-600 hover:bg-amber-700 text-white',
      border: 'border-amber-600',
      text: 'text-amber-600 dark:text-amber-400',
      bgLight: 'bg-amber-50 dark:bg-amber-950/60',
      ring: 'focus:ring-amber-500'
    },
    emerald: {
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      border: 'border-emerald-600',
      text: 'text-emerald-600 dark:text-emerald-400',
      bgLight: 'bg-emerald-50 dark:bg-emerald-950/60',
      ring: 'focus:ring-emerald-500'
    }
  }[accentColor];

  // Stop camera media tracks
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Start web camera stream
  const startCamera = async (facing: 'environment' | 'user' = facingMode) => {
    stopCamera();
    setCameraError(null);
    setIsCameraStarting(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera tidak didukung oleh browser ini.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(err.message || 'Gagal mengakses kamera peranti. Pastikan izin kamera telah diberikan.');
    } finally {
      setIsCameraStarting(false);
    }
  };

  const handleOpenCamera = () => {
    setShowCameraModal(true);
    setTimeout(() => {
      startCamera(facingMode);
    }, 100);
  };

  const handleCloseCamera = () => {
    stopCamera();
    setShowCameraModal(false);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      onChange(dataUrl);
      handleCloseCamera();
    }
  };

  const handleSwitchCamera = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  // File upload from device folder/gallery
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file format gambar (JPG, PNG, WEBP, etc).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    // Reset input value so same file can be selected again
    e.target.value = '';
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-3">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={cameraFileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
        <span className="flex items-center">
          <ImageIcon className={`w-4 h-4 mr-1.5 ${colorClasses.text}`} />
          <span>{label}</span>
        </span>
        {photoUrl && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 hover:underline flex items-center space-x-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Hapus Foto</span>
          </button>
        )}
      </label>

      {/* Main Container */}
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {/* Thumbnail Preview Box */}
        <div className="shrink-0">
          {photoUrl ? (
            <div className="relative group w-32 h-24 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-900 shadow-sm">
              <img src={photoUrl} alt="Foto Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 bg-white/90 rounded-lg text-slate-800 hover:bg-white text-xs font-bold shadow"
                  title="Ganti Foto"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-1.5 bg-rose-600 rounded-lg text-white hover:bg-rose-700 text-xs font-bold shadow"
                  title="Hapus Foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="w-32 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2 text-center">
              <ImageIcon className="w-6 h-6 mb-1 opacity-40" />
              <span className="text-[10px] font-medium leading-tight">Belum ada foto fisik</span>
            </div>
          )}
        </div>

        {/* Action Controls & Options */}
        <div className="flex-1 w-full space-y-2.5">
          {/* Option Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-all shadow-2xs ${colorClasses.btn}`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah File</span>
            </button>

            <button
              type="button"
              onClick={handleOpenCamera}
              className="py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white transition-all shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Kamera</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('url')}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1 transition-all ${
                activeMode === 'url'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>URL Web</span>
            </button>

            {presetPhotos.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveMode('presets')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1 transition-all ${
                  activeMode === 'presets'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Sampel Galeri</span>
              </button>
            )}
          </div>

          {/* Dynamic Input Views */}
          {activeMode === 'url' && (
            <div className="flex items-center space-x-2 animate-fade-in">
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Paste URL foto fisik (https://...)"
                className={`flex-1 px-3 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 outline-none ${colorClasses.ring}`}
              />
              {photoUrl && (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-1.5 text-slate-400 hover:text-rose-500"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {presetPhotos.length > 0 && activeMode === 'presets' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 animate-fade-in">
              {presetPhotos.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange(preset.url)}
                  className={`p-1 rounded-lg border text-left text-[10px] font-medium flex items-center space-x-1.5 transition-all ${
                    photoUrl === preset.url
                      ? `${colorClasses.border} ${colorClasses.bgLight} ${colorClasses.text} font-bold shadow-2xs`
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <img src={preset.url} alt="" className="w-6 h-6 rounded object-cover shrink-0" />
                  <span className="truncate">{preset.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Helper Text */}
          <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
            *Dapat mengunggah foto langsung dari kamera HP/laptop, memilih file dari folder perangkat, memasukkan URL, atau galeri sampel.
          </p>
        </div>
      </div>

      {/* Live Camera Viewport Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden text-white">
            {/* Header */}
            <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">Ambil Foto Fisik Objek (Kamera)</span>
              </div>
              <button
                type="button"
                onClick={handleCloseCamera}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewport */}
            <div className="relative bg-black min-h-[300px] flex items-center justify-center overflow-hidden">
              {isCameraStarting && (
                <div className="flex flex-col items-center justify-center space-y-2 p-8 text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
                  <span className="text-xs font-medium">Memulai koneksi kamera...</span>
                </div>
              )}

              {cameraError && (
                <div className="p-6 text-center space-y-3">
                  <p className="text-xs text-rose-400 font-semibold">{cameraError}</p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => cameraFileInputRef.current?.click()}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow"
                    >
                      Buka Kamera Perangkat / Galeri Native
                    </button>
                    <button
                      type="button"
                      onClick={() => startCamera(facingMode)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                    >
                      Coba Lagi
                    </button>
                  </div>
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full max-h-[400px] object-cover ${cameraError || isCameraStarting ? 'hidden' : 'block'}`}
              />
            </div>

            {/* Footer Shutter Controls */}
            {!cameraError && !isCameraStarting && (
              <div className="p-4 bg-slate-800/90 border-t border-slate-700 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleSwitchCamera}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1"
                  title="Tukar Kamera Depan / Belakang"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Tukar Kamera</span>
                </button>

                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-full flex items-center space-x-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <div className="w-3 h-3 rounded-full bg-slate-950 animate-ping" />
                  <span>JEPRET FOTO FISIK</span>
                </button>

                <button
                  type="button"
                  onClick={handleCloseCamera}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
