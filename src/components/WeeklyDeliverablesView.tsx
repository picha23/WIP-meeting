import React, { useState, useMemo } from 'react';
import { TaskItem, SprintWeek, TaskStatus } from '../types';
import {
  Calendar,
  Zap,
  Plus,
  Package,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowUpDown,
  Edit2,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface WeeklyDeliverablesViewProps {
  currentWeek: SprintWeek;
  allWeeks: SprintWeek[];
  tasks: TaskItem[];
  onSelectWeek: (weekId: string) => void;
  onAddTask: () => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (taskId: string) => void;
  onCycleStatus: (task: TaskItem) => void;
  onGenerateReport: () => void;
  themeColor: 'green' | 'indigo';
}

export const WeeklyDeliverablesView: React.FC<WeeklyDeliverablesViewProps> = ({
  currentWeek,
  allWeeks,
  tasks,
  onSelectWeek,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onCycleStatus,
  onGenerateReport,
  themeColor,
}) => {
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks belonging to current week
  const weekTasks = useMemo(() => {
    return tasks.filter((t) => t.weekId === currentWeek.id);
  }, [tasks, currentWeek.id]);

  // Metric counts
  const totalCount = weekTasks.length;
  const completedCount = weekTasks.filter((t) => t.status === 'Completed').length;
  const inProgressCount = weekTasks.filter((t) => t.status === 'In Progress').length;
  const blockedCount = weekTasks.filter((t) => t.status === 'Blocked').length;

  // Filter & Search
  const filteredTasks = useMemo(() => {
    return weekTasks.filter((task) => {
      if (filter !== 'all' && task.status !== filter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = task.jobName.toLowerCase().includes(q);
        const matchReq = task.requester.toLowerCase().includes(q);
        const matchIssue = (task.issue || '').toLowerCase().includes(q);
        return matchName || matchReq || matchIssue;
      }
      return true;
    });
  }, [weekTasks, filter, searchQuery]);

  const primaryBtnClass =
    themeColor === 'indigo'
      ? 'bg-[#4f46e5] hover:bg-[#4338ca] text-white'
      : 'bg-[#218300] hover:bg-[#186700] text-white';

  const primaryContainerClass =
    themeColor === 'indigo'
      ? 'bg-[#4f46e5] text-white'
      : 'bg-[#218300] text-white';

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header Action Ribbon */}
      <div className="flex flex-col gap-5 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1c1b1f] tracking-tight">
                Active Work In Progress
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#ebe7ec] text-[#404a3a] font-mono text-[11px] font-semibold">
                {currentWeek.status === 'active' ? 'Sprint Active' : 'Sprint Closed'}
              </span>
            </div>
            <p className="text-[14px] text-[#404a3a]">
              Track deliverables, unblock team dependencies, and export formatted standup digests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Week Selector Dropdown */}
            <div className="relative inline-flex items-center bg-white border border-[#e5e1e7] rounded-xl shadow-xs px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#218300] min-w-[260px]">
              <Calendar className="w-4 h-4 text-[#186700] mr-2 shrink-0" />
              <select
                value={currentWeek.id}
                onChange={(e) => onSelectWeek(e.target.value)}
                className="w-full bg-transparent text-[13px] font-medium text-[#1c1b1f] focus:outline-none cursor-pointer py-1"
                aria-label="Sprint Week"
              >
                {allWeeks.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Report Button */}
            <button
              onClick={onGenerateReport}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#006e4b] hover:bg-[#005236] text-white text-[13px] font-semibold shadow-xs active:scale-[0.98] transition-all"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>⚡ Generate WIP Text Report</span>
            </button>

            {/* Add New Task Button */}
            <button
              onClick={onAddTask}
              type="button"
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl ${primaryBtnClass} text-[13px] font-semibold shadow-xs active:scale-[0.98] transition-all`}
            >
              <Plus className="w-4 h-4" />
              <span>Add New Task</span>
            </button>
          </div>
        </div>

        {/* Metric Counter Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Deliverables */}
          <div className="p-4 rounded-xl bg-white border border-[#e5e1e7] shadow-xs flex flex-col justify-between gap-1 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#404a3a]">
                Total Deliverables
              </span>
              <Package className="w-4 h-4 text-[#404a3a]" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl font-extrabold text-[#1c1b1f] font-mono tabular-nums">
                {totalCount}
              </span>
              <span className="text-[11px] text-[#404a3a]">registered</span>
            </div>
            <div className="w-full bg-[#e5e1e7] rounded-full h-1 mt-2 overflow-hidden">
              <div
                className="bg-[#3c6753] h-full transition-all duration-500 rounded-full"
                style={{ width: totalCount > 0 ? '100%' : '0%' }}
              />
            </div>
          </div>

          {/* In Progress */}
          <div className="p-4 rounded-xl bg-white border border-[#e5e1e7] shadow-xs flex flex-col justify-between gap-1 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#404a3a]">
                In Progress
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl font-extrabold text-[#1c1b1f] font-mono tabular-nums">
                {inProgressCount}
              </span>
              <span className="text-[11px] text-amber-700 font-medium">active tracking</span>
            </div>
            <div className="w-full bg-[#e5e1e7] rounded-full h-1 mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-500 rounded-full"
                style={{
                  width: totalCount > 0 ? `${Math.round((inProgressCount / totalCount) * 100)}%` : '0%'
                }}
              />
            </div>
          </div>

          {/* Completed */}
          <div className="p-4 rounded-xl bg-white border border-[#e5e1e7] shadow-xs flex flex-col justify-between gap-1 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#404a3a]">
                Completed
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#186700]" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl font-extrabold text-[#186700] font-mono tabular-nums">
                {completedCount}
              </span>
              <span className="text-[11px] text-[#186700] font-medium">ready to ship</span>
            </div>
            <div className="w-full bg-[#e5e1e7] rounded-full h-1 mt-2 overflow-hidden">
              <div
                className="bg-[#186700] h-full transition-all duration-500 rounded-full"
                style={{
                  width: totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}%` : '0%'
                }}
              />
            </div>
          </div>

          {/* Blocked & Risks */}
          <div className="p-4 rounded-xl bg-white border border-[#e5e1e7] shadow-xs flex flex-col justify-between gap-1 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ba1a1a]">
                Blocked & Risks
              </span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ba1a1a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ba1a1a]"></span>
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl font-extrabold text-[#ba1a1a] font-mono tabular-nums">
                {blockedCount}
              </span>
              <span className="text-[11px] text-[#ba1a1a] font-medium">requires action</span>
            </div>
            <div className="w-full bg-[#e5e1e7] rounded-full h-1 mt-2 overflow-hidden">
              <div
                className="bg-[#ba1a1a] h-full transition-all duration-500 rounded-full"
                style={{
                  width: totalCount > 0 ? `${Math.round((blockedCount / totalCount) * 100)}%` : '0%'
                }}
              />
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-[#e5e1e7] shadow-xs">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#404a3a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by Job Name, Requester, or Issue keywords..."
              className="w-full bg-[#f6f2f8] pl-9 pr-4 py-2 rounded-lg text-[13px] text-[#1c1b1f] placeholder-[#404a3a]/70 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#218300] transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <button
              onClick={() => setFilter('all')}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${
                filter === 'all'
                  ? primaryContainerClass
                  : 'text-[#404a3a] hover:bg-[#f0ecf2] font-medium'
              }`}
            >
              All Tasks ({totalCount})
            </button>
            <button
              onClick={() => setFilter('Completed')}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${
                filter === 'Completed'
                  ? primaryContainerClass
                  : 'text-[#404a3a] hover:bg-[#f0ecf2] font-medium'
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setFilter('In Progress')}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${
                filter === 'In Progress'
                  ? primaryContainerClass
                  : 'text-[#404a3a] hover:bg-[#f0ecf2] font-medium'
              }`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setFilter('Blocked')}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${
                filter === 'Blocked'
                  ? primaryContainerClass
                  : 'text-[#404a3a] hover:bg-[#f0ecf2] font-medium'
              }`}
            >
              Blocked ({blockedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Main Tasks Table Section */}
      <div className="bg-white rounded-xl border border-[#e5e1e7] shadow-xs overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#f6f2f8] text-[#404a3a] text-[11px] font-bold uppercase tracking-wider border-b border-[#e5e1e7]">
                <th className="py-3 px-4 sm:px-6">Job / Deliverable Name</th>
                <th className="py-3 px-4 sm:px-6">Requester</th>
                <th className="py-3 px-4 sm:px-6">Status</th>
                <th className="py-3 px-4 sm:px-6">Issues & Blockers Note</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e1e7] text-[13px]">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-[#fcf8fe] transition-colors group">
                  {/* Job Name */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <span className="font-bold text-[#1c1b1f] block leading-snug">
                      {task.jobName}
                    </span>
                    {task.tag && (
                      <span className="text-[11px] font-mono text-[#3c6753] mt-0.5 inline-block">
                        #{task.tag}
                      </span>
                    )}
                  </td>

                  {/* Requester */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <span className="font-medium text-[#1c1b1f]">{task.requester}</span>
                  </td>

                  {/* Status with Quick Toggle */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      {task.status === 'Completed' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#beedd3] text-[#005338]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#186700]" />
                          Completed
                        </span>
                      )}
                      {task.status === 'In Progress' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          In Progress
                        </span>
                      )}
                      {task.status === 'Blocked' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ffdad6] text-[#ba1a1a]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-pulse" />
                          Blocked
                        </span>
                      )}

                      {/* Quick Status Cycler Button */}
                      <button
                        onClick={() => onCycleStatus(task)}
                        type="button"
                        title="Click to cycle status (In Progress → Completed → Blocked)"
                        className="p-1 rounded text-[#404a3a]/60 hover:text-[#1c1b1f] hover:bg-[#f0ecf2] transition-colors"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Issues & Blockers Note */}
                  <td className="py-3.5 px-4 sm:px-6 max-w-xs md:max-w-md">
                    {task.status === 'Blocked' ? (
                      <div className="flex items-start gap-1.5 p-2 rounded-lg bg-[#ffdad6]/40 text-[#ba1a1a] border border-[#ffdad6]">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="text-[12px] font-medium leading-snug">
                          {task.issue || 'Blocker reported without note'}
                        </span>
                      </div>
                    ) : task.issue ? (
                      <span className="text-[#404a3a] text-[12px] leading-snug block">
                        {task.issue}
                      </span>
                    ) : (
                      <span className="text-[#404a3a]/40 italic text-[12px]">None</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEditTask(task)}
                        type="button"
                        title="Edit deliverable"
                        className="p-1.5 rounded-lg text-[#404a3a] hover:text-[#186700] hover:bg-[#f0ecf2] transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        type="button"
                        title="Delete deliverable"
                        className="p-1.5 rounded-lg text-[#404a3a] hover:text-[#ba1a1a] hover:bg-[#f0ecf2] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="p-12 sm:p-16 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#f6f2f8] text-[#404a3a] flex items-center justify-center mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-[18px] font-bold text-[#1c1b1f] mb-1">
              No tasks found for this view
            </h3>
            <p className="text-[13px] text-[#404a3a] max-w-md mb-6 leading-relaxed">
              {searchQuery || filter !== 'all'
                ? 'Your search or status filter returned zero tasks. Try changing the filter or search term.'
                : 'No tasks added for this week yet. Click below to register your first weekly deliverable.'}
            </p>
            <button
              onClick={onAddTask}
              type="button"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl ${primaryBtnClass} text-[13px] font-semibold shadow-xs active:scale-[0.98] transition-all`}
            >
              <Plus className="w-4 h-4" />
              <span>Add First Task</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
