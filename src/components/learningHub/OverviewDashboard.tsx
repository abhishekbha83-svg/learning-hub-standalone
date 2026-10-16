import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  ArrowRight,
  Flame,
  Clock,
  BookOpen,
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
  Wrench,
  HelpCircle,
  TrendingUp,
  Youtube,
  Search,
  ExternalLink,
  Edit2,
  Award,
  Bookmark,
  Compass,
  Check,
  ChevronRight,
  X,
  Target,
  BarChart3
} from 'lucide-react';
import { LearningCourse, LearningHubTab, PlannerTask, SyllabusTopic } from '../../types/learningHub';
import { learningHubService } from '../../services/learningHubService';
import { getStoredTotalSeconds } from '../../services/learnerProfileService';

interface OverviewDashboardProps {
  onSelectTab: (tab: LearningHubTab) => void;
  onOpenCourse: (courseId: string) => void;
  onQuickImport: (url: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onSelectTab,
  onOpenCourse,
  onQuickImport
}) => {
  const [courses, setCourses] = useState<LearningCourse[]>(() => learningHubService.getCourses());
  const [activeCourse, setActiveCourse] = useState<LearningCourse | null>(null);
  const [todayTasks, setTodayTasks] = useState<PlannerTask[]>([]);
  const [urlInput, setUrlInput] = useState<string>('');
  const [userSettings, setUserSettings] = useState(() => learningHubService.getUserSettings());
  const [isEditingExam, setIsEditingExam] = useState(false);
  const [examNameInput, setExamNameInput] = useState(userSettings.targetExamName);
  const [examDateInput, setExamDateInput] = useState(userSettings.targetExamDate);

  // Active exam syllabus status
  const [activeSyllabusExam] = useState(() => {
    const examId = learningHubService.getActiveExamId();
    const tracks = learningHubService.getSyllabusTracks();
    return tracks.find((t) => t.id === examId) || tracks[0] || null;
  });

  // Daily activity log and streaks
  const streakInfo = learningHubService.getStudyStreak();
  const dailyLogs = learningHubService.getDailyLogs();

  const totalStudySeconds = getStoredTotalSeconds();
  const totalStudyHours = (totalStudySeconds / 3600).toFixed(1);

  const totalLecturesCount = courses.reduce((acc, c) => acc + (c.lectures?.length || 0), 0);
  const totalCompletedLectures = courses.reduce(
    (acc, c) => acc + (c.completedLecturesCount || 0),
    0
  );
  const overallCourseRate = totalLecturesCount > 0
    ? Math.round((totalCompletedLectures / totalLecturesCount) * 100)
    : 0;

  useEffect(() => {
    const list = learningHubService.getCourses();
    setCourses(list);
    const activeId = learningHubService.getActiveCourseId();
    if (activeId) {
      const found = list.find((c) => c.id === activeId);
      setActiveCourse(found || list[0] || null);
    } else if (list.length > 0) {
      setActiveCourse(list[0]);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const tasks = learningHubService.getTasks(todayStr);
    setTodayTasks(tasks);
  }, []);

  // Compute countdown to target exam
  const countdown = useMemo(() => {
    if (!userSettings.targetExamDate) return { days: 0, hours: 0, minutes: 0 };
    const target = new Date(userSettings.targetExamDate).getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes };
  }, [userSettings.targetExamDate]);

  // Compute syllabus progress for active exam
  const syllabusProgress = useMemo(() => {
    if (!activeSyllabusExam) return { total: 0, completed: 0, percentage: 0 };
    let total = 0;
    let completed = 0;
    activeSyllabusExam.subjects.forEach((s) => {
      s.chapters.forEach((c) => {
        c.topics.forEach((t) => {
          total++;
          if (t.status === 'completed') completed++;
        });
      });
    });
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [activeSyllabusExam]);

  // Bookmarked / Revision Required topics from active exam
  const priorityTopics = useMemo(() => {
    if (!activeSyllabusExam) return [];
    const list: { topic: SyllabusTopic; chapterName: string; subjectName: string }[] = [];
    activeSyllabusExam.subjects.forEach((s) => {
      s.chapters.forEach((c) => {
        c.topics.forEach((t) => {
          if (t.isBookmarked || t.status === 'revision_required' || t.isDifficult) {
            list.push({ topic: t, chapterName: c.name, subjectName: s.name });
          }
        });
      });
    });
    return list.slice(0, 4);
  }, [activeSyllabusExam]);

  // 365 Days Heatmap Calculation
  const heatmapData = useMemo(() => {
    const cells: { dateStr: string; intensity: number; minutes: number }[] = [];
    const today = new Date();
    // 52 weeks = ~364 days
    for (let i = 250; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const str = d.toISOString().split('T')[0];
      const log = dailyLogs[str];
      let intensity = 0;
      const mins = log?.minutes || 0;
      if (mins > 60) intensity = 4;
      else if (mins > 30) intensity = 3;
      else if (mins > 15) intensity = 2;
      else if (mins > 0 || log?.sessionsCount) intensity = 1;

      cells.push({ dateStr: str, intensity, minutes: mins });
    }
    return cells;
  }, [dailyLogs]);

  const handleSaveExamGoal = () => {
    learningHubService.saveUserSettings({
      targetExamName: examNameInput.trim() || 'Competitive Exam',
      targetExamDate: examDateInput || '2026-05-01'
    });
    setUserSettings(learningHubService.getUserSettings());
    setIsEditingExam(false);
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onQuickImport(urlInput.trim());
  };

  const handleToggleTask = (taskId: string) => {
    learningHubService.toggleTaskStatus(taskId);
    const todayStr = new Date().toISOString().split('T')[0];
    setTodayTasks(learningHubService.getTasks(todayStr));
  };

  return (
    <div className="space-y-8 pb-20 text-slate-100 max-w-6xl mx-auto">
      {/* 1. Hero Conversion Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#141418] to-[#0D0D0F] border border-white/10 p-6 sm:p-10 lg:p-12 text-center shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-500/10 blur-[90px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Structured YouTube Learning Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Turn <span className="text-red-500 inline-flex items-center gap-1.5"><Youtube className="w-8 h-8 sm:w-12 sm:h-12 inline fill-red-500 text-white" /> YouTube</span> into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              structured courses.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Paste any playlist URL to get distraction-free lectures, automated chapter tracking, timestamped notes, and an integrated study timetable.
          </p>

          {/* Quick Input Bar */}
          <form
            onSubmit={handleHeroSubmit}
            className="flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto p-1.5 bg-[#181820] border border-white/15 rounded-2xl shadow-2xl focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all"
          >
            <div className="flex items-center gap-2.5 px-3 w-full">
              <Youtube className="w-5 h-5 text-red-500 shrink-0" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste YouTube playlist or video URL here..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Convert Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Curated Paths Link */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-1">
            <span>Or start with</span>
            <button
              onClick={() => onSelectTab('explore')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 cursor-pointer underline underline-offset-4"
            >
              <span>free curated curriculum paths</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-slate-600">·</span>
            <span>JEE, NEET, UPSC, & Web Development</span>
          </div>
        </div>
      </section>

      {/* 2. Top Analytics Metrics Grid matching Screenshot 2 */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Courses Enrolled */}
        <div className="p-5 rounded-2xl bg-[#141418] border border-white/10 space-y-1.5 hover:border-emerald-500/30 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Courses Enrolled</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{courses.length}</div>
          <span className="text-[11px] text-slate-400">{courses.length} active playlists</span>
        </div>

        {/* Metric 2: Videos Mastered */}
        <div className="p-5 rounded-2xl bg-[#141418] border border-white/10 space-y-1.5 hover:border-blue-500/30 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Videos Mastered</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{totalCompletedLectures}</div>
          <span className="text-[11px] text-slate-400">Out of {totalLecturesCount} total videos</span>
        </div>

        {/* Metric 3: Genuine Study Time */}
        <div className="p-5 rounded-2xl bg-[#141418] border border-white/10 space-y-1.5 hover:border-amber-500/30 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Verified Study Time</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{totalStudyHours}h</div>
          <span className="text-[11px] text-slate-400">Calculated from lectures finished</span>
        </div>

        {/* Metric 4: Overall Course Completion Rate */}
        <div className="p-5 rounded-2xl bg-[#141418] border border-white/10 space-y-1.5 hover:border-purple-500/30 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Completion Rate</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400">{overallCourseRate}%</div>
          <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${overallCourseRate}%` }}
            />
          </div>
        </div>
      </section>

      {/* 3. Study Streak & Target Exam Milestone Banner matching Screenshot 1 & 2 */}
      <section className="p-5 sm:p-6 rounded-3xl bg-[#141418] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold border border-amber-500/30">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{streakInfo.streakDays} Day Streak · Active Today</span>
            </div>
            <button
              onClick={() => setIsEditingExam(!isEditingExam)}
              className="text-slate-400 hover:text-white p-1 rounded-md text-xs cursor-pointer"
              title="Edit Target Exam"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {isEditingExam ? (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <input
                type="text"
                value={examNameInput}
                onChange={(e) => setExamNameInput(e.target.value)}
                placeholder="Target Exam (e.g. JEE Main 2026)"
                className="px-3 py-1.5 bg-[#181820] border border-white/10 rounded-xl text-xs text-white"
              />
              <input
                type="date"
                value={examDateInput}
                onChange={(e) => setExamDateInput(e.target.value)}
                className="px-3 py-1.5 bg-[#181820] border border-white/10 rounded-xl text-xs text-white"
              />
              <button
                onClick={handleSaveExamGoal}
                className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-bold"
              >
                Save Milestone
              </button>
            </div>
          ) : (
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {userSettings.targetExamName}
            </h2>
          )}

          <p className="text-xs text-slate-400">
            Target Date: <strong className="text-slate-300">{userSettings.targetExamDate}</strong> · Systematic chapter revision countdown active.
          </p>
        </div>

        {/* Countdown Digits */}
        <div className="flex items-center gap-3 bg-[#181820] px-5 py-3 rounded-2xl border border-white/5 shrink-0">
          <div className="text-center">
            <span className="text-2xl font-black text-amber-400 tabular-nums">{countdown.days}</span>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Days</p>
          </div>
          <span className="text-slate-600 font-light text-xl">:</span>
          <div className="text-center">
            <span className="text-2xl font-black text-white tabular-nums">{countdown.hours}</span>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Hours</p>
          </div>
          <span className="text-slate-600 font-light text-xl">:</span>
          <div className="text-center">
            <span className="text-2xl font-black text-emerald-400 tabular-nums">{countdown.minutes}</span>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Mins</p>
          </div>
        </div>
      </section>

      {/* 4. Study Activity Heatmap & Today's Daily Planner matching Screenshot 3 */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 365 Days Activity Heatmap (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#141418] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Flame className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Study Activity</h3>
                <span className="text-[10px] text-slate-400">{Object.keys(dailyLogs).length} active study sessions logged</span>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
              Last 365 Days
            </span>
          </div>

          {/* Month Labels */}
          <div className="flex justify-between text-[10px] text-slate-500 font-medium px-1">
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
            <span>Sep</span>
            <span>Nov</span>
            <span>Today</span>
          </div>

          {/* Heatmap Grid (Compact CSS Grid) */}
          <div className="overflow-x-auto pb-1 custom-scrollbar">
            <div className="grid grid-rows-7 grid-flow-col gap-1 w-full min-w-[500px]">
              {heatmapData.map((cell) => {
                let cellColor = 'bg-[#181820]';
                if (cell.intensity === 1) cellColor = 'bg-emerald-950/70 border border-emerald-900/40';
                if (cell.intensity === 2) cellColor = 'bg-emerald-800 text-white';
                if (cell.intensity === 3) cellColor = 'bg-emerald-600 text-white';
                if (cell.intensity === 4) cellColor = 'bg-emerald-400 shadow-sm shadow-emerald-400/50';

                return (
                  <div
                    key={cell.dateStr}
                    title={`${cell.dateStr}: ${cell.minutes} minutes study activity`}
                    className={`w-2.5 h-2.5 rounded-[2px] transition-all duration-150 hover:scale-125 cursor-pointer ${cellColor}`}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span>Genuine active timestamps</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#181820]" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-900" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-700" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400" />
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Daily Planner Card matching Screenshot 3 */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#141418] border border-white/10 space-y-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Daily Planner</h3>
                  <span className="text-[10px] text-slate-400">
                    {new Date().toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {todayTasks.filter((t) => t.status === 'Done').length} / {todayTasks.length} Done
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Organize syllabus targets, video lectures, and active recall revision sessions.
            </p>

            {/* Incomplete Tasks Preview */}
            <div className="space-y-2 pt-1">
              {todayTasks.length > 0 ? (
                todayTasks.slice(0, 3).map((task) => {
                  const isDone = task.status === 'Done';
                  return (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#181820] border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <button
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-500 group-hover:border-emerald-400'
                          }`}
                        >
                          {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        <span className={`text-xs truncate ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </span>
                      </div>
                      {task.timeSlot && (
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">{task.timeSlot}</span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-4 text-center text-xs text-slate-400 bg-[#181820] rounded-xl border border-white/5">
                  No tasks set for today.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onSelectTab('planner')}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Open Daily Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 5. Competitive Exam Syllabus Tracker Callout matching Screenshot 1 */}
      {activeSyllabusExam && (
        <section className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/30 via-[#141418] to-teal-950/20 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/20">
              <Layers className="w-3 h-3" />
              <span>Official Syllabus Tracker</span>
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {activeSyllabusExam.name} Preparation Tracker
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Track {activeSyllabusExam.fullName} with verified chapter weightages, revision counts, and active recall bookmarks.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-lg font-black text-emerald-400">{syllabusProgress.percentage}%</span>
              <p className="text-[10px] text-slate-400">
                {syllabusProgress.completed}/{syllabusProgress.total} Topics Done
              </p>
            </div>

            <button
              onClick={() => onSelectTab('syllabus')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Track Syllabus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 6. Continue Learning Card (Active Video Course) */}
      {activeCourse && (
        <section className="p-6 rounded-3xl bg-[#141418] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-bold text-base text-white">Continue Learning</h3>
            </div>
            <button
              onClick={() => onSelectTab('courses')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Courses ({courses.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#181820] p-4 rounded-2xl border border-white/5">
            <div className="relative w-full sm:w-48 h-28 rounded-xl overflow-hidden bg-black shrink-0">
              <img
                src={activeCourse.thumbnailUrl}
                alt={activeCourse.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button
                  onClick={() => onOpenCourse(activeCourse.id)}
                  className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {activeCourse.examCategory || 'Curriculum'}
                </span>
                <span className="text-xs text-slate-400">{activeCourse.channelName}</span>
              </div>

              <h4 className="font-extrabold text-sm text-white line-clamp-1">{activeCourse.title}</h4>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{activeCourse.completedLecturesCount || 0} of {activeCourse.lectures?.length || 0} lectures watched</span>
                  <span className="font-bold text-emerald-400">{activeCourse.progressPercentage || 0}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: `${activeCourse.progressPercentage || 0}%` }}
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => onOpenCourse(activeCourse.id)}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Resume Player</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. Quick Study Tools matching Screenshot 1 */}
      <section className="space-y-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-base font-extrabold text-white">Quick Study Tools</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onSelectTab('planner')}
            className="p-5 rounded-2xl bg-[#141418] border border-white/10 hover:border-emerald-500/40 hover:bg-[#181820] transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Daily Study Planner</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Organize study sessions, timetable slots, and track completion rate.
              </p>
            </div>
          </div>

          <div
            onClick={() => onSelectTab('ai-center')}
            className="p-5 rounded-2xl bg-[#141418] border border-white/10 hover:border-purple-500/40 hover:bg-[#181820] transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">AI Tutor & Quizzes</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant concept explanations, deep summaries, and adaptive MCQs.
              </p>
            </div>
          </div>

          <div
            onClick={() => onSelectTab('syllabus')}
            className="p-5 rounded-2xl bg-[#141418] border border-white/10 hover:border-emerald-500/40 hover:bg-[#181820] transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Syllabus Directory</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Browse verified exam trackers across 14+ Indian entrance tests.
              </p>
            </div>
          </div>

          <div
            onClick={() => onSelectTab('explore')}
            className="p-5 rounded-2xl bg-[#141418] border border-white/10 hover:border-amber-500/40 hover:bg-[#181820] transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Explore Courses</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-yield structured curated playlists for JEE, NEET, and coding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7b. Academic Certificates Showcase Banner */}
      <section className="p-6 rounded-3xl bg-gradient-to-r from-[#141418] via-[#171720] to-[#141418] border border-emerald-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Verified Academic Certificates</h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                VERIFIED CREDENTIALS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Earn verifiable milestone credentials at 25%, 50%, 75%, and 100% course completion with online verification.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectTab('certificates')}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-auto"
        >
          <span>Open Certificate Center</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* 8. Milestone Badges Showcase matching Screenshot 1 */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-extrabold text-white">Milestone Badges</h3>
          </div>
          <button
            onClick={() => onSelectTab('analytics')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
          >
            View all badges →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {learningHubService.getAchievements().slice(0, 4).map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                ach.unlocked
                  ? 'bg-[#141418] border-emerald-500/30 shadow-md shadow-emerald-950/20'
                  : 'bg-[#141418]/60 border-white/5 opacity-70'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  ach.unlocked
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-white/5 text-slate-600'
                }`}
              >
                <Award className="w-5 h-5" />
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs text-white truncate">{ach.title}</h4>
                  {ach.unlocked && (
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-tight line-clamp-2">
                  {ach.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
