import React, { useState, useEffect } from 'react';
import { LearningHubTab, LearningCourse } from '../../types/learningHub';
import { learningHubService } from '../../services/learningHubService';

import { LearningHubHeader } from './LearningHubHeader';
import { OverviewDashboard } from './OverviewDashboard';
import { CourseConverter } from './CourseConverter';
import { CoursePlayer } from './CoursePlayer';
import { CoursesView } from './CoursesView';
import { CuratedCatalogue } from './CuratedCatalogue';
import { StudyPlanner } from './StudyPlanner';
import { SyllabusTracker } from './SyllabusTracker';
import { AICenter } from './AICenter';
import { PracticeCenter } from './PracticeCenter';
import { ToolsDirectory } from './ToolsDirectory';
import { AnalyticsView } from './AnalyticsView';
import { SettingsModal } from './SettingsModal';
import { CertificateCenter } from './certificate/CertificateCenter';
import { AbhyvexaLogo } from '../AbhyvexaLogo';

interface LearningHubRootProps {
  onBackToMainWebsite?: () => void;
  initialTab?: LearningHubTab;
}

export const LearningHubRoot: React.FC<LearningHubRootProps> = ({
  onBackToMainWebsite,
  initialTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState<LearningHubTab>(initialTab);
  const [activeCourseId, setActiveCourseId] = useState<string>(() =>
    learningHubService.getActiveCourseId()
  );
  const [quickImportUrl, setQuickImportUrl] = useState<string>('');
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Global Pomodoro State
  const [pomodoroSeconds, setPomodoroSeconds] = useState<number>(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState<boolean>(false);

  // Record daily activity once mounted
  useEffect(() => {
    learningHubService.recordDailyActivity();
  }, []);

  // Pomodoro countdown timer tick
  useEffect(() => {
    if (!isPomodoroRunning) return;
    const interval = setInterval(() => {
      setPomodoroSeconds((prev) => {
        if (prev <= 1) {
          setIsPomodoroRunning(false);
          return 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPomodoroRunning]);

  const handleTogglePomodoro = () => setIsPomodoroRunning(!isPomodoroRunning);
  const handleResetPomodoro = () => {
    setIsPomodoroRunning(false);
    setPomodoroSeconds(25 * 60);
  };

  const handleOpenCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    learningHubService.setActiveCourseId(courseId);
    setActiveTab('courses');
  };

  const handleQuickImport = (url: string) => {
    setQuickImportUrl(url);
    setActiveTab('converter');
  };

  const handleCourseEnrolled = (courseId: string) => {
    setActiveCourseId(courseId);
    learningHubService.setActiveCourseId(courseId);
    setActiveTab('courses');
  };

  const handleEnrollCurated = (course: LearningCourse) => {
    learningHubService.enrollCourse(course);
    setActiveCourseId(course.id);
    setActiveTab('courses');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-slate-100 flex flex-col font-sans transition-colors selection:bg-emerald-500/30">
      {/* Universal Learning Hub Header */}
      <LearningHubHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onBackToMain={onBackToMainWebsite}
        pomodoroSeconds={pomodoroSeconds}
        isPomodoroRunning={isPomodoroRunning}
        onTogglePomodoro={handleTogglePomodoro}
        onResetPomodoro={handleResetPomodoro}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 pt-6">
        {activeTab === 'overview' && (
          <OverviewDashboard
            onSelectTab={setActiveTab}
            onOpenCourse={handleOpenCourse}
            onQuickImport={handleQuickImport}
          />
        )}

        {activeTab === 'courses' && (
          <>
            {activeCourseId ? (
              <CoursePlayer
                courseId={activeCourseId}
                onBackToCourses={() => setActiveCourseId('')}
                onOpenSyllabusMap={() => setActiveTab('syllabus')}
              />
            ) : (
              <CoursesView
                onOpenCourse={handleOpenCourse}
                onNavigateImport={() => setActiveTab('converter')}
                onNavigateExplore={() => setActiveTab('explore')}
                onNavigateCertificates={() => setActiveTab('certificates')}
              />
            )}
          </>
        )}

        {activeTab === 'certificates' && (
          <CertificateCenter
            onNavigateCourses={() => setActiveTab('courses')}
            onNavigateExplore={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'explore' && (
          <CuratedCatalogue onEnrollCourse={handleEnrollCurated} />
        )}

        {activeTab === 'converter' && (
          <CourseConverter
            initialUrl={quickImportUrl}
            onCourseEnrolled={handleCourseEnrolled}
            onExploreCurated={() => setActiveTab('explore')}
            onNavigateToPlanner={() => setActiveTab('planner')}
          />
        )}

        {activeTab === 'planner' && (
          <StudyPlanner onOpenCourse={handleOpenCourse} />
        )}

        {activeTab === 'syllabus' && (
          <SyllabusTracker
            onBackToOverview={() => setActiveTab('overview')}
            onNavigateToTab={(tab) => setActiveTab(tab as any)}
          />
        )}

        {activeTab === 'ai-center' && <AICenter />}

        {activeTab === 'practice' && <PracticeCenter />}

        {activeTab === 'tools' && <ToolsDirectory />}

        {activeTab === 'analytics' && <AnalyticsView />}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* ABHYVEXA Workspace Footer */}
      <footer className="mt-auto border-t border-[#22222A] bg-[#0A0A0E] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A1A1AA]">
          <div className="flex items-center gap-2.5">
            <AbhyvexaLogo className="w-5 h-5" />
            <span className="font-extrabold text-[#F5F5F5] tracking-wider">
              ABHY<span className="text-[#00F5C4]">VEXA</span>
            </span>
            <span className="text-[#27272A]">•</span>
            <span className="text-[#71717A] text-[11px] font-medium tracking-wide">
              LEARN BEYOND LIMITS
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#71717A]">
            <span>Empowering Academic Excellence & Self-Paced Mastery</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
