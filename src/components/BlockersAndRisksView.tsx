import React, { useState, useMemo } from 'react';
import { BlockerIncident } from '../types';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Share2,
  PlusCircle,
  Search,
  Bell,
  Check,
  Send,
  Edit3,
  BookOpen,
  ArrowRight,
  TrendingDown,
  RotateCcw
} from 'lucide-react';

interface BlockersAndRisksViewProps {
  blockers: BlockerIncident[];
  onResolveBlocker: (id: string) => void;
  onReopenBlocker: (id: string) => void;
  onOpenLogModal: () => void;
  onOpenExportModal: () => void;
  onOpenPlaybookModal: () => void;
  onShowToast: (title: string, message: string) => void;
  themeColor: 'green' | 'indigo';
}

export const BlockersAndRisksView: React.FC<BlockersAndRisksViewProps> = ({
  blockers,
  onResolveBlocker,
  onReopenBlocker,
  onOpenLogModal,
  onOpenExportModal,
  onOpenPlaybookModal,
  onShowToast,
  themeColor,
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'risk' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const criticalCount = blockers.filter((b) => b.severity === 'critical' && !b.isResolved).length;
  const riskCount = blockers.filter((b) => b.severity === 'risk' && !b.isResolved).length;
  const resolvedCount = blockers.filter((b) => b.isResolved || b.severity === 'resolved').length;
  const totalCount = blockers.length;

  const filteredBlockers = useMemo(() => {
    return blockers.filter((b) => {
      if (filter === 'critical' && (b.severity !== 'critical' || b.isResolved)) return false;
      if (filter === 'risk' && (b.severity !== 'risk' || b.isResolved)) return false;
      if (filter === 'resolved' && !b.isResolved && b.severity !== 'resolved') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = b.title.toLowerCase().includes(q);
        const matchReq = b.requester.toLowerCase().includes(q);
        const matchEsc = b.escalatedTo.toLowerCase().includes(q);
        const matchCause = b.rootCauseDetail.toLowerCase().includes(q);
        return matchTitle || matchReq || matchEsc || matchCause;
      }
      return true;
    });
  }, [blockers, filter, searchQuery]);

  const primaryBtnClass =
    themeColor === 'indigo'
      ? 'bg-[#4f46e5] text-white hover:bg-[#4338ca]'
      : 'bg-[#218300] text-white hover:bg-[#186700]';

  return (
    <div className="flex flex-col w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 gap-6">
      {/* Header Section with Operational Meta */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#404a3a]">
            <span>Sprint 42</span>
            <span>/</span>
            <span className="text-[#ba1a1a] font-semibold">Incident Resolution Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1c1b1f] tracking-tight">
            Blockers & Risks Tracker
          </h1>
          <p className="text-[14px] text-[#404a3a] max-w-2xl leading-relaxed">
            Triage impediments, escalate dependencies, and document resolution pathways for continuous velocity and executive transparency.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={onOpenExportModal}
            type="button"
            className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg bg-white border border-[#e5e1e7] hover:bg-[#f6f2f8] text-[#1c1b1f] text-[13px] font-medium transition-all shadow-xs active:scale-98"
          >
            <Share2 className="w-4 h-4 text-[#404a3a]" />
            <span>Export Escalation Brief</span>
          </button>
          <button
            onClick={onOpenLogModal}
            type="button"
            className={`inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg ${primaryBtnClass} text-[13px] font-semibold transition-all shadow-xs active:scale-98`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Log New Blocker / Risk</span>
          </button>
        </div>
      </div>

      {/* Severity Overview KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Critical / Hard Blocker */}
        <div className="relative overflow-hidden bg-white border border-[#e5e1e7] rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <span className="text-[12px] font-bold tracking-wider text-[#404a3a] uppercase">
              Critical Blocker
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />
              Action Required
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-[#1c1b1f] leading-none font-mono tabular-nums">
                {criticalCount}
              </span>
              <span className="text-[12px] text-[#ba1a1a] font-medium">Active item</span>
            </div>
            <AlertTriangle className="w-6 h-6 text-[#ba1a1a]/80" />
          </div>
          <div className="mt-2 pt-1 border-t border-[#e5e1e7] text-[11px] text-[#404a3a]">
            P0 Hard stop on sprint milestone
          </div>
        </div>

        {/* At Risk / Dependency Pending */}
        <div className="relative overflow-hidden bg-white border border-[#e5e1e7] rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <span className="text-[12px] font-bold tracking-wider text-[#404a3a] uppercase">
              At Risk / Dependency
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Monitoring
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-[#1c1b1f] leading-none font-mono tabular-nums">
                {riskCount}
              </span>
              <span className="text-[12px] text-amber-700 font-medium">Pending input</span>
            </div>
            <Clock className="w-6 h-6 text-amber-600/80" />
          </div>
          <div className="mt-2 pt-1 border-t border-[#e5e1e7] text-[11px] text-[#404a3a]">
            Cross-functional sync scheduled
          </div>
        </div>

        {/* Resolved This Week */}
        <div className="relative overflow-hidden bg-white border border-[#e5e1e7] rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <span className="text-[12px] font-bold tracking-wider text-[#404a3a] uppercase">
              Resolved This Week
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#beedd3] text-[#005338] text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#186700]" />
              Cleared
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-[#1c1b1f] leading-none font-mono tabular-nums">
                {resolvedCount}
              </span>
              <span className="text-[12px] text-[#3c6753] font-medium">Sprint 42</span>
            </div>
            <CheckCircle2 className="w-6 h-6 text-[#186700]" />
          </div>
          <div className="mt-2 pt-1 border-t border-[#e5e1e7] text-[11px] text-[#404a3a]">
            +33% recovery vs previous cycle
          </div>
        </div>

        {/* Avg Time to Unblock with Inline Sparkline */}
        <div className="relative overflow-hidden bg-white border border-[#e5e1e7] rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <span className="text-[12px] font-bold tracking-wider text-[#404a3a] uppercase">
              Avg Time to Unblock
            </span>
            <span className="text-[11px] font-mono text-[#186700] font-bold bg-[#beedd3]/50 px-2 py-0.5 rounded-full">
              -0.4d vs avg
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#1c1b1f] leading-none font-mono tabular-nums">
                  1.8
                </span>
                <span className="text-[13px] text-[#404a3a] font-medium">Days</span>
              </div>
              <p className="text-[11px] text-[#404a3a] mt-1">Resolution SLA: &lt; 2.5d</p>
            </div>

            {/* Sparkline SVG */}
            <div className="w-20 h-10 flex items-end">
              <svg className="w-full h-full text-[#186700]" fill="none" viewBox="0 0 100 40">
                <path
                  d="M0 32 L20 28 L40 35 L60 22 L80 18 L100 12"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
                <path
                  d="M0 32 L20 28 L40 35 L60 22 L80 18 L100 12 L100 40 L0 40 Z"
                  fill="currentColor"
                  fillOpacity="0.1"
                />
                <circle cx="100" cy="12" fill="currentColor" r="3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & View Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-2 rounded-xl border border-[#e5e1e7] shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter('all')}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors whitespace-nowrap ${
              filter === 'all'
                ? primaryBtnClass
                : 'text-[#404a3a] hover:bg-[#f6f2f8]'
            }`}
          >
            All Issues ({totalCount})
          </button>
          <button
            onClick={() => setFilter('critical')}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors whitespace-nowrap ${
              filter === 'critical'
                ? primaryBtnClass
                : 'text-[#404a3a] hover:bg-[#f6f2f8]'
            }`}
          >
            Critical Blockers ({criticalCount})
          </button>
          <button
            onClick={() => setFilter('risk')}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors whitespace-nowrap ${
              filter === 'risk'
                ? primaryBtnClass
                : 'text-[#404a3a] hover:bg-[#f6f2f8]'
            }`}
          >
            Pending Dependencies ({riskCount})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors whitespace-nowrap ${
              filter === 'resolved'
                ? primaryBtnClass
                : 'text-[#404a3a] hover:bg-[#f6f2f8]'
            }`}
          >
            Resolved History ({resolvedCount})
          </button>
        </div>

        <div className="flex items-center gap-2 px-1">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-2.5 top-2 text-[#404a3a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by task or owner..."
              className="w-full h-8 pl-8 pr-3 text-[12px] bg-[#f6f2f8] text-[#1c1b1f] rounded-lg placeholder-[#404a3a]/60 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#218300] shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Blocker Items Triage List */}
      <div className="flex flex-col gap-4">
        {filteredBlockers.map((item) => {
          const isCritical = item.severity === 'critical' && !item.isResolved;
          const isRisk = item.severity === 'risk' && !item.isResolved;
          const isResolved = item.isResolved || item.severity === 'resolved';

          if (isResolved) {
            return (
              <article
                key={item.id}
                className="relative bg-white/70 border border-[#e5e1e7] rounded-xl p-4 shadow-xs opacity-85 hover:opacity-100 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#beedd3]/50 text-[#186700] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold text-[#404a3a] line-through">
                          {item.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#beedd3] text-[#005338] text-[10px] font-bold">
                          Resolved
                        </span>
                      </div>
                      <p className="text-[12px] text-[#404a3a] mt-0.5">
                        {item.rootCauseDetail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pl-11 sm:pl-0">
                    <span className="text-[11px] font-mono text-[#404a3a]">
                      Cleared in {item.clearanceDuration || '1.0d'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onReopenBlocker(item.id)}
                      className="text-[11px] font-medium text-[#186700] hover:underline flex items-center gap-0.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reopen</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          }

          return (
            <article
              key={item.id}
              className={`group relative bg-white border rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-200 ${
                isCritical ? 'border-[#ffdad6]' : 'border-[#e5e1e7]'
              }`}
            >
              {/* Left Accent Indicator */}
              <div
                className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r ${
                  isCritical ? 'bg-[#ba1a1a]' : 'bg-amber-500'
                }`}
              />

              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  {/* Category Pills & Days Stalled */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        isCritical
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isCritical ? 'bg-[#ba1a1a] animate-ping' : 'bg-amber-500'
                        }`}
                      />
                      <span>{item.severityLabel}</span>
                    </span>

                    <span
                      className={`text-[12px] font-mono font-semibold flex items-center gap-1 ${
                        isCritical ? 'text-[#ba1a1a]' : 'text-amber-700'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.daysStalled}</span>
                    </span>

                    <span className="text-[#404a3a] text-[12px]">•</span>
                    <span className="text-[12px] font-mono text-[#404a3a]">{item.taskRef}</span>
                  </div>

                  <h2 className="text-[17px] font-bold text-[#1c1b1f] tracking-tight mt-0.5">
                    {item.title}
                  </h2>

                  {/* Blocker Description Narrative Box */}
                  <div className="mt-1 bg-[#f6f2f8] border border-[#e5e1e7] p-3 rounded-lg text-[#1c1b1f] text-[13px] leading-relaxed">
                    <div
                      className={`flex items-start gap-1.5 mb-1 font-semibold text-[11px] uppercase tracking-wide ${
                        isCritical ? 'text-[#ba1a1a]' : 'text-amber-700'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5" />
                      <span>{item.rootCauseType}</span>
                    </div>
                    <p className="text-[#404a3a]">{item.rootCauseDetail}</p>
                  </div>

                  {/* Stakeholders & Assignment Meta */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-1 text-[12px]">
                    <div className="flex items-center gap-1.5 text-[#404a3a]">
                      <span className="font-medium text-[#1c1b1f]">Requester:</span>
                      <span>{item.requester}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#404a3a]">
                      <span className="font-medium text-[#1c1b1f]">Escalated To:</span>
                      <span className="font-semibold text-[#ba1a1a]">{item.escalatedTo}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#404a3a]">
                      <span>Last Updated:</span>
                      <span className="text-[#1c1b1f] font-mono">{item.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Column */}
                <div className="flex flex-row lg:flex-col items-stretch gap-1.5 self-start shrink-0 min-w-[160px]">
                  <button
                    onClick={() => onResolveBlocker(item.id)}
                    type="button"
                    className={`w-full inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg ${primaryBtnClass} text-[12px] font-semibold transition-all`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark as Resolved</span>
                  </button>

                  <button
                    onClick={() =>
                      onShowToast('Escalation Dispatched', `Reminder ping sent to ${item.escalatedTo}`)
                    }
                    type="button"
                    className="w-full inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-[#f6f2f8] hover:bg-[#ebe7ec] border border-[#e5e1e7] text-[#1c1b1f] text-[12px] font-medium transition-all"
                  >
                    <Send className="w-3.5 h-3.5 text-[#3c6753]" />
                    <span>Ping Stakeholder</span>
                  </button>

                  <button
                    onClick={() =>
                      onShowToast('Escalation Thread', `Opened thread for: ${item.title}`)
                    }
                    type="button"
                    className="w-full inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-[#f6f2f8] hover:bg-[#ebe7ec] border border-[#e5e1e7] text-[#404a3a] hover:text-[#1c1b1f] text-[12px] transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Escalation</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Blocker Resolution Playbook / Best Practices Banner */}
      <div className="relative overflow-hidden bg-white border border-[#e5e1e7] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 max-w-3xl">
            <div className="w-10 h-10 rounded-xl bg-[#218300]/15 text-[#186700] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[14px] font-bold text-[#1c1b1f] tracking-tight">
                Team Unblocking Playbook & Escalation Thresholds
              </h3>
              <p className="text-[12px] text-[#404a3a] leading-relaxed">
                When an item stays blocked for &gt; 24h, automatically notify the squad engineering lead. Hard dependencies exceeding 48h must be presented at the morning executive standup for cross-functional reprioritization.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end lg:self-center shrink-0">
            <button
              onClick={onOpenPlaybookModal}
              type="button"
              className="h-8 px-3.5 rounded-lg bg-[#f6f2f8] hover:bg-[#ebe7ec] border border-[#e5e1e7] text-[#1c1b1f] text-[12px] font-medium transition-all inline-flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#186700]" />
              <span>Read SOP Guide</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
