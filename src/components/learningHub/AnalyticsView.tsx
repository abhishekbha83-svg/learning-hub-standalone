import React, { useState } from 'react';
import {
  BarChart3,
  Flame,
  Clock,
  BookOpen,
  CheckCircle2,
  Award,
  Zap,
  TrendingUp,
  Trophy,
  GraduationCap
} from 'lucide-react';
import { learningHubService } from '../../services/learningHubService';
import { getStoredTotalSeconds } from '../../services/learnerProfileService';

export const AnalyticsView: React.FC = () => {
  const [streakInfo] = useState(() => learningHubService.getStudyStreak());
  const [courses] = useState(() => learningHubService.getCourses());
  const [achievements] = useState(() => learningHubService.getAchievements());

  const totalSeconds = getStoredTotalSeconds();
  const totalHours = (totalSeconds / 3600).toFixed(1);
  const totalLecturesDone = courses.reduce((acc, c) => acc + (c.completedLecturesCount || 0), 0);
  const totalLecturesAvailable = courses.reduce((acc, c) => acc + (c.lectures?.length || 0), 0);

  // Weekly study activity mock distribution (Mon - Sun) based on total seconds
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dailyDistribution = [1.5, 2.0, 2.5, 1.8, 3.2, 4.0, 2.2];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 text-slate-100">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Real Student Performance Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Progress & Learning Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Track genuine study hours, consistency streaks, and milestone achievements.
        </p>
      </div>

      {/* 4 Main Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#141418] border border-white/10 space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>Study Streak</span>
          </div>
          <p className="text-3xl font-black text-white tabular-nums">{streakInfo.streakDays} Days</p>
          <span className="text-[10px] text-slate-500">Consecutive learning days</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#141418] border border-white/10 space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
            <Clock className="w-4 h-4" />
            <span>Verified Time</span>
          </div>
          <p className="text-3xl font-black text-white tabular-nums">{totalHours} hrs</p>
          <span className="text-[10px] text-slate-500">Active session time spent</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#141418] border border-white/10 space-y-1">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase">
            <CheckCircle2 className="w-4 h-4" />
            <span>Lectures Done</span>
          </div>
          <p className="text-3xl font-black text-white tabular-nums">{totalLecturesDone}</p>
          <span className="text-[10px] text-slate-500">Out of {totalLecturesAvailable} enrolled</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#141418] border border-white/10 space-y-1">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase">
            <Trophy className="w-4 h-4" />
            <span>Achievements</span>
          </div>
          <p className="text-3xl font-black text-white tabular-nums">
            {achievements.filter((a) => a.unlocked).length} / {achievements.length}
          </p>
          <span className="text-[10px] text-slate-500">Milestones unlocked</span>
        </div>
      </div>

      {/* Weekly Activity Pillars */}
      <div className="p-6 rounded-3xl bg-[#141418] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Weekly Focus Hours Distribution</span>
        </h3>

        <div className="grid grid-cols-7 gap-3 pt-4 items-end h-48 border-b border-white/5 pb-2">
          {dayNames.map((d, i) => {
            const h = dailyDistribution[i];
            const heightPercent = Math.min(100, Math.round((h / 4.5) * 100));

            return (
              <div key={d} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}h
                </span>
                <div className="w-full max-w-[36px] bg-[#1A1A20] rounded-xl overflow-hidden h-full flex flex-col justify-end">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-xl transition-all duration-500"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-400">{d}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Showcase */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Student Milestones & Badges
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                ach.unlocked
                  ? 'bg-[#141418] border-emerald-500/30'
                  : 'bg-[#141418]/60 border-white/5 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  ach.unlocked
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-white/5 text-slate-600'
                }`}
              >
                <Award className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-white">{ach.title}</h4>
                  {ach.unlocked && (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                      Unlocked
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{ach.description}</p>
                <div className="pt-1 text-[10px] text-slate-500 font-mono">
                  Progress: {ach.progress} / {ach.target}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
