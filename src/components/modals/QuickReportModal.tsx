import React from 'react';
import { TaskItem, SprintWeek } from '../../types';
import { X, Copy, Terminal, Check } from 'lucide-react';

interface QuickReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TaskItem[];
  currentWeek: SprintWeek;
  onShowToast: (title: string, message: string) => void;
  themeColor: 'green' | 'indigo';
}

export const QuickReportModal: React.FC<QuickReportModalProps> = ({
  isOpen,
  onClose,
  tasks,
  currentWeek,
  onShowToast,
  themeColor,
}) => {
  if (!isOpen) return null;

  const weekTasks = tasks.filter((t) => t.weekId === currentWeek.id);
  const completed = weekTasks.filter((t) => t.status === 'Completed');
  const inProgress = weekTasks.filter((t) => t.status === 'In Progress');
  const blocked = weekTasks.filter((t) => t.status === 'Blocked');

  const weekLabel = (currentWeek.dateRange || 'CURRENT SPRINT WEEK').toUpperCase();

  let reportText = `-----------------------------------------\n`;
  reportText += `[WIP REPORT: WEEK OF ${weekLabel}]\n`;
  reportText += `Owner: Senior Product Designer\n\n`;

  reportText += `✅ COMPLETED:\n`;
  if (completed.length > 0) {
    completed.forEach((item) => {
      reportText += `- ${item.jobName} (Req: ${item.requester})\n`;
    });
  } else {
    reportText += `- None\n`;
  }
  reportText += `\n`;

  reportText += `⏳ IN PROGRESS:\n`;
  if (inProgress.length > 0) {
    inProgress.forEach((item) => {
      reportText += `- ${item.jobName} (Req: ${item.requester})\n`;
    });
  } else {
    reportText += `- None\n`;
  }
  reportText += `\n`;

  reportText += `🚫 BLOCKED & ATTENTION NEEDED:\n`;
  if (blocked.length > 0) {
    blocked.forEach((item) => {
      reportText += `- ${item.jobName} (Req: ${item.requester})\n`;
      if (item.issue && item.issue.trim()) {
        reportText += `  ↳ Blocker: ${item.issue.trim()}\n`;
      } else {
        reportText += `  ↳ Blocker: Unspecified pending dependency\n`;
      }
    });
  } else {
    reportText += `- None (Clear runway)\n`;
  }

  reportText += `-----------------------------------------`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(reportText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = reportText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      onShowToast('Report Copied', 'WIP Text Report copied to clipboard!');
      onClose();
    } catch (err) {
      onShowToast('Copy Notice', 'Please copy directly from the preview text.');
    }
  };

  const primaryBtnClass =
    themeColor === 'indigo'
      ? 'bg-[#4f46e5] text-white hover:bg-[#4338ca]'
      : 'bg-[#006e4b] text-white hover:bg-[#005236]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#e5e1e7] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f6f2f8] border-b border-[#e5e1e7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006e4b] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">summarize</span>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#1c1b1f]">Weekly Executive WIP Report</h3>
              <p className="text-[11px] text-[#404a3a]">
                Ready for Slack, email dispatch, or executive syncs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#404a3a] hover:bg-[#ebe7ec] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-3">
          <div className="flex items-center justify-between bg-[#f6f2f8] px-3.5 py-1.5 rounded-lg text-[#404a3a] text-[11px]">
            <span className="flex items-center gap-1.5 font-medium">
              <Terminal className="w-3.5 h-3.5" />
              <span>Formatted Plain Text Preview</span>
            </span>
            <span className="font-mono font-semibold text-[#186700]">{weekLabel}</span>
          </div>

          <div className="relative group">
            <pre className="w-full min-h-[260px] p-4 rounded-xl bg-[#213145] text-[#eaf1ff] font-mono text-[12px] leading-relaxed overflow-x-auto whitespace-pre-wrap select-all shadow-inner border border-[#35455a]">
              {reportText}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#f6f2f8] border-t border-[#e5e1e7] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-[#404a3a] flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-[#186700]" />
            <span>Preserves ASCII emojis & indentation</span>
          </span>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 rounded-xl bg-white border border-[#e5e1e7] hover:bg-[#ebe7ec] text-[#1c1b1f] text-[13px] font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              type="button"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl ${primaryBtnClass} text-[13px] font-semibold shadow-xs active:scale-[0.98] transition-all`}
            >
              <Copy className="w-4 h-4" />
              <span>📋 Copy to Clipboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
