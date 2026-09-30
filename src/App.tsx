import React, { useState, useEffect, useCallback } from 'react';
import {
  TaskItem,
  SprintWeek,
  BlockerIncident,
  GeneratedReportHistory,
  WorkspaceView,
  TaskStatus
} from './types';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  loadWeeksFromStorage,
  saveWeeksToStorage,
  loadBlockersFromStorage,
  saveBlockersToStorage,
  loadReportHistoryFromStorage,
  saveReportHistoryToStorage,
  getActiveWeekId,
  setActiveWeekId,
  getThemeColor,
  setThemeColor,
  getEstimatedStorageSize,
  INITIAL_TASKS,
  INITIAL_WEEKS,
  INITIAL_BLOCKERS,
  INITIAL_REPORT_HISTORY
} from './utils/storage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WeeklyDeliverablesView } from './components/WeeklyDeliverablesView';
import { ReportGeneratorView } from './components/ReportGeneratorView';
import { WeeklySprintsArchiveView } from './components/WeeklySprintsArchiveView';
import { BlockersAndRisksView } from './components/BlockersAndRisksView';
import { TaskModal } from './components/modals/TaskModal';
import { QuickReportModal } from './components/modals/QuickReportModal';
import { LogBlockerModal } from './components/modals/LogBlockerModal';
import { ExportEscalationModal } from './components/modals/ExportEscalationModal';
import { PlaybookModal } from './components/modals/PlaybookModal';
import { StorageModal } from './components/modals/StorageModal';
import { Toast } from './components/Toast';

