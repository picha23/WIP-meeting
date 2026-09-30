import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  TaskItem,
  SprintWeek,
  BlockerIncident,
  GeneratedReportHistory,
  WorkspaceView,
  TaskStatus,
  UserProfile
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
  loadUserProfile,
  saveUserProfile,
  INITIAL_TASKS,
  INITIAL_WEEKS,
  INITIAL_BLOCKERS,
  INITIAL_REPORT_HISTORY
} from './utils/storage';
import { auth, signInWithGoogle, logOut } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  saveTaskToFirestore,
  deleteTaskFromFirestore,
  subscribeTasks,
  subscribeWeeks,
  subscribeBlockers,
  subscribeReports,
  saveBlockerToFirestore,
  saveReportToFirestore,
  ensureUserProfile,
  syncInitialDataIfEmpty
} from './services/firestoreService';
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
import { EditProfileModal } from './components/modals/EditProfileModal';
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

  // Firebase Auth & Cloud Sync State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const userRef = useRef<FirebaseUser | null>(null);
  userRef.current = user;

  // User Profile State (Default Amri Faizal)
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

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

  // Initial Load from Local Storage
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

  // Firebase Auth Listener & Firestore Live Sync
  useEffect(() => {
    let unsubTasks: (() => void) | undefined;
    let unsubWeeks: (() => void) | undefined;
    let unsubBlockers: (() => void) | undefined;
    let unsubReports: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsSyncing(true);
        try {
          // Update local userProfile with Google credentials if available
          setUserProfile((prev) => {
            const updated: UserProfile = {
              name: currentUser.displayName || prev.name || 'Amri Faizal',
              email: currentUser.email || prev.email || 'amri.faizal@bigtree.com.my',
              role: prev.role === 'Senior Product Designer' || !prev.role ? 'Senior Graphic Designer' : prev.role,
              avatarUrl: currentUser.photoURL || prev.avatarUrl
            };
            saveUserProfile(updated);
            return updated;
          });

          await ensureUserProfile({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || userProfile.name || 'Amri Faizal',
            photoURL: currentUser.photoURL || userProfile.avatarUrl || null
          });

          // Seed cloud data if user's cloud account is empty
          await syncInitialDataIfEmpty(
            currentUser.uid,
            loadTasksFromStorage(),
            loadWeeksFromStorage(),
            loadBlockersFromStorage()
          );

          // Real-time subscriptions
          unsubTasks = subscribeTasks(currentUser.uid, (cloudTasks) => {
            if (cloudTasks && cloudTasks.length > 0) {
              setTasks(cloudTasks);
              saveTasksToStorage(cloudTasks);
            }
          });

          unsubWeeks = subscribeWeeks(currentUser.uid, (cloudWeeks) => {
            if (cloudWeeks && cloudWeeks.length > 0) {
              setWeeks(cloudWeeks);
              saveWeeksToStorage(cloudWeeks);
            }
          });

          unsubBlockers = subscribeBlockers(currentUser.uid, (cloudBlockers) => {
            if (cloudBlockers) {
              setBlockers(cloudBlockers);
              saveBlockersToStorage(cloudBlockers);
            }
          });

          unsubReports = subscribeReports(currentUser.uid, (cloudReports) => {
            if (cloudReports) {
              setReportHistory(cloudReports);
              saveReportHistoryToStorage(cloudReports);
            }
          });

          showToast(
            'Firebase Cloud Tersinkron',
            `Disambungkan ke akaun: ${currentUser.displayName || currentUser.email}`,
            'success'
          );
        } catch (error) {
          console.error('Error establishing Firestore sync:', error);
          showToast('Amaran Sinkron', 'Gagal menyegerakkan data awan dengan sempurna', 'warning');
        } finally {
          setIsSyncing(false);
        }
      } else {
        // Cleanup subscriptions on logout
        unsubTasks?.();
        unsubWeeks?.();
        unsubBlockers?.();
        unsubReports?.();
      }
    });

    return () => {
      unsubscribeAuth();
      unsubTasks?.();
      unsubWeeks?.();
      unsubBlockers?.();
      unsubReports?.();
    };
  }, [showToast]);

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

  // Sign In with Google
  const handleSignIn = async () => {
    setIsSyncing(true);
    try {
      const loggedUser = await signInWithGoogle();
      if (!loggedUser) {
        // User closed or cancelled the popup dialog
        return;
      }
      showToast(
        'Log Masuk Berjaya',
        `Selamat kembali, ${loggedUser.displayName || loggedUser.email || 'Pengguna'}!`
      );
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string };
      if (
        errorObj?.code === 'auth/popup-closed-by-user' ||
        errorObj?.code === 'auth/cancelled-popup-request'
      ) {
        return;
      }
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn('Sign-in notification:', err);
      showToast('Log Masuk Tidak Berjaya', errorMsg || 'Gagal log masuk Google.', 'warning');
    } finally {
      setIsSyncing(false);
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    try {
      await logOut();
      showToast('Log Keluar', 'Anda telah log keluar. Storan beralih ke cache setempat.');
    } catch (err) {
      console.error('Sign out error:', err);
      showToast('Ralat', 'Gagal log keluar.', 'warning');
    }
  };

  // Save / Update User Profile
  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    saveUserProfile(newProfile);
    showToast('Profil Disimpan', `Nama pengguna berjaya dikemaskini kepada "${newProfile.name}".`);
  };

  // Change Active Sprint Week
  const handleSelectWeek = (weekId: string) => {
    setActiveWeekIdState(weekId);
    setActiveWeekId(weekId);
    const selected = weeks.find((w) => w.id === weekId);
    if (selected) {
      showToast('Sprint Ditukar', `Memaparkan tugasan bagi ${selected.shortLabel}`);
    }
  };

  // Theme Accent Toggle
  const handleToggleTheme = () => {
    const nextColor = themeColor === 'green' ? 'indigo' : 'green';
    setThemeColorState(nextColor);
    setThemeColor(nextColor);
    showToast('Tema Dikemas Kini', `Menukar gaya aksen kepada ${nextColor}`);
  };

  // Save Task (Add or Edit)
  const handleSaveTask = async (taskData: {
    id?: string;
    jobName: string;
    requester: string;
    status: TaskStatus;
    issue: string;
    tag?: string;
  }) => {
    let updatedTasks: TaskItem[];
    let affectedTask: TaskItem;

    if (taskData.id) {
      // Edit existing
      updatedTasks = tasks.map((t) => {
        if (t.id === taskData.id) {
          affectedTask = {
            ...t,
            jobName: taskData.jobName,
            requester: taskData.requester,
            status: taskData.status,
            issue: taskData.issue,
            tag: taskData.tag,
            updatedAt: new Date().toISOString()
          };
          return affectedTask;
        }
        return t;
      });
      showToast('Tugasan Dikemas Kini', `Perubahan pada "${taskData.jobName}" disimpan.`);
    } else {
      // Add new task
      affectedTask = {
        id: 'task_' + Date.now(),
        weekId: activeWeekId,
        jobName: taskData.jobName,
        requester: taskData.requester,
        status: taskData.status,
        issue: taskData.issue,
        tag: taskData.tag || 'SPR-' + currentWeek.weekNumber,
        createdAt: new Date().toISOString()
      };
      updatedTasks = [affectedTask, ...tasks];
      showToast('Tugasan Dicipta', `"${taskData.jobName}" ditambah ke sprint semasa.`);

      // If added as Blocked, automatically log to blockers list as well
      if (taskData.status === 'Blocked') {
        const newBlocker: BlockerIncident = {
          id: 'blk_' + Date.now(),
          taskId: affectedTask.id,
          title: affectedTask.jobName,
          severity: 'critical',
          severityLabel: 'Critical Hard Blocker',
          daysStalled: '1 Day In Triage',
          taskRef: affectedTask.tag || 'TASK-' + Math.floor(1000 + Math.random() * 9000),
          rootCauseType: 'Deliverable Impeded',
          rootCauseDetail: affectedTask.issue || 'Blocked dependency reported by task owner',
          requester: affectedTask.requester,
          escalatedTo: 'Squad Lead',
          lastUpdated: 'Baru sahaja'
        };
        const updatedBlockers = [newBlocker, ...blockers];
        setBlockers(updatedBlockers);
        saveBlockersToStorage(updatedBlockers);

        if (userRef.current) {
          saveBlockerToFirestore(newBlocker, userRef.current.uid).catch(console.error);
        }
      }
    }

    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);

    // Sync to Firestore if authenticated
    if (userRef.current && affectedTask!) {
      try {
        await saveTaskToFirestore(affectedTask, userRef.current.uid);
      } catch (err) {
        console.error('Failed to sync task to Firestore:', err);
      }
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    saveTasksToStorage(updated);
    showToast(
      'Tugasan Dipadam',
      `"${taskToDelete?.jobName || 'Tugasan'}" telah dipadam dari rekod sprint.`
    );

    if (userRef.current) {
      try {
        await deleteTaskFromFirestore(taskId);
      } catch (err) {
        console.error('Failed to delete task from Firestore:', err);
      }
    }
  };

  // Quick Status Cycle: In Progress -> Completed -> Blocked -> In Progress
  const handleCycleStatus = async (task: TaskItem) => {
    let nextStatus: TaskStatus;
    if (task.status === 'In Progress') {
      nextStatus = 'Completed';
    } else if (task.status === 'Completed') {
      nextStatus = 'Blocked';
    } else {
      nextStatus = 'In Progress';
    }

    const updatedTask: TaskItem = { ...task, status: nextStatus, updatedAt: new Date().toISOString() };
    const updated = tasks.map((t) => (t.id === task.id ? updatedTask : t));
    setTasks(updated);
    saveTasksToStorage(updated);
    showToast('Status Dikemas Kini', `"${task.jobName}" ditandakan sebagai ${nextStatus === 'Blocked' ? 'Pending' : nextStatus}.`);

    if (userRef.current) {
      try {
        await saveTaskToFirestore(updatedTask, userRef.current.uid);
      } catch (err) {
        console.error('Failed to update task status in Firestore:', err);
      }
    }
  };

  // Resolve Blocker
  const handleResolveBlocker = async (blockerId: string) => {
    let resolvedBlockerItem: BlockerIncident | undefined;
    const updated = blockers.map((b) => {
      if (b.id === blockerId) {
        resolvedBlockerItem = {
          ...b,
          isResolved: true,
          severity: 'resolved' as const,
          severityLabel: 'Selesai',
          daysStalled: 'Dibersihkan',
          lastUpdated: 'Hari ini'
        };
        return resolvedBlockerItem;
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
      const matchedTask = updatedTasks.find((t) => t.id === matchedBlocker.taskId);
      if (userRef.current && matchedTask) {
        saveTaskToFirestore(matchedTask, userRef.current.uid).catch(console.error);
      }
    }

    showToast('Halangan Diselesaikan', `Halangan yang selesai dipindahkan ke log sejarah.`);

    if (userRef.current && resolvedBlockerItem) {
      saveBlockerToFirestore(resolvedBlockerItem, userRef.current.uid).catch(console.error);
    }
  };

  // Reopen Blocker
  const handleReopenBlocker = async (blockerId: string) => {
    let reopenedItem: BlockerIncident | undefined;
    const updated = blockers.map((b) => {
      if (b.id === blockerId) {
        reopenedItem = {
          ...b,
          isResolved: false,
          severity: 'risk' as const,
          severityLabel: 'At Risk / Dependency Pending',
          daysStalled: 'Dibuka Semula',
          lastUpdated: 'Baru sahaja'
        };
        return reopenedItem;
      }
      return b;
    });
    setBlockers(updated);
    saveBlockersToStorage(updated);
    showToast('Halangan Dibuka Semula', 'Halangan dikembalikan ke senarai pemantauan aktif.');

    if (userRef.current && reopenedItem) {
      saveBlockerToFirestore(reopenedItem, userRef.current.uid).catch(console.error);
    }
  };

  // Save new blocker from modal
  const handleSaveNewBlocker = async (blockerData: Omit<BlockerIncident, 'id'>) => {
    const newBlocker: BlockerIncident = {
      ...blockerData,
      id: 'blk_' + Date.now()
    };
    const updated = [newBlocker, ...blockers];
    setBlockers(updated);
    saveBlockersToStorage(updated);
    showToast('Halangan Direkod', `Amaran eskalasi dimasukkan untuk ${blockerData.title}`);

    if (userRef.current) {
      saveBlockerToFirestore(newBlocker, userRef.current.uid).catch(console.error);
    }
  };

  // Save to Report History
  const handleSaveReportHistory = async (report: GeneratedReportHistory) => {
    const updated = [report, ...reportHistory.slice(0, 8)];
    setReportHistory(updated);
    saveReportHistoryToStorage(updated);

    if (userRef.current) {
      saveReportToFirestore(report, userRef.current.uid).catch(console.error);
    }
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
    showToast('Data Ditetapkan Semula', 'Semua data contoh asal telah dimuat semula.');
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
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        isSyncing={isSyncing}
        userProfile={userProfile}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
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
        isCloudConnected={Boolean(user)}
        userProfile={userProfile}
        userPhoto={user?.photoURL || userProfile.avatarUrl}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
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
              userName={user?.displayName || userProfile.name}
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
              userName={user?.displayName || userProfile.name}
            />
          )}

          {activeView === 'weekly-sprints-archive' && (
            <WeeklySprintsArchiveView
              weeks={weeks}
              tasks={tasks}
              onInspectSprint={(week) => {
                handleSelectWeek(week.id);
                showToast('Sprint Dipilih', `Memeriksa ${week.shortLabel}`);
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

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        themeColor={themeColor}
      />
    </div>
  );
}
