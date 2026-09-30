import React from 'react';
import { BlockerIncident } from '../../types';
import { X, Copy, Share2 } from 'lucide-react';

interface ExportEscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockers: BlockerIncident[];
  onShowToast: (title: string, message: string) => void;
  themeColor: 'green' | 'indigo';
}

export const ExportEscalationModal: React.FC<ExportEscalationModalProps> = ({
  isOpen,
  onClose,
  blockers,
  onShowToast,
  themeColor,
}) => {
  if (!isOpen) return null;

  const activeCritical = blockers.filter((b) => b.severity === 'critical' && !b.isResolved);
  const activeRisk = blockers.filter((b) => b.severity === 'risk' && !b.isResolved);
  const resolved = blockers.filter((b) => b.isResolved || b.severity === 'resolved');

  let snippet = `🚨 *Sprint 42 Blockers & Escalation Brief*\n`;
  snippet += `--------------------------------------------\n`;

  if (activeCritical.length > 0) {
    activeCritical.forEach((b) => {
      snippet += `• [CRITICAL] ${b.title}\n`;
      snippet += `  - Days Blocked: ${b.daysStalled} | Escalated To: ${b.escalatedTo}\n`;
      snippet += `  - Impediment: ${b.rootCauseDetail}\n\n`;
    });
  }

  if (activeRisk.length > 0) {
    activeRisk.forEach((b) => {
      snippet += `• [AT RISK] ${b.title}\n`;
      snippet += `  - Days Blocked: ${b.daysStalled} | Assigned: ${b.escalatedTo}\n`;
      snippet += `  - Impediment: ${b.rootCauseDetail}\n\n`;
    });
  }

  snippet += `✅ Cleared Items This Week: ${resolved.length}\n`;
  snippet += `⏱ Avg Resolution Velocity: 1.8 Days\n`;
  snippet += `--------------------------------------------`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(snippet);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = snippet;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      onShowToast('Brief Copied', 'Brief copied to clipboard in Markdown format!');
      onClose();
    } catch (e) {
      onShowToast('Copy Notice', 'Please copy directly from the preview block.');
    }
  };

  const primaryBtnClass =
    themeColor === 'indigo'
      ? 'bg-[#4f46e5] text-white hover:bg-[#4338ca]'
      : 'bg-[#218300] text-white hover:bg-[#186700]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 flex flex-col gap-4 border border-[#e5e1e7] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#186700]" />
            <h3 className="text-[17px] font-bold text-[#1c1b1f]">
              Executive Blocker Briefing Export
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-[#404a3a] hover:text-[#1c1b1f] p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[13px] text-[#404a3a] leading-relaxed">
          Formatted for asynchronous executive briefings, Slack standup channels, or weekly stakeholder memos.
        </p>

        <div className="relative bg-[#213145] p-4 rounded-xl font-mono text-[12px] text-[#eaf1ff] leading-relaxed overflow-x-auto max-h-64 shadow-inner border border-[#35455a] select-all">
          <pre>{snippet}</pre>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onClose}
            type="button"
            className="h-9 px-4 rounded-lg bg-[#f6f2f8] text-[#1c1b1f] text-[13px] hover:bg-[#ebe7ec] transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            type="button"
            className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-lg ${primaryBtnClass} text-[13px] font-semibold transition-all shadow-xs active:scale-95`}
          >
            <Copy className="w-4 h-4" />
            <span>Copy Markdown Brief</span>
          </button>
        </div>
      </div>
    </div>
  );
};
