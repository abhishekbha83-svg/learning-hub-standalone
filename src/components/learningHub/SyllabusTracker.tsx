import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Star,
  Bookmark,
  RotateCcw,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Filter,
  Check,
  Calendar,
  Layers,
  Sliders,
  Settings2,
  TrendingUp,
  Flame,
  Award,
  ExternalLink,
  Info,
  X,
  Target,
  FileText,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import {
  SyllabusExamTrack,
  SyllabusSubject,
  SyllabusChapter,
  SyllabusTopic,
  ExamSetupConfig
} from '../../types/learningHub';
import { learningHubService } from '../../services/learningHubService';

interface SyllabusTrackerProps {
  onBackToOverview?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

type TopicStatusFilter = 'all' | 'not_started' | 'in_progress' | 'completed' | 'revision_required' | 'bookmarked' | 'difficult';

export const SyllabusTracker: React.FC<SyllabusTrackerProps> = ({
  onBackToOverview,
  onNavigateToTab
}) => {
  // Service state
  const [examTracks, setExamTracks] = useState<SyllabusExamTrack[]>(() =>
    learningHubService.getSyllabusTracks()
  );
  const [bookmarkedExamIds, setBookmarkedExamIds] = useState<string[]>(() =>
    learningHubService.getBookmarkedExamIds()
  );

  // Active view state: directory | setup | tracker
  const [selectedExamId, setSelectedExamId] = useState<string | null>(() =>
    learningHubService.getActiveExamId()
  );
  const [isSettingUp, setIsSettingUp] = useState<boolean>(false);
  const [activeSetup, setActiveSetup] = useState<ExamSetupConfig | null>(null);

  // Directory filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyBookmarkedExams, setOnlyBookmarkedExams] = useState<boolean>(false);

  // Setup form state
  const [setupYear, setSetupYear] = useState<string>('2026');
  const [setupTargetDate, setSetupTargetDate] = useState<string>('');
  const [setupIsOfficialDate, setSetupIsOfficialDate] = useState<boolean>(false);
  const [setupDailyHours, setSetupDailyHours] = useState<number>(4);
  const [setupPrepMode, setSetupPrepMode] = useState<'Self Study' | 'Coaching'>('Self Study');
  const [setupTargetGoal, setSetupTargetGoal] = useState<string>('');
  const [setupVariantId, setSetupVariantId] = useState<string>('');
  const [setupStage, setSetupStage] = useState<string>('');

  // Tracker navigation & filter state
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [expandedChapterIds, setExpandedChapterIds] = useState<Set<string>>(new Set());
  const [chapterSearch, setChapterSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<TopicStatusFilter>('all');
  const [weightageFilter, setWeightageFilter] = useState<string>('all');

  // Confirmation modals & Toasts
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showReportIssue, setShowReportIssue] = useState<boolean>(false);
  const [reportIssueText, setReportIssueText] = useState<string>('');
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleScheduleTopic = (e: React.MouseEvent, topic: SyllabusTopic, chapterName: string) => {
    e.stopPropagation();
    if (!activeExam || !activeSubject) return;

    const res = learningHubService.scheduleTopicToPlanner(
      topic,
      chapterName,
      activeSubject.name,
      activeExam.name
    );

    if (res.isDuplicate) {
      showToast(`Topic is already scheduled in your daily planner today.`);
    } else {
      showToast(`Added to Daily Planner for today!`);
    }
  };

  // Countdown timer state
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  } | null>(null);

  const categories = [
    'All',
    'Engineering',
    'Medical',
    'Govt & Civil',
    'Commerce',
    'Defence & Law',
    'University'
  ];

  // Active exam model
  const activeExam = useMemo(() => {
    return examTracks.find((e) => e.id === selectedExamId) || null;
  }, [examTracks, selectedExamId]);

