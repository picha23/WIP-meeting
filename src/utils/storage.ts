import { TaskItem, SprintWeek, BlockerIncident, GeneratedReportHistory } from '../types';

const STORAGE_KEYS = {
  TASKS: 'wip_tracker_tasks_v2',
  WEEKS: 'wip_tracker_weeks_v2',
  BLOCKERS: 'wip_tracker_blockers_v2',
  REPORT_HISTORY: 'wip_tracker_report_history_v2',
  ACTIVE_WEEK: 'wip_tracker_active_week_v2',
  THEME_COLOR: 'wip_tracker_theme_color_v2'
};

export const INITIAL_WEEKS: SprintWeek[] = [
  {
    id: 'week_current',
    weekNumber: 42,
    label: 'Current Week (Sep 28 - Oct 04, 2026)',
    shortLabel: 'Week 42',
    dateRange: 'Sep 28 - Oct 04, 2026',
    status: 'active',
    quarter: 'q4',
    retrospectiveNote: 'Sprint actively tracking high-priority marketing deliverables and Q4 checkout polish.',
    closedBy: 'Senior Product Designer'
  },
  {
    id: 'w41',
    weekNumber: 41,
    label: 'Week 41: Oct 07 – Oct 13, 2026',
    shortLabel: 'Week 41',
    dateRange: 'Oct 07 - Oct 13, 2026',
    status: 'closed',
    quarter: 'q4',
    retrospectiveNote: 'Significant velocity acceleration after adopting local tokens. Week 41 closed without any technical debt carry-overs. Team recommends standardizing the 4-task ceiling for optimal code quality and cross-functional alignment.',
    closedBy: 'Senior Product Designer',
    syncAgo: 'Synchronized 4 days ago'
  },
  {
    id: 'w40',
    weekNumber: 40,
    label: 'Week 40: Sep 30 – Oct 06, 2026',
    shortLabel: 'Week 40',
    dateRange: 'Sep 30 - Oct 06, 2026',
    status: 'closed',
    quarter: 'q4',
    retrospectiveNote: 'OAuth token validation bottleneck resolved in sync meeting with David Miller on Oct 05. Decoupled direct webhook ingestion into an asynchronous queue, scheduled for release in sprint W42.',
    closedBy: 'Senior Product Designer',
    reviewers: 'Elena Rostova (VP Eng) & David Miller'
  },
  {
    id: 'w39',
    weekNumber: 39,
    label: 'Week 39: Sep 23 – Sep 29, 2026',
    shortLabel: 'Week 39',
    dateRange: 'Sep 23 - Sep 29, 2026',
    status: 'closed',
    quarter: 'q3',
    retrospectiveNote: 'Quarter-end delivery finalization complete. All committed deliverables shipped on time with high audit compliance.',
    closedBy: 'Senior Product Designer',
    reviewers: 'Verified by Sarah Chen'
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  // Current Week (Sep 28 - Oct 04, 2026)
  {
    id: 'task_1',
    weekId: 'week_current',
    jobName: 'Homepage Mockup - Sales Redesign',
    requester: 'Sarah Chen (Head of Sales)',
    status: 'Completed',
    issue: '',
    tag: 'PROD-102',
    category: 'resolved',
    nextStep: 'Handoff to frontend team with responsive specs',
    targetEta: 'Delivered',
    createdAt: '2026-09-28T09:00:00.000Z'
  },
  {
    id: 'task_2',
    weekId: 'week_current',
    jobName: 'Checkout Funnel v2 UX Polish',
    requester: 'David Miller (PM - Growth)',
    status: 'In Progress',
    issue: 'Awaiting final copy validation from legal team.',
    tag: 'GROWTH-1082',
    category: 'risk',
    nextStep: 'Push localized build to staging once terms approved',
    targetEta: 'Tomorrow 11:00 AM',
    createdAt: '2026-09-28T10:30:00.000Z'
  },
  {
    id: 'task_3',
    weekId: 'week_current',
    jobName: 'Executive Analytics Dashboard Widget',
    requester: 'Elena Rostova (VP Product)',
    status: 'Blocked',
    issue: 'Waiting for final API schema from backend team',
    tag: 'TASK-1049',
    category: 'critical',
    escalatedTo: 'Marcus Brody (Backend Lead)',
    timeBlocked: '3 Days Stalled',
    nextStep: 'Unblock client mock mode once Swagger 500 fixed',
    targetEta: 'Today EOD',
    createdAt: '2026-09-28T11:15:00.000Z'
  },
  // Week 41 Archived Tasks
  {
    id: 'task_w41_1',
    weekId: 'w41',
    jobName: 'Design System Token Migration',
    requester: 'Core UI Guild',
    status: 'Completed',
    tag: 'PROD-189',
    issue: '',
    nextStep: 'Core UI Kit Sync',
    targetEta: 'Delivered Oct 12',
    createdAt: '2026-10-07T08:00:00.000Z'
  },
  {
    id: 'task_w41_2',
    weekId: 'w41',
    jobName: 'Onboarding Flow v3 Redesign',
    requester: 'Growth Team',
    status: 'Completed',
    tag: 'GROWTH-44',
    issue: '',
    nextStep: 'Activation +14%',
    targetEta: 'Delivered Oct 11',
    createdAt: '2026-10-07T09:00:00.000Z'
  },
  {
    id: 'task_w41_3',
    weekId: 'w41',
    jobName: 'Settings Page Responsive Patch',
    requester: 'Platform Team',
    status: 'Completed',
    tag: 'CORE-702',
    issue: '',
    nextStep: 'Mobile Viewport Fixes',
    targetEta: 'Delivered Oct 10',
    createdAt: '2026-10-08T10:00:00.000Z'
  },
  {
    id: 'task_w41_4',
    weekId: 'w41',
    jobName: 'Billing Table Micro-interactions',
    requester: 'Sarah Chen (Fintech Lead)',
    status: 'Completed',
    tag: 'FIN-311',
    issue: '',
    nextStep: 'Invoice Tooltips & CSV export',
    targetEta: 'Delivered Oct 09',
    createdAt: '2026-10-09T14:00:00.000Z'
  },
  // Week 40 Archived Tasks
  {
    id: 'task_w40_1',
    weekId: 'w40',
    jobName: 'Dark Mode Elevation Pass',
    requester: 'Sarah Chen',
    status: 'Completed',
    tag: 'UX-504',
    issue: '',
    nextStep: 'Palette verification',
    targetEta: 'Delivered Oct 04',
    createdAt: '2026-09-30T09:00:00.000Z'
  },
  {
    id: 'task_w40_2',
    weekId: 'w40',
    jobName: 'Executive Digest Template v1',
    requester: 'Elena Rostova',
    status: 'Completed',
    tag: 'PRD-81',
    issue: '',
    nextStep: 'Template compiler ready',
    targetEta: 'Delivered Oct 03',
    createdAt: '2026-09-30T10:00:00.000Z'
  },
  {
    id: 'task_w40_3',
    weekId: 'w40',
    jobName: 'Offline IndexedDB Schema v2',
    requester: 'David Miller',
    status: 'Completed',
    tag: 'ENG-901',
    issue: '',
    nextStep: 'Storage Optimization',
    targetEta: 'Delivered Oct 02',
    createdAt: '2026-10-01T11:00:00.000Z'
  },
  {
    id: 'task_w40_4',
    weekId: 'w40',
    jobName: 'Figma REST API Webhook Bridge',
    requester: 'David Miller',
    status: 'Blocked',
    tag: 'INT-112',
    issue: 'OAuth token validation bottleneck with token expiration',
    nextStep: 'Decouple into asynchronous queue',
    targetEta: 'Rescheduled for W42',
    createdAt: '2026-10-01T14:00:00.000Z'
  },
  // Week 39 Archived Tasks
  {
    id: 'task_w39_1',
    weekId: 'w39',
    jobName: 'Q3 Executive Slide Deck Generator',
    requester: 'Sarah Chen',
    status: 'Completed',
    tag: 'RPT-209',
    issue: '',
    nextStep: 'Auto-compiles KPI digests',
    targetEta: 'Delivered Sep 28',
    createdAt: '2026-09-23T09:00:00.000Z'
  },
  {
    id: 'task_w39_2',
    weekId: 'w39',
    jobName: 'Keyboard Shortcuts Overlay (⌘K)',
    requester: 'Design Guild',
    status: 'Completed',
    tag: 'UX-490',
    issue: '',
    nextStep: 'Power user workflow',
    targetEta: 'Delivered Sep 27',
    createdAt: '2026-09-23T11:00:00.000Z'
  },
  {
    id: 'task_w39_3',
    weekId: 'w39',
    jobName: 'Audit Log Retention Policy',
    requester: 'Security Compliance',
    status: 'Completed',
    tag: 'SEC-11',
    issue: '',
    nextStep: 'SOC2 type II compliance',
    targetEta: 'Delivered Sep 26',
    createdAt: '2026-09-24T14:00:00.000Z'
  },
  {
    id: 'task_w39_4',
    weekId: 'w39',
    jobName: 'Markdown Clipboard Dispatcher',
    requester: 'Elena Rostova',
    status: 'Completed',
    tag: 'CORE-691',
    issue: '',
    nextStep: 'Slack & Notion clean copy',
    targetEta: 'Delivered Sep 25',
    createdAt: '2026-09-25T15:00:00.000Z'
  }
];

export const INITIAL_BLOCKERS: BlockerIncident[] = [
  {
    id: 'blk_1',
    taskId: 'task_3',
    title: 'Executive Analytics Dashboard Widget',
    severity: 'critical',
    severityLabel: 'Critical Hard Blocker',
    daysStalled: '3 Days Stalled',
    taskRef: 'TASK-1049',
    rootCauseType: 'Root Cause & Technical Impediment',
    rootCauseDetail: 'Waiting for final API schema from backend team. Swagger doc endpoints are returning 500 error on the aggregate KPI payload. Client front-end mock mode is exhausted.',
    requester: 'Elena Rostova (VP Product)',
    escalatedTo: 'Marcus Brody (Backend Lead)',
    lastUpdated: 'Today at 10:14 AM'
  },
  {
    id: 'blk_2',
    taskId: 'task_2',
    title: 'Checkout Funnel v2 UX Polish',
    severity: 'risk',
    severityLabel: 'At Risk / Dependency Pending',
    daysStalled: '1 Day In Review',
    taskRef: 'TASK-1082',
    rootCauseType: 'External Review Dependency',
    rootCauseDetail: 'Awaiting final copy validation from legal and compliance team regarding regional terms in EU/UK regions before pushing localized build to staging.',
    requester: 'David Miller (PM - Growth)',
    escalatedTo: 'Linda Vance (Legal Counsel)',
    lastUpdated: 'Tomorrow 11:00 AM'
  },
  {
    id: 'blk_3',
    title: 'Redis Production Cache Cluster Allocation',
    severity: 'risk',
    severityLabel: 'Hardware Provisioning Risk',
    daysStalled: '2 Days Pending',
    taskRef: 'INFRA-441',
    rootCauseType: 'AWS VPC Quota Limit',
    rootCauseDetail: 'Support ticket opened with cloud ops to raise memory instance limit for Frankfurt zone. Fallback is running on staged shared instance.',
    requester: 'Alex Rivera (Platform SRE)',
    escalatedTo: '#AWS-89210-EU Support',
    lastUpdated: 'Yesterday at 3:15 PM'
  },
  {
    id: 'blk_4',
    title: 'Stripe Webhook Sandbox Test',
    severity: 'resolved',
    severityLabel: 'Resolved',
    daysStalled: 'Cleared',
    taskRef: 'FIN-201',
    rootCauseType: 'Signature Validation',
    rootCauseDetail: 'Certificate mismatched signature issue patched. Resolved by Sarah Chen (Fintech Lead) yesterday at 4:30 PM.',
    requester: 'Fintech Team',
    escalatedTo: 'Sarah Chen (Fintech Lead)',
    lastUpdated: 'Yesterday at 4:30 PM',
    clearanceDuration: '0.8d',
    isResolved: true
  },
  {
    id: 'blk_5',
    title: 'Mobile App Store Asset Provisioning',
    severity: 'resolved',
    severityLabel: 'Resolved',
    daysStalled: 'Cleared',
    taskRef: 'IOS-88',
    rootCauseType: 'Privacy Manifest',
    rootCauseDetail: 'New privacy manifest generated and verified on App Store Connect. Resolved by David Miller Oct 15.',
    requester: 'Mobile Team',
    escalatedTo: 'David Miller',
    lastUpdated: 'Oct 15',
    clearanceDuration: '1.2d',
    isResolved: true
  }
];

export const INITIAL_REPORT_HISTORY: GeneratedReportHistory[] = [
  {
    id: 'rep_1',
    title: 'Sprint 42 (Today, 09:42 AM)',
    timestamp: 'Today, 09:42 AM',
    toneBadge: 'Executive',
    itemCount: 6,
    wordCount: 84,
    content: `# ⚡ WIP PROGRESS REPORT — Sprint 42 (Oct 14 - Oct 20)\n\n🚀 Health Snapshot: 75% Done • 1 Critical Risk\n\n🚨 ACTIVE BLOCKERS & ACTION REQUIRED:\n• Executive Analytics Dashboard Widget [Lead: Elena Rostova (VP Product)] — Next: Waiting for final API schema from backend team (Today EOD)\n\n✅ COMPLETED THIS SPRINT:\n• Homepage Mockup - Sales Redesign [Lead: Sarah Chen (Head of Sales)] — Next: Handoff to frontend team with responsive specs (Delivered)\n\n⚙️ IN PROGRESS & ON TRACK:\n• Checkout Funnel v2 UX Polish [Lead: David Miller (PM - Growth)] — Next: Push localized build to staging once terms approved (Tomorrow 11:00 AM)\n\n---\nDispatched via WIP Tracker Local Engine`,
    preview: '# WIP PROGRESS REPORT — Sprint 42 [CRITICAL BLOCKERS] Stripe Webhook signatures...'
  },
  {
    id: 'rep_2',
    title: 'Sprint 41 (Oct 13, 17:15 PM)',
    timestamp: 'Oct 13, 17:15 PM',
    toneBadge: 'Tech Slack',
    itemCount: 9,
    wordCount: 120,
    content: `*# WIP DISPATCH — Sprint 41 (Oct 07 - Oct 13)*\n\n*DEV STANDUP DISPATCH - W41* Resolved: Multi-tenant token isolation & latency benchmark.\n\n• Design System Token Migration [PROD-189]\n• Onboarding Flow v3 Redesign [GROWTH-44]\n• Settings Page Responsive Patch [CORE-702]\n• Billing Table Micro-interactions [FIN-311]`,
    preview: '*DEV STANDUP DISPATCH - W41* Resolved: Multi-tenant token isolation & latency benchmark...'
  },
  {
    id: 'rep_3',
    title: 'Sprint 40 (Oct 06, 11:30 AM)',
    timestamp: 'Oct 06, 11:30 AM',
    toneBadge: 'Client Digest',
    itemCount: 5,
    wordCount: 62,
    content: `Executive Briefing: Deliverable handoff on Design Token compiler completed.\n\nSummary:\n- Dark Mode Elevation Pass delivered\n- Executive Digest Template v1 validated\n- Offline IndexedDB Schema v2 optimized`,
    preview: 'Executive Briefing: Deliverable handoff on Design Token compiler completed...'
  }
];

// Storage Helpers
export function loadTasksFromStorage(): TaskItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load tasks from localStorage', err);
  }
  saveTasksToStorage(INITIAL_TASKS);
  return INITIAL_TASKS;
}

