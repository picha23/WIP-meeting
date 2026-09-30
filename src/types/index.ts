export type TaskStatus = 'In Progress' | 'Completed' | 'Blocked' | 'Pending';

export interface TaskItem {
  id: string;
  jobName: string;
  requester: string;
  status: TaskStatus;
  issue?: string;
  weekId: string;
  tag?: string;
  category?: 'critical' | 'risk' | 'resolved' | 'nominal';
  escalatedTo?: string;
  timeBlocked?: string;
  nextStep?: string;
  targetEta?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SprintWeek {
  id: string;
  weekNumber: number;
  label: string;
  shortLabel: string;
  dateRange: string;
  status: 'active' | 'closed';
  quarter: 'q4' | 'q3' | 'q2';
  retrospectiveNote?: string;
  closedBy?: string;
  syncAgo?: string;
  reviewers?: string;
}

export interface BlockerIncident {
  id: string;
  taskId?: string;
  title: string;
  severity: 'critical' | 'risk' | 'resolved';
  severityLabel: string;
  daysStalled: string;
  taskRef: string;
  rootCauseType: string;
  rootCauseDetail: string;
  requester: string;
  escalatedTo: string;
  lastUpdated: string;
  resolvedDate?: string;
  resolvedBy?: string;
  resolutionOutcome?: string;
  clearanceDuration?: string;
  isResolved?: boolean;
}

export type ReportPreset = 'standard' | 'exec' | 'slack' | 'client';
export type ReportTone = 'executive' | 'technical' | 'casual';

export interface ReportConfig {
  preset: ReportPreset;
  tone: ReportTone;
  showBlockersFirst: boolean;
  includeRequester: boolean;
  includeETAs: boolean;
  includeMetrics: boolean;
  customNote: string;
}

export interface GeneratedReportHistory {
  id: string;
  title: string;
  timestamp: string;
  toneBadge: string;
  toneBadgeColor?: string;
  itemCount: number;
  wordCount: number;
  content: string;
  preview: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export type WorkspaceView = 'weekly-deliverables' | 'report-generator' | 'weekly-sprints-archive' | 'blockers-and-risks';
