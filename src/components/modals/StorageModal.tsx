import React from 'react';
import { HardDrive, Download, RotateCcw, X, Check, Shield } from 'lucide-react';
import { resetAllDataToDefault } from '../../utils/storage';

interface StorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  storageUsage: string;
  onReset: () => void;
  onShowToast: (title: string, message: string) => void;
  themeColor: 'green' | 'indigo';
}

export const StorageModal: React.FC<StorageModalProps> = ({
  isOpen,
  onClose,
  storageUsage,
  onReset,
  onShowToast,
  themeColor,
}) => {
  if (!isOpen) return null;

  const handleExportAll = () => {
    const backup: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('wip_tracker')) {
        backup[key] = localStorage.getItem(key) || '';
      }
    }
    const dataStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wip-tracker-complete-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Full Backup Downloaded', 'All tasks, weeks, blockers exported.');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all deliverables and sprint data to default factory state?')) {
      resetAllDataToDefault();
      onReset();
      onShowToast('Data Reset', 'Restored initial sample deliverables and sprint archive.');
      onClose();
    }
  };

  const primaryBtnClass =
    themeColor === 'indigo'
      ? 'bg-[#4f46e5] text-white hover:bg-[#4338ca]'
      : 'bg-[#218300] text-white hover:bg-[#186700]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-[#e5e1e7] animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-[#f6f2f8] border-b border-[#e5e1e7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HardDrive className="w-5 h-5 text-[#186700]" />
            <h3 className="text-[16px] font-bold text-[#1c1b1f]">Storage Engine Management</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#404a3a] hover:bg-[#ebe7ec] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 text-[13px]">
          <div className="p-3.5 bg-[#f6f2f8] rounded-xl border border-[#e5e1e7] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#1c1b1f]">Storage Provider</span>
              <span className="font-mono text-[#186700] font-bold text-[12px]">Local IndexedDB / WebStorage</span>
            </div>
            <div className="flex items-center justify-between text-[#404a3a] text-[12px]">
              <span>Current Allocation:</span>
              <span className="font-mono font-semibold text-[#1c1b1f]">{storageUsage}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#3c6753]">
              <Shield className="w-3.5 h-3.5 text-[#186700]" />
              <span>Offline-first • Zero remote server exposure</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleExportAll}
              type="button"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white hover:bg-[#f6f2f8] border border-[#e5e1e7] rounded-xl font-semibold text-[#1c1b1f] transition-all shadow-xs"
            >
              <Download className="w-4 h-4 text-[#186700]" />
              <span>Export Full JSON Backup</span>
            </button>

            <button
              onClick={handleResetData}
              type="button"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#ffdad6]/40 hover:bg-[#ffdad6] border border-[#ffdad6] rounded-xl font-semibold text-[#ba1a1a] transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Sample Default Data</span>
            </button>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#f6f2f8] border-t border-[#e5e1e7] flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className={`px-4 py-2 rounded-xl ${primaryBtnClass} text-[13px] font-semibold transition-all`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