export function saveTasksToStorage(tasks: TaskItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage', err);
  }
}

export function loadWeeksFromStorage(): SprintWeek[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEEKS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load weeks from localStorage', err);
  }
  saveWeeksToStorage(INITIAL_WEEKS);
  return INITIAL_WEEKS;
}

export function saveWeeksToStorage(weeks: SprintWeek[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.WEEKS, JSON.stringify(weeks));
  } catch (err) {
    console.error('Failed to save weeks to localStorage', err);
  }
}

export function loadBlockersFromStorage(): BlockerIncident[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BLOCKERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load blockers from localStorage', err);
  }
  saveBlockersToStorage(INITIAL_BLOCKERS);
  return INITIAL_BLOCKERS;
}

export function saveBlockersToStorage(blockers: BlockerIncident[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.BLOCKERS, JSON.stringify(blockers));
  } catch (err) {
    console.error('Failed to save blockers to localStorage', err);
  }
}

export function loadReportHistoryFromStorage(): GeneratedReportHistory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORT_HISTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load report history from localStorage', err);
  }
  saveReportHistoryToStorage(INITIAL_REPORT_HISTORY);
  return INITIAL_REPORT_HISTORY;
}

export function saveReportHistoryToStorage(history: GeneratedReportHistory[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.REPORT_HISTORY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to save report history to localStorage', err);
  }
}

export function getActiveWeekId(): string {
  try {
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_WEEK);
    if (id) return id;
  } catch (e) {
    // Ignore
  }
  return 'week_current';
}

export function setActiveWeekId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_WEEK, id);
  } catch (e) {
    // Ignore
  }
}

export function getThemeColor(): 'green' | 'indigo' {
  try {
    const color = localStorage.getItem(STORAGE_KEYS.THEME_COLOR);
    if (color === 'indigo' || color === 'green') return color;
  } catch (e) {
    // Ignore
  }
  return 'green';
}

export function setThemeColor(color: 'green' | 'indigo') {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME_COLOR, color);
  } catch (e) {
    // Ignore
  }
}

export function getEstimatedStorageSize(): string {
  try {
    let totalBytes = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalBytes += (localStorage[key].length + key.length) * 2;
      }
    }
    const kb = Math.max(24, Math.round(totalBytes / 1024));
    return `${kb} KB Used`;
  } catch (e) {
    return '24 KB Used';
  }
}

export function resetAllDataToDefault() {
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.WEEKS);
  localStorage.removeItem(STORAGE_KEYS.BLOCKERS);
  localStorage.removeItem(STORAGE_KEYS.REPORT_HISTORY);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_WEEK);
}
