import React, { useState } from 'react';
import { CourseCertificate } from '../../../types/certificate';
import { certificateService } from '../../../services/certificateService';
import {
  Award,
  Download,
  Printer,
  ExternalLink,
  Copy,
  Check,
  Eye,
  ShieldCheck,
  Calendar,
  BookOpen
} from 'lucide-react';

interface CertificateCardProps {
  certificate: CourseCertificate;
  onViewFullscreen: (cert: CourseCertificate) => void;
  onOpenVerify: (certId: string) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onViewFullscreen,
  onOpenVerify
}) => {
  const [copied, setCopied] = useState(false);
  const is100 = certificate.milestone === 100;

  const handleCopyLink = async () => {
    try {
      const url = certificate.verificationUrl || `${window.location.origin}/#/verify-certificate?id=${certificate.id}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    certificateService.downloadAsImage(certificate);
  };

  return (
    <div className="group relative rounded-3xl bg-[#141418] border border-white/10 hover:border-emerald-500/40 p-5 sm:p-6 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between">
      {/* Top Header: Milestone Badge & ID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${
              is100
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{certificate.milestoneBadge}</span>
          </span>

          <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
            {certificate.id}
          </span>
        </div>

        {/* Certificate Title */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
            {certificate.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
            <BookOpen className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="line-clamp-1">{certificate.courseSnapshot.courseTitle}</span>
          </div>
        </div>

        {/* Mini Certificate Card Snapshot */}
        <div
          onClick={() => onViewFullscreen(certificate)}
          className="relative aspect-[16/9] w-full rounded-2xl bg-[#0B0B0E] border border-white/10 p-4 flex flex-col justify-between items-center text-center cursor-pointer overflow-hidden group-hover:border-emerald-500/30 transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E] via-transparent to-transparent opacity-60" />
          
          <div className="w-full flex items-center justify-between z-10">
            <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
              Study With Abhi Hub
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <div className="z-10 my-auto">
            <p className="text-[10px] text-slate-400 italic font-serif">Awarded to</p>
            <p className="text-sm font-bold text-white font-serif tracking-wide">{certificate.studentName}</p>
            <p className="text-[9px] text-emerald-400/90 font-mono mt-0.5">
              Verified {certificate.courseSnapshot.verifiedPercentage}% Curriculum
            </p>
          </div>

          <div className="w-full flex items-center justify-between text-[9px] text-slate-500 font-mono z-10 border-t border-white/5 pt-1">
            <span>{certificate.issueDateFormatted}</span>
            <span className="text-emerald-400">VERIFIED</span>
          </div>

          {/* Hover Overlay with Preview prompt */}
          <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20">
            <span className="px-3 py-1.5 rounded-xl bg-black/80 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 shadow-lg">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Fullscreen</span>
            </span>
          </div>
        </div>

        {/* Verified Lecture Counts & Date */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Lectures</span>
            <span className="text-slate-200 font-medium font-mono text-[11px]">
              {certificate.courseSnapshot.completedLecturesAtIssue}/{certificate.courseSnapshot.totalLecturesAtIssue} (
              {certificate.courseSnapshot.verifiedPercentage}%)
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Issue Date</span>
            <span className="text-slate-200 font-medium text-[11px] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{certificate.issueDateFormatted}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2 mt-4">
        <button
          onClick={() => onViewFullscreen(certificate)}
          className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View / Print</span>
        </button>

        <button
          onClick={handleDownload}
          title="Download High-Res PNG (300 DPI)"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={handleCopyLink}
          title="Copy Verification Link"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>

        <button
          onClick={() => onOpenVerify(certificate.id)}
          title="Verify Credential Authenticity"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-emerald-400 border border-white/10 transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