  // Load setup on selected exam change
  useEffect(() => {
    if (selectedExamId) {
      const existing = learningHubService.getExamSetup(selectedExamId);
      if (existing) {
        setActiveSetup(existing);
        setSetupYear(existing.targetYear || '2026');
        setSetupTargetDate(existing.targetDate || '');
        setSetupIsOfficialDate(!!existing.isOfficialDate);
        setSetupDailyHours(existing.dailyStudyHours || 4);
        setSetupPrepMode(existing.prepMode || 'Self Study');
        setSetupTargetGoal(existing.targetScoreOrGoal || '');
        setSetupVariantId(existing.variantId || '');
        setSetupStage(existing.selectedStage || '');
      } else {
        // Initialize default setup values for new exam
        const ex = examTracks.find((e) => e.id === selectedExamId);
        if (ex) {
          setSetupYear(ex.year || '2026');
          setSetupTargetDate(ex.officialExamDate || '');
          setSetupIsOfficialDate(!!ex.isOfficialDateAnnounced);
          setSetupVariantId(ex.variants?.[0]?.id || '');
          setSetupStage(ex.stages?.[0] || '');
        }
      }
    }
  }, [selectedExamId, examTracks]);

  // Synchronize active subject and expand first chapter by default
  useEffect(() => {
    if (activeExam && activeExam.subjects.length > 0) {
      if (!selectedSubjectId || !activeExam.subjects.some((s) => s.id === selectedSubjectId)) {
        setSelectedSubjectId(activeExam.subjects[0].id);
        if (activeExam.subjects[0].chapters.length > 0) {
          setExpandedChapterIds(new Set([activeExam.subjects[0].chapters[0].id]));
        }
      }
    }
  }, [activeExam, selectedSubjectId]);

  // Real-time Countdown Timer
  useEffect(() => {
    const targetDateStr = activeSetup?.targetDate || activeExam?.officialExamDate;
    if (!targetDateStr) {
      setTimeRemaining(null);
      return;
    }

    const calculateTime = () => {
      const targetTime = new Date(targetDateStr).getTime();
      const now = Date.now();
      const diff = targetTime - now;

      if (isNaN(targetTime)) {
        setTimeRemaining(null);
        return;
      }

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [activeSetup?.targetDate, activeExam?.officialExamDate]);

  // Compute stats helper
  const computeOverallStats = (exam: SyllabusExamTrack) => {
    let total = 0;
    let completed = 0;
    let inProgress = 0;
    let revisionRequired = 0;
    let bookmarked = 0;
    let difficult = 0;

    exam.subjects.forEach((s) => {
      s.chapters.forEach((c) => {
        c.topics.forEach((t) => {
          total++;
          if (t.status === 'completed') completed++;
          if (t.status === 'in_progress') inProgress++;
          if (t.status === 'revision_required') revisionRequired++;
          if (t.isBookmarked) bookmarked++;
          if (t.isDifficult) difficult++;
        });
      });
    });

    const remaining = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, remaining, inProgress, revisionRequired, bookmarked, difficult, percentage };
  };

  const computeSubjectStats = (subject: SyllabusSubject) => {
    let total = 0;
    let completed = 0;
    let inProgress = 0;
    let revisionRequired = 0;

    subject.chapters.forEach((c) => {
      c.topics.forEach((t) => {
        total++;
        if (t.status === 'completed') completed++;
        if (t.status === 'in_progress') inProgress++;
        if (t.status === 'revision_required') revisionRequired++;
      });
    });

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, revisionRequired, percentage };
  };

  // Exam Selection Actions
  const handleSelectExam = (exam: SyllabusExamTrack) => {
    setSelectedExamId(exam.id);
    learningHubService.setActiveExamId(exam.id);

    // If already has setup, go directly to tracker, else open setup
    const existing = learningHubService.getExamSetup(exam.id);
    if (existing) {
      setActiveSetup(existing);
      setIsSettingUp(false);
    } else {
      setIsSettingUp(true);
    }
  };

  const handleToggleExamBookmark = (e: React.MouseEvent, examId: string) => {
    e.stopPropagation();
    learningHubService.toggleExamBookmark(examId);
    setBookmarkedExamIds(learningHubService.getBookmarkedExamIds());
  };

