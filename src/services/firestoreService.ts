import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  Unsubscribe
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { TaskItem, SprintWeek, BlockerIncident, GeneratedReportHistory } from '../types';

// Tasks Firestore Operations
export async function saveTaskToFirestore(task: TaskItem, userId: string): Promise<void> {
  const path = `tasks/${task.id}`;
  try {
    const taskPayload = {
      id: task.id,
      ownerId: userId,
      weekId: task.weekId,
      jobName: task.jobName,
      requester: task.requester,
      status: task.status,
      issue: task.issue || '',
      tag: task.tag || '',
      nextStep: task.nextStep || '',
      targetEta: task.targetEta || '',
      createdAt: task.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'tasks', task.id), taskPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTaskFromFirestore(taskId: string): Promise<void> {
  const path = `tasks/${taskId}`;
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeTasks(
  userId: string,
  onUpdate: (tasks: TaskItem[]) => void
): Unsubscribe {
  const q = query(collection(db, 'tasks'), where('ownerId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: TaskItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: data.id,
          weekId: data.weekId,
          jobName: data.jobName,
          requester: data.requester,
          status: data.status,
          issue: data.issue,
          tag: data.tag,
          nextStep: data.nextStep,
          targetEta: data.targetEta,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });
      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'tasks');
    }
  );
}

// Weeks Firestore Operations
export async function saveWeekToFirestore(week: SprintWeek, userId: string): Promise<void> {
  const path = `weeks/${week.id}`;
  try {
    const payload = {
      id: week.id,
      ownerId: userId,
      weekNumber: week.weekNumber,
      label: week.label,
      shortLabel: week.shortLabel || `Week ${week.weekNumber}`,
      dateRange: week.dateRange || '',
      status: week.status,
      quarter: week.quarter || 'q4',
      retrospectiveNote: week.retrospectiveNote || '',
      closedBy: week.closedBy || '',
      syncAgo: week.syncAgo || '',
      reviewers: week.reviewers || '',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'weeks', week.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeWeeks(
  userId: string,
  onUpdate: (weeks: SprintWeek[]) => void
): Unsubscribe {
  const q = query(collection(db, 'weeks'), where('ownerId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: SprintWeek[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: data.id,
          weekNumber: data.weekNumber,
          label: data.label,
          shortLabel: data.shortLabel,
          dateRange: data.dateRange,
          status: data.status,
          quarter: data.quarter,
          retrospectiveNote: data.retrospectiveNote,
          closedBy: data.closedBy,
          syncAgo: data.syncAgo,
          reviewers: data.reviewers
        });
      });
      if (items.length > 0) {
        // Sort descending by weekNumber
        items.sort((a, b) => b.weekNumber - a.weekNumber);
        onUpdate(items);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'weeks');
    }
  );
}

// Blockers Firestore Operations
export async function saveBlockerToFirestore(
  blocker: BlockerIncident,
  userId: string
): Promise<void> {
  const path = `blockers/${blocker.id}`;
  try {
    const payload = {
      id: blocker.id,
      ownerId: userId,
      taskId: blocker.taskId || '',
      title: blocker.title,
      severity: blocker.severity,
      severityLabel: blocker.severityLabel || '',
      daysStalled: blocker.daysStalled || '',
      taskRef: blocker.taskRef || '',
      rootCauseType: blocker.rootCauseType || '',
      rootCauseDetail: blocker.rootCauseDetail,
      requester: blocker.requester || '',
      escalatedTo: blocker.escalatedTo,
      lastUpdated: blocker.lastUpdated || 'Just now',
      clearanceDuration: blocker.clearanceDuration || '',
      isResolved: Boolean(blocker.isResolved),
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'blockers', blocker.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeBlockers(
  userId: string,
  onUpdate: (blockers: BlockerIncident[]) => void
): Unsubscribe {
  const q = query(collection(db, 'blockers'), where('ownerId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: BlockerIncident[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: data.id,
          taskId: data.taskId,
          title: data.title,
          severity: data.severity,
          severityLabel: data.severityLabel,
          daysStalled: data.daysStalled,
          taskRef: data.taskRef,
          rootCauseType: data.rootCauseType,
          rootCauseDetail: data.rootCauseDetail,
          requester: data.requester,
          escalatedTo: data.escalatedTo,
          lastUpdated: data.lastUpdated,
          clearanceDuration: data.clearanceDuration,
          isResolved: data.isResolved
        });
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'blockers');
    }
  );
}

// Reports Firestore Operations
export async function saveReportToFirestore(
  report: GeneratedReportHistory,
  userId: string
): Promise<void> {
  const path = `reports/${report.id}`;
  try {
    const payload = {
      id: report.id,
      ownerId: userId,
      title: report.title,
      timestamp: report.timestamp || '',
      toneBadge: report.toneBadge || '',
      itemCount: report.itemCount || 0,
      wordCount: report.wordCount || 0,
      content: report.content,
      preview: report.preview || '',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'reports', report.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeReports(
  userId: string,
  onUpdate: (reports: GeneratedReportHistory[]) => void
): Unsubscribe {
  const q = query(collection(db, 'reports'), where('ownerId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: GeneratedReportHistory[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: data.id,
          title: data.title,
          timestamp: data.timestamp,
          toneBadge: data.toneBadge,
          itemCount: data.itemCount,
          wordCount: data.wordCount,
          content: data.content,
          preview: data.preview
        });
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'reports');
    }
  );
}

// User Profile creation / update
export async function ensureUserProfile(user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null }) {
  const path = `users/${user.uid}`;
  try {
    await setDoc(doc(db, 'users', user.uid), {
      userId: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Solo Workspace',
      photoURL: user.photoURL || '',
      createdAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Sync local items to Firestore upon first login
export async function syncInitialDataIfEmpty(
  userId: string,
  localTasks: TaskItem[],
  localWeeks: SprintWeek[],
  localBlockers: BlockerIncident[]
) {
  try {
    const tasksSnapshot = await getDocs(
      query(collection(db, 'tasks'), where('ownerId', '==', userId))
    );
    if (tasksSnapshot.empty && localTasks.length > 0) {
      for (const task of localTasks) {
        await saveTaskToFirestore(task, userId);
      }
    }

    const weeksSnapshot = await getDocs(
      query(collection(db, 'weeks'), where('ownerId', '==', userId))
    );
    if (weeksSnapshot.empty && localWeeks.length > 0) {
      for (const week of localWeeks) {
        await saveWeekToFirestore(week, userId);
      }
    }

    const blockersSnapshot = await getDocs(
      query(collection(db, 'blockers'), where('ownerId', '==', userId))
    );
    if (blockersSnapshot.empty && localBlockers.length > 0) {
      for (const blocker of localBlockers) {
        await saveBlockerToFirestore(blocker, userId);
      }
    }
  } catch (error) {
    console.warn('Initial data sync to Firestore warning:', error);
  }
}
