import React, { useState, useEffect } from 'react';
import { TaskItem, TaskStatus } from '../../types';
import { X, AlertCircle } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    id?: string;
    jobName: string;
    requester: string;
    status: TaskStatus;
    issue: string;
    tag?: string;
  }) => void;
  taskToEdit?: TaskItem | null;
  themeColor: 'green' | 'indigo';
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  themeColor,
}) => {
  const [jobName, setJobName] = useState('');
  const [requester, setRequester] = useState('');
  const [status, setStatus] = useState<TaskStatus>('In Progress');
  const [issue, setIssue] = useState('');
  const [tag, setTag] = useState('');
  const [errors, setErrors] = useState<{ jobName?: boolean; requester?: boolean }>({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setJobName(taskToEdit.jobName);
      setRequester(taskToEdit.requester);
      setStatus(taskToEdit.status);
      setIssue(taskToEdit.issue || '');
      setTag(taskToEdit.tag || '');
    } else {
      setJobName('');
      setRequester('');
      setStatus('In Progress');
      setIssue('');
      setTag('');
    }
    setErrors({});
    setErrorMessage('');
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { jobName?: boolean; requester?: boolean } = {};

    if (!jobName.trim()) {
      newErrors.jobName = true;
    }
    if (!requester.trim()) {
      newErrors.requester = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessage('Please enter both Job Name and Requester before saving.');
      return;
    }

    onSave({
      id: taskToEdit?.id,
      jobName: jobName.trim(),
      requester: requester.trim(),
      status,
      issue: issue.trim(),
      tag: tag.trim() || undefined
    });
    onClose();
  };

  const primaryBtnClass =
    themeColor === 'indigo'
      ? 'bg-[#4f46e5] text-white hover:bg-[#4338ca]'
      : 'bg-[#218300] text-white hover:bg-[#186700]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-[#e5e1e7] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f6f2f8] border-b border-[#e5e1e7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                themeColor === 'indigo' ? 'bg-[#4f46e5]' : 'bg-[#218300]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">assignment</span>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#1c1b1f]">
                {taskToEdit ? 'Edit Deliverable' : 'Add New Deliverable'}
              </h3>
              <p className="text-[11px] text-[#404a3a]">
                Fill in task parameters to update your WIP tracking
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center gap-2 text-[12px] font-medium border border-[#ffdad6]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Job / Deliverable Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-semibold text-[#1c1b1f]" htmlFor="jobName">
              Job / Mockup Name <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              id="jobName"
              type="text"
              value={jobName}
              onChange={(e) => {
                setJobName(e.target.value);
                if (errors.jobName) setErrors((prev) => ({ ...prev, jobName: false }));
              }}
              placeholder="e.g. Homepage Mockup - Sales Redesign"
              className={`w-full px-3 py-2 rounded-lg bg-[#fcf8fe] text-[13px] text-[#1c1b1f] placeholder-[#404a3a]/60 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#218300] border shadow-xs transition-all ${
                errors.jobName
                  ? 'border-[#ba1a1a] ring-1 ring-[#ba1a1a]'
                  : 'border-[#e5e1e7]'
              }`}
              autoFocus
            />
          </div>

          {/* Requester Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-semibold text-[#1c1b1f]" htmlFor="requester">
              Requester & Stakeholder <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              id="requester"
              type="text"
              value={requester}
              onChange={(e) => {
                setRequester(e.target.value);
                if (errors.requester) setErrors((prev) => ({ ...prev, requester: false }));
              }}
              placeholder="e.g. Sarah Chen (Head of Sales)"
              className={`w-full px-3 py-2 rounded-lg bg-[#fcf8fe] text-[13px] text-[#1c1b1f] placeholder-[#404a3a]/60 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#218300] border shadow-xs transition-all ${
                errors.requester
                  ? 'border-[#ba1a1a] ring-1 ring-[#ba1a1a]'
                  : 'border-[#e5e1e7]'
              }`}
            />
          </div>

          {/* Status & Optional Task Tag Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-semibold text-[#1c1b1f]" htmlFor="status">
                Current Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 rounded-lg bg-[#fcf8fe] text-[13px] text-[#1c1b1f] border border-[#e5e1e7] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#218300] shadow-xs cursor-pointer"
              >
                <option value="In Progress">⚡ In Progress</option>
                <option value="Completed">✅ Completed</option>
                <option value="Blocked">⏳ Pending</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-semibold text-[#1c1b1f]" htmlFor="tag">
                Task Reference Tag (Optional)
              </label>
              <input
                id="tag"
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. PROD-102 or UX-504"
                className="w-full px-3 py-2 rounded-lg bg-[#fcf8fe] text-[13px] text-[#1c1b1f] placeholder-[#404a3a]/60 border border-[#e5e1e7] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#218300] shadow-xs"
              />
            </div>
          </div>

          {/* Issues / Pending Note */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-[#1c1b1f]" htmlFor="issues">
                Issues & Pending Note
              </label>
              <span
                className={`text-[11px] font-medium ${
                  status === 'Blocked' || status === 'Pending' ? 'text-amber-800' : 'text-[#404a3a]'
                }`}
              >
                {status === 'Blocked' || status === 'Pending' ? 'Recommended - Explain pending reason' : 'Optional'}
              </span>
            </div>
            <textarea
              id="issues"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Detail any pending dependencies, waiting reviews, or missing assets..."
              rows={3}
              className={`w-full px-3 py-2 rounded-lg bg-[#fcf8fe] text-[13px] text-[#1c1b1f] placeholder-[#404a3a]/60 border focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#218300] shadow-xs resize-none ${
                status === 'Blocked' ? 'border-[#ffdad6] bg-[#ffdad6]/10' : 'border-[#e5e1e7]'
              }`}
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 mt-2 pt-4 border-t border-[#e5e1e7]">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 rounded-xl bg-[#f6f2f8] hover:bg-[#ebe7ec] text-[#1c1b1f] text-[13px] font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-xl ${primaryBtnClass} text-[13px] font-semibold shadow-xs active:scale-[0.98] transition-all`}
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
