import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit2,
  Tag,
  BookOpen,
  Filter,
  Check,
  AlertCircle,
  RefreshCw,
  Flame
} from 'lucide-react';
import { PlannerTask, TaskPriority, TaskStatus } from '../../types/learningHub';
import { learningHubService } from '../../services/learningHubService';

interface StudyPlannerProps {
  onOpenCourse?: (courseId: string) => void;
}

type PlannerViewMode = 'day' | 'week' | 'month' | 'year';

export const StudyPlanner: React.FC<StudyPlannerProps> = ({ onOpenCourse }) => {
  const [viewMode, setViewMode] = useState<PlannerViewMode>('day');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<PlannerTask[]>(() => learningHubService.getTasks());

  // Task creation/editing modal state
  const [showTaskModal, setShowTaskModal] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<PlannerTask | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [taskDate, setTaskDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [taskTimeSlot, setTaskTimeSlot] = useState<string>('07:00 - 08:30 AM');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('HIGH');
  const [taskExamTag, setTaskExamTag] = useState<string>('JEE');
  const [taskSubject, setTaskSubject] = useState<string>('Physics');
  const [plannerStatusFilter, setPlannerStatusFilter] = useState<'all' | 'todo' | 'done'>('all');
  const [plannerSearch, setPlannerSearch] = useState<string>('');

  // AI Plan Generator form state
  const [studyHoursAvailable, setStudyHoursAvailable] = useState<string>('6');
  const [topicsToCover, setTopicsToCover] = useState<string>('Rotational Motion, Chemical Bonding, Calculus Limits');
  const [syncCourseSchedule, setSyncCourseSchedule] = useState<boolean>(true);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [planMessage, setPlanMessage] = useState<string>('');

  // Proposed AI plan review & edit state
  const [proposedPlan, setProposedPlan] = useState<{
    targetExam?: string;
    strategyOverview?: string;
    tasks: PlannerTask[];
  } | null>(null);
  const [showPlanReviewModal, setShowPlanReviewModal] = useState<boolean>(false);
  const [selectedPlanTaskIds, setSelectedPlanTaskIds] = useState<Set<string>>(new Set());
  const [editingPlanTasks, setEditingPlanTasks] = useState<PlannerTask[]>([]);

  const todayStr = new Date().toISOString().split('T')[0];
  const currentDateStr = currentDate.toISOString().split('T')[0];

  const refreshTasks = () => {
    setTasks(learningHubService.getTasks());
  };

  // Filter tasks for active day or range
  const displayedTasks = tasks.filter((t) => {
    // Status filter
    if (plannerStatusFilter === 'todo' && t.status === 'Done') return false;
    if (plannerStatusFilter === 'done' && t.status !== 'Done') return false;

    // Search query
    if (plannerSearch.trim()) {
      const q = plannerSearch.toLowerCase().trim();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q) || false;
      const matchSub = t.subject?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchDesc && !matchSub) return false;
    }

    if (viewMode === 'day') return t.date === currentDateStr;
    if (viewMode === 'week') {
      // 7-day window
      const d = new Date(t.date).getTime();
      const curr = new Date(currentDateStr).getTime();
      const diff = Math.abs(d - curr) / (1000 * 60 * 60 * 24);
      return diff <= 3.5;
    }
    if (viewMode === 'month') {
      const [tYear, tMonth] = t.date.split('-').map(Number);
      return tYear === currentDate.getFullYear() && (tMonth - 1) === currentDate.getMonth();
    }
    return true;
  });

  const todayAllTasks = tasks.filter((t) => t.date === todayStr);
  const todayDoneTasks = todayAllTasks.filter((t) => t.status === 'Done');
  const todayRate = todayAllTasks.length > 0 ? Math.round((todayDoneTasks.length / todayAllTasks.length) * 100) : 0;

  const handleToggleTask = (taskId: string) => {
    learningHubService.toggleTaskStatus(taskId);
    refreshTasks();
  };

  const handleDeleteTask = (taskId: string) => {
    learningHubService.deleteTask(taskId);
    refreshTasks();
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingTask) {
      const all = learningHubService.getTasks();
      const idx = all.findIndex((t) => t.id === editingTask.id);
      if (idx >= 0) {
        all[idx] = {
          ...editingTask,
          title: taskTitle.trim(),
          description: taskDescription.trim() || undefined,
          date: taskDate,
          timeSlot: taskTimeSlot.trim() || undefined,
          priority: taskPriority,
          examTag: taskExamTag,
          subject: taskSubject
        };
        learningHubService.saveTasks(all);
      }
    } else {
      learningHubService.addTask({
        title: taskTitle.trim(),
        description: taskDescription.trim() || undefined,
        date: taskDate,
        timeSlot: taskTimeSlot.trim() || undefined,
        priority: taskPriority,
        status: 'To Do',
        examTag: taskExamTag,
        subject: taskSubject
      });
    }

    refreshTasks();
    setShowTaskModal(false);
    setEditingTask(null);
    setTaskTitle('');
    setTaskDescription('');
  };

  const handleOpenEdit = (task: PlannerTask) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description || '');
    setTaskDate(task.date);
    setTaskTimeSlot(task.timeSlot || '07:00 - 08:30 AM');
    setTaskPriority(task.priority);
    setTaskExamTag(task.examTag || 'JEE');
    setTaskSubject(task.subject || 'Physics');
    setShowTaskModal(true);
  };

  const handleGenerateAIPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingPlan(true);
    setPlanMessage('');

    try {
      const res = await fetch('/api/learning-hub/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dailyHours: Number(studyHoursAvailable) || 6,
          topicFocus: topicsToCover,
          targetExam: taskExamTag || 'JEE Main',
          subjects: topicsToCover.split(',').map((s) => s.trim()).filter(Boolean),
          syllabusProgress: learningHubService.getSavedSyllabusOverrides(),
          existingTaskCount: tasks.length
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.plan?.tasks) {
        throw new Error(data.error || 'Failed to generate plan.');
      }
      setProposedPlan(data.plan);
      setEditingPlanTasks(data.plan.tasks);
      setSelectedPlanTaskIds(new Set(data.plan.tasks.map((t: PlannerTask) => t.id)));
      setShowPlanReviewModal(true);
      setPlanMessage(`AI generated ${data.plan.tasks.length} proposed study sessions. Review and approve below.`);
    } catch (err: any) {
      setPlanMessage(err.message || 'Failed to generate AI plan. Please check connection and retry.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleTogglePlanTaskSelection = (id: string) => {
    setSelectedPlanTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUpdatePlanTaskField = (id: string, field: keyof PlannerTask, value: any) => {
    setEditingPlanTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleRemovePlanTask = (id: string) => {
    setEditingPlanTasks((prev) => prev.filter((t) => t.id !== id));
    setSelectedPlanTaskIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleApprovePlan = () => {
    const approved = editingPlanTasks.filter((t) => selectedPlanTaskIds.has(t.id));
    if (approved.length === 0) {
      setPlanMessage('Please select at least one task to schedule.');
      return;
    }

    const existing = learningHubService.getTasks();
    const existingSignatures = new Set(
      existing.map((t) => `${t.date}::${t.title.trim().toLowerCase()}`)
    );
    const existingIds = new Set(existing.map((t) => t.id));

    // Prevent duplicate tasks and unintended overwrites
    const newUniqueTasks: PlannerTask[] = [];
    for (const t of approved) {
      const sig = `${t.date}::${t.title.trim().toLowerCase()}`;
      if (!existingSignatures.has(sig) && !existingIds.has(t.id)) {
        newUniqueTasks.push(t);
        existingSignatures.add(sig);
        existingIds.add(t.id);
      }
    }

    learningHubService.saveTasks([...newUniqueTasks, ...existing]);
    refreshTasks();
    setShowPlanReviewModal(false);
    const duplicatesSkipped = approved.length - newUniqueTasks.length;
    setPlanMessage(
      `Successfully scheduled ${newUniqueTasks.length} approved study sessions!${
        duplicatesSkipped > 0 ? ` (${duplicatesSkipped} duplicate sessions skipped)` : ''
      }`
    );
  };

  const navigateStep = (direction: -1 | 1) => {
    const next = new Date(currentDate);
    if (viewMode === 'month') {
      next.setMonth(next.getMonth() + direction);
    } else if (viewMode === 'week') {
      next.setDate(next.getDate() + direction * 7);
    } else {
      next.setDate(next.getDate() + direction);
    }
    setCurrentDate(next);
  };

  return (
    <div className="space-y-6 pb-16 text-slate-100">
      {/* Top Banner / Callout matching Reference Screenshot 6 */}
      <div className="p-4 rounded-2xl bg-[#141418] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Study Planner & Timetable Engine
            </h2>
            <p className="text-xs text-slate-400">
              Balanced daily study schedules, target exam milestones, and active lecture synchronizer.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setTaskTitle('');
            setTaskDescription('');
            setTaskDate(currentDateStr);
            setShowTaskModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Main 2-Column Planner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Calendar, Today's Progress, AI Generator (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Mini Calendar Card */}
          <div className="p-4 rounded-2xl bg-[#141418] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const d = new Date(currentDate);
                    d.setMonth(d.getMonth() - 1);
                    setCurrentDate(d);
                  }}
                  className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                  title="Previous month"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    const d = new Date(currentDate);
                    d.setMonth(d.getMonth() + 1);
                    setCurrentDate(d);
                  }}
                  className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                  title="Next month"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500 pb-1">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d, i) => (
                <div key={i}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {(() => {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const cells = [];

                for (let i = 0; i < firstDayIndex; i++) {
                  cells.push(<div key={`pad-${i}`} className="py-1.5" />);
                }

                for (let day = 1; day <= daysInMonth; day++) {
                  const dayDate = new Date(year, month, day);
                  const dateStr = dayDate.toISOString().split('T')[0];
                  const isSelected = currentDate.getDate() === day;
                  const isToday = todayStr === dateStr;
                  const dayTasks = tasks.filter((t) => t.date === dateStr);
                  const hasTasks = dayTasks.length > 0;
                  const allDone = hasTasks && dayTasks.every((t) => t.status === 'Done');

                  cells.push(
                    <button
                      key={day}
                      onClick={() => {
                        const d = new Date(year, month, day);
                        setCurrentDate(d);
                      }}
                      className={`relative py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                          : isToday
                          ? 'bg-white/10 text-emerald-400 font-bold'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{day}</span>
                      {hasTasks && (
                        <span
                          className={`w-1 h-1 rounded-full mt-0.5 ${
                            allDone ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                        />
                      )}
                    </button>
                  );
                }
                return cells;
              })()}
            </div>
          </div>

          {/* Today's Progress Widget matching Screenshot 6 */}
          <div className="p-4 rounded-2xl bg-[#141418] border border-white/10 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Today's Progress
            </span>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-[#1A1A20] rounded-xl border border-white/5">
                <span className="text-xl font-black text-white tabular-nums">{todayAllTasks.length}</span>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Total</p>
              </div>
              <div className="p-2 bg-[#1A1A20] rounded-xl border border-white/5">
                <span className="text-xl font-black text-emerald-400 tabular-nums">{todayDoneTasks.length}</span>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Done</p>
              </div>
              <div className="p-2 bg-[#1A1A20] rounded-xl border border-white/5">
                <span className="text-xl font-black text-amber-400 tabular-nums">{todayRate}%</span>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Rate</p>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  style={{ width: `${todayRate}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                {todayDoneTasks.length} of {todayAllTasks.length} tasks done today
              </p>
            </div>
          </div>

          {/* AI Generator Widget matching Screenshot 7 */}
          <div className="p-4 rounded-2xl bg-[#141418] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Timetable Generator</span>
              </div>
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                AI Powered
              </span>
            </div>

            <form onSubmit={handleGenerateAIPlan} className="space-y-2.5 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Study hours available</label>
                <input
                  type="number"
                  value={studyHoursAvailable}
                  onChange={(e) => setStudyHoursAvailable(e.target.value)}
                  placeholder="e.g. 6"
                  className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Topics to cover</label>
                <textarea
                  value={topicsToCover}
                  onChange={(e) => setTopicsToCover(e.target.value)}
                  placeholder="e.g. JEE Physics Chap 6, NEET NCERT Botany..."
                  rows={2}
                  className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between py-1 text-slate-300">
                <span className="text-[11px]">Sync enrolled course lectures</span>
                <input
                  type="checkbox"
                  checked={syncCourseSchedule}
                  onChange={(e) => setSyncCourseSchedule(e.target.checked)}
                  className="rounded text-emerald-500 accent-emerald-500"
                />
              </div>

              {planMessage && (
                <p className="text-[11px] text-emerald-400 p-2 bg-emerald-500/10 rounded-lg">
                  {planMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isGeneratingPlan}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingPlan ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Scheduling Real Timetable...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate My Plan</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: View Switcher & Task List (8 cols) matching Screenshot 6 */}
        <div className="lg:col-span-8 space-y-4">
          {/* Header Bar */}
          <div className="flex flex-col gap-3 p-3 bg-[#141418] border border-white/10 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* View Modes */}
              <div className="flex items-center gap-1 bg-[#1A1A20] p-1 rounded-xl">
                {(['day', 'week', 'month', 'year'] as PlannerViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                      viewMode === mode
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Date Navigator */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateStep(-1)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/5 cursor-pointer"
                  title="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-center min-w-[140px]">
                  <span className="text-sm font-bold text-white block">
                    {viewMode === 'month'
                      ? currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })
                      : viewMode === 'week'
                      ? `Week of ${currentDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`
                      : currentDate.toLocaleDateString('default', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {displayedTasks.length} tasks · {displayedTasks.filter((t) => t.status === 'Done').length} completed
                  </span>
                </div>
                <button
                  onClick={() => navigateStep(1)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/5 cursor-pointer"
                  title="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-white/5">
              <div className="flex items-center gap-1 bg-[#1A1A20] p-0.5 rounded-xl">
                {(
                  [
                    { id: 'all', label: 'All Tasks' },
                    { id: 'todo', label: 'To Do' },
                    { id: 'done', label: 'Completed' }
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setPlannerStatusFilter(tab.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      plannerStatusFilter === tab.id
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 sm:max-w-xs">
                <input
                  type="text"
                  value={plannerSearch}
                  onChange={(e) => setPlannerSearch(e.target.value)}
                  placeholder="Filter tasks by topic, subject..."
                  className="w-full px-3 py-1 bg-[#181820] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Task Items List matching Screenshot 6 */}
          <div className="space-y-3">
            {displayedTasks.map((task) => {
              const isDone = task.status === 'Done';
              const isInProgress = task.status === 'In Progress';

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isDone
                      ? 'bg-[#141418]/60 border-white/5 opacity-75'
                      : 'bg-[#141418] border-white/10 hover:border-emerald-500/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-500 hover:border-emerald-400'
                        }`}
                      >
                        {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="space-y-1.5">
                        <h4 className={`text-sm font-bold text-white ${isDone ? 'line-through text-slate-400' : ''}`}>
                          {task.title}
                        </h4>

                        {/* Metadata Pills matching Screenshot 6 */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          {/* Status Tag */}
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                              isDone
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : isInProgress
                                ? 'bg-amber-500/15 text-amber-400'
                                : 'bg-slate-500/15 text-slate-400'
                            }`}
                          >
                            • {task.status}
                          </span>

                          {/* Priority Tag */}
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                              task.priority === 'HIGH'
                                ? 'bg-red-500/15 text-red-400'
                                : task.priority === 'MEDIUM'
                                ? 'bg-amber-500/15 text-amber-400'
                                : 'bg-slate-500/15 text-slate-400'
                            }`}
                          >
                            {task.priority}
                          </span>

                          {/* Exam Tag */}
                          {task.examTag && (
                            <span className="px-2 py-0.5 rounded-full font-bold uppercase bg-purple-500/15 text-purple-400">
                              {task.examTag}
                            </span>
                          )}

                          {/* Time Slot */}
                          {task.timeSlot && (
                            <span className="text-slate-400 font-mono inline-flex items-center gap-1 ml-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{task.timeSlot}</span>
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-xs text-slate-400 pt-0.5">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(task)}
                        className="p-1.5 text-slate-500 hover:text-white rounded hover:bg-white/5 cursor-pointer"
                        title="Edit Task"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-white/5 cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {displayedTasks.length === 0 && (
              <div className="py-16 text-center text-slate-400 p-8 rounded-2xl bg-[#141418] border border-dashed border-white/10 space-y-3">
                <CalendarIcon className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-sm font-semibold text-white">No tasks scheduled for this day</h4>
                <p className="text-xs max-w-sm mx-auto">
                  Add custom revision tasks, DPP practice slots, or use the AI generator to map out your full week.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Creation / Edit Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveTask}
            className="bg-[#141418] border border-white/15 max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-bold text-base text-white">
                {editingTask ? 'Edit Task' : 'Add New Study Task'}
              </h3>
              <button
                type="button"
                onClick={() => setShowTaskModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. JEE Physics — Rotational Motion (Lec 4/12)"
                  className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Notes / Batch Details</label>
                <input
                  type="text"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="e.g. PW Arjuna batch · Focus on MOI derivations"
                  className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Date</label>
                  <input
                    type="date"
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Time Slot</label>
                  <input
                    type="text"
                    value={taskTimeSlot}
                    onChange={(e) => setTaskTimeSlot(e.target.value)}
                    placeholder="07:00 - 08:30 AM"
                    className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Exam Tag</label>
                  <input
                    type="text"
                    value={taskExamTag}
                    onChange={(e) => setTaskExamTag(e.target.value)}
                    placeholder="JEE / NEET / Coding"
                    className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-all"
              >
                Save Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Proposed Plan Review & Approval Modal */}
      {showPlanReviewModal && proposedPlan && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-white/15 max-w-2xl w-full rounded-2xl p-6 space-y-4 max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Review AI Study Plan</h3>
                  <p className="text-[11px] text-slate-400">
                    Verify and customize the proposed schedule before adding to your timetable
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPlanReviewModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1 rounded-lg hover:bg-white/5"
              >
                ✕
              </button>
            </div>

            {/* Strategy Overview Banner */}
            {proposedPlan.strategyOverview && (
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-200 leading-relaxed shrink-0">
                <span className="font-bold text-purple-300 block mb-0.5">Strategy Plan:</span>
                {proposedPlan.strategyOverview}
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between text-xs text-slate-400 shrink-0 pt-1">
              <span>
                <strong className="text-white">{selectedPlanTaskIds.size}</strong> of {editingPlanTasks.length} sessions selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlanTaskIds(new Set(editingPlanTasks.map((t) => t.id)))}
                  className="text-[11px] text-purple-400 hover:underline cursor-pointer"
                >
                  Select All
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setSelectedPlanTaskIds(new Set())}
                  className="text-[11px] text-slate-400 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Editable Task List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
              {editingPlanTasks.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No proposed tasks remaining.
                </div>
              ) : (
                editingPlanTasks.map((task) => {
                  const isSelected = selectedPlanTaskIds.has(task.id);
                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${
                        isSelected
                          ? 'bg-[#1A1A20] border-purple-500/30'
                          : 'bg-[#141418] border-white/5 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleTogglePlanTaskSelection(task.id)}
                          className="mt-1 rounded text-purple-500 accent-purple-500 cursor-pointer"
                        />
                        <div className="flex-1 space-y-1.5">
                          <input
                            type="text"
                            value={task.title}
                            onChange={(e) => handleUpdatePlanTaskField(task.id, 'title', e.target.value)}
                            className="w-full bg-[#141418] border border-white/10 rounded-lg px-2.5 py-1 text-white font-medium text-xs focus:outline-none focus:border-purple-500"
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                            <div className="flex items-center gap-1 text-slate-400">
                              <CalendarIcon className="w-3 h-3 text-slate-500 shrink-0" />
                              <input
                                type="date"
                                value={task.date}
                                onChange={(e) => handleUpdatePlanTaskField(task.id, 'date', e.target.value)}
                                className="bg-transparent border-0 text-slate-300 focus:outline-none p-0 text-[11px]"
                              />
                            </div>
                            <div className="flex items-center gap-1 text-slate-400">
                              <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                              <input
                                type="text"
                                value={task.timeSlot || ''}
                                onChange={(e) => handleUpdatePlanTaskField(task.id, 'timeSlot', e.target.value)}
                                placeholder="Time slot"
                                className="bg-transparent border-0 text-slate-300 focus:outline-none p-0 text-[11px] w-full"
                              />
                            </div>
                            <div className="flex items-center gap-1 text-slate-400">
                              <span className="px-1.5 py-0.5 rounded bg-white/5 text-purple-300 text-[10px] font-bold">
                                {task.subject || 'Subject'}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-[10px] font-bold">
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemovePlanTask(task.id)}
                          className="text-slate-500 hover:text-red-400 p-1 rounded-lg transition-colors cursor-pointer"
                          title="Remove from plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setShowPlanReviewModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Discard Proposal
              </button>
              <button
                type="button"
                disabled={selectedPlanTaskIds.size === 0}
                onClick={handleApprovePlan}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-40 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Schedule ({selectedPlanTaskIds.size} Tasks)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
