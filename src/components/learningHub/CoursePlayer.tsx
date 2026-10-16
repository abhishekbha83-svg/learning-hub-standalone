import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
  Bookmark,
  FileText,
  HelpCircle,
  Flame,
  Volume2,
  VolumeX,
  Share2,
  Download,
  Plus,
  Send,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  List,
  ExternalLink,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LearningCourse, LectureItem, TimestampedNote } from '../../types/learningHub';
import { learningHubService } from '../../services/learningHubService';
import { certificateService } from '../../services/certificateService';
import { CertificateMilestone, CourseCertificate } from '../../types/certificate';
import { ClaimCertificateModal } from './certificate/ClaimCertificateModal';
import { CertificateViewerModal } from './certificate/CertificateViewerModal';

interface CoursePlayerProps {
  courseId: string;
  onBackToCourses: () => void;
  onOpenSyllabusMap?: () => void;
}

type RightTab = 'notes' | 'ai-tutor' | 'quiz';

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  courseId,
  onBackToCourses,
  onOpenSyllabusMap
}) => {
  const [course, setCourse] = useState<LearningCourse | null>(() =>
    learningHubService.getCourseById(courseId) || null
  );
  const [activeLectureId, setActiveLectureId] = useState<string>('');
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeRightTab, setActiveRightTab] = useState<RightTab>('notes');

  // Notes state
  const [notes, setNotes] = useState<TimestampedNote[]>([]);
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);

  // AI Tutor state in right panel
  const [tutorQuery, setTutorQuery] = useState<string>('');
  const [tutorChat, setTutorChat] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);
  const [isTutorLoading, setIsTutorLoading] = useState<boolean>(false);
  const [tutorError, setTutorError] = useState<string | null>(null);

  // AI Summary Modal / Drawer
  const [summaryText, setSummaryText] = useState<string>('');
  const [summaryDisclaimer, setSummaryDisclaimer] = useState<string>('');
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);

  // Quiz in player state
  const [lectureQuiz, setLectureQuiz] = useState<any>(null);
  const [isQuizLoading, setIsQuizLoading] = useState<boolean>(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Focus Timer inside player
  const [focusTimerSeconds, setFocusTimerSeconds] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Simulated player time tracker
  const [currentPlayTimeSeconds, setCurrentPlayTimeSeconds] = useState<number>(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Certificate Modals State
  const [claimMilestone, setClaimMilestone] = useState<CertificateMilestone | null>(null);
  const [showClaimModal, setShowClaimModal] = useState<boolean>(false);
  const [viewerCert, setViewerCert] = useState<CourseCertificate | null>(null);

  useEffect(() => {
    const c = learningHubService.getCourseById(courseId);
    if (c) {
      setCourse(c);
      learningHubService.setActiveCourseId(c.id);
      if (c.lectures.length > 0) {
        // pick first incomplete or first lecture
        const firstIncomplete = c.lectures.find((l) => !l.completed);
        const initialLec = firstIncomplete || c.lectures[0];
        setActiveLectureId(initialLec.id);
        setCurrentPlayTimeSeconds(initialLec.watchedSeconds || 0);
      }
    }
  }, [courseId]);

  useEffect(() => {
    if (course && activeLectureId) {
      const allNotes = learningHubService.getNotes(course.id);
      setNotes(allNotes.filter((n) => n.lectureId === activeLectureId));
    }
  }, [course, activeLectureId]);

  // Pomodoro timer tick
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setFocusTimerSeconds((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Active lecture object
  const activeLecture = course?.lectures.find((l) => l.id === activeLectureId) || course?.lectures[0];

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectLecture = (lecId: string) => {
    setActiveLectureId(lecId);
    const targetLec = course?.lectures.find((l) => l.id === lecId);
    if (targetLec) {
      setCurrentPlayTimeSeconds(targetLec.watchedSeconds || 0);
    }
  };

  const handleNextLecture = () => {
    if (!course) return;
    const currentIdx = course.lectures.findIndex((l) => l.id === activeLectureId);
    if (currentIdx < course.lectures.length - 1) {
      handleSelectLecture(course.lectures[currentIdx + 1].id);
    }
  };

  const handlePrevLecture = () => {
    if (!course) return;
    const currentIdx = course.lectures.findIndex((l) => l.id === activeLectureId);
    if (currentIdx > 0) {
      handleSelectLecture(course.lectures[currentIdx - 1].id);
    }
  };

  const handleToggleCompleted = () => {
    if (!course || !activeLecture) return;
    const nextCompleted = !activeLecture.completed;
    const result = learningHubService.updateLectureProgress(
      course.id,
      activeLecture.id,
      activeLecture.watchedSeconds,
      nextCompleted
    );
    setCourse(result.course);

    // If a lecture was just marked completed, check if any milestone was reached!
    if (result.newlyCompleted) {
      const certs = certificateService.getStoredCertificates();
      const status = certificateService.calculateCourseMilestoneStatus(result.course, certs);
      
      // Look for highest eligible milestone that has not yet been claimed
      const newlyUnlocked = ([100, 75, 50, 25] as CertificateMilestone[]).find(
        (m) => status.milestones[m].isEligible && !status.milestones[m].isAlreadyClaimed
      );

      if (newlyUnlocked) {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 }
        });
        setClaimMilestone(newlyUnlocked);
        setShowClaimModal(true);
      }
    }
  };

  const handleAddTimestampNote = () => {
    if (!course || !activeLecture || !newNoteContent.trim()) return;

    const saved = learningHubService.saveNote({
      courseId: course.id,
      lectureId: activeLecture.id,
      lectureTitle: activeLecture.title,
      videoId: activeLecture.videoId,
      timestampSeconds: currentPlayTimeSeconds,
      timestampFormatted: formatSeconds(currentPlayTimeSeconds),
      content: newNoteContent.trim()
    });

    setNotes((prev) => [saved, ...prev]);
    setNewNoteContent('');
    setIsAddingNote(false);
  };

  const handleSeekTimestamp = (seconds: number) => {
    setCurrentPlayTimeSeconds(seconds);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Send postMessage to YouTube IFrame
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }),
        '*'
      );
    }
  };

  const handleAskAITutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuery.trim() || isTutorLoading) return;

    const q = tutorQuery.trim();
    setTutorQuery('');
    setTutorError(null);
    setTutorChat((prev) => [...prev, { role: 'user', text: q }]);
    setIsTutorLoading(true);

    try {
      const res = await fetch('/api/learning-hub/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          lectureTitle: activeLecture?.title,
          courseTitle: course?.title,
          notesContext: notes.map((n) => n.content).join('; '),
          conversationHistory: tutorChat.map((m) => ({ role: m.role, content: m.text }))
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.answer) {
        throw new Error(data.error || 'AI Tutor failed to respond.');
      }
      setTutorChat((prev) => [
        ...prev,
        { role: 'assistant', text: data.answer }
      ]);
    } catch (err: any) {
      const errMsg = err.message || 'AI Tutor network error. Please verify connection and retry.';
      setTutorError(errMsg);
      setTutorChat((prev) => [
        ...prev,
        { role: 'assistant', text: `⚠️ ${errMsg}` }
      ]);
    } finally {
      setIsTutorLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!activeLecture || !course) return;
    setIsSummaryLoading(true);
    setShowSummaryModal(true);
    setSummaryText('');
    setSummaryDisclaimer('');

    try {
      const res = await fetch('/api/learning-hub/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lectureTitle: activeLecture.title,
          courseTitle: course.title,
          durationFormatted: activeLecture.durationFormatted
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.summary) {
        throw new Error(data.error || 'Failed to generate summary.');
      }
      setSummaryText(data.summary);
      if (data.disclaimer) {
        setSummaryDisclaimer(data.disclaimer);
      }
    } catch (err: any) {
      setSummaryText(`⚠️ Failed to generate summary: ${err.message || 'Please check connection and retry.'}`);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!activeLecture) return;
    setIsQuizLoading(true);
    setQuizError(null);
    setActiveRightTab('quiz');
    setSelectedAnswers({});
    setQuizSubmitted(false);

    try {
      const res = await fetch('/api/learning-hub/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activeLecture.title,
          count: 5,
          difficulty: 'medium',
          examContext: course?.examCategory || 'Exam Prep'
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.quiz) {
        throw new Error(data.error || 'Failed to generate quiz.');
      }
      setLectureQuiz(data.quiz);
    } catch (err: any) {
      setQuizError(err.message || 'Failed to generate diagnostic quiz. Please retry.');
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleSubmitQuiz = () => {
    if (!lectureQuiz) return;
    setQuizSubmitted(true);

    let correctCount = 0;
    lectureQuiz.questions.forEach((q: any, idx: number) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const totalQ = lectureQuiz.questions.length;
    const scorePct = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;

    // Persist quiz attempt in student progress and weak topics
    learningHubService.saveQuizAttempt({
      id: `qa-${Date.now()}`,
      quizId: lectureQuiz.id,
      quizTitle: lectureQuiz.title,
      topicOrLecture: activeLecture?.title || lectureQuiz.title,
      totalQuestions: totalQ,
      correctAnswers: correctCount,
      incorrectAnswers: totalQ - correctCount,
      skippedAnswers: 0,
      scorePercentage: scorePct,
      timeSpentSeconds: 60,
      answers: selectedAnswers as any,
      attemptedAt: Date.now()
    });
  };

  const handleExportNotes = (format: 'txt' | 'md') => {
    if (notes.length === 0) return;
    let text = `# Lecture Notes: ${activeLecture?.title || 'Lecture'}\n`;
    text += `Course: ${course?.title || ''}\nDate: ${new Date().toLocaleDateString()}\n\n`;
    notes.forEach((n) => {
      text += `[${n.timestampFormatted}] ${n.content}\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeLecture?.title || 'notes'}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!course || !activeLecture) {
    return (
      <div className="py-20 text-center space-y-4 text-slate-300">
        <p>Course not found or still loading...</p>
        <button
          onClick={onBackToCourses}
          className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 pb-16 text-slate-100 ${isFocusMode ? 'fixed inset-0 z-50 bg-[#090A0F] p-4 overflow-y-auto' : ''}`}>
      {/* Top Browser / Classroom Bar matching Reference Screenshot 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#141418] border border-white/10 px-4 py-2.5 rounded-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCourses}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Return to Courses"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Breadcrumbs */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-[200px]">{course.title}</span>
              <span>/</span>
              <span className="text-emerald-400 truncate max-w-[160px] sm:max-w-[260px] font-medium">
                {activeLecture.title}
              </span>
            </div>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2">
          {/* Milestone Certificates Pill */}
          <button
            onClick={() => {
              const certs = certificateService.getStoredCertificates();
              const status = certificateService.calculateCourseMilestoneStatus(course, certs);
              // If there's an unclaimed eligible milestone, prompt to claim it!
              const unclaimed = ([100, 75, 50, 25] as CertificateMilestone[]).find(
                (m) => status.milestones[m].isEligible && !status.milestones[m].isAlreadyClaimed
              );
              if (unclaimed) {
                setClaimMilestone(unclaimed);
                setShowClaimModal(true);
              } else {
                // Check if any claimed certificate exists to view
                const claimed = ([100, 75, 50, 25] as CertificateMilestone[]).find(
                  (m) => status.milestones[m].isAlreadyClaimed
                );
                if (claimed) {
                  const existingCert = certs.find(
                    (c) => c.id === status.milestones[claimed].claimedCertificateId
                  );
                  if (existingCert) setViewerCert(existingCert);
                } else {
                  // If none eligible yet, prompt with next milestone
                  const nextMilestone = ([25, 50, 75, 100] as CertificateMilestone[]).find(
                    (m) => !status.milestones[m].isEligible
                  );
                  if (nextMilestone) {
                    setClaimMilestone(nextMilestone);
                    setShowClaimModal(true);
                  }
                }
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold transition-all cursor-pointer shadow-xs"
            title="Course Milestone Certificates"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Certificates ({course.progressPercentage}%)</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Zero Ads</span>
          </div>

          {/* Focus Mode Pill */}
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              isFocusMode
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFocusMode ? 'Exit Focus' : 'Focus Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column / 2-Column Classroom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Panel: Lecture Playlist Navigation (3 Cols) */}
        {!isFocusMode && (
          <aside className="lg:col-span-3 bg-[#141418] border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-4 max-h-[640px] overflow-hidden">
            <div className="space-y-3 min-w-0">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div>
                  <h3 className="text-xs font-bold text-white truncate">{course.title}</h3>
                  <p className="text-[10px] text-slate-400">
                    {course.lectures.length} Lectures · {Math.round(course.totalDurationSeconds / 3600)}h Total
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {course.progressPercentage}%
                </span>
              </div>

              {/* Lecture Items List */}
              <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
                {course.lectures.map((lec, idx) => {
                  const isActive = lec.id === activeLectureId;
                  return (
                    <div
                      key={lec.id}
                      onClick={() => handleSelectLecture(lec.id)}
                      className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-white font-semibold'
                          : 'bg-[#1A1A20] hover:bg-white/5 text-slate-300 border border-white/5'
                      }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          learningHubService.updateLectureProgress(course.id, lec.id, lec.watchedSeconds, !lec.completed);
                          setCourse(learningHubService.getCourseById(course.id) || null);
                        }}
                        className="mt-0.5 shrink-0 hover:scale-110 transition-transform"
                      >
                        {lec.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p className={`line-clamp-2 leading-tight ${lec.completed && !isActive ? 'line-through text-slate-500' : ''}`}>
                          {lec.title}
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                          {lec.durationFormatted}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Progress Card matching Screenshot */}
            <div className="p-3 bg-[#1A1A20] rounded-xl border border-white/5 space-y-2 shrink-0">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Course Progress</span>
                <span className="font-bold text-emerald-400">{course.progressPercentage}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${course.progressPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-amber-400">
                  <Flame className="w-3 h-3 fill-amber-400" />
                  <span>Habit Streak</span>
                </span>
                <span>{course.completedLecturesCount}/{course.lectures.length} done</span>
              </div>
            </div>
          </aside>
        )}

        {/* Center: Video Player + Playback Controls + Action Bar (6 or 9 cols) */}
        <div className={`${isFocusMode ? 'lg:col-span-8' : 'lg:col-span-6'} space-y-3`}>
          {/* IFrame Container */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
            <iframe
              key={activeLecture.videoId}
              ref={iframeRef}
              src={`https://www.youtube-nocookie.com/embed/${activeLecture.videoId}?enablejsapi=1&origin=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.origin : ''
              )}&rel=0&modestbranding=1&autoplay=1&start=${activeLecture.watchedSeconds || 0}`}
              title={activeLecture.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Under-player Navigation & Speed Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#141418] border border-white/10 rounded-xl text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevLecture}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1 cursor-pointer"
                title="Previous Lecture"
              >
                <SkipBack className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>
              <button
                onClick={handleNextLecture}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1 cursor-pointer"
                title="Next Lecture"
              >
                <span className="hidden sm:inline">Next</span>
                <SkipForward className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleToggleCompleted}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeLecture.completed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{activeLecture.completed ? 'Completed' : 'Mark Complete'}</span>
              </button>
            </div>

            {/* Playback speed pills */}
            <div className="flex items-center gap-1 bg-[#1A1A20] p-1 rounded-lg">
              {[1, 1.25, 1.5, 1.75, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-emerald-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Action Bar matching Reference Screenshot 2 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <button
              onClick={handleGenerateSummary}
              className="p-2.5 rounded-xl bg-[#141418] hover:bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:border-emerald-500/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Summary</span>
            </button>

            <button
              onClick={() => {
                setActiveRightTab('notes');
                setIsAddingNote(true);
              }}
              className="p-2.5 rounded-xl bg-[#141418] hover:bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:border-emerald-500/40"
            >
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Take Note</span>
            </button>

            <button
              onClick={handleGenerateQuiz}
              className="p-2.5 rounded-xl bg-[#141418] hover:bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:border-purple-500/40"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>Quiz Generator</span>
            </button>

            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-2.5 rounded-xl bg-[#141418] hover:bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:border-amber-500/40"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="tabular-nums font-mono">
                {Math.floor(focusTimerSeconds / 60)}:{(focusTimerSeconds % 60).toString().padStart(2, '0')} Focus
              </span>
            </button>
          </div>
        </div>

        {/* Right Panel: Notes / AI Tutor / Quiz (3 or 4 cols) */}
        <div className={`${isFocusMode ? 'lg:col-span-4' : 'lg:col-span-3'} bg-[#141418] border border-white/10 rounded-2xl p-4 flex flex-col justify-between max-h-[640px] space-y-3`}>
          {/* Tabs */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-1 bg-[#1A1A20] p-1 rounded-xl">
              <button
                onClick={() => setActiveRightTab('notes')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeRightTab === 'notes'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Notes ({notes.length})
              </button>
              <button
                onClick={() => setActiveRightTab('ai-tutor')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeRightTab === 'ai-tutor'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                AI Tutor
              </button>
              <button
                onClick={() => setActiveRightTab('quiz')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeRightTab === 'quiz'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Quiz
              </button>
            </div>

            {activeRightTab === 'notes' && notes.length > 0 && (
              <button
                onClick={() => handleExportNotes('md')}
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 p-1"
                title="Export Notes as Markdown"
              >
                <Download className="w-3 h-3" />
                <span>Export</span>
              </button>
            )}
          </div>

          {/* TAB 1: NOTES */}
          {activeRightTab === 'notes' && (
            <div className="flex-1 flex flex-col justify-between space-y-3 min-h-0">
              {/* Existing Notes List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 bg-[#1A1A20] rounded-xl border border-white/5 space-y-1.5 group hover:border-emerald-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleSeekTimestamp(n.timestampSeconds)}
                        className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        title="Click to seek player"
                      >
                        <Play className="w-2.5 h-2.5 fill-emerald-400" />
                        <span>{n.timestampFormatted}</span>
                      </button>
                      <button
                        onClick={() => {
                          learningHubService.deleteNote(n.id);
                          setNotes((prev) => prev.filter((item) => item.id !== n.id));
                        }}
                        className="opacity-0 group-hover:opacity-100 text-[10px] text-red-400 hover:text-red-300 transition-opacity"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {n.content}
                    </p>
                  </div>
                ))}

                {notes.length === 0 && !isAddingNote && (
                  <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                    <FileText className="w-6 h-6 mx-auto text-slate-500" />
                    <p>No timestamped notes taken for this lecture yet.</p>
                  </div>
                )}
              </div>

              {/* Add Note Form */}
              {isAddingNote ? (
                <div className="p-3 bg-[#1A1A20] rounded-xl border border-emerald-500/30 space-y-2 shrink-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-400">
                      Timestamp: {formatSeconds(currentPlayTimeSeconds)}
                    </span>
                    <button
                      onClick={() => setIsAddingNote(false)}
                      className="text-[11px] text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                  <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Type lecture formula, key concept, or exam tip..."
                    rows={3}
                    className="w-full bg-[#141418] border border-white/10 rounded-lg p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60"
                  />
                  <button
                    onClick={handleAddTimestampNote}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Save Note
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add note at current time</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 2: AI TUTOR */}
          {activeRightTab === 'ai-tutor' && (
            <div className="flex-1 flex flex-col justify-between space-y-2 min-h-0">
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar text-xs">
                {tutorChat.length === 0 && (
                  <div className="py-10 text-center text-slate-400 space-y-2">
                    <Sparkles className="w-6 h-6 text-purple-400 mx-auto" />
                    <p className="font-semibold text-white">Ask AI Tutor anything</p>
                    <p className="text-[11px]">Get step-by-step math derivations, formulas, or conceptual explanations.</p>
                  </div>
                )}
                {tutorChat.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-600/20 border border-purple-500/30 text-purple-200 ml-4'
                        : 'bg-[#1A1A20] border border-white/5 text-slate-200 mr-2'
                    }`}
                  >
                    <p className="font-semibold text-[10px] text-slate-400 mb-1">
                      {msg.role === 'user' ? 'You' : 'AI Academic Tutor'}
                    </p>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                ))}
                {isTutorLoading && (
                  <div className="p-2.5 rounded-xl bg-[#1A1A20] text-purple-400 animate-pulse text-xs">
                    Deriving academic explanation...
                  </div>
                )}
              </div>

              <form onSubmit={handleAskAITutor} className="flex items-center gap-1.5 shrink-0 pt-1">
                <input
                  type="text"
                  value={tutorQuery}
                  onChange={(e) => setTutorQuery(e.target.value)}
                  placeholder="Ask a question about this lecture..."
                  className="flex-1 bg-[#1A1A20] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={isTutorLoading || !tutorQuery.trim()}
                  className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: QUIZ */}
          {activeRightTab === 'quiz' && (
            <div className="flex-1 flex flex-col justify-between space-y-3 min-h-0 overflow-y-auto custom-scrollbar">
              {isQuizLoading && (
                <div className="py-12 text-center text-xs text-emerald-400 animate-pulse">
                  Generating diagnostic quiz questions...
                </div>
              )}

              {!isQuizLoading && !lectureQuiz && (
                <div className="py-12 text-center text-slate-400 space-y-3">
                  <HelpCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-xs">
                    {quizError ? (
                      <span className="text-red-400 font-semibold">{quizError}</span>
                    ) : (
                      'No quiz generated for this lecture yet.'
                    )}
                  </p>
                  <button
                    onClick={handleGenerateQuiz}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    {quizError ? 'Retry Diagnostic Quiz' : 'Generate Diagnostic Quiz'}
                  </button>
                </div>
              )}

              {!isQuizLoading && lectureQuiz && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white">{lectureQuiz.title}</h4>
                  {lectureQuiz.questions.map((q: any, qIdx: number) => (
                    <div key={q.id} className="p-3 bg-[#1A1A20] rounded-xl border border-white/5 space-y-2 text-xs">
                      <p className="font-semibold text-slate-200">
                        {qIdx + 1}. {q.question}
                      </p>
                      <div className="space-y-1">
                        {q.options.map((opt: string, optIdx: number) => {
                          const isSelected = selectedAnswers[qIdx] === optIdx;
                          const isCorrect = q.correctOptionIndex === optIdx;
                          let btnStyle = 'bg-[#141418] border-white/10 text-slate-300 hover:border-emerald-500/50';

                          if (quizSubmitted) {
                            if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                            else if (isSelected && !isCorrect) btnStyle = 'bg-red-500/20 border-red-500 text-red-300';
                          } else if (isSelected) {
                            btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted}
                              onClick={() => setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                              className={`w-full text-left p-2 rounded-lg border text-xs transition-colors cursor-pointer ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <p className="text-[11px] text-slate-400 p-2 bg-[#141418] rounded-lg border border-white/5">
                          💡 <span className="font-semibold text-emerald-400">Explanation:</span> {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="pt-2">
                    {!quizSubmitted ? (
                      <button
                        onClick={handleSubmitQuiz}
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        Submit & View Score
                      </button>
                    ) : (
                      <button
                        onClick={handleGenerateQuiz}
                        className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        Generate New Questions
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Lecture Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-white/15 max-w-2xl w-full rounded-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">AI Lecture Summary</h3>
              </div>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-white/5 rounded-lg cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            {isSummaryLoading ? (
              <div className="py-12 text-center text-xs text-emerald-400 animate-pulse">
                Analyzing lecture content and creating structured study summary...
              </div>
            ) : (
              <div className="space-y-3">
                {summaryDisclaimer && (
                  <p className="text-[10px] text-slate-400 p-2.5 bg-[#1A1A20] border border-white/5 rounded-xl">
                    ℹ️ {summaryDisclaimer}
                  </p>
                )}
                <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {summaryText}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Claim Certificate Milestone Modal */}
      <ClaimCertificateModal
        course={course}
        milestone={claimMilestone}
        isOpen={showClaimModal}
        onClose={() => {
          setShowClaimModal(false);
          setClaimMilestone(null);
        }}
        onCertificateIssued={(cert) => {
          setViewerCert(cert);
        }}
      />

      {/* Certificate Viewer Modal */}
      <CertificateViewerModal
        certificate={viewerCert}
        isOpen={Boolean(viewerCert)}
        onClose={() => setViewerCert(null)}
        onOpenVerify={() => {}}
      />
    </div>
  );
};
