import React, { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  Sparkles,
  BookOpen,
  Play,
  ArrowRight,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { LearningCourse } from '../../types/learningHub';
import { learningHubService } from '../../services/learningHubService';

interface CuratedCatalogueProps {
  onEnrollCourse: (course: LearningCourse) => void;
}

export const CuratedCatalogue: React.FC<CuratedCatalogueProps> = ({ onEnrollCourse }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const categories = ['All', 'JEE', 'NEET', 'UPSC', 'Coding', 'General'];

  useEffect(() => {
    fetch('/api/learning-hub/curated')
      .then((r) => r.json())
      .then((data) => {
        if (data.courses) setCourses(data.courses);
      })
      .catch((e) => console.warn('Curated fetch error:', e))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = courses.filter((c) => {
    if (selectedCategory !== 'All' && c.examCategory !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        c.title.toLowerCase().includes(q) ||
        (c.channelName && c.channelName.toLowerCase().includes(q)) ||
        (c.subject && c.subject.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16 text-slate-100 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>Curated Foundational Pathways</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Curated Learning Paths
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          High-yield, ad-free courses structured from India's most celebrated faculty and educators.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#141418] p-2 rounded-2xl border border-white/10">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto custom-scrollbar pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-[#1A1A20] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search curated courses..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#1A1A20] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Curated Courses */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-emerald-400 animate-pulse">
          Loading curated courses catalogue...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl bg-[#141418] border border-white/10 hover:border-emerald-500/40 transition-all overflow-hidden flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/25" />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 backdrop-blur-md text-emerald-400 border border-white/10">
                      {course.examCategory}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/75 text-white">
                    {course.lectures?.length || 0} Lectures
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[11px] text-slate-400 font-medium block">
                    {course.channelName}
                  </span>
                  <h3 className="font-bold text-sm text-white line-clamp-2 leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {course.chapters?.length || 0} Chapters · Complete exam foundation series with notes.
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => onEnrollCourse(course)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Enroll & Start Studying</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
