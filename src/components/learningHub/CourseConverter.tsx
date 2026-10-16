import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Youtube,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  List,
  Video,
  Edit2,
  Trash2,
  RefreshCw,
  FolderOpen,
  Plus,
  Calendar,
  Check,
  ChevronRight,
  Play,
  Film
} from 'lucide-react';
import { LearningCourse, LectureItem } from '../../types/learningHub';
import { learningHubService } from '../../services/learningHubService';

interface CourseConverterProps {
  initialUrl?: string;
  onCourseEnrolled: (courseId: string) => void;
  onExploreCurated: () => void;
  onNavigateToPlanner?: () => void;
}

export type DetectedYouTubeType = 'playlist' | 'video' | 'both' | 'unknown' | 'none';

interface ParsedUrlState {
  type: DetectedYouTubeType;
  videoId?: string;
  playlistId?: string;
  label: string;
}

export function detectYouTubeType(rawUrl: string): ParsedUrlState {
  if (!rawUrl || !rawUrl.trim()) {
    return { type: 'none', label: 'Enter a YouTube URL to detect' };
  }
  const clean = rawUrl.trim();

  let videoId: string | undefined;
  let playlistId: string | undefined;

  // 1. Playlist match
  const playlistMatch = clean.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (playlistMatch && playlistMatch[1]) {
    playlistId = playlistMatch[1];
  }

  // 2. Video matches
  const youtuBeMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (youtuBeMatch && youtuBeMatch[1]) {
    videoId = youtuBeMatch[1];
  }

  if (!videoId) {
    const watchMatch = clean.match(
      /(?:youtube\.com|m\.youtube\.com)\/(?:watch\?.*v=|embed\/|v\/|shorts\/|live\/)([a-zA-Z0-9_-]{11})/
    );
    if (watchMatch && watchMatch[1]) {
      videoId = watchMatch[1];
    }
  }

  // 3. Raw IDs
  if (!videoId && !playlistId && /^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    videoId = clean;
  }
  if (!videoId && !playlistId && /^(?:PL|UU|FL|RD|OLAK)[a-zA-Z0-9_-]+$/.test(clean)) {
    playlistId = clean;
  }

  if (videoId && playlistId) {
    return {
      type: 'both',
      videoId,
      playlistId,
      label: 'Video within a Playlist (Single Video or Full Series)'
    };
  }
  if (playlistId) {
    return {
      type: 'playlist',
      playlistId,
      label: 'YouTube Playlist Series'
    };
  }
  if (videoId) {
    const isShorts = clean.includes('/shorts/');
    const isLive = clean.includes('/live/');
    return {
      type: 'video',
      videoId,
      label: isShorts
        ? 'YouTube Shorts Video'
        : isLive
        ? 'YouTube Live Stream'
        : 'Single YouTube Lecture Video'
    };
  }

  return { type: 'unknown', label: 'Unrecognized URL (Must be a YouTube link)' };
}