export default function App() {
  // App State
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [weeks, setWeeks] = useState<SprintWeek[]>([]);
  const [blockers, setBlockers] = useState<BlockerIncident[]>([]);
  const [reportHistory, setReportHistory] = useState<GeneratedReportHistory[]>([]);
  const [activeWeekId, setActiveWeekIdState] = useState<string>('week_current');
  const [activeView, setActiveView] = useState<WorkspaceView>('weekly-deliverables');
  const [themeColor, setThemeColorState] = useState<'green' | 'indigo'>('green');
  const [storageUsage, setStorageUsage] = useState<string>('24 KB Used');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null);
  const [isQuickReportOpen, setIsQuickReportOpen] = useState(false);
  const [isLogBlockerOpen, setIsLogBlockerOpen] = useState(false);
  const [isExportEscalationOpen, setIsExportEscalationOpen] = useState(false);
  const [isPlaybookOpen, setIsPlaybookOpen] = useState(false);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    type?: 'success' | 'warning' | 'info';
  }>({
    show: false,
    title: '',
    message: ''
  });

  const showToast = useCallback(
    (title: string, message: string, type: 'success' | 'warning' | 'info' = 'success') => {
      setToast({ show: true, title, message, type });
      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3200);
    },
    []
  );

  // Initial Load from Storage
  useEffect(() => {
    const loadedTasks = loadTasksFromStorage();
    const loadedWeeks = loadWeeksFromStorage();
    const loadedBlockers = loadBlockersFromStorage();
    const loadedReports = loadReportHistoryFromStorage();
    const loadedActiveWeek = getActiveWeekId();
    const loadedTheme = getThemeColor();

    setTasks(loadedTasks);
    setWeeks(loadedWeeks);
    setBlockers(loadedBlockers);
    setReportHistory(loadedReports);
    setActiveWeekIdState(loadedActiveWeek);
    setThemeColorState(loadedTheme);
    setStorageUsage(getEstimatedStorageSize());
  }, []);

  // Update storage size on state changes
  useEffect(() => {
    setStorageUsage(getEstimatedStorageSize());
  }, [tasks, weeks, blockers, reportHistory]);

  const currentWeek =
    weeks.find((w) => w.id === activeWeekId) ||
    weeks[0] || {
      id: 'week_current',
      weekNumber: 42,
      label: 'Current Week (Sep 28 - Oct 04, 2026)',
      shortLabel: 'Week 42',
      dateRange: 'Sep 28 - Oct 04, 2026',
      status: 'active',
      quarter: 'q4'
    };

  // Change Active Sprint Week
  const handleSelectWeek = (weekId: string) => {
    setActiveWeekIdState(weekId);
    setActiveWeekId(weekId);
    const selected = weeks.find((w) => w.id === weekId);
    if (selected) {
      showToast('Sprint Switched', `Loaded deliverables for ${selected.shortLabel}`);
    }
  };

  // Theme Accent Toggle
  const handleToggleTheme = () => {
    const nextColor = themeColor === 'green' ? 'indigo' : 'green';
    setThemeColorState(nextColor);
    setThemeColor(nextColor);
    showToast('Theme Updated', `Switched accent style to ${nextColor}`);
  };

  // Save Task (Add or Edit)
  const handleSaveTask = (taskData: {
    id?: string;
    jobName: string;
    requester: string;
    status: TaskStatus;
    issue: string;
    tag?: string;
  }) => {
    let updatedTasks: TaskItem[];

    if (taskData.id) {
      // Edit existing
      updatedTasks = tasks.map((t) => {
        if (t.id === taskData.id) {
          return {
            ...t,
            jobName: taskData.jobName,
            requester: taskData.requester,
            status: taskData.status,
            issue: taskData.issue,
            tag: taskData.tag,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      });
      showToast('Task Updated', `Changes to "${taskData.jobName}" saved.`);
    } else {
      // Add new task
      const newTask: TaskItem = {
        id: 'task_' + Date.now(),
        weekId: activeWeekId,
        jobName: taskData.jobName,
        requester: taskData.requester,
        status: taskData.status,
        issue: taskData.issue,
        tag: taskData.tag || 'SPR-' + currentWeek.weekNumber,
        createdAt: new Date().toISOString()
      };
      updatedTasks = [newTask, ...tasks];
      showToast('Task Created', `"${taskData.jobName}" added to active sprint.`);

      // If added as Blocked, automatically log to blockers list as well
      if (taskData.status === 'Blocked') {
        const newBlocker: BlockerIncident = {
          id: 'blk_' + Date.now(),
          taskId: newTask.id,
          title: newTask.jobName,
          severity: 'critical',
          severityLabel: 'Critical Hard Blocker',
          daysStalled: '1 Day In Triage',
          taskRef: newTask.tag || 'TASK-' + Math.floor(1000 + Math.random() * 9000),
          rootCauseType: 'Deliverable Impeded',
          rootCauseDetail: newTask.issue || 'Blocked dependency reported by task owner',
          requester: newTask.requester,
          escalatedTo: 'Squad Lead',
          lastUpdated: 'Just now'
        };
        const updatedBlockers = [newBlocker, ...blockers];
        setBlockers(updatedBlockers);
        saveBlockersToStorage(updatedBlockers);
      }
    }

    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  // Delete Task
  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    saveTasksToStorage(updated);
    showToast(
      'Deliverable Removed',
      `"${taskToDelete?.jobName || 'Task'}" was deleted from sprint records.`
    );
  };

  // Quick Status Cycle: In Progress -> Completed -> Blocked -> In Progress
  const handleCycleStatus = (task: TaskItem) => {
    let nextStatus: TaskStatus;
    if (task.status === 'In Progress') {
      nextStatus = 'Completed';
    } else if (task.status === 'Completed') {
      nextStatus = 'Blocked';
    } else {
      nextStatus = 'In Progress';
    }

    const updated = tasks.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t));
    setTasks(updated);
    saveTasksToStorage(updated);
    showToast('Status Updated', `"${task.jobName}" marked as ${nextStatus}.`);
  };

  // Resolve Blocker
  const handleResolveBlocker = (blockerId: string) => {
    const updated = blockers.map((b) => {
      if (b.id === blockerId) {
        return {
          ...b,
          isResolved: true,
          severity: 'resolved' as const,
          severityLabel: 'Resolved',
          daysStalled: 'Cleared',
          lastUpdated: 'Today'
        };
      }
      return b;
    });
    setBlockers(updated);
    saveBlockersToStorage(updated);

    // Also update associated task if matched
    const matchedBlocker = blockers.find((b) => b.id === blockerId);
    if (matchedBlocker?.taskId) {
      const updatedTasks = tasks.map((t) =>
        t.id === matchedBlocker.taskId ? { ...t, status: 'Completed' as const } : t
      );
      setTasks(updatedTasks);
      saveTasksToStorage(updatedTasks);
    }

    showToast('Impediment Cleared', `Resolved blocker moved to historical cleared log.`);
  };

  // Reopen Blocker
  const handleReopenBlocker = (blockerId: string) => {
    const updated = blockers.map((b) => {
      if (b.id === blockerId) {
        return {
          ...b,
          isResolved: false,
          severity: 'risk' as const,
          severityLabel: 'At Risk / Dependency Pending',
          daysStalled: 'Reopened 1d',
          lastUpdated: 'Just now'
        };
      }
      return b;
    });
    setBlockers(updated);
    saveBlockersToStorage(updated);
    showToast('Blocker Reopened', 'Impediment restored to active monitoring queue.');
  };

  // Save new blocker from modal
  const handleSaveNewBlocker = (blockerData: Omit<BlockerIncident, 'id'>) => {
    const newBlocker: BlockerIncident = {
      ...blockerData,
      id: 'blk_' + Date.now()
    };
    const updated = [newBlocker, ...blockers];
    setBlockers(updated);
    saveBlockersToStorage(updated);
    showToast('Blocker Recorded', `Escalation alert queued for ${blockerData.title}`);
  };

  // Save to Report History
  const handleSaveReportHistory = (report: GeneratedReportHistory) => {
    const updated = [report, ...reportHistory.slice(0, 8)];
    setReportHistory(updated);
    saveReportHistoryToStorage(updated);
  };

  // Reset to default
  const handleResetData = () => {
    setTasks(INITIAL_TASKS);
    setWeeks(INITIAL_WEEKS);
    setBlockers(INITIAL_BLOCKERS);
    setReportHistory(INITIAL_REPORT_HISTORY);
    setActiveWeekIdState('week_current');
    saveTasksToStorage(INITIAL_TASKS);
    saveWeeksToStorage(INITIAL_WEEKS);
    saveBlockersToStorage(INITIAL_BLOCKERS);
    saveReportHistoryToStorage(INITIAL_REPORT_HISTORY);
    setActiveWeekId('week_current');
  };

  const activeBlockersCount = blockers.filter((b) => !b.isResolved && b.severity !== 'resolved').length;

  return (
    <div className="min-h-screen bg-[#fcf8fe] text-[#1c1b1f] flex flex-col antialiased">
      {/* Toast Notification */}
      <Toast
        show={toast.show}
        title={toast.title}
        message={toast.message}
        type={toast.type}
      />

      {/* Top Header */}
      <Header
        currentWeek={currentWeek}
        weeks={weeks}
        onSelectWeek={handleSelectWeek}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        themeColor={themeColor}
        onToggleTheme={handleToggleTheme}
      />

      {/* Left Sidebar */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        storageUsage={storageUsage}
        onOpenStorageModal={() => setIsStorageModalOpen(true)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        themeColor={themeColor}
        blockerCount={activeBlockersCount}
      />

      {/* Main Viewport Content */}
      <div className="md:pl-64 pt-14 min-h-screen flex flex-col">
        <main className="flex-1">
          {activeView === 'weekly-deliverables' && (
            <WeeklyDeliverablesView
              currentWeek={currentWeek}
              allWeeks={weeks}
              tasks={tasks}
              onSelectWeek={handleSelectWeek}
              onAddTask={() => {
                setTaskToEdit(null);
                setIsTaskModalOpen(true);
              }}
              onEditTask={(task) => {
                setTaskToEdit(task);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onCycleStatus={handleCycleStatus}
              onGenerateReport={() => setIsQuickReportOpen(true)}
              themeColor={themeColor}
            />
          )}

          {activeView === 'report-generator' && (
            <ReportGeneratorView
              currentWeek={currentWeek}
              allWeeks={weeks}
              tasks={tasks}
              onSelectWeek={handleSelectWeek}
              reportHistory={reportHistory}
              onSaveHistory={handleSaveReportHistory}
              onShowToast={showToast}
              themeColor={themeColor}
            />
          )}

          {activeView === 'weekly-sprints-archive' && (
            <WeeklySprintsArchiveView
              weeks={weeks}
              tasks={tasks}
              onInspectSprint={(week) => {
                handleSelectWeek(week.id);
                showToast('Sprint Selected', `Inspecting ${week.shortLabel}`);
              }}
              onShowToast={showToast}
              themeColor={themeColor}
            />
          )}

          {activeView === 'blockers-and-risks' && (
            <BlockersAndRisksView
              blockers={blockers}
              onResolveBlocker={handleResolveBlocker}
              onReopenBlocker={handleReopenBlocker}
              onOpenLogModal={() => setIsLogBlockerOpen(true)}
              onOpenExportModal={() => setIsExportEscalationOpen(true)}
              onOpenPlaybookModal={() => setIsPlaybookOpen(true)}
              onShowToast={showToast}
              themeColor={themeColor}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        themeColor={themeColor}
      />

      <QuickReportModal
        isOpen={isQuickReportOpen}
        onClose={() => setIsQuickReportOpen(false)}
        tasks={tasks}
        currentWeek={currentWeek}
        onShowToast={showToast}
        themeColor={themeColor}
      />

      <LogBlockerModal
        isOpen={isLogBlockerOpen}
        onClose={() => setIsLogBlockerOpen(false)}
        onSaveBlocker={handleSaveNewBlocker}
        themeColor={themeColor}
      />

      <ExportEscalationModal
        isOpen={isExportEscalationOpen}
        onClose={() => setIsExportEscalationOpen(false)}
        blockers={blockers}
        onShowToast={showToast}
        themeColor={themeColor}
      />

      <PlaybookModal
        isOpen={isPlaybookOpen}
        onClose={() => setIsPlaybookOpen(false)}
        onShowToast={showToast}
        themeColor={themeColor}
      />

      <StorageModal
        isOpen={isStorageModalOpen}
        onClose={() => setIsStorageModalOpen(false)}
        storageUsage={storageUsage}
        onReset={handleResetData}
        onShowToast={showToast}
        themeColor={themeColor}
      />
    </div>
  );
}
