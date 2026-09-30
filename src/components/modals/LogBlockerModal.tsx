import React, { useState } from 'react';
import { BlockerIncident } from '../../types';
import { X, AlertTriangle } from 'lucide-react';

interface LogBlockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBlocker: (blocker: Omit<BlockerIncident, 'id'>) => void;
  themeColor: 'green' | 'indigo';
}

export const LogBlockerModal: React.FC<LogBlockerModalProps> = ({
  isOpen,
  onClose,
  onSaveBlocker,
  themeColor,
}) => {
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<'critical' | 'risk'>('critical');
  const [escalatedTo, setEscalatedTo] = useState('');
  const [rootCauseType, setRootCauseType] = useState('Root Cause & Technical Impediment');
  const [rootCauseDetail, setRootCauseDetail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !escalatedTo.trim() || !rootCauseDetail.trim()) return;

    onSaveBlocker({
      title: title.trim(),
      severity,
      severityLabel:
        severity === 'critical' ? 'Critical Hard Blocker' : 'At Risk / Dependency Pending',
      daysStalled: '1 Day In Triage',
      taskRef: 'TASK-' + Math.floor(1000 + Math.random() * 9000),
      rootCauseType: rootCauseType,
      rootCauseDetail: rootCauseDetail.trim(),
      requester: 'Solo Workspace Lead',
      escalatedTo: escalatedTo.trim(),
      lastUpdated: 'Just now'
    });

    setTitle('');
    setEscalatedTo('');
    setRootCauseDetail('');
    onClose();
  };

  const primaryBtnClass =
    themeColor === 'indigo'
      ? 'bg-[#4f46e5] text-white hover:bg-[#4338ca]'
      : 'bg-[#218300] text-white hover:bg-[#186700]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-[#e5e1e7] animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-[#f6f2f8] border-b border-[#e5e1e7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#ba1a1a]" />
            <h3 className="text-[16px] font-bold text-[#1c1b1f]">Log New Impediment / Risk</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#404a3a] hover:bg-[#ebe7ec] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#404a3a] uppercase">
              Impacted Deliverable / Task <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Stripe Webhook Sandbox or Checkout Redesign"
              className="h-9 px-3 rounded-lg bg-[#fcf8fe] text-[#1c1b1f] text-[13px] border border-[#e5e1e7] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#218300] shadow-xs"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#404a3a] uppercase">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as 'critical' | 'risk')}
                className="h-9 px-3 rounded-lg bg-[#fcf8fe] text-[#1c1b1f] text-[13px] border border-[#e5e1e7] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#218300] shadow-xs cursor-pointer"
              >
                <option value="critical">Critical / Hard Blocker</option>
                <option value="risk">At Risk / Pending Dependency</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#404a3a] uppercase">
                Escalation Assignee <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                type="text"
                required
                value={escalatedTo}
                onChange={(e) => setEscalatedTo(e.target.value)}
                placeholder="e.g. Marcus Brody (Backend Lead)"
                className="h-9 px-3 rounded-lg bg-[#fcf8fe] text-[#1c1b1f] text-[13px] border border-[#e5e1e7] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#218300] shadow-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#404a3a] uppercase">
              Root Cause Category
            </label>
            <input
              type="text"
              value={rootCauseType}
              onChange={(e) => setRootCauseType(e.target.value)}
              placeholder="e.g. External Review Dependency or API Schema 500"
              className="h-9 px-3 rounded-lg bg-[#fcf8fe] text-[#1c1b1f] text-[13px] border border-[#e5e1e7] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#218300] shadow-xs"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#404a3a] uppercase">
              Root Cause & Technical Details <span className="text-[#ba1a1a]">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={rootCauseDetail}
              onChange={(e) => setRootCauseDetail(e.target.value)}
              placeholder="Specify error codes, awaiting reviews, or dependencies holding up progress..."
              className="p-3 rounded-lg bg-[#fcf8fe] text-[#1c1b1f] text-[13px] border border-[#e5e1e7] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#218300] shadow-xs resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e5e1e7]">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 rounded-xl text-[#404a3a] hover:bg-[#f6f2f8] text-[13px] font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-xl ${primaryBtnClass} text-[13px] font-semibold transition-all shadow-xs`}
            >
              Save & Dispatch Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
