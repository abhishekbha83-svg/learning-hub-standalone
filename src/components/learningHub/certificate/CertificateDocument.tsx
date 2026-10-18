import React from 'react';
import { CourseCertificate } from '../../../types/certificate';
import { AbhyvexaLogo } from '../../AbhyvexaLogo';
import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react';

interface CertificateDocumentProps {
  certificate: CourseCertificate;
  id?: string;
  className?: string;
}

export const CertificateDocument: React.FC<CertificateDocumentProps> = ({
  certificate,
  id = 'printable-certificate-container',
  className = ''
}) => {
  const is100 = certificate.milestone === 100;

  return (
    <div
      id={id}
      className={`relative w-full aspect-[1.414/1] bg-[#0A0A0E] text-slate-100 rounded-3xl p-6 sm:p-10 md:p-12 overflow-hidden shadow-2xl border-4 border-[#D97706]/40 select-none print:m-0 print:border-none print:rounded-none print:shadow-none print:w-full print:h-full ${className}`}
      style={{
        boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.8), 0 0 40px -10px rgba(16, 185, 129, 0.15)'
      }}
    >
      {/* Ornate Background Guilloché Grid & Ambient Gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Outer Inner Double Border */}
      <div className="absolute inset-3 sm:inset-4 md:inset-5 rounded-2xl border-2 border-[#10B981]/40 pointer-events-none" />
      <div className="absolute inset-5 sm:inset-6 md:inset-7 rounded-xl border border-[#F59E0B]/20 pointer-events-none" />

      {/* Decorative Ornate Corners */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 w-6 h-6 border-t-2 border-l-2 border-[#F59E0B] pointer-events-none" />
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-6 h-6 border-t-2 border-r-2 border-[#F59E0B] pointer-events-none" />
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 w-6 h-6 border-b-2 border-l-2 border-[#F59E0B] pointer-events-none" />
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-6 h-6 border-b-2 border-r-2 border-[#F59E0B] pointer-events-none" />

      {/* Certificate Content Flex Flow */}
      <div className="relative z-10 h-full flex flex-col justify-between items-center text-center">
        {/* Top Header: Brand & Milestone Type */}
        <div className="space-y-1.5 sm:space-y-2 w-full">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl overflow-hidden flex-shrink-0">
              <AbhyvexaLogo className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-xs sm:text-sm md:text-base tracking-[0.25em] uppercase text-emerald-400">
              ABHYVEXA — LEARN BEYOND LIMITS
            </span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-wider text-white uppercase font-sans">
              {is100 ? 'Course Completion Certificate' : certificate.title}
            </h1>
          </div>

          {/* Milestone Badge Pill */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold border tracking-wide uppercase shadow-sm ${
            is100
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
              : 'bg-amber-500/15 text-amber-300 border-amber-500/40'
          }`}>
            <Award className="w-3.5 h-3.5 text-current" />
            <span>{certificate.milestone}% Verified Academic Milestone</span>
          </div>
        </div>

        {/* Center Presentation: Student Name & Course */}
        <div className="space-y-2 sm:space-y-3 md:space-y-4 my-auto w-full max-w-4xl px-4">
          <p className="text-[11px] sm:text-xs md:text-sm text-slate-400 font-serif italic tracking-wide">
            This digital credential is proudly awarded to
          </p>

          {/* Student Name */}
          <div className="relative inline-block">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-100 font-serif py-1 tracking-tight">
              {certificate.studentName}
            </h2>
            <div className="w-48 sm:w-72 md:w-96 h-0.5 mx-auto bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent mt-1" />
          </div>

          <p className="text-[10px] sm:text-xs md:text-sm text-slate-300 font-sans tracking-normal max-w-2xl mx-auto leading-relaxed">
            for successfully completing verified lecture curriculum of
          </p>

          {/* Course Title */}
          <div className="inline-block px-4 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 max-w-full">
            <h3 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-emerald-400 font-sans line-clamp-2">
              "{certificate.courseSnapshot.courseTitle}"
            </h3>
          </div>

          {/* Verified Lecture Stats */}
          <p className="text-[10px] sm:text-xs text-slate-400 font-mono">
            Verified Completed: <span className="text-white font-bold">{certificate.courseSnapshot.completedLecturesAtIssue}</span> of{' '}
            <span className="text-white font-bold">{certificate.courseSnapshot.totalLecturesAtIssue}</span> Video Lectures ({certificate.courseSnapshot.verifiedPercentage}%)
          </p>
        </div>

        {/* Bottom Section: Authority, Seal, ID & Anti-Tamper Code */}
        <div className="w-full pt-3 sm:pt-4 border-t border-white/10 flex items-end justify-between text-left text-[10px] sm:text-xs">
          {/* Left Column: Date & Issuing Platform */}
          <div className="space-y-1">
            <div className="text-slate-500 font-mono uppercase text-[9px] sm:text-[10px] tracking-wider">
              Issue Date
            </div>
            <div className="font-semibold text-slate-200 text-xs sm:text-sm font-sans">
              {certificate.issueDateFormatted}
            </div>
            <div className="text-emerald-400 text-[10px] sm:text-[11px] font-medium flex items-center gap-1 pt-0.5">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>ABHYVEXA Verified Engine</span>
            </div>
          </div>

          {/* Center Column: Digital Embossed Seal */}
          <div className="flex flex-col items-center justify-center shrink-0 mx-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-[#141418] to-[#1C1C24] border-2 border-[#D97706] p-1 shadow-lg shadow-amber-500/10 flex items-center justify-center relative">
              <div className="w-full h-full rounded-full border border-emerald-500/50 flex flex-col items-center justify-center text-center p-1">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <span className="text-[7px] sm:text-[8px] font-black tracking-wider text-amber-300 uppercase mt-0.5">
                  VERIFIED
                </span>
                <span className="text-[6px] sm:text-[7px] text-slate-400 font-mono">
                  ABHY 2026
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Certificate ID & Tamper Hash */}
          <div className="space-y-1 text-right">
            <div className="text-slate-500 font-mono uppercase text-[9px] sm:text-[10px] tracking-wider">
              Certificate ID
            </div>
            <div className="font-mono font-bold text-slate-200 text-xs sm:text-sm tracking-wider">
              {certificate.id}
            </div>
            <div className="text-emerald-400 font-mono text-[9px] sm:text-[10px]">
              HASH: <span className="text-slate-300">{certificate.verificationCode}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
