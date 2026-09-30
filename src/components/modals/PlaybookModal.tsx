import React from 'react';
import { X, BookOpen, Clock, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PlaybookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, message: string) => void;
  themeColor: 'green' | 'indigo';
}

export const PlaybookModal: React.FC<PlaybookModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  themeColor,
}) => {
  if (!isOpen) return null;

  const handleCopyGuide = () => {
    const guideText = `SOP: TEAM UNBLOCKING PLAYBOOK & ESCALATION PROTOCOL
0h: Initial detection - tag task as 'Blocked' and log specific technical dependency.
< 24h: Squad ping - notify assignee and engineering counterpart directly.
> 24h: Lead escalation - flag in daily standup and reassign if necessary.
> 48h: Executive review - C-suite standup briefing for cross-functional reprioritization.`;
    navigator.clipboard?.writeText(guideText);
    onShowToast('SOP Copied', 'Playbook protocol copied to clipboard.');
  };

  const primaryBtnClass =
    themeColor === 'indigo'
      ? 'bg-[#4f46e5] text-white hover:bg-[#4338ca]'
      : 'bg-[#218300] text-white hover:bg-[#186700]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-[#e5e1e7] animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-[#f6f2f8] border-b border-[#e5e1e7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#218300]/15 text-[#186700] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#1c1b1f]">
                Team Unblocking Playbook & SOP Guide
              </h3>
              <p className="text-[11px] text-[#404a3a]">
                Standard Operating Procedures for fast impediment recovery
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

        <div className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto text-[13px]">
          {/* Threshold Timeline */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-bold text-[#1c1b1f] uppercase tracking-wider">
              Escalation Time Thresholds
            </span>

            <div className="flex flex-col gap-2.5 border-l-2 border-[#186700]/30 pl-4 py-1">
              <div className="flex flex-col">
                <span className="font-bold text-[#186700] text-[12px] flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5" /> 0h – Initial Detection
                </span>
                <p className="text-[#404a3a] text-[12px] mt-0.5">
                  Immediately set deliverable status to <code>Blocked</code> in WIP Tracker. Record the exact blocker note (error codes, awaiting mockups, or legal review).
                </p>
              </div>

              <div className="flex flex-col">
                <span className="font-bold text-amber-700 text-[12px] flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5" /> &lt; 24h – Squad Peer Outreach
                </span>
                <p className="text-[#404a3a] text-[12px] mt-0.5">
                  Direct message the named escalation stakeholder with formatted blocker context. Provide alternate mockup or temporary fallback endpoint.
                </p>
              </div>

              <div className="flex flex-col">
                <span className="font-bold text-[#ba1a1a] text-[12px] flex items-center gap-1.5 font-mono">
                  <AlertTriangle className="w-3.5 h-3.5" /> &gt; 24h – Engineering Lead Alert
                </span>
                <p className="text-[#404a3a] text-[12px] mt-0.5">
                  Notify squad technical lead. Identify if deliverable scope can be partitioned into a non-blocking v1 release.
                </p>
              </div>

              <div className="flex flex-col">
                <span className="font-bold text-[#ba1a1a] text-[12px] flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" /> &gt; 48h – Executive Standup Review
                </span>
                <p className="text-[#404a3a] text-[12px] mt-0.5">
                  Generate the 1-Click Executive Blocker Briefing and present in morning leadership sync for cross-squad reprioritization.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Best Practices Box */}
          <div className="p-3.5 bg-[#f6f2f8] rounded-xl border border-[#e5e1e7] flex flex-col gap-1.5">
            <span className="text-[12px] font-bold text-[#1c1b1f]">Key Principle: Zero Silent Carry-overs</span>
            <p className="text-[#404a3a] text-[12px] leading-relaxed">
              Never let an impeded task roll into a subsequent sprint without documenting the root cause and clearance ETA. Transparency accelerates velocity.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#f6f2f8] border-t border-[#e5e1e7] flex items-center justify-between">
          <button
            onClick={handleCopyGuide}
            type="button"
            className="text-[12px] font-semibold text-[#186700] hover:underline"
          >
            Copy Playbook Summary
          </button>
          <button
            onClick={onClose}
            type="button"
            className={`px-4 py-2 rounded-xl ${primaryBtnClass} text-[13px] font-semibold transition-all`}
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
