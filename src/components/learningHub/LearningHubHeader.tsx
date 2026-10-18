import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Clock,
  BookOpen,
  Calendar,
  Layers,
  Wand2,
  BrainCircuit,
  Calculator,
  BarChart3,
  Settings,
  ArrowLeft,
  PlusCircle,
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Compass,
  Menu,
  X,
  Award
} from 'lucide-react';
import { LearningHubTab } from '../../types/learningHub';
import { learningHubService } from '../../services/learningHubService';
import { AbhyvexaLogo } from '../AbhyvexaLogo';

interface LearningHubHeaderProps {
  activeTab: LearningHubTab;
  onSelectTab: (tab: LearningHubTab) => void;
  onBackToMain?: () => void;
  pomodoroSeconds: number;
  isPomodoroRunning: boolean;
  onTogglePomodoro: () => void;
  onResetPomodoro: () => void;
  onOpenSettings: () => void;
}

export const LearningHubHeader: React.FC<LearningHubHeaderProps> = ({
  activeTab,
  onSelectTab,
  onBackToMain,
  pomodoroSeconds,
  isPomodoroRunning,
  onTogglePomodoro,
  onResetPomodoro,
  onOpenSettings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Read live streak and target settings from learningHubService
  const streak = learningHubService.getStudyStreak();
  const settings = learningHubService.getUserSettings();

  // Format pomodoro seconds mm:ss
  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Target exam countdown
  const examDate = new Date(settings.targetExamDate || '2026-05-03');
  const today = new Date();
  const diffTime = examDate.getTime() - today.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const navItems: { id: LearningHubTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'certificates', label: 'Certificates', icon: Award, badge: 'VERIFIED' },
    { id: 'explore', label: 'Curated Catalog', icon: Compass },
    { id: 'converter', label: 'Import Playlist', icon: PlusCircle, badge: 'YouTube' },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'syllabus', label: 'Syllabus Tracker', icon: CheckCircle2 },
    { id: 'ai-center', label: 'AI Study Center', icon: BrainCircuit, badge: 'AI' },
    { id: 'practice', label: 'Quizzes & Flashcards', icon: Wand2 },
    { id: 'tools', label: 'Free Study Tools', icon: Calculator, badge: 'NEET/JEE' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0D0D0F]/95 backdrop-blur-md border-b border-[#22222A] text-white">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Optional host-site return link and Learning Hub brand */}
          <div className="flex items-center gap-3">
            {onBackToMain && (
              <button
                onClick={onBackToMain}
                title="Return to the host website"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white bg-[#1A1A22] hover:bg-[#252530] border border-[#2A2A38] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Main Site</span>
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <AbhyvexaLogo className="w-8 sm:w-9 h-8 sm:h-9 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold text-sm sm:text-base tracking-wider text-white">
                    ABHY<span className="text-[#00F5C4]">VEXA</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] sm:text-[9px] font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 tracking-widest uppercase">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-[#A1A1AA] hidden md:block tracking-wide font-medium">
                  LEARN BEYOND LIMITS
                </p>
              </div>
            </div>
          </div>

          {/* Quick Badges: Pomodoro Timer, Streak, Target Countdown */}
          <div className="flex items-center gap-2">
            {/* Header Pomodoro Focus Bar */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#141418] border border-[#242432] text-xs">
              <Timer className={`w-3.5 h-3.5 ${isPomodoroRunning ? 'text-amber-400 animate-pulse' : 'text-gray-400'}`} />
              <span className="font-mono font-bold text-white text-xs sm:text-sm">
                {formatTimer(pomodoroSeconds)}
              </span>
              <button
                onClick={onTogglePomodoro}
                className="p-1 rounded text-gray-300 hover:text-white hover:bg-[#22222E] transition-colors"
                title={isPomodoroRunning ? 'Pause Focus' : 'Start Focus'}
              >
                {isPomodoroRunning ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />}
              </button>
              <button
                onClick={onResetPomodoro}
                className="p-1 rounded text-gray-500 hover:text-gray-300 hover:bg-[#22222E] transition-colors"
                title="Reset Pomodoro"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Streak */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#141418] border border-[#242432] text-xs">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span className="font-bold text-white">{streak.streakDays}</span>
              <span className="text-gray-400 text-[10px]">d streak</span>
            </div>

            {/* Target Exam Countdown */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#141418] border border-[#242432] text-xs">
              <span className="text-gray-400 text-[10px]">{settings.targetExamName}:</span>
              <span className="font-bold text-emerald-400">{daysLeft}d left</span>
            </div>

            {/* Quick Import Playlist Action */}
            <button
              onClick={() => onSelectTab('converter')}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/25 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import Playlist</span>
              <span className="sm:hidden">Import</span>
            </button>

            {/* Settings Trigger */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-gray-400 hover:text-white bg-[#141418] hover:bg-[#1E1E26] border border-[#242432] transition-colors"
              title="ABHYVEXA Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile Nav Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-white bg-[#141418] hover:bg-[#1E1E26] border border-[#242432] sm:hidden transition-colors"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar (Desktop Horizontal Scroll) */}
      <div className="bg-[#111115] border-t border-[#1C1C24] px-3 sm:px-6 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#181822] border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                      isActive
                        ? 'bg-emerald-500/30 text-emerald-300'
                        : 'bg-[#22222E] text-gray-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#111116] border-b border-[#22222E] p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-gray-300 hover:bg-[#181822]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#20202E] text-gray-400">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
