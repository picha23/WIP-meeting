import React, { useState, useMemo } from 'react';
import { SprintWeek, TaskItem } from '../types';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Download,
  RotateCcw,
  Search,
  LayoutGrid,
  List,
  Clock,
  ThumbsUp,
  Eye,
  Copy,
  Users,
  Cloud,
  MessageSquareQuote
} from 'lucide-react';

interface WeeklySprintsArchiveViewProps {
  weeks: SprintWeek[];
  tasks: TaskItem[];
  onInspectSprint: (week: SprintWeek) => void;
  onShowToast: (title: string, message: string) => void;
  themeColor: 'green' | 'indigo';
}

export const WeeklySprintsArchiveView: React.FC<WeeklySprintsArchiveViewProps> = ({
  weeks,
  tasks,
  onInspectSprint,
  onShowToast,
  themeColor,
}) => {
  const [selectedQuarter, setSelectedQuarter] = useState<'all' | 'q4' | 'q3'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');

  // Currently inspected sprint in right panel
  const [inspectedWeek, setInspectedWeek] = useState<SprintWeek>(
    weeks.find((w) => w.id === 'w41') || weeks[1] || weeks[0]
  );

  // Filtered weeks
  const filteredWeeks = useMemo(() => {
    return weeks.filter((w) => {
      // Don't show current week in closed historical archive if we only want past cycles, or show all
      if (selectedQuarter !== 'all' && w.quarter !== selectedQuarter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchLabel = w.label.toLowerCase().includes(q);
        const matchRetro = (w.retrospectiveNote || '').toLowerCase().includes(q);
        // Also search tasks in this week
        const weekTasks = tasks.filter((t) => t.weekId === w.id);
        const matchTask = weekTasks.some(
          (t) => t.jobName.toLowerCase().includes(q) || t.requester.toLowerCase().includes(q)
        );
        return matchLabel || matchRetro || matchTask;
      }
      return true;
    });
  }, [weeks, selectedQuarter, searchQuery, tasks]);

  // Export JSON/CSV
  const handleExportArchive = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = JSON.stringify({ weeks, tasks }, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `WIP-Archive-Ledger-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      onShowToast('Archive Exported', 'Full historical sprint ledger saved as JSON.');
    }
  };

  const handleCopySummary = (week: SprintWeek) => {
    const weekTasks = tasks.filter((t) => t.weekId === week.id);
    const summary = `[WIP Tracker Export] ${week.label}\nCommitted: ${weekTasks.length} items.\nStatus: ${week.status}\nNote: ${week.retrospectiveNote || ''}`;
    navigator.clipboard?.writeText(summary);
    onShowToast('Sprint Summary Copied', `Copied summary for ${week.shortLabel}`);
  };

  const primaryBtnClass =
    themeColor === 'indigo'
      ? 'bg-[#4f46e5] text-white hover:bg-[#4338ca]'
      : 'bg-[#218300] text-white hover:bg-[#186700]';

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 gap-6">
      {/* Top Header Banner & Breadcrumb */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-[#404a3a]">
            <span>Sprint Ledger</span>
            <span>/</span>
            <span className="text-[#186700] font-semibold">Historical Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1b1f]">
            Weekly Sprints Archive
          </h1>
          <p className="text-[13px] text-[#404a3a] max-w-2xl leading-relaxed">
            Review historical deliverables, past blockers, sprint velocity, and quarterly delivery metrics across previous production cycles.
          </p>
        </div>

        {/* Quick Action Group */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto">
          <button
            onClick={() => handleExportArchive('json')}
            type="button"
            className="flex items-center gap-1.5 h-9 px-3 bg-white hover:bg-[#f6f2f8] text-[#1c1b1f] border border-[#e5e1e7] rounded-lg text-[13px] font-medium transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-[#186700]" />
            <span>Export JSON / CSV</span>
          </button>
          <button
            onClick={() => onShowToast('Index Synchronized', 'Re-indexed all 14 historical weeks in local store.')}
            type="button"
            className={`flex items-center gap-1.5 h-9 px-3.5 ${primaryBtnClass} rounded-lg text-[13px] font-semibold transition-all shadow-xs active:scale-95`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Re-index Weeks</span>
          </button>
        </div>
      </div>

      {/* 4 High-Impact Stat Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Archived Sprints */}
        <div className="relative overflow-hidden bg-white border border-[#e5e1e7] rounded-xl p-4 shadow-xs flex flex-col justify-between gap-2 group hover:bg-[#fcf8fe] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#404a3a]">
              Archived Sprints
            </span>
            <span className="w-7 h-7 rounded-lg bg-[#f6f2f8] flex items-center justify-center text-[#186700]">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-[#1c1b1f] tracking-tight font-mono tabular-nums">
              14
            </span>
            <span className="text-[12px] font-medium text-[#3c6753]">Weeks Tracked</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#404a3a] font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-[#186700]" />
            <span>Continuous cycle W28 – W41</span>
          </div>
        </div>

        {/* Metric 2: Completion Rate */}
        <div className="relative overflow-hidden bg-white border border-[#e5e1e7] rounded-xl p-4 shadow-xs flex flex-col justify-between gap-2 group hover:bg-[#fcf8fe] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#404a3a]">
              Overall Completion
            </span>
            <span className="w-7 h-7 rounded-lg bg-[#f6f2f8] flex items-center justify-center text-[#186700]">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-[#1c1b1f] tracking-tight font-mono tabular-nums">
              88.5%
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[#186700]/15 text-[#186700] font-semibold">
              +3.2% vs Q2
            </span>
          </div>
          <div className="w-full bg-[#e5e1e7] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#186700] h-full rounded-full" style={{ width: '88.5%' }} />
          </div>
        </div>

        {/* Metric 3: Avg Deliverables */}
        <div className="relative overflow-hidden bg-white border border-[#e5e1e7] rounded-xl p-4 shadow-xs flex flex-col justify-between gap-2 group hover:bg-[#fcf8fe] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#404a3a]">
              Avg Deliverables / Wk
            </span>
            <span className="w-7 h-7 rounded-lg bg-[#f6f2f8] flex items-center justify-center text-[#3c6753]">
              <ThumbsUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-[#1c1b1f] tracking-tight font-mono tabular-nums">
              4.2
            </span>
            <span className="text-[12px] font-medium text-[#404a3a]">Items per sprint</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#404a3a]">
            <span>Velocity Ceiling: 6</span>
            <span className="text-[#186700] font-mono font-semibold">Nominal 94%</span>
          </div>
        </div>

        {/* Metric 4: Resolved Blockers */}
        <div className="relative overflow-hidden bg-white border border-[#e5e1e7] rounded-xl p-4 shadow-xs flex flex-col justify-between gap-2 group hover:bg-[#fcf8fe] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#404a3a]">
              Resolved Blockers
            </span>
            <span className="w-7 h-7 rounded-lg bg-[#beedd3]/40 flex items-center justify-center text-[#3c6753]">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-[#1c1b1f] tracking-tight font-mono tabular-nums">
              19
            </span>
            <span className="text-[12px] font-medium text-[#3c6753]">Cleared on-time</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#404a3a]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#186700]" />
            <span>Zero critical carry-over to W42</span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Quarter Filters, Live Search & View Toggle */}
      <div className="bg-white p-2.5 rounded-xl border border-[#e5e1e7] flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        {/* Quarter Filter Chips */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedQuarter('all')}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold tracking-wide whitespace-nowrap transition-colors ${
              selectedQuarter === 'all'
                ? primaryBtnClass
                : 'bg-[#f6f2f8] text-[#404a3a] hover:text-[#1c1b1f]'
            }`}
          >
            All Periods
          </button>
          <button
            onClick={() => setSelectedQuarter('q4')}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold tracking-wide whitespace-nowrap transition-colors ${
              selectedQuarter === 'q4'
                ? primaryBtnClass
                : 'bg-[#f6f2f8] text-[#404a3a] hover:text-[#1c1b1f]'
            }`}
          >
            Q4 2026 (Oct – Dec)
          </button>
          <button
            onClick={() => setSelectedQuarter('q3')}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold tracking-wide whitespace-nowrap transition-colors ${
              selectedQuarter === 'q3'
                ? primaryBtnClass
                : 'bg-[#f6f2f8] text-[#404a3a] hover:text-[#1c1b1f]'
            }`}
          >
            Q3 2026 (Jul – Sep)
          </button>
        </div>

        {/* Search Input + View Toggle */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#404a3a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search archived jobs, requesters..."
              className="w-full h-9 pl-9 pr-3 text-[12px] bg-[#f6f2f8] rounded-lg text-[#1c1b1f] placeholder-[#404a3a]/60 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#218300] transition-all"
            />
          </div>

          <div className="flex items-center bg-[#f6f2f8] border border-[#e5e1e7] rounded-lg p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => {
                setViewMode('timeline');
                onShowToast('Timeline Mode', 'Showing detailed sprint timeline cards.');
              }}
              title="Sprint Timeline Cards"
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-[#186700] shadow-xs font-semibold'
                  : 'text-[#404a3a] hover:text-[#1c1b1f]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('list');
                onShowToast('List Mode', 'Switched to dense historical table.');
              }}
              title="Compact Table List"
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-[#186700] shadow-xs font-semibold'
                  : 'text-[#404a3a] hover:text-[#1c1b1f]'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport Split: 8-Col Sprint Logs & 4-Col Retrospective Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Primary Sprint Cards (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {filteredWeeks.map((week) => {
            const weekTasks = tasks.filter((t) => t.weekId === week.id);
            const isCompleted = weekTasks.every((t) => t.status === 'Completed');
            const blockedInWeek = weekTasks.filter((t) => t.status === 'Blocked');
            const isInspected = inspectedWeek.id === week.id;

            return (
              <article
                key={week.id}
                onClick={() => setInspectedWeek(week)}
                className={`bg-white rounded-xl p-5 border shadow-xs hover:shadow-md transition-all flex flex-col gap-4 cursor-pointer ${
                  isInspected
                    ? 'border-[#218300] ring-1 ring-[#218300]/30'
                    : 'border-[#e5e1e7]'
                }`}
              >
                {/* Card Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#e5e1e7]">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="w-9 h-9 rounded-lg bg-[#f6f2f8] border border-[#e5e1e7] flex items-center justify-center text-[#186700] font-mono font-bold text-[14px]">
                      W{week.weekNumber}
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h2 className="text-[15px] font-bold text-[#1c1b1f] tracking-tight">
                          {week.label}
                        </h2>
                        <span className="text-[11px] font-mono text-[#404a3a]">
                          #SPR-2026-{week.weekNumber}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#404a3a]">
                        {week.reviewers ||
                          `Closed by ${week.closedBy || 'Senior Product Designer'} • ${
                            week.syncAgo || 'Archived'
                          }`}
                      </span>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#beedd3] text-[#005338] text-[11px] font-semibold tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#186700]" />
                        <span>Sprint Closed • 100% Complete</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad6]/60 text-[#ba1a1a] text-[11px] font-semibold tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />
                        <span>Sprint Closed • {blockedInWeek.length} Blocked</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Deliverables List Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {weekTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`p-2.5 rounded-lg flex items-start gap-2 border transition-colors ${
                        t.status === 'Blocked'
                          ? 'bg-[#ffdad6]/20 border-[#ffdad6]'
                          : 'bg-[#f6f2f8] border-[#e5e1e7] hover:bg-[#ebe7ec]'
                      }`}
                    >
                      {t.status === 'Blocked' ? (
                        <AlertTriangle className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-[#186700] shrink-0 mt-0.5" />
                      )}
                      <div className="flex flex-col min-w-0 flex-1">
                        <span
                          className={`text-[12px] font-semibold truncate ${
                            t.status === 'Blocked' ? 'text-[#ba1a1a]' : 'text-[#1c1b1f]'
                          }`}
                        >
                          {t.jobName}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#404a3a] mt-0.5">
                          <span className="font-mono text-[#3c6753]">
                            {t.tag || 'SPR-' + week.weekNumber}
                          </span>
                          <span>•</span>
                          <span className="truncate">{t.nextStep || t.requester}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Blocker Resolution Outcome Box if there's a blocker note */}
                {week.retrospectiveNote && (
                  <div className="p-3 bg-[#f6f2f8] rounded-lg border border-[#e5e1e7] flex items-start gap-2">
                    <MessageSquareQuote className="w-4 h-4 text-[#3c6753] shrink-0 mt-0.5" />
                    <div className="flex flex-col text-[12px]">
                      <span className="font-semibold text-[#1c1b1f]">Sprint Retrospective Note:</span>
                      <p className="text-[#404a3a] leading-relaxed mt-0.5">
                        {week.retrospectiveNote}
                      </p>
                    </div>
                  </div>
                )}

                {/* Bottom Card Meta & Action Ribbon */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[12px]">
                  <div className="flex items-center gap-4 text-[#404a3a]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#3c6753]" />
                      <span>Committed: {weekTasks.length} / Shipped: {weekTasks.filter((t) => t.status === 'Completed').length}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[#186700] font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {blockedInWeek.length === 0 ? 'Zero Blockers' : `${blockedInWeek.length} Blocker Handled`}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectedWeek(week);
                        onShowToast('Inspector Updated', `Viewing retrospective for ${week.shortLabel}`);
                      }}
                      type="button"
                      className="h-8 px-2.5 bg-[#f6f2f8] hover:bg-[#ebe7ec] text-[#1c1b1f] border border-[#e5e1e7] rounded-lg text-[12px] font-medium flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Full Report</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopySummary(week);
                      }}
                      type="button"
                      className="h-8 px-2.5 bg-[#f6f2f8] hover:bg-[#ebe7ec] text-[#186700] border border-[#e5e1e7] rounded-lg text-[12px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Export Summary</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Right Column: Retrospective Notes & Key Stakeholder Network (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Live Selected Sprint Inspector / Retrospective Panel */}
          <div className="bg-white rounded-xl p-4 border border-[#e5e1e7] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4 text-[#186700]" />
                <h3 className="text-[13px] font-bold text-[#1c1b1f] tracking-tight">
                  Sprint Retrospective Log
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#f6f2f8] text-[#404a3a] border border-[#e5e1e7] rounded font-semibold">
                {inspectedWeek.shortLabel} Active
              </span>
            </div>

            {/* Highlight Quotation */}
            <div className="p-3 rounded-lg bg-[#f6f2f8] border border-[#e5e1e7] flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase text-[#3c6753] tracking-wider">
                Lead Retrospective Note
              </span>
              <p className="text-[12px] text-[#1c1b1f] leading-relaxed">
                "{inspectedWeek.retrospectiveNote || 'Velocity on track. No critical blockers observed.'}"
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#404a3a] pt-1">
                <span className="font-semibold text-[#1c1b1f]">
                  {inspectedWeek.closedBy || 'Senior Product Designer'}
                </span>
                <span className="font-mono">{inspectedWeek.dateRange}</span>
              </div>
            </div>

            {/* Trailing 6-Week Velocity Micro-Chart */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#404a3a]">
                <span className="font-bold uppercase tracking-wider">Trailing 6-Week Velocity</span>
                <span className="font-mono text-[#186700] font-semibold">Avg: 4.2 / Wk</span>
              </div>
              <div className="h-20 bg-[#f6f2f8] border border-[#e5e1e7] rounded-lg p-2.5 flex items-end justify-between gap-2">
                {/* W36 */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-[#ebe7ec] hover:bg-[#186700] rounded-t transition-all"
                    style={{ height: '48px' }}
                    title="W36: 4 tasks"
                  />
                  <span className="text-[9px] font-mono text-[#404a3a]">36</span>
                </div>
                {/* W37 */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-[#ebe7ec] hover:bg-[#186700] rounded-t transition-all"
                    style={{ height: '36px' }}
                    title="W37: 3 tasks"
                  />
                  <span className="text-[9px] font-mono text-[#404a3a]">37</span>
                </div>
                {/* W38 */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-[#ebe7ec] hover:bg-[#186700] rounded-t transition-all"
                    style={{ height: '60px' }}
                    title="W38: 5 tasks"
                  />
                  <span className="text-[9px] font-mono text-[#404a3a]">38</span>
                </div>
                {/* W39 */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-[#186700]/70 hover:bg-[#186700] rounded-t transition-all"
                    style={{ height: '52px' }}
                    title="W39: 4 tasks"
                  />
                  <span className="text-[9px] font-mono text-[#404a3a]">39</span>
                </div>
                {/* W40 */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-[#3c6753] hover:bg-[#186700] rounded-t transition-all"
                    style={{ height: '50px' }}
                    title="W40: 4 shipped, 1 delayed"
                  />
                  <span className="text-[9px] font-mono text-[#404a3a]">40</span>
                </div>
                {/* W41 */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-[#186700] rounded-t shadow-xs"
                    style={{ height: '52px' }}
                    title="W41: 4 tasks (100%)"
                  />
                  <span className="text-[9px] font-mono font-bold text-[#186700]">41</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Stakeholders & Contributors */}
          <div className="bg-white rounded-xl p-4 border border-[#e5e1e7] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#1c1b1f] tracking-tight uppercase">
                Key Stakeholders & Contributors
              </span>
              <Users className="w-4 h-4 text-[#404a3a]" />
            </div>

            <div className="flex flex-col gap-2">
              {/* Stakeholder 1: Sarah Chen */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f6f2f8] transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#e5e1e7] border border-[#e5e1e7] flex items-center justify-center text-[12px] font-bold text-[#186700]">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMp5JDt3oJTZr_cmp5xw1MdAAn29_ALAI6wbOxAFoBBOV34Cv5f7VIgf-XXovRiyEMO7ShZ6jVsibLlHwGcYvRG8qxkATxz-Qm9uPfygu7daRe59XdttAEpOoj3kACztAco8BNzOz8-dvWxhkAi2KyswCnC1UXxYVd1omr3dP6Y6Yr76MdvzfoAI1tNBbWqOUQtaUaLfrrv5RpWCPROL4jP7S1Si1jb5OyRQNmqHF9zkQuzJgyp8r3"
                      alt="Sarah Chen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-[#1c1b1f] leading-snug">
                      Sarah Chen
                    </span>
                    <span className="text-[11px] text-[#404a3a]">Lead Product Manager</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#186700] font-semibold">
                  12 Deliverables
                </span>
              </div>

              {/* Stakeholder 2: David Miller */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f6f2f8] transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#e5e1e7] border border-[#e5e1e7] flex items-center justify-center text-[12px] font-bold text-[#3c6753]">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjZHtzT1bDikZJ9Lx7GyBXF337dkE5PgVIE_ObTcsleRW3vZaE556CHdx-0wtVsBT2U0w7b0pCKOFCKZHFqKY7wo26FPpWVPbrUraHgZ315dscrf8UvHIJxCjU9YBIAwdcXvki7c3TWN6Joym4PNiaB8W8ZPTCWIGcjQJvdeE2VpPDDl8CYySb74DZZsQ5dR9nE2cSDvpmtLy77ez6yM_HNgpgXHNHmcwNTSSgeS-DuTZZfLpa6eW_"
                      alt="David Miller"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-[#1c1b1f] leading-snug">
                      David Miller
                    </span>
                    <span className="text-[11px] text-[#404a3a]">Principal Engineer</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#3c6753] font-semibold">
                  9 Unblocked
                </span>
              </div>

              {/* Stakeholder 3: Elena Rostova */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f6f2f8] transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#e5e1e7] border border-[#e5e1e7] flex items-center justify-center text-[12px] font-bold text-[#666000]">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFF8841mhrCRk-m3xAYP8u-g3RBJZKjuMR4KHEXomEoBLL0E70DIoQdhZ8Ju36Ox81dXEHHUfA5R8fn5_tsVSK1z4b17ATRVDa917H99779JUnRO7pPuyKaPpqv4TKYjFsZlB1BKpGkF9EMxANStYXiMSqwrwihYElyiYyHFCoyN0lCcy8HXIJLj2BNJRBPqcqnCqBfkyyWybs3BBTD2YG7sGazLIQYcwp0-V7j0YQ_l6v1nbz_Gqw"
                      alt="Elena Rostova"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-[#1c1b1f] leading-snug">
                      Elena Rostova
                    </span>
                    <span className="text-[11px] text-[#404a3a]">VP of Engineering</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#666000] font-semibold">
                  Executive Signoff
                </span>
              </div>
            </div>
          </div>

          {/* Archival Storage Health Badge */}
          <div className="bg-white p-3 rounded-xl border border-[#e5e1e7] flex items-center justify-between text-[11px] text-[#404a3a]">
            <div className="flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-[#186700]" />
              <span>Index synchronized: Oct 17, 2026</span>
            </div>
            <span className="font-mono text-[#186700] font-semibold">0 Error Logs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
