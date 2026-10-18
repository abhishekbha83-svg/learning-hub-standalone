import React, { useState, useEffect } from 'react';
import { CourseCertificate, CertificateVerificationResult } from '../../../types/certificate';
import { certificateService } from '../../../services/certificateService';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  X,
  CheckCircle2,
  Calendar,
  BookOpen,
  User,
  Hash,
  ExternalLink,
  Award
} from 'lucide-react';

interface PublicCertificateVerificationModalProps {
  initialCertId?: string;
  isOpen: boolean;
  onClose: () => void;
  onViewCertificate?: (cert: CourseCertificate) => void;
}

export const PublicCertificateVerificationModal: React.FC<PublicCertificateVerificationModalProps> = ({
  initialCertId = '',
  isOpen,
  onClose,
  onViewCertificate
}) => {
  const [certIdInput, setCertIdInput] = useState<string>(initialCertId);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CertificateVerificationResult | null>(null);

  useEffect(() => {
    if (initialCertId && isOpen) {
      setCertIdInput(initialCertId);
      performVerify(initialCertId);
    }
  }, [initialCertId, isOpen]);

  const performVerify = async (id: string) => {
    const clean = id.trim();
    if (!clean) return;
    setLoading(true);
    setResult(null);

    const res = await certificateService.verifyCertificate(clean);
    setResult(res);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performVerify(certIdInput);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl bg-[#141418] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Credential Registry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Verify Certificate Authenticity
          </h2>
          <p className="text-xs text-slate-400">
            Enter any ABHYVEXA Certificate ID to verify its cryptographic issuance record and academic completion stats.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={certIdInput}
              onChange={(e) => setCertIdInput(e.target.value)}
              placeholder="e.g. ABHYVEXA-CERT-2026-XXXX-XXXX"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? <span>Checking...</span> : <span>Verify</span>}
          </button>
        </form>

        {/* Result Container */}
        {result && (
          <div className="space-y-4 pt-2">
            {result.verified && result.certificate ? (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4">
                {/* Verified Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-sm uppercase tracking-wide">
                    <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                    <span>Officially Verified & Authentic</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                    STATUS: ACTIVE
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-black/30 p-3.5 rounded-xl border border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Recipient</span>
                    <span className="font-bold text-white text-sm">{result.certificate.studentName}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Milestone Award</span>
                    <span className="font-bold text-emerald-300 text-xs">
                      {result.certificate.milestone}% {result.certificate.title}
                    </span>
                  </div>

                  <div className="space-y-0.5 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Course Curriculum</span>
                    <span className="font-semibold text-slate-200 text-xs">
                      "{result.certificate.courseSnapshot.courseTitle}"
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Verified Lectures</span>
                    <span className="font-mono text-slate-200">
                      {result.certificate.courseSnapshot.completedLecturesAtIssue} of{' '}
                      {result.certificate.courseSnapshot.totalLecturesAtIssue} Video Lectures
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Date Issued</span>
                    <span className="text-slate-200">{result.certificate.issueDateFormatted}</span>
                  </div>

                  <div className="space-y-0.5 sm:col-span-2 border-t border-white/5 pt-2">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      Anti-Tamper Hash
                    </span>
                    <span className="font-mono text-emerald-400 text-xs font-bold">
                      {result.certificate.verificationCode}
                    </span>
                  </div>
                </div>

                {onViewCertificate && (
                  <button
                    onClick={() => onViewCertificate(result.certificate!)}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Official Certificate Document</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-red-400 font-bold text-sm">
                  <ShieldAlert className="w-5 h-5" />
                  <span>Certificate Not Found</span>
                </div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {result.error ||
                    'The Certificate ID entered does not match any verified record in the ABHYVEXA credential registry.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
