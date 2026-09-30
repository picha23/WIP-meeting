import React, { useState, useMemo } from 'react';
import { TaskItem, SprintWeek, ReportConfig, ReportPreset, ReportTone, GeneratedReportHistory } from '../types';
import { formatWipReport } from '../utils/reportFormatter';
import {
  RotateCcw,
  Copy,
  Download,
  FileCode,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Clock,
  Gauge,
  Bookmark,
  Share2,
  Check,
  History
} from 'lucide-react';

interface ReportGeneratorViewProps {
  currentWeek: SprintWeek;
  allWeeks: SprintWeek[];
  tasks: TaskItem[];
  onSelectWeek: (weekId: string) => void;
  reportHistory: GeneratedReportHistory[];
  onSaveHistory: (report: GeneratedReportHistory) => void;
  onShowToast: (title: string, message: string) => void;
  themeColor: 'green' | 'indigo';
  userName?: string;
}

export const ReportGeneratorView: React.FC<ReportGeneratorViewProps> = ({
  currentWeek,
  allWeeks,
  tasks,
  onSelectWeek,
  reportHistory,
  onSaveHistory,
  onShowToast,
  themeColor,
  userName = 'Amri Faizal'
}) => {
  const [config, setConfig] = useState<ReportConfig>({
    preset: 'standard',
    tone: 'executive',
    showBlockersFirst: true,
    includeRequester: true,
    includeETAs: true,
    includeMetrics: true,
    customNote: ''
  });

  const weekTasks = useMemo(() => {
    return tasks.filter((t) => t.weekId === currentWeek.id);
  }, [tasks, currentWeek.id]);

  const completedCount = weekTasks.filter((t) => t.status === 'Completed').length;
  const inProgressCount = weekTasks.filter((t) => t.status === 'In Progress').length;
  const blockedCount = weekTasks.filter((t) => t.status === 'Blocked').length;
  const totalCount = weekTasks.length;
  const velocityPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Formatted report calculation
  const reportOutput = useMemo(() => {
    return formatWipReport(weekTasks, currentWeek, config);
  }, [weekTasks, currentWeek, config]);

  // Handle Preset Switching
  const handleSelectPreset = (preset: ReportPreset) => {
    if (preset === 'exec') {
      setConfig((prev) => ({
        ...prev,
        preset,
        tone: 'executive',
        showBlockersFirst: true,
        includeMetrics: true
      }));
    } else if (preset === 'slack') {
      setConfig((prev) => ({
        ...prev,
        preset,
        tone: 'casual',
        showBlockersFirst: true
      }));
    } else if (preset === 'client') {
      setConfig((prev) => ({
        ...prev,
        preset,
        tone: 'executive',
        showBlockersFirst: false
      }));
    } else {
      setConfig((prev) => ({
        ...prev,
        preset,
        tone: 'executive'
      }));
    }
    onShowToast('Preset Applied', `Switched formatting preset to ${preset}`);
  };

  // Copy to clipboard helper
  const handleCopy = async (text: string, title: string = 'Copied to Clipboard') => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      onShowToast(title, 'Ready to paste into Slack, Docs, or email.');

      // Save to recent report history
      const newHistoryItem: GeneratedReportHistory = {
        id: 'rep_' + Date.now(),
        title: `${currentWeek.shortLabel || 'Sprint ' + currentWeek.weekNumber} (${new Date().toLocaleDateString([], {
          month: 'short',
          day: 'numeric'
        })}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
        timestamp: 'Just now',
        toneBadge: config.preset.toUpperCase(),
        itemCount: totalCount,
        wordCount: reportOutput.wordCount,
        content: text,
        preview: text.slice(0, 140) + '...'
      };
      onSaveHistory(newHistoryItem);
    } catch (err) {
      console.error('Clipboard copy error', err);
      onShowToast('Copy Warning', 'Please select text manually and copy.');
    }
  };

  // Copy for Slack
  const handleCopyForSlack = () => {
    let slackText = reportOutput.rawText;
    slackText = slackText.replace(/# /g, '*').replace(/## /g, '*');
    handleCopy(slackText, 'Slack Format Copied!');
  };

  // Export .md file
  const handleExportMarkdown = () => {
    const blob = new Blob([reportOutput.rawText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WIP-Report-${currentWeek.shortLabel || 'Sprint'}-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('Markdown File Exported', 'Downloaded .md progress file.');
  };

  // Download .txt file
  const handleExportTxt = () => {
    const blob = new Blob([reportOutput.rawText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WIP-Report-${currentWeek.shortLabel || 'Sprint'}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('Plain Text Downloaded', 'Downloaded .txt report summary.');
  };

  const primaryBtnClass =
    themeColor === 'indigo'
      ? 'bg-[#4f46e5] text-white hover:bg-[#4338ca]'
      : 'bg-[#218300] text-white hover:bg-[#186700]';

  return (
    <div className="flex flex-col w-full max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-8 gap-6">
      {/* Top Action Ribbon & View Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#e5e1e7] shadow-xs relative overflow-hidden">
        <div className="flex flex-col gap-1 min-w-0 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#186700]/15 text-[#186700] text-[10px] font-mono uppercase font-bold tracking-wider">
              Engine: Markdown v3.2
            </span>
            <span className="text-[#404a3a] text-[11px] font-mono tracking-tight">
              • Live Sync Armed
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#eef7ee] text-[#186700] text-[11px] font-semibold">
              👤 Disediakan oleh: {userName}
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#1c1b1f]">
            Report Generator & Standup Dispatch
          </h1>
          <p className="text-[#404a3a] text-[13px] max-w-2xl leading-relaxed">
            Format, preview, customize, and export executive progress digests in 1-click. Streamlined for async updates, C-suite memos, and cross-functional syncs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <div className="flex items-center bg-[#f6f2f8] border border-[#e5e1e7] px-3 py-1.5 rounded-lg shadow-xs">
            <select
              value={currentWeek.id}
              onChange={(e) => onSelectWeek(e.target.value)}
              className="bg-transparent text-[12px] font-semibold text-[#1c1b1f] outline-none cursor-pointer"
              aria-label="Sprint selection for report"
            >
              {allWeeks.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.shortLabel}: {w.dateRange}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onShowToast('Digest Refreshed', 'Re-rendered live dispatch buffer.')}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#f6f2f8] hover:bg-[#ebe7ec] text-[#1c1b1f] text-[12px] font-semibold rounded-lg border border-[#e5e1e7] shadow-xs transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#186700]" />
            <span>Regenerate Digest</span>
          </button>
        </div>
      </div>

      {/* Template Presets Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-[#e5e1e7] shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-0.5">
          <span className="text-[11px] uppercase font-bold tracking-wider text-[#404a3a] px-2 whitespace-nowrap">
            Format Presets:
          </span>
          <button
            onClick={() => handleSelectPreset('standard')}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-[12px] transition-all whitespace-nowrap ${
              config.preset === 'standard'
                ? `${primaryBtnClass} font-semibold shadow-xs`
                : 'bg-[#f6f2f8] text-[#404a3a] hover:text-[#1c1b1f] font-medium'
            }`}
          >
            Standard WIP Format
          </button>
          <button
            onClick={() => handleSelectPreset('exec')}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-[12px] transition-all whitespace-nowrap ${
              config.preset === 'exec'
                ? `${primaryBtnClass} font-semibold shadow-xs`
                : 'bg-[#f6f2f8] text-[#404a3a] hover:text-[#1c1b1f] font-medium'
            }`}
          >
            Executive Bullet Points
          </button>
          <button
            onClick={() => handleSelectPreset('slack')}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-[12px] transition-all whitespace-nowrap ${
              config.preset === 'slack'
                ? `${primaryBtnClass} font-semibold shadow-xs`
                : 'bg-[#f6f2f8] text-[#404a3a] hover:text-[#1c1b1f] font-medium'
            }`}
          >
            Engineering Slack / Discord
          </button>
          <button
            onClick={() => handleSelectPreset('client')}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-[12px] transition-all whitespace-nowrap ${
              config.preset === 'client'
                ? `${primaryBtnClass} font-semibold shadow-xs`
                : 'bg-[#f6f2f8] text-[#404a3a] hover:text-[#1c1b1f] font-medium'
            }`}
          >
            Client & Stakeholder Digest
          </button>
        </div>

        <div className="flex items-center gap-1.5 px-3 text-[11px] text-[#404a3a] font-mono shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#186700] inline-block animate-pulse" />
          <span>
            Auto-rendering: {completedCount} Completed • {inProgressCount} In Progress • {blockedCount} Blocker
          </span>
        </div>
      </div>

      {/* Main Two-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Controls & Configuration (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Tone Selector Block */}
          <div className="bg-white p-4 rounded-xl border border-[#e5e1e7] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#1c1b1f]">
                1. Delivery Tone & Density
              </span>
              <span className="text-[11px] text-[#404a3a]">Influences vocabulary</span>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-[#f6f2f8] p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setConfig((p) => ({ ...p, tone: 'executive' }))}
                className={`py-2 px-1 rounded-md text-[11px] font-semibold text-center transition-all ${
                  config.tone === 'executive'
                    ? `${primaryBtnClass} shadow-xs`
                    : 'text-[#404a3a] hover:text-[#1c1b1f]'
                }`}
              >
                Executive / Crisp
              </button>
              <button
                type="button"
                onClick={() => setConfig((p) => ({ ...p, tone: 'technical' }))}
                className={`py-2 px-1 rounded-md text-[11px] font-semibold text-center transition-all ${
                  config.tone === 'technical'
                    ? `${primaryBtnClass} shadow-xs`
                    : 'text-[#404a3a] hover:text-[#1c1b1f]'
                }`}
              >
                Tech / Detailed
              </button>
              <button
                type="button"
                onClick={() => setConfig((p) => ({ ...p, tone: 'casual' }))}
                className={`py-2 px-1 rounded-md text-[11px] font-semibold text-center transition-all ${
                  config.tone === 'casual'
                    ? `${primaryBtnClass} shadow-xs`
                    : 'text-[#404a3a] hover:text-[#1c1b1f]'
                }`}
              >
                Casual Standup
              </button>
            </div>
          </div>

          {/* Inclusions & Modular Toggles */}
          <div className="bg-white p-4 rounded-xl border border-[#e5e1e7] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#1c1b1f]">
                2. Content Modular Toggles
              </span>
              <span className="text-[11px] text-[#186700] font-mono font-semibold">
                {[
                  config.showBlockersFirst,
                  config.includeRequester,
                  config.includeETAs,
                  config.includeMetrics
                ].filter(Boolean).length}{' '}
                active
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              {/* Show Blockers First */}
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#f6f2f8] hover:bg-[#ebe7ec] transition-colors cursor-pointer select-none">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-[#1c1b1f]">Show Blockers First</span>
                    <span className="text-[10px] text-[#404a3a]">
                      Surface critical risks at the very top of report
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.showBlockersFirst}
                  onChange={(e) => setConfig((p) => ({ ...p, showBlockersFirst: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#186700] focus:ring-[#186700] accent-[#186700] cursor-pointer"
                />
              </label>

              {/* Include Requester / Lead */}
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#f6f2f8] hover:bg-[#ebe7ec] transition-colors cursor-pointer select-none">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-[#3c6753]" />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-[#1c1b1f]">Include Requester / Lead</span>
                    <span className="text-[10px] text-[#404a3a]">
                      Append stakeholder tag [Lead: Sarah Chen]
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.includeRequester}
                  onChange={(e) => setConfig((p) => ({ ...p, includeRequester: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#186700] focus:ring-[#186700] accent-[#186700] cursor-pointer"
                />
              </label>

              {/* Include Target ETAs & Next Steps */}
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#f6f2f8] hover:bg-[#ebe7ec] transition-colors cursor-pointer select-none">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#186700]" />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-[#1c1b1f]">Include Target ETAs & Next Steps</span>
                    <span className="text-[10px] text-[#404a3a]">
                      Explicit commitments for incomplete tasks
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.includeETAs}
                  onChange={(e) => setConfig((p) => ({ ...p, includeETAs: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#186700] focus:ring-[#186700] accent-[#186700] cursor-pointer"
                />
              </label>

              {/* Metrics Counter Badge */}
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#f6f2f8] hover:bg-[#ebe7ec] transition-colors cursor-pointer select-none">
                <div className="flex items-center gap-2.5">
                  <Gauge className="w-4 h-4 text-[#666000]" />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-[#1c1b1f]">Metrics Counter Badge</span>
                    <span className="text-[10px] text-[#404a3a]">
                      Append throughput velocity (e.g. 75% complete)
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.includeMetrics}
                  onChange={(e) => setConfig((p) => ({ ...p, includeMetrics: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#186700] focus:ring-[#186700] accent-[#186700] cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Custom Context & Notes */}
          <div className="bg-white p-4 rounded-xl border border-[#e5e1e7] shadow-xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#1c1b1f]">
                3. Add Dispatch Notes / Announcements
              </span>
              <span className="text-[11px] text-[#404a3a]">Prepend to header</span>
            </div>

            <textarea
              value={config.customNote}
              onChange={(e) => setConfig((p) => ({ ...p, customNote: e.target.value }))}
              placeholder="E.g.: Heads up: PTO next Monday. Design system sync moved to 2 PM EST."
              rows={3}
              className="w-full bg-[#f6f2f8] p-2.5 rounded-lg text-[12px] font-mono text-[#1c1b1f] placeholder-[#404a3a]/60 outline-none focus:bg-white focus:ring-2 focus:ring-[#218300] transition-all resize-none shadow-inner"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#404a3a]">Markdown syntax supported</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfig((p) => ({ ...p, customNote: '' }))}
                  className="text-[11px] text-[#404a3a] hover:text-[#1c1b1f] font-medium px-2 py-1 rounded"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast('Template Saved', 'Current announcement saved to local buffer.')}
                  className="text-[11px] text-[#186700] font-semibold hover:bg-[#f6f2f8] px-2 py-1 rounded transition-colors flex items-center gap-1"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save as Template</span>
                </button>
              </div>
            </div>
          </div>

          {/* Snapshot Velocity Tile */}
          <div className="bg-white p-4 rounded-xl border border-[#e5e1e7] shadow-xs flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#404a3a]">
                Snapshot Velocity
              </span>
              <span className="text-lg font-bold text-[#1c1b1f]">
                {totalCount} Deliverables Tracked
              </span>
              <span className="text-[11px] text-[#3c6753]">
                {completedCount} Done • {inProgressCount} In Progress • {blockedCount} Risk Flag
              </span>
            </div>

            {/* SVG Circular Progress Ring */}
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#ebe7ec] stroke-current"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3.5"
                />
                <path
                  className="text-[#186700] stroke-current transition-all duration-500"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeDasharray={`${velocityPercent}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs text-[#186700]">
                {velocityPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Output Dispatch Buffer (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Live Preview Header Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-[#e5e1e7] shadow-xs flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#186700] animate-pulse" />
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#1c1b1f] font-mono">
                  Live Output Dispatch Buffer
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#404a3a] font-mono">
                <span>{reportOutput.charCount} chars</span>
                <span>•</span>
                <span>{reportOutput.wordCount} words</span>
              </div>
            </div>

            {/* Action Toolbar Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleCopy(reportOutput.rawText, 'Report Copied to Clipboard!')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 ${primaryBtnClass} text-[12px] font-bold rounded-lg shadow-xs active:scale-95 transition-all`}
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy to Clipboard</span>
              </button>

              <button
                type="button"
                onClick={handleCopyForSlack}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#f6f2f8] hover:bg-[#ebe7ec] text-[#1c1b1f] text-[12px] font-semibold rounded-lg border border-[#e5e1e7] shadow-xs active:scale-95 transition-all"
              >
                <Share2 className="w-3.5 h-3.5 text-[#3c6753]" />
                <span>Copy for Slack</span>
              </button>

              <button
                type="button"
                onClick={handleExportMarkdown}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#f6f2f8] hover:bg-[#ebe7ec] text-[#1c1b1f] text-[12px] font-semibold rounded-lg border border-[#e5e1e7] shadow-xs active:scale-95 transition-all"
              >
                <FileCode className="w-3.5 h-3.5 text-[#186700]" />
                <span>Export .md</span>
              </button>

              <button
                type="button"
                onClick={handleExportTxt}
                className="flex items-center gap-1 px-3 py-2 bg-[#f6f2f8] hover:bg-[#ebe7ec] text-[#1c1b1f] text-[12px] font-semibold rounded-lg border border-[#e5e1e7] shadow-xs active:scale-95 transition-all"
                title="Download plain text file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>.txt</span>
              </button>
            </div>
          </div>

          {/* Terminal / Code Preview Container */}
          <div className="relative bg-white rounded-xl border border-[#e5e1e7] shadow-sm overflow-hidden">
            {/* Window bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#f6f2f8] border-b border-[#e5e1e7] text-[#404a3a] text-[11px] font-mono">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#186700]/80 inline-block" />
                </div>
                <span className="text-[#1c1b1f] text-[11px] font-semibold ml-2">
                  wip-dispatch-{currentWeek.shortLabel?.toLowerCase().replace(/\s+/g, '') || 'sprint'}.md
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#186700] bg-[#186700]/10 px-2 py-0.5 rounded">
                Markdown Rendered
              </span>
            </div>

            {/* Syntax Preview Output */}
            <div
              className="p-5 font-mono text-[12px] leading-relaxed select-all max-h-[500px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: reportOutput.htmlMarkup }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Generated Reports History */}
      <div className="bg-white p-6 rounded-xl border border-[#e5e1e7] shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#186700]" />
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#1c1b1f]">
              Recent Generated Reports History
            </h2>
          </div>
          <span className="text-[11px] text-[#404a3a] font-mono">
            Local storage archive • {reportHistory.length} sessions preserved
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportHistory.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-[#f6f2f8] p-4 rounded-xl border border-[#e5e1e7] flex flex-col justify-between gap-3 hover:bg-[#f0ecf2] transition-colors group shadow-xs"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#1c1b1f] font-mono truncate">
                    {item.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#beedd3] text-[#005338]">
                    {item.toneBadge}
                  </span>
                </div>
                <p className="text-[11px] text-[#404a3a] line-clamp-2 mt-1 font-mono leading-relaxed">
                  {item.preview}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e5e1e7]">
                <span className="text-[10px] text-[#404a3a] font-mono">
                  {item.itemCount} items • {item.wordCount} words
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(item.content, 'Archive Re-copied!')}
                  className="text-[11px] font-semibold text-[#186700] hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Re-copy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
