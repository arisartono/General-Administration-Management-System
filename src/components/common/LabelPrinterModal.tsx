import React, { useState, useEffect } from 'react';
import { Asset } from '../../types/gams';
import { generateQRCodeDataUrl } from '../../utils/exportUtils';
import { Printer, X, Download } from 'lucide-react';

interface Props {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LabelPrinterModal: React.FC<Props> = ({ asset, isOpen, onClose }) => {
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (asset) {
      generateQRCodeDataUrl(asset.qrCodeData).then(setQrUrl);
    }
  }, [asset]);

  if (!isOpen || !asset) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Printer className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold tracking-wide uppercase">
              Asset Tag Label Printer
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Asset Sticker Box */}
        <div className="p-8 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950">
          <div className="text-xs text-slate-500 mb-2 font-mono">3.5" x 2.0" Thermal Transfer Sticker Preview</div>

          <div className="printable-area w-80 bg-white border-2 border-slate-900 p-4 rounded-md shadow-md text-slate-900">
            {/* Top Company Logo Banner */}
            <div className="flex items-center justify-between border-b border-slate-300 pb-2 mb-2">
              <div className="flex items-center space-x-1.5">
                <div className="w-5 h-5 bg-indigo-600 rounded text-white text-[10px] font-bold flex items-center justify-center">
                  G
                </div>
                <span className="font-extrabold text-xs tracking-tight">PT GAMS CORP</span>
              </div>
              <span className="text-[9px] font-mono text-slate-500 font-bold">PROPERTY ASSET</span>
            </div>

            <div className="flex items-center space-x-3">
              {/* QR Code */}
              {qrUrl ? (
                <img src={qrUrl} alt="Asset QR Code" className="w-20 h-20 border border-slate-200 p-1 rounded" />
              ) : (
                <div className="w-20 h-20 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                  QR Code
                </div>
              )}

              <div className="flex-1 min-w-0 text-left">
                <p className="font-mono font-extrabold text-xs text-indigo-700 truncate">{asset.id}</p>
                <p className="font-bold text-[11px] text-slate-900 leading-tight line-clamp-2 mt-0.5">
                  {asset.name}
                </p>
                <p className="text-[9px] text-slate-500 truncate mt-1">
                  Cat: <span className="font-semibold">{asset.categoryName}</span>
                </p>
                <p className="text-[9px] text-slate-500 truncate">
                  Loc: <span className="font-semibold">{asset.locationName}</span>
                </p>
              </div>
            </div>

            {/* Barcode representation */}
            <div className="mt-3 pt-2 border-t border-slate-200 text-center">
              <div className="font-mono text-[9px] font-bold tracking-widest text-slate-800">
                ||||| ||||||| |||| |||||||| ||||| |||
              </div>
              <div className="font-mono text-[8px] text-slate-400 tracking-wider">
                {asset.barcodeData}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Label</span>
          </button>
        </div>
      </div>
    </div>
  );
};
