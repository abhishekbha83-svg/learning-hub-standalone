import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { LearningCourse } from '../../../types/learningHub';
import { CertificateMilestone, CourseCertificate } from '../../../types/certificate';
import { certificateService, MILESTONE_CONFIGS } from '../../../services/certificateService';
import { getStoredStudentName, setStoredStudentName } from '../../../services/learnerProfileService';
import {
  X,
  Award,
  Sparkles,
  CheckCircle2,
  User,
  BookOpen,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ClaimCertificateModalProps {
  course: LearningCourse | null;
  milestone: CertificateMilestone | null;
  isOpen: boolean;
  onClose: () => void;
  onCertificateIssued: (cert: CourseCertificate) => void;
}

export const ClaimCertificateModal: React.FC<ClaimCertificateModalProps> = ({
  course,
  milestone,
  isOpen,
  onClose,
  onCertificateIssued
}) => {
  const [recipientName, setRecipientName] = useState<string>(() => getStoredStudentName() || 'Student Scholar');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !course || !milestone) return null;

  const milestoneConfig = MILESTONE_CONFIGS[milestone];
  const is100 = milestone === 100;
  const completedCount = (course.lectures || []).filter((l) => l.completed).length;
  const totalCount = course.lectures?.length || 0;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = recipientName.trim();
    if (!cleanName) {
      setError('Please provide your name for the official certificate.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Update student profile name
      setStoredStudentName(cleanName);

      // Issue certificate
      const cert = await certificateService.issueCertificate(course, milestone, cleanName);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      onCertificateIssued(cert);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to issue certificate.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-[#141418] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Milestone Badge */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${
            is100
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
          }">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Milestone Unlocked!</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Claim Your {milestoneConfig.title}
          </h2>

          <p className="text-xs text-slate-400 leading-relaxed">
            You have successfully reached the {milestone}% milestone for "{course.title}". Confirm your name below to generate your verifiable digital credential.
          </p>
        </div>

        {/* Milestone Verification Breakdown */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Curriculum Course</span>
            </span>
            <span className="font-bold text-white text-right max-w-[200px] truncate">{course.title}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lectures Completed</span>
            </span>
            <span className="font-mono font-bold text-white">
              {completedCount} / {totalCount} ({course.progressPercentage}%)
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Milestone Level</span>
            </span>
            <span className="font-bold text-amber-300">{milestoneConfig.label}</span>
          </div>
        </div>

        {/* Recipient Display Name Input Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Student Name on Certificate
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 font-medium"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400">
              This name will be inscribed permanently on your verified credential.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <span>Generating...</span>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Issue Certificate</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
