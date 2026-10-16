import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Play,
  CheckCircle2,
  Trash2,
  Plus,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  Check,
  TrendingUp,
  BarChart2,
  Calendar,
  Grid,
  List,
  Award
} from 'lucide-react';
import { LearningCourse } from '../../types/learningHub';
import { learningHubService } from '../../services/learningHubService';

interface CoursesViewProps {
  onOpenCourse: (courseId: string) => void;
  onNavigateImport: () => void;
  onNavigateExplore: () => void;
  onNavigateCertificates?: () => void;
}

type FilterStatus = 'all' | 'in_progress' | 'completed' | 'not_started';
type SortOption = 'recent' | 'progress_desc' | 'progress_asc' | 'title';

export const CoursesView: React.FC<CoursesViewProps> = ({
  onOpenCourse,
  onNavigateImport,
  onNavigateExplore,
  onNavigateCertificates
}) => {
  const [courses, setCourses] = useState<LearningCourse[]>(() =>
    learningHubService.getCourses()
  );
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deleteConfirmCourseId, setDeleteConfirmCourseId] = useState<string | null>(null);

  // Derive unique categories from existing courses
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    courses.forEach((c) => {
      if (c.examCategory) cats.add(c.examCategory);
    });
    return Array.from(cats);
  }, [courses]);

  // Aggregate Metrics derived from real course state
  const totalPlaylists = courses.length;
  const inProgressCount = courses.filter((c) => (c.completedLecturesCount || 0) > 0 && c.status !== 'completed').length;
  const completedCount = courses.filter((c) => c.status === 'completed' || (c.progressPercentage || 0) >= 100).length;
  const notStartedCount = courses.filter((c) => (c.completedLecturesCount || 0) === 0 && c.status !== 'completed').length;

  const totalVideos = courses.reduce((acc, c) => acc + (c.lectures?.length || 0), 0);
  const totalWatched = courses.reduce((acc, c) => acc + (c.completedLecturesCount || 0), 0);
  const overallAvgProgress = totalVideos > 0 ? Math.round((totalWatched / totalVideos) * 100) : 0;

  // Filtered & Sorted list
  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => {
        // Status Filter
        if (statusFilter === 'in_progress') {
          if ((c.completedLecturesCount || 0) === 0 || c.status === 'completed' || (c.progressPercentage || 0) >= 100) return false;
        } else if (statusFilter === 'completed') {
          if (c.status !== 'completed' && (c.progressPercentage || 0) < 100) return false;
        } else if (statusFilter === 'not_started') {
          if ((c.completedLecturesCount || 0) > 0) return false;
        }

        // Category Filter
        if (categoryFilter !== 'all' && c.examCategory !== categoryFilter) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = c.title.toLowerCase().includes(q);
          const matchChannel = c.channelName?.toLowerCase().includes(q) || false;
          const matchCategory = c.examCategory?.toLowerCase().includes(q) || false;
          return matchTitle || matchChannel || matchCategory;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'progress_desc') return (b.progressPercentage || 0) - (a.progressPercentage || 0);
        if (sortBy === 'progress_asc') return (a.progressPercentage || 0) - (b.progressPercentage || 0);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        // default recent
        return (b.lastAccessedAt || b.createdAt || 0) - (a.lastAccessedAt || a.createdAt || 0);
      });
  }, [courses, statusFilter, categoryFilter, searchQuery, sortBy]);

  const handleDeleteCourse = (courseId: string) => {
    learningHubService.deleteCourse(courseId);
    setCourses(learningHubService.getCourses());
    setDeleteConfirmCourseId(null);
  };

  return (
    <div className="space-y-6 pb-20 text-slate-100 max-w-6xl mx-auto">
      {/* 1. Header Bar with Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#141418] border border-white/10 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold tracking-wide border border-emerald-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Structured YouTube Courses</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            My Courses Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Track structured lectures, automatic bookmarks, timestamped study notes, and video progress.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onNavigateImport}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Playlist</span>
          </button>
          <button
            onClick={onNavigateExplore}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Explore Paths</span>
          </button>
          {onNavigateCertificates && (
            <button
              onClick={onNavigateCertificates}
              className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Certificates Hub</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Metric Bar matching Screenshot 4 */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#141418] border border-white/10 grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
        {/* Playlists Count */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Playlists</span>
            <span className="text-xl font-black text-white">{totalPlaylists}</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">In Progress</span>
            <span className="text-xl font-black text-blue-400">{inProgressCount}</span>
          </div>
        </div>

        {/* Completed */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Completed</span>
            <span className="text-xl font-black text-emerald-400">{completedCount}</span>
          </div>
        </div>

        {/* Overall Completion Gauge */}
        <div className="col-span-2 md:col-span-1 p-2.5 rounded-xl bg-[#1A1A20] border border-white/5 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Videos Watched</span>
            <span className="text-xs text-slate-300 font-medium">
              <strong className="text-emerald-400">{totalWatched}</strong> / {totalVideos}
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-emerald-400">{overallAvgProgress}%</span>
            <div className="w-16 h-1.5 rounded-full bg-black/60 overflow-hidden mt-1">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${overallAvgProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Average Progress */}
        <div className="hidden md:flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Avg Progress</span>
            <span className="text-xl font-black text-white">{overallAvgProgress}%</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Pills & Search matching Screenshot 4 */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#141418] p-3 rounded-2xl border border-white/10">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          {(
            [
              { id: 'all', label: 'All', count: totalPlaylists },
              { id: 'in_progress', label: 'In Progress', count: inProgressCount },
              { id: 'completed', label: 'Completed', count: completedCount },
              { id: 'not_started', label: 'Not Started', count: notStartedCount }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-[#181820] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search playlists..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#181820] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-1.5 bg-[#181820] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="recent">Recently Added / Viewed</option>
            <option value="progress_desc">Highest Progress</option>
            <option value="progress_asc">Lowest Progress</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* 4. Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => {
          const isDone = course.status === 'completed' || (course.progressPercentage || 0) >= 100;
          const durationHours = (course.totalDurationSeconds / 3600).toFixed(1);

          return (
            <div
              key={course.id}
              onClick={() => onOpenCourse(course.id)}
              className="rounded-2xl bg-[#141418] border border-white/10 hover:border-emerald-500/40 hover:bg-[#181820] transition-all overflow-hidden flex flex-col justify-between group cursor-pointer shadow-lg hover:shadow-emerald-950/20"
            >
              <div>
                {/* Thumbnail with overlay duration badge */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-md text-emerald-400 border border-white/10 shadow-xs">
                      {course.examCategory || 'Curriculum'}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/80 text-white backdrop-blur-sm border border-white/10">
                    {durationHours}h Total
                  </div>
                </div>

                {/* Course Metadata Body */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-medium block truncate">
                      {course.channelName || 'YouTube Educator'}
                    </span>
                    <h3 className="font-extrabold text-sm text-white line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
                      {course.title}
                    </h3>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>
                        <strong className="text-white">{course.completedLecturesCount || 0}</strong>/{course.lectures?.length || 0} Lectures Done
                      </span>
                      <span className={`font-bold ${isDone ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {course.progressPercentage || 0}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-black/50 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                        style={{ width: `${course.progressPercentage || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-white/5 mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCourse(course.id);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isDone ? 'Review Course' : 'Resume Lecture'}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmCourseId(course.id);
                  }}
                  className="p-2 text-slate-500 hover:text-red-400 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                  title="Remove Course from Portfolio"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="py-20 text-center text-slate-400 p-8 rounded-3xl bg-[#141418] border border-dashed border-white/10 space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-slate-500 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Courses Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery
                ? `No courses match "${searchQuery}". Clear your search query or change filters.`
                : 'You have not enrolled in any courses for this filter yet.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onNavigateImport}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold cursor-pointer"
            >
              Import Playlist URL
            </button>
            <button
              onClick={onNavigateExplore}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold cursor-pointer"
            >
              Browse Curated Paths
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmCourseId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#141418] border border-red-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <Trash2 className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">Remove Course?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to remove this course and its saved lecture timestamps from your portfolio? You can re-import it anytime via URL.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmCourseId(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-bold hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCourse(deleteConfirmCourseId)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-400"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
