import React, { useState, useEffect, useMemo } from 'react';
import { CourseCertificate, CertificateMilestone, CourseMilestoneStatus } from '../../../types/certificate';
import { LearningCourse } from '../../../types/learningHub';
import { certificateService } from '../../../services/certificateService';
import { learningHubService } from '../../../services/learningHubService';
import { CertificateCard } from './CertificateCard';
import { CertificateViewerModal } from './CertificateViewerModal';
import { ClaimCertificateModal } from './ClaimCertificateModal';
import { PublicCertificateVerificationModal } from './PublicCertificateVerificationModal';
import {
  Award,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  Search,
  Filter,
  Plus,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  ExternalLink
} from 'lucide-react';

interface CertificateCenterProps {
  onNavigateCourses: () => void;
  onNavigateExplore: () => void;
}

type ViewFilter = 'all' | '100' | 'progress' | 'tracker';

export const CertificateCenter: React.FC<CertificateCenterProps> = ({
  onNavigateCourses,
  onNavigateExplore
}) => {
  const [certificates, setCertificates] = useState<CourseCertificate[]>(() =>
    certificateService.getStoredCertificates()
  );
  const [courses, setCourses] = useState<LearningCourse[]>(() =>
    learningHubService.getCourses()
  );

  const [activeFilter, setActiveFilter] = useState<ViewFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [viewerCert, setViewerCert] = useState<CourseCertificate | null>(null);
  const [claimCourse, setClaimCourse] = useState<LearningCourse | null>(null);
  const [claimMilestone, setClaimMilestone] = useState<CertificateMilestone | null>(null);
  const [verifyCertId, setVerifyCertId] = useState<string>('');
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);

  // Re-sync on mount
  useEffect(() => {
    setCertificates(certificateService.getStoredCertificates());
    setCourses(learningHubService.getCourses());
  }, []);

  // Compute milestone status for all courses
  const courseMilestoneStatuses = useMemo<CourseMilestoneStatus[]>(() => {
    return courses.map((course) =>
      certificateService.calculateCourseMilestoneStatus(course, certificates)
    );
  }, [courses, certificates]);

  // Aggregate stats
  const totalEarned = certificates.length;
  const completed100Count = certificates.filter((c) => c.milestone === 100).length;
  const progressCertsCount = certificates.filter((c) => c.milestone < 100).length;
  const unclaimedMilestonesCount = courseMilestoneStatuses.reduce(
    (acc, s) => acc + s.unclaimedEligibleCount,
    0
  );

  // Filtered certificates
  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      if (activeFilter === '100' && cert.milestone !== 100) return false;
      if (activeFilter === 'progress' && cert.milestone === 100) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = cert.title.toLowerCase().includes(q);
        const matchCourse = cert.courseSnapshot.courseTitle.toLowerCase().includes(q);
        const matchStudent = cert.studentName.toLowerCase().includes(q);
        const matchId = cert.id.toLowerCase().includes(q);
        return matchTitle || matchCourse || matchStudent || matchId;
      }
      return true;
    });
  }, [certificates, activeFilter, searchQuery]);

  const handleOpenClaimModal = (course: LearningCourse, milestone: CertificateMilestone) => {
    setClaimCourse(course);
    setClaimMilestone(milestone);
  };

  const handleCertificateIssued = (newCert: CourseCertificate) => {
    setCertificates(certificateService.getStoredCertificates());
    setViewerCert(newCert);
  };

  const handleOpenVerify = (certId: string) => {
    setVerifyCertId(certId);
    setIsVerifyModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-20 text-slate-100 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-[#141418] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-wide border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Verifiable Academic Credentials</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Academic Certificate Center
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Earn verified digital milestone credentials (25%, 50%, 75%, and 100% Course Completion) derived from genuine lecture completion data. Suitable for A4 landscape printing and online verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => handleOpenVerify('')}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verify Any ID</span>
          </button>

          <button
            onClick={onNavigateCourses}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>My Courses</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#141418] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Earned Certificates</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{totalEarned}</div>
          <p className="text-[10px] text-slate-500 font-mono">Issued to your profile</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#141418] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">100% Completions</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">{completed100Count}</div>
          <p className="text-[10px] text-slate-500 font-mono">Full courses mastered</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#141418] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Progress Milestones</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{progressCertsCount}</div>
          <p className="text-[10px] text-slate-500 font-mono">25%, 50%, 75% awarded</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#141418] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Ready to Claim</span>
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {unclaimedMilestonesCount}
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            {unclaimedMilestonesCount > 0 ? 'Eligible milestones unlocked' : 'Keep watching lectures'}
          </p>
        </div>
      </div>

      {/* 3. Navigation Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#141418] p-2.5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All Certificates ({certificates.length})
          </button>

          <button
            onClick={() => setActiveFilter('100')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === '100'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            100% Completion ({completed100Count})
          </button>

          <button
            onClick={() => setActiveFilter('progress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'progress'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Progress Milestones ({progressCertsCount})
          </button>

          <button
            onClick={() => setActiveFilter('tracker')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'tracker'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Milestone Tracker ({courses.length})
          </button>
        </div>

        {/* Search */}
        {activeFilter !== 'tracker' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course or ID..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}
      </div>

      {/* 4. Main Views */}
      {activeFilter !== 'tracker' ? (
        /* Earned Certificates Gallery */
        <div className="space-y-6">
          {filteredCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertificates.map((cert) => (
                <CertificateCard
                  key={cert.id}
                  certificate={cert}
                  onViewFullscreen={(c) => setViewerCert(c)}
                  onOpenVerify={handleOpenVerify}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 text-center text-slate-400 p-8 rounded-3xl bg-[#141418] border border-dashed border-white/10 space-y-4 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-white/5 text-slate-500 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No Certificates in This View</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {certificates.length === 0
                    ? 'You have not claimed any milestone certificates yet. Complete 25%, 50%, 75%, or 100% of any enrolled course to unlock verified credentials.'
                    : 'No certificates match your search query.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveFilter('tracker')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold cursor-pointer"
                >
                  Check Milestone Tracker
                </button>
                <button
                  onClick={onNavigateCourses}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold cursor-pointer"
                >
                  Go to Courses
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Course Milestone Progress Tracker */
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Course Milestone Tracker</h2>
            <p className="text-xs text-slate-400">
              Track how many lectures remain to unlock 25%, 50%, 75%, and 100% certificates for each enrolled curriculum.
            </p>
          </div>

          <div className="space-y-4">
            {courseMilestoneStatuses.map((status) => {
              const course = courses.find((c) => c.id === status.courseId);
              if (!course) return null;

              return (
                <div
                  key={status.courseId}
                  className="p-5 sm:p-6 rounded-3xl bg-[#141418] border border-white/10 space-y-5"
                >
                  {/* Course Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {course.examCategory || 'Course'}
                        </span>
                        <h3 className="text-base font-bold text-white">{course.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400">
                        {status.completedLectures} of {status.totalLectures} lectures completed (
                        {status.currentPercentage}%)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${status.currentPercentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {status.currentPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* 4 Milestones Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {([25, 50, 75, 100] as CertificateMilestone[]).map((milestone) => {
                      const m = status.milestones[milestone];
                      const is100Milestone = milestone === 100;

                      return (
                        <div
                          key={milestone}
                          className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                            m.isAlreadyClaimed
                              ? 'bg-emerald-500/5 border-emerald-500/20'
                              : m.isEligible
                              ? 'bg-amber-500/10 border-amber-500/30 shadow-lg shadow-amber-500/5'
                              : 'bg-white/[0.02] border-white/5'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-[11px] font-bold uppercase tracking-wider ${
                                  m.isAlreadyClaimed
                                    ? 'text-emerald-400'
                                    : m.isEligible
                                    ? 'text-amber-400'
                                    : 'text-slate-400'
                                }`}
                              >
                                {milestone}% Milestone
                              </span>

                              {m.isAlreadyClaimed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : m.isEligible ? (
                                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                              ) : (
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                              )}
                            </div>

                            <div className="text-xs font-bold text-white">
                              {is100Milestone ? 'Course Completion' : `${milestone}% Progress`}
                            </div>

                            <p className="text-[11px] text-slate-400">
                              {m.isAlreadyClaimed ? (
                                'Claimed & Verified'
                              ) : m.isEligible ? (
                                'Unlocked! Ready to claim'
                              ) : (
                                `${m.remainingLectures} more lecture${m.remainingLectures === 1 ? '' : 's'} needed`
                              )}
                            </p>
                          </div>

                          {/* Action Button */}
                          <div>
                            {m.isAlreadyClaimed ? (
                              <button
                                onClick={() => {
                                  const existingCert = certificates.find(
                                    (c) => c.id === m.claimedCertificateId
                                  );
                                  if (existingCert) setViewerCert(existingCert);
                                }}
                                className="w-full py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 text-[11px] font-bold border border-white/5 transition-colors cursor-pointer"
                              >
                                View Certificate
                              </button>
                            ) : m.isEligible ? (
                              <button
                                onClick={() => handleOpenClaimModal(course, milestone)}
                                className="w-full py-1.5 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-1"
                              >
                                <Award className="w-3.5 h-3.5" />
                                <span>Claim Now</span>
                              </button>
                            ) : (
                              <div className="w-full py-1.5 text-center text-[10px] text-slate-500 font-mono">
                                In Progress ({Math.round(m.progressRatio * 100)}%)
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {courseMilestoneStatuses.length === 0 && (
              <div className="py-16 text-center text-slate-400 p-8 rounded-3xl bg-[#141418] border border-dashed border-white/10 space-y-4 max-w-lg mx-auto">
                <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No Enrolled Courses Found</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Import a YouTube course or explore our catalog to begin earning verified milestone certificates.
                </p>
                <button
                  onClick={onNavigateExplore}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <CertificateViewerModal
        certificate={viewerCert}
        isOpen={Boolean(viewerCert)}
        onClose={() => setViewerCert(null)}
        onOpenVerify={handleOpenVerify}
      />

      <ClaimCertificateModal
        course={claimCourse}
        milestone={claimMilestone}
        isOpen={Boolean(claimCourse && claimMilestone)}
        onClose={() => {
          setClaimCourse(null);
          setClaimMilestone(null);
        }}
        onCertificateIssued={handleCertificateIssued}
      />

      <PublicCertificateVerificationModal
        initialCertId={verifyCertId}
        isOpen={isVerifyModalOpen}
        onClose={() => {
          setIsVerifyModalOpen(false);
          setVerifyCertId('');
        }}
        onViewCertificate={(cert) => {
          setIsVerifyModalOpen(false);
          setViewerCert(cert);
        }}
      />
    </div>
  );
};