  const handleSaveSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId) return;

    const setup: ExamSetupConfig = {
      examId: selectedExamId,
      variantId: setupVariantId || undefined,
      targetYear: setupYear,
      targetDate: setupTargetDate.trim() || undefined,
      isOfficialDate: setupIsOfficialDate,
      dailyStudyHours: setupDailyHours,
      prepMode: setupPrepMode,
      targetScoreOrGoal: setupTargetGoal.trim() || undefined,
      selectedStage: setupStage || undefined,
      updatedAt: Date.now()
    };

    learningHubService.saveExamSetup(setup);
    setActiveSetup(setup);
    setIsSettingUp(false);
  };

  const handleResetProgress = () => {
    if (!selectedExamId) return;
    learningHubService.resetExamProgress(selectedExamId);
    setExamTracks(learningHubService.getSyllabusTracks());
    setShowResetConfirm(false);
  };

  const handleCycleStatus = (topic: SyllabusTopic) => {
    const sequence: SyllabusTopic['status'][] = [
      'not_started',
      'in_progress',
      'completed',
      'revision_required'
    ];
    const currentIdx = sequence.indexOf(topic.status);
    const nextStatus = sequence[(currentIdx + 1) % sequence.length];
    const incrementRev = nextStatus === 'revision_required' || (topic.status === 'revision_required' && nextStatus === 'completed');

    learningHubService.updateTopicStatus(
      topic.id,
      nextStatus,
      topic.isDifficult,
      topic.isBookmarked,
      incrementRev
    );
    setExamTracks(learningHubService.getSyllabusTracks());
  };

  const handleToggleTopicBookmark = (e: React.MouseEvent, topic: SyllabusTopic) => {
    e.stopPropagation();
    learningHubService.toggleTopicBookmark(topic.id);
    setExamTracks(learningHubService.getSyllabusTracks());
  };

  const handleToggleDifficulty = (e: React.MouseEvent, topic: SyllabusTopic) => {
    e.stopPropagation();
    learningHubService.updateTopicStatus(
      topic.id,
      topic.status,
      !topic.isDifficult,
      topic.isBookmarked
    );
    setExamTracks(learningHubService.getSyllabusTracks());
  };

  const toggleChapterExpand = (chapterId: string) => {
    setExpandedChapterIds((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  };

  const handleExpandAllChapters = () => {
    if (!activeSubject) return;
    setExpandedChapterIds(new Set(activeSubject.chapters.map((c) => c.id)));
  };

  const handleCollapseAllChapters = () => {
    setExpandedChapterIds(new Set());
  };

  // Filter exams for directory
  const filteredExams = useMemo(() => {
    return examTracks.filter((track) => {
      if (onlyBookmarkedExams && !bookmarkedExamIds.includes(track.id)) return false;
      if (selectedCategory !== 'All' && track.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = track.name.toLowerCase().includes(q);
        const matchesAbbr = track.abbreviation?.toLowerCase().includes(q) || false;
        const matchesFull = track.fullName.toLowerCase().includes(q);
        const matchesCat = track.category.toLowerCase().includes(q);
        const matchesVariant = track.variants?.some((v) => v.name.toLowerCase().includes(q)) || false;
        return matchesName || matchesAbbr || matchesFull || matchesCat || matchesVariant;
      }
      return true;
    });
  }, [examTracks, bookmarkedExamIds, onlyBookmarkedExams, selectedCategory, searchQuery]);

  // Active Subject and Filtered Chapters
  const activeSubject = useMemo(() => {
    if (!activeExam) return null;
    return activeExam.subjects.find((s) => s.id === selectedSubjectId) || activeExam.subjects[0] || null;
  }, [activeExam, selectedSubjectId]);

  const filteredChapters = useMemo(() => {
    if (!activeSubject) return [];

    return activeSubject.chapters
      .map((ch) => {
        // Filter by weightage
        if (weightageFilter !== 'all' && ch.weightage?.toLowerCase() !== weightageFilter.toLowerCase()) {
          return null;
        }

        // Filter topics by status / query
        const matchingTopics = ch.topics.filter((t) => {
          if (statusFilter === 'not_started' && t.status !== 'not_started') return false;
          if (statusFilter === 'in_progress' && t.status !== 'in_progress') return false;
          if (statusFilter === 'completed' && t.status !== 'completed') return false;
          if (statusFilter === 'revision_required' && t.status !== 'revision_required') return false;
          if (statusFilter === 'bookmarked' && !t.isBookmarked) return false;
          if (statusFilter === 'difficult' && !t.isDifficult) return false;

          if (chapterSearch.trim()) {
            const q = chapterSearch.toLowerCase().trim();
            const topicMatch = t.name.toLowerCase().includes(q);
            const chapterMatch = ch.name.toLowerCase().includes(q);
            return topicMatch || chapterMatch;
          }
          return true;
        });

        if (chapterSearch.trim() && matchingTopics.length === 0 && !ch.name.toLowerCase().includes(chapterSearch.toLowerCase())) {
          return null;
        }

        return {
          ...ch,
          topics: matchingTopics
        };
      })
      .filter((ch): ch is SyllabusChapter => ch !== null);
  }, [activeSubject, weightageFilter, statusFilter, chapterSearch]);

  // Overall Stats for active exam
  const activeOverallStats = activeExam ? computeOverallStats(activeExam) : null;
  const studyStreak = learningHubService.getStudyStreak().streakDays;

  // Calculate suggested daily pace
  const suggestedDailyPace = useMemo(() => {
    if (!activeOverallStats || !timeRemaining || timeRemaining.isPast || timeRemaining.days <= 0) return null;
    const remainingTopics = activeOverallStats.remaining;
    if (remainingTopics <= 0) return 'Complete!';
    const pace = (remainingTopics / timeRemaining.days).toFixed(1);
    return `${pace} topics / day`;
  }, [activeOverallStats, timeRemaining]);

  // =========================================================================
  // RENDER VIEW 1: EXAM DIRECTORY / SELECTION
  // =========================================================================
  if (!selectedExamId) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto pb-16 text-slate-100">
        {/* Header matching Reference */}
        <div className="text-center space-y-2.5 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Syllabus Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Choose Your Exam
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Select the exam you're preparing for to get started with systematic chapter-wise tracking, progress analytics, and active recall.
          </p>
        </div>

        {/* Search Field & Bookmarks Toggle */}
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by exam name, abbreviation (JEE, NEET, UPSC, SSC, CA, NDA...)"
              className="w-full pl-11 pr-10 py-3 bg-[#141418] border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span>
              Showing <strong className="text-emerald-400">{filteredExams.length}</strong> verified exams
            </span>
            <button
              onClick={() => setOnlyBookmarkedExams(!onlyBookmarkedExams)}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer font-medium ${
                onlyBookmarkedExams ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarkedExams ? 'fill-amber-400' : ''}`} />
              <span>Only Saved ({bookmarkedExamIds.length})</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 custom-scrollbar px-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-[#141418] text-slate-400 hover:text-white border border-white/5 hover:border-white/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Exam Cards Grid */}
        {filteredExams.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#141418] border border-white/5 space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">No Matching Exams Found</h3>
              <p className="text-xs text-slate-400 mt-1">
                We couldn't find any exams matching "{searchQuery}". Try searching for JEE, NEET, UPSC, SSC, CA, or GATE.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setOnlyBookmarkedExams(false);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
            {filteredExams.map((exam) => {
              const stats = computeOverallStats(exam);
              const chapterCount = exam.subjects.reduce((acc, s) => acc + s.chapters.length, 0);
              const isSaved = bookmarkedExamIds.includes(exam.id);

              return (
                <div
                  key={exam.id}
                  onClick={() => handleSelectExam(exam)}
                  className="group relative p-5 rounded-2xl bg-[#141418] border border-white/10 hover:border-emerald-500/50 hover:bg-[#181820] transition-all duration-200 flex flex-col justify-between space-y-4 cursor-pointer shadow-lg hover:shadow-emerald-950/20"
                >
                  {/* Top Bar: Icon, Variants Badge & Bookmark button */}
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-base group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-105 transition-all">
                        <BookOpen className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {exam.variants && exam.variants.length > 1 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                            {exam.variants.length} Variants
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleToggleExamBookmark(e, exam.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                          title={isSaved ? 'Remove from Saved' : 'Bookmark Exam'}
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Titles */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-base text-white group-hover:text-emerald-300 transition-colors">
                          {exam.name}
                        </h3>
                        {exam.abbreviation && exam.abbreviation !== exam.name && (
                          <span className="text-[10px] font-mono text-slate-400">
                            ({exam.abbreviation})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {exam.description || exam.fullName}
                      </p>
                    </div>

                    {/* Metadata Tags */}
                    <div className="flex items-center flex-wrap gap-2 text-[10px] text-slate-400">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium">
                        {exam.category}
                      </span>
                      <span>·</span>
                      <span>{chapterCount} Chapters</span>
                      <span>·</span>
                      <span>{stats.total} Topics</span>
                    </div>

                    {/* Progress Bar (if student has already made progress) */}
                    {stats.completed > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Syllabus Progress</span>
                          <span className="font-bold text-emerald-400">{stats.percentage}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-black/50 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: `${stats.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Start Tracker Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectExam(exam);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-white font-bold text-xs tracking-wide border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Start Tracker</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // RENDER VIEW 2: EXAM PREPARATION SETUP (MODAL / STEP)
  // =========================================================================
  if (isSettingUp && activeExam) {
    return (
      <div className="max-w-2xl mx-auto pb-16 text-slate-100">
        <div className="rounded-3xl bg-[#141418] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Header & Back */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (activeSetup) {
                    setIsSettingUp(false);
                  } else {
                    setSelectedExamId(null);
                    learningHubService.setActiveExamId(null);
                  }
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Back"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-400" />
              </button>
              <div>
                <h2 className="text-xl font-black text-white">Configure Your Preparation</h2>
                <p className="text-xs text-slate-400">
                  {activeExam.name} • {activeExam.category}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Setup Step
            </span>
          </div>

          <form onSubmit={handleSaveSetup} className="space-y-6">
            {/* Exam Variant Selection if available */}
            {activeExam.variants && activeExam.variants.length > 1 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Select Exam Variant / Stream:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeExam.variants.map((v) => (
                    <button
                      type="button"
                      key={v.id}
                      onClick={() => setSetupVariantId(v.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        setupVariantId === v.id
                          ? 'bg-emerald-500/15 border-emerald-500 text-white'
                          : 'bg-[#181820] border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">{v.name}</div>
                      {v.description && (
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{v.description}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Target Year & Expected/Official Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Target Exam Year:</label>
                <select
                  value={setupYear}
                  onChange={(e) => setSetupYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#181820] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Exam Target Date:</label>
                  {activeExam.isOfficialDateAnnounced ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Official Date
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400">Official Date Unannounced</span>
                  )}
                </div>
                <input
                  type="date"
                  value={setupTargetDate}
                  onChange={(e) => setSetupTargetDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#181820] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Daily Study Hours Slider */}
            <div className="space-y-2 p-4 rounded-2xl bg-[#181820] border border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Daily Study Target:</span>
                <span className="font-black text-emerald-400 text-sm">{setupDailyHours} Hours / Day</span>
              </div>
              <input
                type="range"
                min="1"
                max="14"
                step="0.5"
                value={setupDailyHours}
                onChange={(e) => setSetupDailyHours(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 hr (Light)</span>
                <span>4-6 hrs (Standard)</span>
                <span>10+ hrs (Intensive)</span>
              </div>
            </div>

            {/* Preparation Mode */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Preparation Mode:</label>
              <div className="grid grid-cols-2 gap-3">
                {(['Self Study', 'Coaching'] as const).map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setSetupPrepMode(mode)}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      setupPrepMode === mode
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                        : 'bg-[#181820] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Score / Rank Goal */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Target Score / Rank Goal (Optional):
              </label>
              <input
                type="text"
                value={setupTargetGoal}
                onChange={(e) => setSetupTargetGoal(e.target.value)}
                placeholder="e.g. 99.5 Percentile, Rank under 500, Score 680+/720"
                className="w-full px-3.5 py-2.5 bg-[#181820] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (activeSetup) {
                    setIsSettingUp(false);
                  } else {
                    setSelectedExamId(null);
                    learningHubService.setActiveExamId(null);
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                Save & Open Tracker
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER VIEW 3: DEDICATED EXAM TRACKER & PROGRESS DASHBOARD
  // =========================================================================
  return (
    <div className="space-y-6 pb-20 text-slate-100 max-w-6xl mx-auto">
      {/* 1. Header with Breadcrumb & Global Actions */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#141418] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={() => {
                setSelectedExamId(null);
                learningHubService.setActiveExamId(null);
              }}
              className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>All Exams</span>
            </button>
            <span>/</span>
            <span className="text-slate-300 font-medium">{activeExam?.category}</span>
            <span>/</span>
            <span className="text-emerald-400 font-bold">{activeExam?.name}</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {activeExam?.name} Syllabus Tracker
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {activeSetup?.targetYear || activeExam?.year} Syllabus
            </span>
          </div>

          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Source: <strong className="text-slate-300">{activeExam?.verifiedOfficialSource || 'Official Syllabus'}</strong>
            {activeSetup?.prepMode && ` • Mode: ${activeSetup.prepMode}`}
            {activeSetup?.targetScoreOrGoal && ` • Goal: ${activeSetup.targetScoreOrGoal}`}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setIsSettingUp(true)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Edit Preparation Settings"
          >
            <Settings2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Edit Setup</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold border border-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset Syllabus Progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>

          <button
            onClick={() => setShowReportIssue(true)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Report Discrepancy"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Report Issue</span>
          </button>

          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('courses')}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-white text-xs font-bold border border-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Watch Lectures</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Prominent Exam Countdown Timer (if target date available) */}
      {timeRemaining && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#141418] to-purple-950/30 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Target Exam Countdown
                </span>
                <span className={`text-[10px] px-2 py-0.2 rounded-full border ${
                  activeSetup?.isOfficialDate || activeExam?.isOfficialDateAnnounced
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {activeSetup?.isOfficialDate || activeExam?.isOfficialDateAnnounced
                    ? 'Official Date'
                    : 'User-Estimated Date'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target date: {new Date(activeSetup?.targetDate || activeExam?.officialExamDate || '').toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Time digits */}
          {timeRemaining.isPast ? (
            <div className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              Exam session completed or date has passed.
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="px-3 py-1.5 rounded-xl bg-[#0E0E12] border border-white/5">
                <div className="text-base sm:text-lg font-black text-white font-mono">{timeRemaining.days}</div>
                <div className="text-[9px] uppercase tracking-wider text-slate-400">Days</div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-[#0E0E12] border border-white/5">
                <div className="text-base sm:text-lg font-black text-white font-mono">{timeRemaining.hours}</div>
                <div className="text-[9px] uppercase tracking-wider text-slate-400">Hours</div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-[#0E0E12] border border-white/5">
                <div className="text-base sm:text-lg font-black text-white font-mono">{timeRemaining.minutes}</div>
                <div className="text-[9px] uppercase tracking-wider text-slate-400">Mins</div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-[#0E0E12] border border-white/5">
                <div className="text-base sm:text-lg font-black text-emerald-400 font-mono">{timeRemaining.seconds}</div>
                <div className="text-[9px] uppercase tracking-wider text-slate-400">Secs</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Progress Dashboard Cards */}
      {activeOverallStats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Overall Completion */}
          <div className="p-4 rounded-2xl bg-[#141418] border border-white/10 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Completion</span>
            <div className="text-2xl font-black text-emerald-400">
              {activeOverallStats.percentage}%
            </div>
            <div className="w-full h-1 rounded-full bg-black/40 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${activeOverallStats.percentage}%` }}
              />
            </div>
          </div>

          {/* Card 2: Completed Topics */}
          <div className="p-4 rounded-2xl bg-[#141418] border border-white/10 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Completed</span>
            <div className="text-2xl font-black text-white">
              {activeOverallStats.completed}
              <span className="text-xs text-slate-500 font-normal ml-1">/ {activeOverallStats.total}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">Mastered Topics</span>
          </div>

          {/* Card 3: Remaining Topics */}
          <div className="p-4 rounded-2xl bg-[#141418] border border-white/10 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Remaining</span>
            <div className="text-2xl font-black text-amber-400">
              {activeOverallStats.remaining}
            </div>
            <span className="text-[10px] text-slate-400">To be covered</span>
          </div>

          {/* Card 4: Bookmarked Chapters */}
          <div className="p-4 rounded-2xl bg-[#141418] border border-white/10 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Saved / Priority</span>
            <div className="text-2xl font-black text-purple-400">
              {activeOverallStats.bookmarked}
            </div>
            <span className="text-[10px] text-purple-300 font-semibold">Flagged for focus</span>
          </div>

          {/* Card 5: Study Streak */}
          <div className="p-4 rounded-2xl bg-[#141418] border border-white/10 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Study Streak</span>
            <div className="text-2xl font-black text-amber-400 flex items-center gap-1">
              <Flame className="w-5 h-5 fill-amber-400" />
              <span>{studyStreak}d</span>
            </div>
            <span className="text-[10px] text-slate-400">Daily consistency</span>
          </div>

          {/* Card 6: Suggested Daily Pace */}
          <div className="p-4 rounded-2xl bg-[#141418] border border-white/10 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Target Pace</span>
            <div className="text-sm font-black text-emerald-400 truncate mt-1">
              {suggestedDailyPace || `${activeSetup?.dailyStudyHours || 4} hrs/day`}
            </div>
            <span className="text-[10px] text-slate-400">To complete in time</span>
          </div>
        </div>
      )}

      {/* 4. Subject Tabs */}
      {activeExam && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {activeExam.subjects.map((sub) => {
            const isSelected = sub.id === activeSubject?.id;
            const stats = computeSubjectStats(sub);

            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 shrink-0 ${
                  isSelected
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-[#141418] text-slate-300 hover:text-white border border-white/5 hover:border-white/15'
                }`}
              >
                <span>{sub.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-emerald-500/15 text-emerald-400'
                  }`}
                >
                  {stats.percentage}%
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 5. In-Tracker Search & Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#141418] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={chapterSearch}
            onChange={(e) => setChapterSearch(e.target.value)}
            placeholder={`Search ${activeSubject?.name || 'subject'} topics or chapters...`}
            className="w-full pl-10 pr-8 py-2 bg-[#181820] border border-white/5 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
          {chapterSearch && (
            <button
              onClick={() => setChapterSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TopicStatusFilter)}
            className="px-3 py-1.5 bg-[#181820] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="revision_required">Revision Needed</option>
            <option value="bookmarked">Bookmarked</option>
            <option value="difficult">Difficult</option>
          </select>

          {/* Weightage Filter */}
          <select
            value={weightageFilter}
            onChange={(e) => setWeightageFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#181820] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Weightage</option>
            <option value="high">High Weightage</option>
            <option value="medium">Medium Weightage</option>
            <option value="low">Low Weightage</option>
          </select>

          {/* Expand / Collapse All Controls */}
          <div className="flex items-center gap-1 border-l border-white/10 pl-2">
            <button
              onClick={handleExpandAllChapters}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Expand All Chapters"
            >
              Expand All
            </button>
            <button
              onClick={handleCollapseAllChapters}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Collapse All Chapters"
            >
              Collapse
            </button>
          </div>
        </div>
      </div>

      {/* 6. Chapter-Wise Syllabus Accordion */}
      {filteredChapters.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#141418] border border-white/5 space-y-3">
          <Info className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="font-bold text-sm text-white">No Topics Match Current Filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your search query or selecting "All Statuses" to view all chapters.
          </p>
          <button
            onClick={() => {
              setChapterSearch('');
              setStatusFilter('all');
              setWeightageFilter('all');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
          >
            Clear Topic Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredChapters.map((chapter) => {
            const isExpanded = expandedChapterIds.has(chapter.id);
            const completedCount = chapter.topics.filter((t) => t.status === 'completed').length;
            const chapterPercentage = chapter.topics.length > 0 ? Math.round((completedCount / chapter.topics.length) * 100) : 0;

            return (
              <div
                key={chapter.id}
                className="rounded-2xl bg-[#141418] border border-white/10 overflow-hidden transition-all shadow-md"
              >
                {/* Chapter Header */}
                <div
                  onClick={() => toggleChapterExpand(chapter.id)}
                  className="p-4 sm:p-4.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-emerald-400" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-white tracking-tight">{chapter.name}</h3>
                        {chapter.stage && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-white/5 border border-white/10 text-slate-300">
                            {chapter.stage}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        {chapter.weightage && (
                          <span
                            className={`font-bold ${
                              chapter.weightage === 'High'
                                ? 'text-red-400'
                                : chapter.weightage === 'Medium'
                                ? 'text-amber-400'
                                : 'text-slate-400'
                            }`}
                          >
                            • {chapter.weightage} Weightage
                          </span>
                        )}
                        {chapter.expectedQuestions && <span>· {chapter.expectedQuestions}</span>}
                        <span>· {chapter.topics.length} Topics</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {completedCount}/{chapter.topics.length} ({chapterPercentage}%)
                    </span>
                  </div>
                </div>

                {/* Topics List Body */}
                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-white/5 space-y-2 bg-[#0E0E12]">
                    {chapter.topics.map((topic) => {
                      const isDone = topic.status === 'completed';
                      const isInProg = topic.status === 'in_progress';
                      const isRevision = topic.status === 'revision_required';

                      let statusBadge = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                      let statusText = 'Not Started';

                      if (isDone) {
                        statusBadge = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold';
                        statusText = 'Completed';
                      } else if (isInProg) {
                        statusBadge = 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold';
                        statusText = 'In Progress';
                      } else if (isRevision) {
                        statusBadge = 'bg-purple-500/15 text-purple-400 border-purple-500/30 font-bold';
                        statusText = 'Revision Required';
                      }

                      return (
                        <div
                          key={topic.id}
                          onClick={() => handleCycleStatus(topic)}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#141418] hover:bg-white/5 border border-white/5 cursor-pointer transition-colors group"
                        >
                          {/* Checkbox & Topic Name */}
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCycleStatus(topic);
                              }}
                              className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                isDone
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-slate-500 group-hover:border-emerald-400'
                              }`}
                            >
                              {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                            </button>

                            <div className="min-w-0">
                              <span
                                className={`text-xs block leading-snug transition-colors ${
                                  isDone ? 'line-through text-slate-500' : 'text-slate-200'
                                }`}
                              >
                                {topic.name}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                {topic.estimatedMinutes && (
                                  <span>~{topic.estimatedMinutes} mins est.</span>
                                )}
                                {topic.revisionCount && topic.revisionCount > 0 && (
                                  <span className="text-purple-400 font-semibold">
                                    • Rev ×{topic.revisionCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Controls: Schedule to Planner, Bookmark, Difficulty Star, Status Pill */}
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Schedule to Daily Planner Shortcut */}
                            <button
                              type="button"
                              onClick={(e) => handleScheduleTopic(e, topic, chapter.name)}
                              className="p-1 text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer"
                              title="Schedule this topic into Daily Planner"
                            >
                              <Calendar className="w-3.5 h-3.5 text-slate-500 hover:text-emerald-400" />
                            </button>

                            {/* Bookmark Flag */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleTopicBookmark(e, topic)}
                              className="p-1 text-slate-500 hover:text-purple-400 transition-colors cursor-pointer"
                              title={topic.isBookmarked ? 'Unbookmark Topic' : 'Bookmark Topic'}
                            >
                              <Bookmark
                                className={`w-3.5 h-3.5 ${
                                  topic.isBookmarked ? 'fill-purple-400 text-purple-400' : 'text-slate-600'
                                }`}
                              />
                            </button>

                            {/* Difficulty Star */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleDifficulty(e, topic)}
                              className="p-1 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                              title={topic.isDifficult ? 'Marked as Difficult' : 'Mark as Difficult'}
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${
                                  topic.isDifficult ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                                }`}
                              />
                            </button>

                            {/* Status Cycle Pill */}
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] border transition-all ${statusBadge}`}
                            >
                              {statusText}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 7. Reset Progress Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#141418] border border-red-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Reset Syllabus Progress?</h3>
                <p className="text-xs text-slate-400">{activeExam?.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to reset all topic progress, completed checkmarks, and revision counts for <strong className="text-white">{activeExam?.name}</strong>? Your course videos and planner tasks will remain untouched.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetProgress}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-bold transition-all shadow-md shadow-red-500/20 cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Report Issue / Discrepancy Modal */}
      {showReportIssue && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#141418] border border-white/10 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2 text-white">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Report Syllabus Discrepancy</h3>
              </div>
              <button
                onClick={() => {
                  setShowReportIssue(false);
                  setReportSuccess(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-xs text-emerald-300">Feedback Submitted</h4>
                <p className="text-[11px] text-slate-300">
                  Thank you! Our academic syllabus curriculum team will verify your notice against the latest official exam bulletin.
                </p>
                <button
                  onClick={() => {
                    setShowReportIssue(false);
                    setReportSuccess(false);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!reportIssueText.trim()) return;
                  setReportSuccess(true);
                  setReportIssueText('');
                }}
                className="space-y-3"
              >
                <p className="text-xs text-slate-400">
                  Found an omitted chapter, changed notification weightage, or syllabus deletion for <strong className="text-white">{activeExam?.name}</strong>?
                </p>
                <textarea
                  rows={4}
                  value={reportIssueText}
                  onChange={(e) => setReportIssueText(e.target.value)}
                  placeholder="Describe the discrepancy or official notification link..."
                  required
                  className="w-full p-3 bg-[#181820] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReportIssue(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-400"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 9. Live Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#141418] border border-emerald-500/40 text-white text-xs font-semibold shadow-2xl shadow-black/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