export const CourseConverter: React.FC<CourseConverterProps> = ({
  initialUrl = '',
  onCourseEnrolled,
  onExploreCurated,
  onNavigateToPlanner
}) => {
  const [url, setUrl] = useState<string>(initialUrl);
  const [selectedExam, setSelectedExam] = useState<string>('General');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [resolutionMode, setResolutionMode] = useState<'auto' | 'playlist' | 'video'>('auto');

  // Resolution state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [previewCourse, setPreviewCourse] = useState<LearningCourse | null>(null);

  // Individual video queue workflow
  const [queuedLectures, setQueuedLectures] = useState<LectureItem[]>([]);
  const [singleVideoPreview, setSingleVideoPreview] = useState<{
    lecture: LectureItem;
    author: string;
    course: LearningCourse;
  } | null>(null);

  // Success indicator
  const [planSuccessNotice, setPlanSuccessNotice] = useState<string>('');

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const exams = [
    'General',
    'JEE',
    'NEET',
    'UPSC',
    'GATE',
    'Coding',
    'SSC & Govt',
    'School Boards'
  ];

  const samplePlaylists = [
    {
      name: 'Python Mastery (Corey Schafer)',
      url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU',
      exam: 'Coding'
    },
    {
      name: 'DSA Graph Series (Striver)',
      url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn',
      exam: 'Coding'
    },
    {
      name: 'Essence of Calculus (3Blue1Brown)',
      url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr',
      exam: 'JEE'
    },
    {
      name: 'Sample Lecture Video (Physics)',
      url: 'https://www.youtube.com/watch?v=b1t41Q3xRM8',
      exam: 'JEE'
    }
  ];

  const detection = useMemo(() => detectYouTubeType(url), [url]);

  // Handle URL changes with automatic detection & debounced resolve
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!url.trim()) {
      setErrorMessage('');
      setPreviewCourse(null);
      setSingleVideoPreview(null);
      return;
    }

    if (detection.type === 'unknown') {
      setErrorMessage('Please enter a valid YouTube video or playlist link.');
      setPreviewCourse(null);
      setSingleVideoPreview(null);
      return;
    }

    setErrorMessage('');

    // If valid URL detected, trigger resolution automatically after 700ms debounce
    debounceTimerRef.current = setTimeout(() => {
      handleResolveUrl(url.trim(), resolutionMode);
    }, 700);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [url, resolutionMode]);

  const handleResolveUrl = async (
    targetUrl: string,
    mode: 'auto' | 'playlist' | 'video' = resolutionMode
  ) => {
    if (!targetUrl.trim()) return;

    setIsLoading(true);
    setErrorMessage('');
    setPlanSuccessNotice('');

    try {
      const res = await fetch('/api/learning-hub/youtube/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl.trim(),
          preferredExam: selectedExam,
          customTitle: customTitle.trim() || undefined,
          mode
        })
      });

      const data = await res.json();
      if (!data?.success) {
        setErrorMessage(
          data?.error || 'Unable to load YouTube data. Please ensure the link is public and accessible.'
        );
        setPreviewCourse(null);
        setSingleVideoPreview(null);
        return;
      }

      if (data.notice) {
        setPlanSuccessNotice(data.notice);
      }

      if (data.type === 'video' && data.singleLecture) {
        setSingleVideoPreview({
          lecture: data.singleLecture,
          author: data.metadata?.author || 'YouTube Educator',
          course: data.course
        });
        setPreviewCourse(data.course);
      } else if (data.course) {
        setPreviewCourse(data.course);
        setSingleVideoPreview(null);
      }
    } catch {
      setErrorMessage(
        'Could not load YouTube data. Please ensure the link is public and accessible, or try importing an individual video.'
      );
      setPreviewCourse(null);
      setSingleVideoPreview(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Add currently resolved single video to queue
  const handleAddCurrentVideoToQueue = () => {
    if (!singleVideoPreview) return;
    const lec = singleVideoPreview.lecture;
    if (queuedLectures.some((q) => q.videoId === lec.videoId)) {
      setErrorMessage('This video is already in your course queue.');
      return;
    }

    const nextOrder = queuedLectures.length + 1;
    const newQueueItem: LectureItem = {
      ...lec,
      id: `lec-${lec.videoId}-${Date.now()}`,
      order: nextOrder
    };

    setQueuedLectures([...queuedLectures, newQueueItem]);
    setUrl('');
    setSingleVideoPreview(null);
    setPreviewCourse(null);
    setErrorMessage('');
  };

  const handleRemoveQueuedLecture = (index: number) => {
    const updated = queuedLectures.filter((_, idx) => idx !== index);
    setQueuedLectures(updated);
  };

  // Create course from queued single videos
  const handleCreateCourseFromQueue = (launchClassroom: boolean = true) => {
    if (queuedLectures.length === 0) return;

    const courseTitle =
      customTitle.trim() ||
      (queuedLectures.length === 1
        ? queuedLectures[0].title
        : `${selectedExam} Custom Lecture Series (${queuedLectures.length} Lectures)`);

    const createdCourse = learningHubService.createCourseFromLectures({
      title: courseTitle,
      examCategory: selectedExam,
      lectures: queuedLectures,
      sourceUrl: queuedLectures[0]?.videoId ? `https://www.youtube.com/watch?v=${queuedLectures[0].videoId}` : ''
    });

    if (launchClassroom) {
      onCourseEnrolled(createdCourse.id);
    } else {
      learningHubService.scheduleCourseInPlanner(createdCourse, 2);
      setPlanSuccessNotice(
        `Course "${createdCourse.title}" created and scheduled in your Study Planner!`
      );
      setTimeout(() => {
        if (onNavigateToPlanner) onNavigateToPlanner();
      }, 1200);
    }
  };

  // Enroll and open classroom immediately
  const handleEnrollAndLaunchClassroom = () => {
    if (!previewCourse) return;
    learningHubService.enrollCourse(previewCourse);
    onCourseEnrolled(previewCourse.id);
  };

  // Enroll and add to study planner
  const handleEnrollAndAddToPlanner = () => {
    if (!previewCourse) return;
    learningHubService.enrollCourse(previewCourse);
    learningHubService.scheduleCourseInPlanner(previewCourse, 2);
    setPlanSuccessNotice(
      `Course "${previewCourse.title}" successfully enrolled and added to your Study Planner!`
    );
    setTimeout(() => {
      if (onNavigateToPlanner) {
        onNavigateToPlanner();
      } else {
        onCourseEnrolled(previewCourse.id);
      }
    }, 1200);
  };

  const totalQueuedDuration = queuedLectures.reduce(
    (acc, l) => acc + (l.durationSeconds || 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-slate-100">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Youtube className="w-3.5 h-3.5 fill-red-500 text-white" />
          <span>YouTube Course Studio</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Turn Any YouTube Link Into a Structured Course
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Paste any YouTube playlist or individual lecture video. We automatically extract genuine titles, durations, and video IDs, build organized chapters, and launch into the classroom with notes and AI tutoring.
        </p>
      </div>

      {/* Main Conversion Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-6 shadow-2xl">
        {/* Detection Status Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Content Type:</span>
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                detection.type === 'playlist'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : detection.type === 'video'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : detection.type === 'both'
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                  : detection.type === 'unknown'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                  : 'bg-white/5 text-slate-400 border border-white/10'
              }`}
            >
              {detection.type === 'playlist' && <List className="w-3 h-3" />}
              {detection.type === 'video' && <Video className="w-3 h-3" />}
              {detection.type === 'both' && <Layers className="w-3 h-3" />}
              {detection.type === 'unknown' && <AlertCircle className="w-3 h-3" />}
              <span>{detection.label}</span>
            </div>
          </div>

          {/* If URL contains BOTH watch and playlist, allow user to pick mode */}
          {detection.type === 'both' && (
            <div className="flex items-center gap-1 bg-[#1A1A20] p-1 rounded-xl text-xs">
              <span className="text-[10px] text-slate-400 px-2">Import as:</span>
              <button
                type="button"
                onClick={() => setResolutionMode('playlist')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition-all ${
                  resolutionMode === 'playlist' || resolutionMode === 'auto'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Full Playlist
              </button>
              <button
                type="button"
                onClick={() => setResolutionMode('video')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition-all ${
                  resolutionMode === 'video'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                This Video Only
              </button>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                YouTube URL (Playlist, Video, Shorts, or Live)
              </label>
              {detection.videoId && (
                <span className="text-[10px] text-slate-500 font-mono">
                  ID: {detection.videoId}
                </span>
              )}
              {detection.playlistId && !detection.videoId && (
                <span className="text-[10px] text-slate-500 font-mono">
                  Playlist: {detection.playlistId}
                </span>
              )}
            </div>
            <div className="relative">
              <Youtube className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste any YouTube playlist or video link..."
                className="w-full pl-10 pr-28 py-3 bg-[#1A1A20] border border-white/10 focus:border-emerald-500/50 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="button"
                disabled={isLoading || !url.trim()}
                onClick={() => handleResolveUrl(url.trim(), resolutionMode)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isLoading ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                <span>Resolve</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Target Exam / Subject</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1A1A20] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
              >
                {exams.map((ex) => (
                  <option key={ex} value={ex} className="bg-[#141418] text-white">
                    {ex}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Custom Course Title <span className="text-slate-500">(Optional)</span>
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Leave blank to use authentic YouTube title"
                className="w-full px-3 py-2.5 bg-[#1A1A20] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2.5 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400 shrink-0" />
              <span>Fetching verified YouTube metadata, title, order, and duration...</span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <div className="space-y-1">
                  <p className="font-semibold text-red-300">Unable to resolve YouTube URL</p>
                  <p className="text-[11px] text-red-300/90 leading-relaxed">{errorMessage}</p>
                </div>
              </div>

              {/* Helpful suggestions */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-red-500/15">
                <span className="text-[11px] text-slate-400">Try verified alternatives:</span>
                <button
                  type="button"
                  onClick={() => {
                    setUrl('https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn');
                    setSelectedExam('Coding');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium transition cursor-pointer"
                >
                  DSA Graph Series
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUrl('https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr');
                    setSelectedExam('JEE');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium transition cursor-pointer"
                >
                  Calculus (3Blue1Brown)
                </button>
                <button
                  type="button"
                  onClick={onExploreCurated}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] font-medium transition cursor-pointer"
                >
                  Browse Curated Courses →
                </button>
              </div>
            </div>
          )}

          {/* Success Notice */}
          {planSuccessNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{planSuccessNotice}</span>
            </div>
          )}
        </div>

        {/* Quick Sample Links */}
        <div className="pt-4 border-t border-white/5 space-y-2">
          <p className="text-xs font-medium text-slate-400">Quick Test with Verified YouTube URLs:</p>
          <div className="flex flex-wrap gap-2">
            {samplePlaylists.map((sample) => (
              <button
                key={sample.name}
                type="button"
                onClick={() => {
                  setUrl(sample.url);
                  setSelectedExam(sample.exam);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#1A1A20] hover:bg-white/10 border border-white/5 text-[11px] text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Youtube className="w-3 h-3 text-red-500" />
                <span>{sample.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INDIVIDUAL VIDEO PREVIEW & QUEUE WORKFLOW */}
      {singleVideoPreview && (
        <div className="p-6 rounded-3xl bg-[#141418] border border-emerald-500/30 space-y-5 animate-in fade-in duration-200 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Individual Lecture Video Detected
                </span>
                <h3 className="text-sm font-bold text-white">Video Information Retrieved</h3>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-bold">
              {singleVideoPreview.lecture.durationFormatted}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="relative w-full sm:w-48 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
              <img
                src={singleVideoPreview.lecture.thumbnailUrl}
                alt={singleVideoPreview.lecture.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                {singleVideoPreview.lecture.durationFormatted}
              </div>
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              <h4 className="text-base font-bold text-white leading-snug">
                {singleVideoPreview.lecture.title}
              </h4>
              <p className="text-xs text-slate-400">
                Channel: <span className="text-slate-200 font-semibold">{singleVideoPreview.author}</span> · Video ID:{' '}
                <span className="font-mono text-slate-300">{singleVideoPreview.lecture.videoId}</span>
              </p>

              {/* Action Buttons for this Single Video */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleEnrollAndLaunchClassroom}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Studying This Video Now</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddCurrentVideoToQueue}
                  className="px-4 py-2 rounded-xl bg-[#1A1A20] hover:bg-white/10 border border-white/15 text-slate-200 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Add to Course Queue ({queuedLectures.length})</span>
                </button>

                <button
                  type="button"
                  onClick={handleEnrollAndAddToPlanner}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>Add to Study Plan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUEUED LECTURES SECTION (FOR INDIVIDUAL VIDEO BATCHING) */}
      {queuedLectures.length > 0 && (
        <div className="p-6 rounded-3xl bg-[#141418] border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400">Course Queue</span>
                <span className="text-[10px] font-bold text-slate-400 bg-white/10 px-2 py-0.5 rounded-full">
                  {queuedLectures.length} {queuedLectures.length === 1 ? 'Lecture' : 'Lectures'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Total duration: {Math.floor(totalQueuedDuration / 60)} minutes · Ready to assemble into a full course
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCreateCourseFromQueue(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md shadow-emerald-500/25 flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Create Course & Launch Classroom</span>
              </button>
              <button
                type="button"
                onClick={() => handleCreateCourseFromQueue(false)}
                className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/30 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Add to Planner</span>
              </button>
            </div>
          </div>

          {/* List of queued lectures */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {queuedLectures.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-2.5 bg-[#1A1A20] rounded-xl border border-white/5 hover:border-white/15 transition-all text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-12 h-8 rounded object-cover shrink-0"
                  />
                  <span className="font-medium text-slate-200 truncate">{item.title}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-mono text-slate-400">
                    {item.durationFormatted}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveQueuedLecture(idx)}
                    className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400 cursor-pointer transition-colors"
                    title="Remove from queue"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FULL PLAYLIST PREVIEW SECTION */}
      {previewCourse && !singleVideoPreview && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141418] border border-emerald-500/30 space-y-6 animate-in fade-in duration-300 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Verified YouTube Course Ready
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                {previewCourse.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Channel: <span className="text-slate-200 font-semibold">{previewCourse.channelName}</span> ·{' '}
                {previewCourse.lectures.length} Lectures · {previewCourse.chapters.length} Organized Chapters ·{' '}
                {Math.round(previewCourse.totalDurationSeconds / 3600)} Hours Content
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleEnrollAndLaunchClassroom}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Launch Classroom</span>
              </button>

              <button
                type="button"
                onClick={handleEnrollAndAddToPlanner}
                className="px-4 py-2.5 rounded-xl bg-[#1A1A20] hover:bg-white/10 border border-white/15 text-slate-200 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>Add to Study Plan</span>
              </button>
            </div>
          </div>

          {/* Chapters & Lectures breakdown */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Curriculum Structure ({previewCourse.chapters.length} Modules)</span>
              <span className="text-[11px] text-emerald-400 lowercase font-normal font-mono">
                {previewCourse.lectures.length} verified lectures
              </span>
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {previewCourse.chapters.map((ch) => (
                <div key={ch.id} className="p-3.5 bg-[#1A1A20] rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300">{ch.title}</span>
                    <span className="text-[10px] text-slate-500">{ch.lectureIds.length} lectures</span>
                  </div>

                  <div className="space-y-1.5 pl-2 border-l border-white/10">
                    {ch.lectureIds.map((lecId) => {
                      const lec = previewCourse.lectures.find((l) => l.id === lecId);
                      if (!lec) return null;
                      return (
                        <div
                          key={lec.id}
                          className="flex items-center justify-between text-xs py-1 text-slate-300 hover:text-white group"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-4">
                            <span className="text-[10px] font-mono text-slate-500 w-5 shrink-0">
                              #{lec.order}
                            </span>
                            <span className="truncate">{lec.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0">
                            {lec.durationFormatted}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
            <span className="text-xs text-slate-400">
              Progress, notes, and AI quiz results persist automatically in your Study Hub.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEnrollAndAddToPlanner}
                className="px-5 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/30 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Study Plan</span>
              </button>
              <button
                type="button"
                onClick={handleEnrollAndLaunchClassroom}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Confirm & Open Classroom</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
