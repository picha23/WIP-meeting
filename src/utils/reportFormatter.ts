import { TaskItem, SprintWeek, ReportConfig } from '../types';

export function formatWipReport(
  tasks: TaskItem[],
  currentWeek: SprintWeek,
  config: ReportConfig
): { rawText: string; htmlMarkup: string; charCount: number; wordCount: number } {
  const completed = tasks.filter((t) => t.status === 'Completed');
  const inProgress = tasks.filter((t) => t.status === 'In Progress');
  const blocked = tasks.filter((t) => t.status === 'Blocked');
  const total = tasks.length;
  const completionRate = total > 0 ? Math.round((completed.length / total) * 100) : 0;

  let raw = '';
  let html = '';

  const isSlack = config.preset === 'slack';
  const isExec = config.preset === 'exec';

  // Sprint Title
  const weekTitle = `${currentWeek.shortLabel || 'Sprint ' + currentWeek.weekNumber} (${currentWeek.dateRange})`;
  const headerLine = isSlack
    ? `*# WIP DISPATCH — ${weekTitle}*\n`
    : `# ⚡ WIP PROGRESS REPORT — ${weekTitle}\n`;

  raw += headerLine;
  html += `<div class="text-[#186700] font-bold mb-2 pb-1 border-b border-[#bfcab5]/30 text-sm font-mono">${escapeHtml(
    headerLine.trim()
  )}</div>`;

  // Custom Dispatch Announcement / Note
  if (config.customNote && config.customNote.trim()) {
    const noteText = isSlack
      ? `> *ANNOUNCEMENT:* ${config.customNote.trim()}\n\n`
      : `> **ANNOUNCEMENT:** ${config.customNote.trim()}\n\n`;
    raw += noteText;
    html += `<div class="bg-[#f0ecf2] p-2.5 rounded-lg text-[#3c6753] italic mb-3 text-xs border-l-2 border-[#186700]">📣 <strong class="text-[#1c1b1f] not-italic">Note:</strong> ${escapeHtml(
      config.customNote.trim()
    )}</div>`;
  }

  // Health Metrics Banner
  if (config.includeMetrics) {
    const metricsRaw = isSlack
      ? `*Health Snapshot:* ${completionRate}% Done • ${completed.length} Completed • ${inProgress.length} In Progress • ${blocked.length} Critical Risk\n\n`
      : `[STATUS METRICS: ${total} Tracked | ${completed.length} Resolved | ${inProgress.length} Active | ${blocked.length} Flagged Blocker | Velocity: ${completionRate}%]\n\n`;
    raw += metricsRaw;
    html += `<div class="bg-[#ebe7ec] px-2.5 py-1 rounded text-[#186700] text-[11px] font-mono mb-3 inline-block font-semibold">🚀 <strong>Health Snapshot:</strong> ${completionRate}% Done • ${blocked.length} Critical Risk</div>\n`;
  }

  // Helper to format individual items
  const formatItem = (item: TaskItem, isBlocker: boolean) => {
    let line = '';
    const leadTag = config.includeRequester ? ` [Lead: ${item.requester}]` : '';
    const stepDetail =
      config.includeETAs && (item.nextStep || item.targetEta)
        ? ` — Next: ${item.nextStep || 'Follow-up'}${item.targetEta ? ` (${item.targetEta})` : ''}`
        : '';
    const blockerNote =
      isBlocker && item.issue ? `\n  ↳ Blocker Root Cause: ${item.issue}` : '';

    if (config.tone === 'executive') {
      line = `• ${item.jobName}${leadTag}${stepDetail}${blockerNote}`;
    } else if (config.tone === 'technical') {
      const tagStr = item.tag ? ` [${item.tag}]` : '';
      line = `* [${isBlocker ? 'BLOCKED' : item.status.toUpperCase()}] ${item.jobName}${tagStr}${leadTag}${stepDetail}${blockerNote}`;
    } else {
      // Casual
      line = `- ${item.jobName}${leadTag ? ` (with ${item.requester})` : ''}${stepDetail ? ` -> ${item.nextStep || ''}` : ''}${blockerNote}`;
    }

    const htmlMarkup = isBlocker
      ? `<div class="text-[#ba1a1a] font-medium my-1.5 pl-2.5 border-l-2 border-[#ba1a1a] font-mono text-xs">🚨 ${escapeHtml(
          line
        )}</div>`
      : `<div class="text-[#1c1b1f] my-1 pl-2.5 border-l-2 border-[#bfcab5]/40 font-mono text-xs">${escapeHtml(
          line
        )}</div>`;

    return { raw: line + '\n', html: htmlMarkup };
  };

  const renderBlockers = () => {
    let r = `\n🚨 [ACTIVE BLOCKERS & ACTION REQUIRED]\n`;
    let h = `<div class="text-[#ba1a1a] font-bold uppercase tracking-wider text-[11px] mt-4 mb-1.5 flex items-center gap-1 font-mono"><span class="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span> ACTIVE BLOCKERS & ACTION REQUIRED</div>`;
    if (blocked.length === 0) {
      r += `- None (Runway clear)\n`;
      h += `<div class="text-[#404a3a]/70 italic text-xs pl-2.5 my-1 font-mono">No active blockers identified.</div>`;
    } else {
      blocked.forEach((item) => {
        const res = formatItem(item, true);
        r += res.raw;
        h += res.html;
      });
    }
    return { r, h };
  };

  const renderCompleted = () => {
    let r = `\n✅ [COMPLETED THIS SPRINT]\n`;
    let h = `<div class="text-[#186700] font-bold uppercase tracking-wider text-[11px] mt-4 mb-1.5 flex items-center gap-1 font-mono"><span class="w-1.5 h-1.5 rounded-full bg-[#186700]"></span> COMPLETED THIS SPRINT</div>`;
    if (completed.length === 0) {
      r += `- None\n`;
      h += `<div class="text-[#404a3a]/70 italic text-xs pl-2.5 my-1 font-mono">No tasks completed yet this sprint.</div>`;
    } else {
      completed.forEach((item) => {
        const res = formatItem(item, false);
        r += res.raw;
        h += res.html;
      });
    }
    return { r, h };
  };

  const renderInProgress = () => {
    let r = `\n⚙️ [IN PROGRESS & ON TRACK]\n`;
    let h = `<div class="text-[#666000] font-bold uppercase tracking-wider text-[11px] mt-4 mb-1.5 flex items-center gap-1 font-mono"><span class="w-1.5 h-1.5 rounded-full bg-[#b9af00]"></span> IN PROGRESS & ON TRACK</div>`;
    if (inProgress.length === 0) {
      r += `- None\n`;
      h += `<div class="text-[#404a3a]/70 italic text-xs pl-2.5 my-1 font-mono">No tasks currently in progress.</div>`;
    } else {
      inProgress.forEach((item) => {
        const res = formatItem(item, false);
        r += res.raw;
        h += res.html;
      });
    }
    return { r, h };
  };

  // Section Ordering: Show Blockers First or Completed First
  if (config.showBlockersFirst || isExec) {
    const blk = renderBlockers();
    raw += blk.r;
    html += blk.h;

    const comp = renderCompleted();
    raw += comp.r;
    html += comp.h;

    const inp = renderInProgress();
    raw += inp.r;
    html += inp.h;
  } else {
    const comp = renderCompleted();
    raw += comp.r;
    html += comp.h;

    const inp = renderInProgress();
    raw += inp.r;
    html += inp.h;

    const blk = renderBlockers();
    raw += blk.r;
    html += blk.h;
  }

  raw += `\n---\nDispatched via WIP Tracker Local Engine\n`;
  html += `<div class="text-[#404a3a]/60 text-[10px] mt-4 pt-2 border-t border-[#bfcab5]/20 italic font-mono">Generated locally • zero third-party cloud sync delay</div>`;

  const words = raw.trim().split(/\s+/).filter(Boolean).length;

  return {
    rawText: raw,
    htmlMarkup: html,
    charCount: raw.length,
    wordCount: words
  };
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
